// Enhanced API utilities with comprehensive error handling and real-time features

const ApiUtils = {
    // Request interceptors
    requestInterceptors: [],
    responseInterceptors: [],
    
    // Add request interceptor
    addRequestInterceptor: function(interceptor) {
        this.requestInterceptors.push(interceptor);
    },
    
    // Add response interceptor
    addResponseInterceptor: function(interceptor) {
        this.responseInterceptors.push(interceptor);
    },
    
    // Make API request with full error handling
    makeRequest: async function(endpoint, options = {}) {
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        // Add authentication token
        const token = AuthModule.getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Apply request interceptors
        for (let interceptor of this.requestInterceptors) {
            config = await interceptor(config);
        }
        
        const url = `${CONFIG.api.baseUrl}${endpoint}`;
        
        try {
            ConfigUtils.log('debug', 'Making API request', { url, method: config.method });
            
            const response = await fetch(url, config);
            
            // Apply response interceptors
            for (let interceptor of this.responseInterceptors) {
                await interceptor(response);
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            ConfigUtils.log('debug', 'API request successful', { url, status: response.status });
            return { success: true, data, status: response.status };
            
        } catch (error) {
            ConfigUtils.log('error', 'API request failed', { url, error: error.message });
            
            // Handle specific error types
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                return { success: false, error: 'Network error - please check your connection' };
            }
            
            if (error.message.includes('401')) {
                AuthModule.logout();
                return { success: false, error: 'Session expired - please login again' };
            }
            
            return { success: false, error: error.message };
        }
    },
    
    // Show toast notification
    showToast: function(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(type)}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add to toast container or create one
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
        
        ConfigUtils.log('debug', 'Toast shown', { message, type });
    },
    
    // Show success toast
    showSuccessToast: function(message) {
        this.showToast(message, 'success');
    },
    
    // Show error toast
    showErrorToast: function(message) {
        this.showToast(message, 'error', 5000);
    },
    
    // Show warning toast
    showWarningToast: function(message) {
        this.showToast(message, 'warning', 4000);
    },
    
    // Show info toast
    showInfoToast: function(message) {
        this.showToast(message, 'info');
    },
    
    // Get toast icon
    getToastIcon: function(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    },
    
    // Show notification (different from toast - for WebSocket notifications)
    showNotification: function(message, type = 'info', duration = 5000) {
        // Check if browser supports notifications
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nabha Telemedicine', {
                body: message,
                icon: '/assets/images/favicon.ico'
            });
        }
        
        // Also show as toast
        this.showToast(message, type, duration);
    },
    
    // Request notification permission
    requestNotificationPermission: async function() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            ConfigUtils.log('info', 'Notification permission', { permission });
            return permission === 'granted';
        }
        return Notification.permission === 'granted';
    },
    
    // Upload file with progress
    uploadFile: async function(endpoint, file, onProgress = null) {
        const formData = new FormData();
        formData.append('file', file);
        
        const token = AuthModule.getToken();
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            // Track upload progress
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                });
            }
            
            xhr.addEventListener('load', () => {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve({ success: true, data });
                    } else {
                        reject(new Error(data.error || `Upload failed with status ${xhr.status}`));
                    }
                } catch (error) {
                    reject(new Error('Invalid response from server'));
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed - network error'));
            });
            
            xhr.open('POST', `${CONFIG.api.baseUrl}${endpoint}`);
            
            // Set headers
            Object.keys(headers).forEach(key => {
                xhr.setRequestHeader(key, headers[key]);
            });
            
            xhr.send(formData);
        });
    },
    
    // Download file
    downloadFile: async function(endpoint, filename) {
        try {
            const response = await this.makeRequest(endpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/octet-stream'
                }
            });
            
            if (response.success) {
                const blob = new Blob([response.data]);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                this.showSuccessToast('File downloaded successfully');
            } else {
                this.showErrorToast(response.error);
            }
        } catch (error) {
            ConfigUtils.log('error', 'File download failed', error);
            this.showErrorToast('File download failed');
        }
    }
};

