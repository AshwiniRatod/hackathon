// API Module for Nabha Telemedicine Web Application

const ApiModule = {
    // Initialize API module
    init: function() {
        ConfigUtils.log('info', 'API module initialized');
        this.setupInterceptors();
    },

    // Setup request/response interceptors
    setupInterceptors: function() {
        // Override fetch to include common headers and error handling
        const originalFetch = window.fetch;
        
        window.fetch = async function(url, options = {}) {
            // Add default headers
            const defaultHeaders = {
                'Content-Type': 'application/json',
            };
            
            // Add auth header if available
            const authHeader = AuthModule.getAuthHeader();
            if (authHeader) {
                defaultHeaders['Authorization'] = authHeader;
            }
            
            // Merge headers
            options.headers = {
                ...defaultHeaders,
                ...options.headers
            };
            
            // Add timeout
            const timeout = options.timeout || CONFIG.api.timeout;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            options.signal = controller.signal;
            
            try {
                ConfigUtils.log('debug', 'Making API request', { url, method: options.method || 'GET' });
                
                const response = await originalFetch(url, options);
                clearTimeout(timeoutId);
                
                // Handle authentication errors
                if (response.status === 401) {
                    ConfigUtils.log('warn', 'Unauthorized response, attempting token refresh');
                    
                    // Try to refresh token
                    const refreshed = await AuthModule.refreshToken();
                    if (refreshed) {
                        // Retry the original request with new token
                        options.headers['Authorization'] = AuthModule.getAuthHeader();
                        return originalFetch(url, options);
                    } else {
                        // Redirect to login
                        AuthModule.handleLogout('Authentication required');
                        throw new Error('Authentication required');
                    }
                }
                
                return response;
                
            } catch (error) {
                clearTimeout(timeoutId);
                
                if (error.name === 'AbortError') {
                    ConfigUtils.log('error', 'Request timeout', { url });
                    throw new Error('Request timeout');
                }
                
                throw error;
            }
        };
    },

    // Generic GET request
    get: async function(endpoint, params = {}) {
        try {
            const url = new URL(ConfigUtils.getApiUrl(endpoint));
            
            // Add query parameters
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    url.searchParams.append(key, params[key]);
                }
            });
            
            const response = await fetch(url.toString(), {
                method: 'GET'
            });
            
            return this.handleResponse(response);
            
        } catch (error) {
            return this.handleError(error, 'GET', endpoint);
        }
    },

    // Generic POST request
    post: async function(endpoint, data = {}) {
        try {
            const response = await fetch(ConfigUtils.getApiUrl(endpoint), {
                method: 'POST',
                body: JSON.stringify(data)
            });
            
            return this.handleResponse(response);
            
        } catch (error) {
            return this.handleError(error, 'POST', endpoint);
        }
    },

    // Generic PUT request
    put: async function(endpoint, data = {}) {
        try {
            const response = await fetch(ConfigUtils.getApiUrl(endpoint), {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            
            return this.handleResponse(response);
            
        } catch (error) {
            return this.handleError(error, 'PUT', endpoint);
        }
    },

    // Generic DELETE request
    delete: async function(endpoint) {
        try {
            const response = await fetch(ConfigUtils.getApiUrl(endpoint), {
                method: 'DELETE'
            });
            
            return this.handleResponse(response);
            
        } catch (error) {
            return this.handleError(error, 'DELETE', endpoint);
        }
    },

    // Handle API response
    handleResponse: async function(response) {
        const contentType = response.headers.get('content-type');
        
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        if (response.ok) {
            ConfigUtils.log('debug', 'API request successful', { 
                status: response.status,
                url: response.url 
            });
            return { success: true, data, status: response.status };
        } else {
            ConfigUtils.log('warn', 'API request failed', { 
                status: response.status,
                url: response.url,
                error: data 
            });
            return { 
                success: false, 
                error: data.message || data || 'Request failed',
                status: response.status 
            };
        }
    },

    // Handle API error
    handleError: function(error, method, endpoint) {
        ConfigUtils.log('error', 'API request error', { 
            method, 
            endpoint, 
            error: error.message 
        });
        
        return { 
            success: false, 
            error: error.message || CONFIG.errorMessages.network,
            status: 0 
        };
    }
};

// Admin API functions
const AdminApi = {
    // Get dashboard data
    getDashboard: function() {
        return ApiModule.get(CONFIG.endpoints.admin.dashboard);
    },

    // Get system statistics
    getStatistics: function() {
        return ApiModule.get(CONFIG.endpoints.admin.statistics);
    },

    // Get all users
    getUsers: function(type = 'all', page = 1, limit = 10) {
        return ApiModule.get(CONFIG.endpoints.admin.users, { type, page, limit });
    },

    // Get all doctors
    getDoctors: function(page = 1, limit = 10) {
        return ApiModule.get(CONFIG.endpoints.admin.doctors, { page, limit });
    },

    // Get all patients
    getPatients: function(page = 1, limit = 10) {
        return ApiModule.get(CONFIG.endpoints.admin.patients, { page, limit });
    },

    // Get ASHA workers
    getAshaWorkers: function(page = 1, limit = 10) {
        return ApiModule.get(CONFIG.endpoints.admin.asha, { page, limit });
    },

    // Get SOS alerts
    getSosAlerts: function(status = 'active') {
        return ApiModule.get(CONFIG.endpoints.admin.sosAlerts, { status });
    },

    // Get analytics data
    getAnalytics: function(type, period = '30d') {
        return ApiModule.get(CONFIG.endpoints.admin.analytics, { type, period });
    },

    // Update user status
    updateUserStatus: function(userId, status) {
        return ApiModule.put(`${CONFIG.endpoints.admin.users}/${userId}/status`, { status });
    },

    // Delete user
    deleteUser: function(userId) {
        return ApiModule.delete(`${CONFIG.endpoints.admin.users}/${userId}`);
    }
};

// Doctor API functions
const DoctorApi = {
    // Get doctor dashboard data
    getDashboard: function() {
        return ApiModule.get(CONFIG.endpoints.doctor.dashboard);
    },

    // Get doctor profile
    getProfile: function() {
        return ApiModule.get(CONFIG.endpoints.doctor.profile);
    },

    // Update doctor profile
    updateProfile: function(profileData) {
        return ApiModule.put(CONFIG.endpoints.doctor.profile, profileData);
    },

    // Get patient queue
    getPatientQueue: function() {
        return ApiModule.get(`${CONFIG.endpoints.doctor.patients}/queue`);
    },

    // Get patient details
    getPatient: function(patientId) {
        return ApiModule.get(`${CONFIG.endpoints.doctor.patients}/${patientId}`);
    },

    // Get patient medical history
    getPatientHistory: function(patientId) {
        return ApiModule.get(`${CONFIG.endpoints.doctor.patients}/${patientId}/history`);
    },

    // Get consultations
    getConsultations: function(status = 'all', page = 1, limit = 10) {
        return ApiModule.get(CONFIG.endpoints.doctor.consultations, { status, page, limit });
    },

    // Start consultation
    startConsultation: function(patientId) {
        return ApiModule.post(`${CONFIG.endpoints.doctor.consultations}/start`, { patientId });
    },

    // End consultation
    endConsultation: function(consultationId, notes) {
        return ApiModule.put(`${CONFIG.endpoints.doctor.consultations}/${consultationId}/end`, { notes });
    },

    // Create prescription
    createPrescription: function(prescriptionData) {
        return ApiModule.post(CONFIG.endpoints.doctor.prescriptions, prescriptionData);
    },

    // Get prescriptions
    getPrescriptions: function(patientId = null, page = 1, limit = 10) {
        const params = { page, limit };
        if (patientId) params.patientId = patientId;
        return ApiModule.get(CONFIG.endpoints.doctor.prescriptions, params);
    },

    // Get ASHA reports
    getAshaReports: function(status = 'all', page = 1, limit = 10) {
        return ApiModule.get(CONFIG.endpoints.doctor.ashaReports, { status, page, limit });
    },

    // Update doctor status
    updateStatus: function(status) {
        return ApiModule.put(`${CONFIG.endpoints.doctor.profile}/status`, { status });
    }
};

// Emergency API functions
const EmergencyApi = {
    // Get SOS alerts
    getSosAlerts: function(status = 'active') {
        return ApiModule.get(CONFIG.endpoints.emergency.sos, { status });
    },

    // Respond to SOS alert
    respondToSos: function(alertId, response) {
        return ApiModule.post(`${CONFIG.endpoints.emergency.sos}/${alertId}/respond`, response);
    },

    // Update SOS alert status
    updateSosStatus: function(alertId, status, notes = '') {
        return ApiModule.put(`${CONFIG.endpoints.emergency.sos}/${alertId}`, { status, notes });
    },

    // Get emergency alerts
    getAlerts: function(type = 'all') {
        return ApiModule.get(CONFIG.endpoints.emergency.alerts, { type });
    }
};

// ASHA API functions
const AshaApi = {
    // Get ASHA workers
    getWorkers: function(status = 'all', location = null) {
        const params = { status };
        if (location) params.location = location;
        return ApiModule.get(CONFIG.endpoints.asha.workers, params);
    },

    // Get ASHA reports
    getReports: function(workerId = null, date = null) {
        const params = {};
        if (workerId) params.workerId = workerId;
        if (date) params.date = date;
        return ApiModule.get(CONFIG.endpoints.asha.reports, params);
    },

    // Get ASHA visits
    getVisits: function(workerId, date = null) {
        const params = { workerId };
        if (date) params.date = date;
        return ApiModule.get(CONFIG.endpoints.asha.visits, params);
    }
};

// Pharmacy API functions
const PharmacyApi = {
    // Get medicines
    getMedicines: function(search = '', category = '') {
        return ApiModule.get(CONFIG.endpoints.pharmacy.medicines, { search, category });
    },

    // Get stock levels
    getStock: function(medicineId = null) {
        const params = {};
        if (medicineId) params.medicineId = medicineId;
        return ApiModule.get(CONFIG.endpoints.pharmacy.stock, params);
    },

    // Get orders
    getOrders: function(status = 'all', page = 1, limit = 10) {
        return ApiModule.get(CONFIG.endpoints.pharmacy.orders, { status, page, limit });
    },

    // Create order
    createOrder: function(orderData) {
        return ApiModule.post(CONFIG.endpoints.pharmacy.orders, orderData);
    }
};

// Utility functions for common API operations
const ApiUtils = {
    // Generic loader management
    showLoader: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<div class="loading-spinner"></div>';
        }
    },

    hideLoader: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '';
        }
    },

    // Handle API response with UI feedback
    handleApiResponse: function(response, successCallback, errorCallback) {
        if (response.success) {
            if (successCallback) successCallback(response.data);
        } else {
            const errorMessage = response.error || CONFIG.errorMessages.generic;
            if (errorCallback) {
                errorCallback(errorMessage);
            } else {
                this.showErrorToast(errorMessage);
            }
        }
    },

    // Show error toast
    showErrorToast: function(message) {
        // Create or update error toast
        let toast = document.getElementById('error-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'error-toast';
            toast.className = 'error-toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.style.display = 'none';
        }, CONFIG.ui.toastDuration);
    },

    // Show success toast
    showSuccessToast: function(message) {
        // Create or update success toast
        let toast = document.getElementById('success-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'success-toast';
            toast.className = 'success-toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
};

// Initialize API module when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    ApiModule.init();
});

// Make API modules available globally
window.ApiModule = ApiModule;
window.AdminApi = AdminApi;
window.DoctorApi = DoctorApi;
window.EmergencyApi = EmergencyApi;
window.AshaApi = AshaApi;
window.PharmacyApi = PharmacyApi;
window.ApiUtils = ApiUtils;