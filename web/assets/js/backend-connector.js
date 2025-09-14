// Backend Connection Utility for Nabha Telemedicine
// This file helps connect to your existing backend in Desktop/sih/telemedicine

const BackendConnector = {
    // Test different common backend configurations
    possiblePorts: [3000, 5000, 8000, 8080, 4000],
    currentPort: null,
    
    // Initialize connection to your existing backend
    init: async function() {
        console.log('🔍 Searching for your existing backend...');
        
        // Try to detect your backend port
        for (let port of this.possiblePorts) {
            const baseUrl = `http://localhost:${port}`;
            
            try {
                console.log(`🔌 Testing connection to ${baseUrl}...`);
                
                // Test basic connectivity
                const response = await fetch(`${baseUrl}/api/health`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok || response.status === 404) {
                    // Backend is running on this port
                    this.currentPort = port;
                    console.log(`✅ Found backend running on port ${port}`);
                    
                    // Update global config
                    this.updateConfig(port);
                    return true;
                }
            } catch (error) {
                console.log(`❌ No backend found on port ${port}`);
            }
        }
        
        console.log('❌ Could not find your backend. Please ensure it\'s running.');
        return false;
    },
    
    // Update configuration with detected port
    updateConfig: function(port) {
        if (window.config) {
            window.config.api.baseUrl = `http://localhost:${port}/api`;
            window.config.websocket.url = `http://localhost:${port}`;
            console.log(`📝 Updated config to use port ${port}`);
        }
        
        // Also update the CONFIG constant if it exists
        if (window.CONFIG) {
            window.CONFIG.api.baseUrl = `http://localhost:${port}/api`;
            window.CONFIG.websocket.url = `http://localhost:${port}`;
        }
    },
    
    // Test authentication endpoints
    testAuthEndpoints: async function() {
        if (!this.currentPort) {
            console.log('❌ No backend connection established');
            return false;
        }
        
        const baseUrl = `http://localhost:${this.currentPort}/api`;
        const testEndpoints = [
            '/auth/login',
            '/admin/login', 
            '/doctor/login',
            '/user/login',
            '/api/auth/login'
        ];
        
        console.log('🧪 Testing authentication endpoints...');
        
        for (let endpoint of testEndpoints) {
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
                
                // Even if credentials are wrong, endpoint should exist
                if (response.status !== 404) {
                    console.log(`✅ Found auth endpoint: ${endpoint}`);
                    return endpoint;
                }
            } catch (error) {
                // Continue testing
            }
        }
        
        console.log('⚠️ Using default auth endpoint: /auth/login');
        return '/auth/login';
    },
    
    // Test specific SIH telemedicine endpoints
    testSIHEndpoints: async function() {
        if (!this.currentPort) return false;
        
        const baseUrl = `http://localhost:${this.currentPort}/api`;
        const sihEndpoints = [
            '/admin/dashboard',
            '/doctor/dashboard', 
            '/patient/queue',
            '/emergency/sos',
            '/asha/reports',
            '/telemedicine/consultation'
        ];
        
        console.log('🏥 Testing SIH telemedicine endpoints...');
        const availableEndpoints = [];
        
        for (let endpoint of sihEndpoints) {
            try {
                const response = await fetch(`${baseUrl}${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.status !== 404) {
                    availableEndpoints.push(endpoint);
                    console.log(`✅ Available: ${endpoint}`);
                }
            } catch (error) {
                // Endpoint not available
            }
        }
        
        return availableEndpoints;
    },
    
    // Create a comprehensive connection report
    generateConnectionReport: async function() {
        console.log('📊 Generating Backend Connection Report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            backendFound: !!this.currentPort,
            port: this.currentPort,
            apiBaseUrl: this.currentPort ? `http://localhost:${this.currentPort}/api` : null,
            websocketUrl: this.currentPort ? `http://localhost:${this.currentPort}` : null,
            authEndpoint: null,
            availableEndpoints: [],
            recommendations: []
        };
        
        if (this.currentPort) {
            report.authEndpoint = await this.testAuthEndpoints();
            report.availableEndpoints = await this.testSIHEndpoints();
            
            // Generate recommendations
            if (report.availableEndpoints.length === 0) {
                report.recommendations.push('Consider implementing standard SIH telemedicine endpoints');
            }
            
            if (!report.authEndpoint.includes('admin')) {
                report.recommendations.push('Ensure admin authentication endpoint is available');
            }
        } else {
            report.recommendations.push('Start your backend server in Desktop/sih/telemedicine folder');
            report.recommendations.push('Ensure it runs on one of these ports: ' + this.possiblePorts.join(', '));
        }
        
        console.log('📋 Connection Report:', report);
        return report;
    }
};

// Auto-detect backend on page load
document.addEventListener('DOMContentLoaded', async function() {
    if (window.location.pathname.includes('admin-login') || 
        window.location.pathname.includes('doctor-login') ||
        window.location.pathname.includes('test-integration')) {
        
        console.log('🚀 Auto-detecting your SIH backend...');
        const connected = await BackendConnector.init();
        
        if (connected) {
            console.log('🎉 Successfully connected to your backend!');
            
            // Generate detailed report
            const report = await BackendConnector.generateConnectionReport();
            
            // Show success message to user
            if (window.ApiUtils) {
                ApiUtils.showSuccessToast(`Connected to backend on port ${BackendConnector.currentPort}`);
            }
        } else {
            console.log('❌ Could not connect to backend. Please check:');
            console.log('1. Backend is running in Desktop/sih/telemedicine');
            console.log('2. Backend is on one of these ports:', BackendConnector.possiblePorts);
            console.log('3. CORS is properly configured');
            
            // Show error message to user
            if (window.ApiUtils) {
                ApiUtils.showErrorToast('Backend not found. Please start your SIH backend server.');
            }
        }
    }
});

// Make available globally
window.BackendConnector = BackendConnector;