// Admin API functions
const AdminApi = {
    // Get admin statistics
    getStatistics: async function() {
        return await ApiUtils.makeRequest('/admin/statistics');
    },
    
    // Get doctors with pagination
    getDoctors: async function(page = 1, limit = 10, filters = {}) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        });
        return await ApiUtils.makeRequest(`/admin/doctors?${params}`);
    },
    
    // Get ASHA workers
    getAshaWorkers: async function(page = 1, limit = 10, filters = {}) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        });
        return await ApiUtils.makeRequest(`/admin/asha-workers?${params}`);
    },
    
    // Get patients
    getPatients: async function(page = 1, limit = 10, filters = {}) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        });
        return await ApiUtils.makeRequest(`/admin/patients?${params}`);
    },
    
    // Update user status
    updateUserStatus: async function(userId, isActive) {
        return await ApiUtils.makeRequest(`/admin/users/${userId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ isActive })
        });
    },
    
    // Get system health
    getSystemHealth: async function() {
        return await ApiUtils.makeRequest('/admin/system/health');
    },
    
    // Get analytics data
    getAnalytics: async function(timeRange = '7d') {
        return await ApiUtils.makeRequest(`/admin/analytics?range=${timeRange}`);
    }
};

// Doctor API functions
const DoctorApi = {
    // Get doctor statistics
    getStatistics: async function() {
        return await ApiUtils.makeRequest('/doctor/statistics');
    },
    
    // Get patient queue
    getPatientQueue: async function() {
        return await ApiUtils.makeRequest('/doctor/patient-queue');
    },
    
    // Start consultation
    startConsultation: async function(patientId) {
        return await ApiUtils.makeRequest('/doctor/consultation/start', {
            method: 'POST',
            body: JSON.stringify({ patientId })
        });
    },
    
    // End consultation
    endConsultation: async function(consultationId, notes) {
        return await ApiUtils.makeRequest(`/doctor/consultation/${consultationId}/end`, {
            method: 'POST',
            body: JSON.stringify({ notes })
        });
    },
    
    // Get patient history
    getPatientHistory: async function(patientId) {
        return await ApiUtils.makeRequest(`/doctor/patients/${patientId}/history`);
    },
    
    // Postpone patient
    postponePatient: async function(patientId, reason) {
        return await ApiUtils.makeRequest(`/doctor/patients/${patientId}/postpone`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        });
    },
    
    // Get appointments
    getAppointments: async function(filter = 'today') {
        return await ApiUtils.makeRequest(`/doctor/appointments?filter=${filter}`);
    },
    
    // Start appointment
    startAppointment: async function(appointmentId) {
        return await ApiUtils.makeRequest(`/doctor/appointments/${appointmentId}/start`, {
            method: 'POST'
        });
    },
    
    // Get ASHA reports
    getAshaReports: async function(status = 'pending') {
        return await ApiUtils.makeRequest(`/doctor/asha-reports?status=${status}`);
    },
    
    // Get report details
    getReportDetails: async function(reportId) {
        return await ApiUtils.makeRequest(`/doctor/asha-reports/${reportId}`);
    },
    
    // Review ASHA report
    reviewReport: async function(reportId, review) {
        return await ApiUtils.makeRequest(`/doctor/asha-reports/${reportId}/review`, {
            method: 'POST',
            body: JSON.stringify(review)
        });
    },
    
    // Get prescriptions
    getPrescriptions: async function(filter = 'recent', limit = 10) {
        return await ApiUtils.makeRequest(`/doctor/prescriptions?filter=${filter}&limit=${limit}`);
    },
    
    // Get prescription details
    getPrescriptionDetails: async function(prescriptionId) {
        return await ApiUtils.makeRequest(`/doctor/prescriptions/${prescriptionId}`);
    },
    
    // Create prescription
    createPrescription: async function(prescriptionData) {
        return await ApiUtils.makeRequest('/doctor/prescriptions', {
            method: 'POST',
            body: JSON.stringify(prescriptionData)
        });
    },
    
    // Update prescription
    updatePrescription: async function(prescriptionId, prescriptionData) {
        return await ApiUtils.makeRequest(`/doctor/prescriptions/${prescriptionId}`, {
            method: 'PUT',
            body: JSON.stringify(prescriptionData)
        });
    }
};

// Emergency API functions
const EmergencyApi = {
    // Get SOS alerts
    getSosAlerts: async function(status = 'active') {
        return await ApiUtils.makeRequest(`/emergency/sos-alerts?status=${status}`);
    },
    
    // Respond to SOS alert
    respondToSos: async function(alertId, response) {
        return await ApiUtils.makeRequest(`/emergency/sos-alerts/${alertId}/respond`, {
            method: 'POST',
            body: JSON.stringify(response)
        });
    },
    
    // Trigger emergency alert
    triggerEmergencyAlert: async function(alertData) {
        return await ApiUtils.makeRequest('/emergency/trigger', {
            method: 'POST',
            body: JSON.stringify(alertData)
        });
    },
    
    // Get emergency statistics
    getEmergencyStats: async function() {
        return await ApiUtils.makeRequest('/emergency/statistics');
    }
};

// Patient API functions
const PatientApi = {
    // Join queue
    joinQueue: async function(patientData) {
        return await ApiUtils.makeRequest('/patient/queue/join', {
            method: 'POST',
            body: JSON.stringify(patientData)
        });
    },
    
    // Leave queue
    leaveQueue: async function(patientId) {
        return await ApiUtils.makeRequest(`/patient/queue/${patientId}/leave`, {
            method: 'POST'
        });
    },
    
    // Get patient profile
    getProfile: async function(patientId) {
        return await ApiUtils.makeRequest(`/patient/${patientId}/profile`);
    },
    
    // Update patient profile
    updateProfile: async function(patientId, profileData) {
        return await ApiUtils.makeRequest(`/patient/${patientId}/profile`, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },
    
    // Get medical history
    getMedicalHistory: async function(patientId) {
        return await ApiUtils.makeRequest(`/patient/${patientId}/medical-history`);
    },
    
    // Book appointment
    bookAppointment: async function(appointmentData) {
        return await ApiUtils.makeRequest('/patient/appointments', {
            method: 'POST',
            body: JSON.stringify(appointmentData)
        });
    }
};

// Add default response interceptor for token refresh
ApiUtils.addResponseInterceptor(async function(response) {
    if (response.status === 401) {
        const refreshToken = AuthModule.getRefreshToken();
        if (refreshToken) {
            try {
                const refreshResponse = await ApiUtils.makeRequest('/auth/refresh', {
                    method: 'POST',
                    body: JSON.stringify({ refreshToken })
                });
                
                if (refreshResponse.success) {
                    AuthModule.saveTokens(refreshResponse.data.token, refreshResponse.data.refreshToken);
                    ConfigUtils.log('info', 'Token refreshed successfully');
                } else {
                    throw new Error('Token refresh failed');
                }
            } catch (error) {
                ConfigUtils.log('error', 'Token refresh failed', error);
                AuthModule.logout();
            }
        }
    }
});

// Request notification permission on module load
ApiUtils.requestNotificationPermission();

// Make API modules available globally
window.ApiUtils = ApiUtils;
window.AdminApi = AdminApi;
window.DoctorApi = DoctorApi;
window.EmergencyApi = EmergencyApi;
window.PatientApi = PatientApi;