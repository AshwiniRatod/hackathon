// Configuration file for the Nabha Telemedicine Web Application
const config = {
    // API Configuration - Updated to connect to your existing backend
    api: {
        baseUrl: 'http://localhost:3000/api', // Your unified backend port
        timeout: 15000,
        retryAttempts: 3,
        retryDelay: 1000
    },
    
    // WebSocket Configuration - Updated for your backend
    websocket: {
        url: 'http://localhost:3000', // Match your backend Socket.IO server
        enabled: true,
        reconnectAttempts: 5,
        reconnectInterval: 3000,
        heartbeatInterval: 30000,
        options: {
            autoConnect: true,
            forceNew: true,
            transports: ['websocket', 'polling']
        }
    },
    
    // Authentication Configuration
    auth: {
        tokenKey: 'nabha_auth_token',
        userKey: 'nabha_user_data',
        roleKey: 'nabha_user_role',
        refreshKey: 'nabha_refresh_token',
        tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
        rememberMeExpiry: 30 * 24 * 60 * 60 * 1000 // 30 days
    },
    
    // Application Configuration
    app: {
        name: 'Nabha Telemedicine',
        version: '1.0.0',
        description: 'Smart India Hackathon 2024 - Rural Healthcare Solution',
        supportEmail: 'support@nabha-telemedicine.com',
        supportPhone: '+91 9876543210'
    },
    
    // Dashboard Configuration
    dashboard: {
        refreshInterval: 30000, // 30 seconds
        chartColors: {
            primary: '#2c5aa0',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#06b6d4'
        },
        pagination: {
            defaultPageSize: 10,
            pageSizeOptions: [5, 10, 25, 50, 100]
        }
    },
    
    // Feature Flags
    features: {
        realTimeNotifications: true,
        videoConsultation: true,
        prescriptionModule: true,
        analyticsReporting: true,
        multiLanguageSupport: false,
        darkMode: false
    },
    
    // Routes Configuration
    routes: {
        admin: {
            login: '/admin-login.html',
            dashboard: '/admin-dashboard.html'
        },
        doctor: {
            login: '/doctor-login.html',
            register: '/doctor-register.html',
            dashboard: '/doctor-dashboard.html'
        },
        common: {
            home: '/index.html',
            unauthorized: '/unauthorized.html',
            notFound: '/404.html'
        }
    },
    
    // API Endpoints - Updated to match your SIH Backend structure
    endpoints: {
        auth: {
    adminLogin: '/api/admin/login',     // ✅ corrected
    doctorLogin: '/api/doctor/login',   // ✅ corrected
    doctorRegister: '/api/doctor/register', // ✅ corrected if such route exists
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    validateToken: '/api/auth/validate'
},

        admin: {
            dashboard: '/admin/dashboard',
            users: '/admin/users',
            doctors: '/admin/doctors',
            patients: '/admin/patients',
            asha: '/admin/asha-workers',
            statistics: '/admin/statistics',
            sosAlerts: '/admin/sos-alerts',
            analytics: '/admin/analytics'
        },
        doctor: {
            dashboard: '/doctor/dashboard',
            profile: '/doctor/profile',
            patients: '/doctor/patients',
            consultations: '/doctor/consultations',
            prescriptions: '/doctor/prescriptions',
            schedule: '/doctor/schedule',
            ashaReports: '/doctor/asha-reports'
        },
        patient: {
            profile: '/patient/profile',
            medical_records: '/patient/medical-records',
            consultations: '/patient/consultations',
            prescriptions: '/patient/prescriptions'
        },
        asha: {
            workers: '/asha/workers',
            reports: '/asha/reports',
            visits: '/asha/visits'
        },
        emergency: {
            sos: '/emergency/sos',
            alerts: '/emergency/alerts'
        },
        pharmacy: {
            medicines: '/pharmacy/medicines',
            stock: '/pharmacy/stock',
            orders: '/pharmacy/orders'
        }
    },
    
    // Socket Events
    socketEvents: {
        // Connection events
        connect: 'connect',
        disconnect: 'disconnect',
        reconnect: 'reconnect',
        
        // SOS and Emergency events
        sosAlert: 'sos_alert',
        sosUpdate: 'sos_update',
        sosResolved: 'sos_resolved',
        
        // Patient and Queue events
        patientQueue: 'patient_queue_update',
        consultationRequest: 'consultation_request',
        consultationUpdate: 'consultation_update',
        
        // ASHA Worker events
        ashaReport: 'asha_report',
        ashaLocation: 'asha_location_update',
        
        // General notifications
        notification: 'notification',
        systemAlert: 'system_alert',
        userStatusUpdate: 'user_status_update'
    },
    
    // UI Configuration
    ui: {
        toastDuration: 5000,
        loadingTimeout: 30000,
        animationDuration: 300,
        debounceDelay: 500,
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        dateTimeFormat: 'DD/MM/YYYY HH:mm'
    },
    
    // Error Messages
    errorMessages: {
        network: 'Network connection error. Please check your internet connection.',
        auth: 'Authentication failed. Please login again.',
        unauthorized: 'You are not authorized to access this resource.',
        notFound: 'The requested resource was not found.',
        serverError: 'Server error occurred. Please try again later.',
        validation: 'Please check your input and try again.',
        timeout: 'Request timeout. Please try again.',
        generic: 'Something went wrong. Please try again.'
    },
    
    // Success Messages
    successMessages: {
        login: 'Login successful! Welcome back.',
        logout: 'Logged out successfully.',
        register: 'Registration successful! Please login to continue.',
        save: 'Data saved successfully.',
        update: 'Updated successfully.',
        delete: 'Deleted successfully.',
        sent: 'Sent successfully.',
        created: 'Created successfully.'
    },
    
    // Development Configuration
    development: {
        debug: true,
        mockData: false,
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        enableDevTools: true
    },
    
    // Production Configuration
    production: {
        debug: false,
        mockData: false,
        logLevel: 'error',
        enableDevTools: false
    }
};

