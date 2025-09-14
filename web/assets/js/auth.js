// Authentication Module for Nabha Telemedicine Web Application

const AuthModule = {
    // Initialize authentication module
    init: function() {
        ConfigUtils.log('info', 'Authentication module initialized');
        this.checkExistingAuth();
        this.setupEventListeners();
    },

    // Check for existing authentication
    checkExistingAuth: function() {
        const token = this.getToken();
        const userData = this.getUserData();
        
        if (token && userData) {
            ConfigUtils.log('info', 'Existing authentication found', { user: userData.email });
            return true;
        }
        
        return false;
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Listen for token expiry
        window.addEventListener('storage', (e) => {
            if (e.key === CONFIG.auth.tokenKey && !e.newValue) {
                this.handleLogout('Session expired');
            }
        });
    },

    // Store authentication data
    storeAuthData: function(authResponse, rememberMe = false) {
        const { token, refreshToken, user } = authResponse;
        
        try {
            // Calculate expiry time
            const expiry = rememberMe ? 
                Date.now() + CONFIG.auth.rememberMeExpiry : 
                Date.now() + CONFIG.auth.tokenExpiry;
            
            // Store token with expiry
            const tokenData = {
                token: token,
                expiry: expiry,
                timestamp: Date.now()
            };
            
            localStorage.setItem(CONFIG.auth.tokenKey, JSON.stringify(tokenData));
            localStorage.setItem(CONFIG.auth.userKey, JSON.stringify(user));
            localStorage.setItem(CONFIG.auth.roleKey, user.role);
            
            if (refreshToken) {
                localStorage.setItem(CONFIG.auth.refreshKey, refreshToken);
            }
            
            ConfigUtils.log('info', 'Authentication data stored', { 
                user: user.email, 
                role: user.role,
                rememberMe: rememberMe 
            });
            
            return true;
        } catch (error) {
            ConfigUtils.log('error', 'Failed to store authentication data', error);
            return false;
        }
    },

    // Get stored token
    getToken: function() {
        try {
            const tokenData = localStorage.getItem(CONFIG.auth.tokenKey);
            if (!tokenData) return null;
            
            const parsed = JSON.parse(tokenData);
            
            // Check if token is expired
            if (Date.now() > parsed.expiry) {
                ConfigUtils.log('warn', 'Token expired, clearing authentication');
                this.clearAuthData();
                return null;
            }
            
            return parsed.token;
        } catch (error) {
            ConfigUtils.log('error', 'Failed to get token', error);
            return null;
        }
    },

    // Get user data
    getUserData: function() {
        try {
            const userData = localStorage.getItem(CONFIG.auth.userKey);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            ConfigUtils.log('error', 'Failed to get user data', error);
            return null;
        }
    },

    // Get user role
    getUserRole: function() {
        return localStorage.getItem(CONFIG.auth.roleKey);
    },

    // Clear authentication data
    clearAuthData: function() {
        localStorage.removeItem(CONFIG.auth.tokenKey);
        localStorage.removeItem(CONFIG.auth.userKey);
        localStorage.removeItem(CONFIG.auth.roleKey);
        localStorage.removeItem(CONFIG.auth.refreshKey);
        
        ConfigUtils.log('info', 'Authentication data cleared');
    },

    // Check if user is authenticated
    isAuthenticated: function() {
        const token = this.getToken();
        const userData = this.getUserData();
        return !!(token && userData);
    },

    // Admin login function
    adminLogin: async function(email, password, rememberMe = false) {
        return this.performLogin(CONFIG.endpoints.auth.adminLogin, {
            email: email,
            password: password
        }, rememberMe, 'admin');
    },

    // Doctor login function
    doctorLogin: async function(email, password, rememberMe = false) {
        return this.performLogin(CONFIG.endpoints.auth.doctorLogin, {
            email: email,
            password: password
        }, rememberMe, 'doctor');
    },

    // Doctor registration function
    doctorRegister: async function(doctorData) {
        try {
            showFormLoader(true);
            
            ConfigUtils.log('info', 'Attempting doctor registration', { email: doctorData.email });
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.endpoints.auth.doctorRegister), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(doctorData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                ConfigUtils.log('info', 'Doctor registration successful', { email: doctorData.email });
                showSuccess(CONFIG.successMessages.register);
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = CONFIG.routes.doctor.login;
                }, 2000);
                
                return { success: true, data: result };
            } else {
                const errorMessage = result.message || CONFIG.errorMessages.generic;
                ConfigUtils.log('warn', 'Doctor registration failed', { error: errorMessage });
                showError(errorMessage);
                return { success: false, error: errorMessage };
            }
            
        } catch (error) {
            ConfigUtils.log('error', 'Doctor registration error', error);
            const errorMessage = error.message || CONFIG.errorMessages.network;
            showError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            showFormLoader(false);
        }
    },

    // Generic login function
    performLogin: async function(endpoint, credentials, rememberMe, expectedRole) {
        try {
            showFormLoader(true);
            
            ConfigUtils.log('info', 'Attempting login', { 
                endpoint: endpoint, 
                email: credentials.email,
                role: expectedRole 
            });
            
            const response = await fetch(ConfigUtils.getApiUrl(endpoint), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Validate role
                if (result.user.role !== expectedRole) {
                    const errorMessage = `Invalid role. Expected ${expectedRole} but got ${result.user.role}`;
                    ConfigUtils.log('warn', 'Role mismatch during login', { 
                        expected: expectedRole, 
                        actual: result.user.role 
                    });
                    showError(errorMessage);
                    return { success: false, error: errorMessage };
                }
                
                // Store authentication data
                const stored = this.storeAuthData(result, rememberMe);
                
                if (stored) {
                    ConfigUtils.log('info', 'Login successful', { 
                        user: result.user.email, 
                        role: result.user.role 
                    });
                    showSuccess(CONFIG.successMessages.login);
                    
                    // Redirect based on role
                    setTimeout(() => {
                        const dashboardUrl = expectedRole === 'admin' ? 
                            CONFIG.routes.admin.dashboard : 
                            CONFIG.routes.doctor.dashboard;
                        window.location.href = dashboardUrl;
                    }, 1000);
                    
                    return { success: true, data: result };
                } else {
                    const errorMessage = 'Failed to store authentication data';
                    showError(errorMessage);
                    return { success: false, error: errorMessage };
                }
            } else {
                const errorMessage = result.message || CONFIG.errorMessages.auth;
                ConfigUtils.log('warn', 'Login failed', { error: errorMessage });
                showError(errorMessage);
                return { success: false, error: errorMessage };
            }
            
        } catch (error) {
            ConfigUtils.log('error', 'Login error', error);
            const errorMessage = error.message || CONFIG.errorMessages.network;
            showError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            showFormLoader(false);
        }
    },

    // Logout function
    logout: async function() {
        try {
            const token = this.getToken();
            
            if (token) {
                // Call logout endpoint
                await fetch(ConfigUtils.getApiUrl(CONFIG.endpoints.auth.logout), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            ConfigUtils.log('warn', 'Logout API call failed', error);
        }
        
        this.handleLogout('User logged out');
    },

    // Handle logout
    handleLogout: function(reason = 'Session ended') {
        ConfigUtils.log('info', 'Handling logout', { reason: reason });
        
        this.clearAuthData();
        
        // Show message if not a page redirect
        if (reason !== 'Redirecting') {
            showSuccess(CONFIG.successMessages.logout);
        }
        
        // Redirect to home page after short delay
        setTimeout(() => {
            window.location.href = CONFIG.routes.common.home;
        }, 1000);
    },

    // Refresh token
    refreshToken: async function() {
        try {
            const refreshToken = localStorage.getItem(CONFIG.auth.refreshKey);
            
            if (!refreshToken) {
                ConfigUtils.log('warn', 'No refresh token available');
                return false;
            }
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.endpoints.auth.refresh), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                ConfigUtils.log('info', 'Token refreshed successfully');
                this.storeAuthData(result, true);
                return true;
            } else {
                ConfigUtils.log('warn', 'Token refresh failed', result);
                this.handleLogout('Token refresh failed');
                return false;
            }
            
        } catch (error) {
            ConfigUtils.log('error', 'Token refresh error', error);
            this.handleLogout('Token refresh error');
            return false;
        }
    },

    // Validate token with server
    validateToken: async function() {
        try {
            const token = this.getToken();
            
            if (!token) {
                return false;
            }
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.endpoints.auth.validateToken), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                ConfigUtils.log('debug', 'Token validation successful');
                return true;
            } else {
                ConfigUtils.log('warn', 'Token validation failed');
                this.handleLogout('Invalid token');
                return false;
            }
            
        } catch (error) {
            ConfigUtils.log('error', 'Token validation error', error);
            return false;
        }
    },

    // Get authorization header
    getAuthHeader: function() {
        const token = this.getToken();
        return token ? `Bearer ${token}` : null;
    },

    // Check role authorization
    hasRole: function(requiredRole) {
        const userRole = this.getUserRole();
        return userRole === requiredRole;
    }
};

// Helper functions for UI feedback
function showFormLoader(show) {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        if (show) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
}

function showError(message) {
    hideMessages();
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, CONFIG.ui.toastDuration);
    }
}

function showSuccess(message) {
    hideMessages();
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }
}

function hideMessages() {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
}

// Convenience functions for global access
function loginUser(type, email, password, rememberMe = false) {
    if (type === 'admin') {
        return AuthModule.adminLogin(email, password, rememberMe);
    } else if (type === 'doctor') {
        return AuthModule.doctorLogin(email, password, rememberMe);
    }
}

function registerDoctor(doctorData) {
    return AuthModule.doctorRegister(doctorData);
}

function logoutUser() {
    return AuthModule.logout();
}

function isAuthenticated() {
    return AuthModule.isAuthenticated();
}

function getUserRole() {
    return AuthModule.getUserRole();
}

function getUserData() {
    return AuthModule.getUserData();
}

function getAuthToken() {
    return AuthModule.getToken();
}

function getAuthHeader() {
    return AuthModule.getAuthHeader();
}

// Initialize authentication module when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    AuthModule.init();
});

// Make AuthModule available globally
window.AuthModule = AuthModule;