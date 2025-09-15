// SIH Backend Authentication Adapter
// Handles authentication with various backend patterns commonly used in SIH projects

const SIHAuthAdapter = {
    // Common authentication endpoints for SIH projects
   authEndpoints: [
    '/api/auth/login',
    '/api/admin/login',      // already correct
    '/api/doctors/login',    // ✅ add this if you are calling doctor login here
    '/api/user/login',
    '/auth/login',           // optional fallback; if you don't use it, can remove
    '/login'
],

    
    // Test which authentication endpoint works
    detectAuthEndpoint: async function(baseUrl) {
        console.log('🔍 Detecting authentication endpoint...');
        
        for (let endpoint of this.authEndpoints) {
            try {
                const response = await fetch(`${baseUrl}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'test@test.com',
                        password: 'test'
                    })
                });
                
                // If we get a response (even error), endpoint exists
                if (response.status !== 404) {
                    console.log(`✅ Found auth endpoint: ${endpoint}`);
                    return endpoint;
                }
            } catch (error) {
                // Continue testing
            }
        }
        
        console.log('⚠️ Using default endpoint: /api/auth/login');
        return '/api/auth/login';
    },
    
    // Attempt login with your SIH backend
    login: async function(email, password, role = 'admin') {
        if (!window.BackendConnector?.currentPort) {
            throw new Error('Backend not connected. Please start your SIH backend server.');
        }
        
        const baseUrl = `http://localhost:${window.BackendConnector.currentPort}`;
        const authEndpoint = await this.detectAuthEndpoint(baseUrl);
        
        const loginData = {
            email: email,
            password: password,
            role: role
        };
        
        console.log(`🔐 Attempting login to ${baseUrl}${authEndpoint}...`);
        
        try {
            const response = await fetch(`${baseUrl}${authEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success - handle different response formats
                return this.normalizeAuthResponse(data, email, role);
            } else {
                // Handle different error formats
                const errorMessage = data.message || data.error || data.msg || 'Login failed';
                throw new Error(errorMessage);
            }
            
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Cannot connect to backend. Please ensure your SIH backend is running.');
            }
            throw error;
        }
    },
    
    // Normalize different authentication response formats
    normalizeAuthResponse: function(data, email, role) {
        console.log('📝 Normalizing auth response:', data);
        
        // Extract token from various possible locations
        const token = data.token || data.accessToken || data.access_token || data.jwt || data.authToken;
        
        // Extract refresh token
        const refreshToken = data.refreshToken || data.refresh_token || data.refreshJWT;
        
        // Extract user data from various formats
        let user = data.user || data.userData || data.profile || {};
        
        // If no user object, create one from available data
        if (!user.email) {
            user = {
                id: data.id || data.userId || data.user_id || Math.random().toString(36).substr(2, 9),
                email: email,
                name: data.name || data.username || data.firstName + ' ' + data.lastName || 'Admin User',
                role: role,
                firstName: data.firstName || data.first_name || 'Admin',
                lastName: data.lastName || data.last_name || 'User',
                ...user
            };
        }
        
        // Ensure role is set
        if (!user.role) {
            user.role = role;
        }
        
        const normalizedResponse = {
            success: true,
            token: token,
            refreshToken: refreshToken,
            user: user,
            message: data.message || 'Login successful'
        };
        
        console.log('✅ Normalized auth response:', normalizedResponse);
        return normalizedResponse;
    },
    
    // Test registration endpoint
    testRegistration: async function(userData) {
        if (!window.BackendConnector?.currentPort) {
            throw new Error('Backend not connected');
        }
        
        const baseUrl = `http://localhost:${window.BackendConnector.currentPort}`;
        const endpoints = [
            '/api/auth/register',
            '/api/user/register', 
            '/auth/register',
            '/register'
        ];
        
        for (let endpoint of endpoints) {
            try {
                const response = await fetch(`${baseUrl}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                
                if (response.status !== 404) {
                    const data = await response.json();
                    
                    if (response.ok) {
                        return this.normalizeAuthResponse(data, userData.email, userData.role || 'doctor');
                    } else {
                        throw new Error(data.message || data.error || 'Registration failed');
                    }
                }
            } catch (error) {
                if (error.message !== 'fetch') {
                    throw error;
                }
            }
        }
        
        throw new Error('Registration endpoint not found');
    },
    
    // Create demo user for testing
    createDemoCredentials: function() {
        return {
            admin: {
                email: 'admin@sih.com',
                password: 'admin123',
                role: 'admin'
            },
            doctor: {
                email: 'doctor@sih.com', 
                password: 'doctor123',
                role: 'doctor'
            },
            asha: {
                email: 'asha@sih.com',
                password: 'asha123', 
                role: 'asha'
            }
        };
    },
    
    // Fallback authentication for demo purposes
    fallbackAuth: function(email, password, role) {
        console.log('⚠️ Using fallback authentication (demo mode)');
        
        const demoCredentials = this.createDemoCredentials();
        const userCreds = demoCredentials[role];
        
        if (email === userCreds.email && password === userCreds.password) {
            return {
                success: true,
                token: 'demo_jwt_token_' + Date.now(),
                user: {
                    id: 'demo_' + role + '_id',
                    email: email,
                    name: role.charAt(0).toUpperCase() + role.slice(1) + ' User',
                    role: role,
                    firstName: role.charAt(0).toUpperCase() + role.slice(1),
                    lastName: 'User',
                    isDemoMode: true
                },
                message: 'Demo login successful'
            };
        } else {
            throw new Error('Invalid demo credentials');
        }
    },
    
    // Main authentication method that tries backend first, then fallback
    authenticate: async function(email, password, role = 'admin') {
        try {
            // Try to authenticate with your SIH backend
            const result = await this.login(email, password, role);
            console.log('✅ Successfully authenticated with SIH backend');
            return result;
            
        } catch (error) {
            console.log('❌ Backend authentication failed:', error.message);
            
            // If backend is not available, try fallback demo mode
            console.log('🔄 Trying demo mode authentication...');
            try {
                const demoResult = this.fallbackAuth(email, password, role);
                console.log('✅ Demo mode authentication successful');
                return demoResult;
            } catch (demoError) {
                throw new Error(`Authentication failed: ${error.message}. Demo credentials: admin@sih.com/admin123`);
            }
        }
    }
};

// Override the global loginUser function to use SIH adapter
window.loginUser = async function(role, email, password, rememberMe = false) {
    try {
        console.log(`🚀 Starting ${role} login for ${email}...`);
        
        // Use SIH authentication adapter
        const authResponse = await SIHAuthAdapter.authenticate(email, password, role);
        
        if (authResponse.success) {
            // Store authentication data
            const stored = window.AuthModule.storeAuthData(authResponse, rememberMe);
            
            if (stored) {
                console.log('✅ Login successful!');
                
                // Show success message
                const successDiv = document.getElementById('successMessage');
                if (successDiv) {
                    successDiv.textContent = authResponse.message || 'Login successful!';
                    successDiv.style.display = 'block';
                }
                
                // Hide error message
                const errorDiv = document.getElementById('errorMessage');
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                }
                
                // Redirect to appropriate dashboard
                setTimeout(() => {
                    if (role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else if (role === 'doctor') {
                        window.location.href = 'doctor-dashboard.html';
                    }
                }, 1000);
                
            } else {
                throw new Error('Failed to store authentication data');
            }
        } else {
            throw new Error(authResponse.error || 'Authentication failed');
        }
        
    } catch (error) {
        console.error('❌ Login failed:', error);
        
        // Show error message
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        }
        
        // Hide success message
        const successDiv = document.getElementById('successMessage');
        if (successDiv) {
            successDiv.style.display = 'none';
        }
        
        throw error;
    }
};

// Make SIHAuthAdapter available globally
window.SIHAuthAdapter = SIHAuthAdapter;