// Environment detection
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('localhost');

// Apply environment-specific configuration
if (isDevelopment) {
    Object.assign(config, config.development);
} else {
    Object.assign(config, config.production);
}

// Utility functions for configuration
const ConfigUtils = {
    // Get API URL with endpoint
    getApiUrl: (endpoint) => {
        return `${config.api.baseUrl}${endpoint}`;
    },
    
    // Get WebSocket URL
    getWebSocketUrl: () => {
        return config.websocket.url;
    },
    
    // Check if feature is enabled
    isFeatureEnabled: (feature) => {
        return config.features[feature] || false;
    },
    
    // Get route URL
    getRouteUrl: (category, route) => {
        return config.routes[category]?.[route] || '/';
    },
    
    // Get formatted date
    formatDate: (date, format = null) => {
        const formatStr = format || config.ui.dateFormat;
        // Simple date formatting - you might want to use a library like moment.js
        const d = new Date(date);
        return d.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },
    
    // Get formatted time
    formatTime: (date, format = null) => {
        const formatStr = format || config.ui.timeFormat;
        const d = new Date(date);
        return d.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    },
    
    // Get formatted date and time
    formatDateTime: (date, format = null) => {
        return `${ConfigUtils.formatDate(date)} ${ConfigUtils.formatTime(date)}`;
    },
    
    // Log with level checking
    log: (level, message, data = null) => {
        const levels = ['debug', 'info', 'warn', 'error'];
        const currentLevelIndex = levels.indexOf(config.logLevel);
        const messageLevelIndex = levels.indexOf(level);
        
        if (messageLevelIndex >= currentLevelIndex) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
            
            switch (level) {
                case 'debug':
                case 'info':
                    console.log(logMessage, data || '');
                    break;
                case 'warn':
                    console.warn(logMessage, data || '');
                    break;
                case 'error':
                    console.error(logMessage, data || '');
                    break;
            }
        }
    }
};

// Make configuration available globally
window.CONFIG = config;
window.ConfigUtils = ConfigUtils;

// Log configuration load
ConfigUtils.log('info', 'Nabha Telemedicine configuration loaded', {
    environment: isDevelopment ? 'development' : 'production',
    version: config.app.version,
    apiBaseUrl: config.api.baseUrl
});