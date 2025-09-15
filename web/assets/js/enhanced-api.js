// Enhanced API utilities with comprehensive error handling and real-time features

const ApiUtils = {
    requestInterceptors: [],
    responseInterceptors: [],
    
    addRequestInterceptor: function(interceptor) {
        this.requestInterceptors.push(interceptor);
    },
    
    addResponseInterceptor: function(interceptor) {
        this.responseInterceptors.push(interceptor);
    },
    
    makeRequest: async function(endpoint, options = {}) {
        let config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        const token = AuthModule.getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        for (let interceptor of this.requestInterceptors) {
            config = await interceptor(config);
        }
        
        const url = `${CONFIG.api.baseUrl}${endpoint}`;
        
        try {
            ConfigUtils.log('debug', 'Making API request', { url, method: config.method });
            
            const response = await fetch(url, config);
            
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
        
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
        
        ConfigUtils.log('debug', 'Toast shown', { message, type });
    },
    
    showSuccessToast: function(message) {
        this.showToast(message, 'success');
    },
    
    showErrorToast: function(message) {
        this.showToast(message, 'error', 5000);
    },
    
    showWarningToast: function(message) {
        this.showToast(message, 'warning', 4000);
    },
    
    showInfoToast: function(message) {
        this.showToast(message, 'info');
    },
    
    getToastIcon: function(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    },
    
    showNotification: function(message, type = 'info', duration = 5000) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nabha Telemedicine', {
                body: message,
                icon: '/assets/images/favicon.ico'
            });
        }
        this.showToast(message, type, duration);
    },
    
    requestNotificationPermission: async function() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            ConfigUtils.log('info', 'Notification permission', { permission });
            return permission === 'granted';
        }
        return Notification.permission === 'granted';
    },
    
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
            
            Object.keys(headers).forEach(key => {
                xhr.setRequestHeader(key, headers[key]);
            });
            
            xhr.send(formData);
        });
    },
    
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

// Add other API modules here like AdminApi, DoctorApi, etc.
// For brevity, only the relevant part is fully shown below

// Add default response interceptor for token refresh
ApiUtils.addResponseInterceptor(async function(response) {
    if (response.status === 401) {
        const refreshToken = AuthModule.getRefreshToken();
        if (refreshToken) {
            try {
                const refreshResponse = await ApiUtils.makeRequest(CONFIG.endpoints.auth.refresh, {
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

// Expose globally
window.ApiUtils = ApiUtils;
// window.AdminApi = AdminApi; // Define AdminApi similarly
// window.DoctorApi = DoctorApi; // Define DoctorApi similarly
// window.EmergencyApi = EmergencyApi; // Define EmergencyApi similarly
// window.PatientApi = PatientApi; // Define PatientApi similarly
