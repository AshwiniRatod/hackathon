// Real-time WebSocket module with enhanced features for Nabha Telemedicine

const WebSocketModule = {
    socket: null,
    isConnected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    reconnectInterval: 5000,
    eventListeners: {},
    heartbeatInterval: null,
    
    // Initialize WebSocket connection
    init: function() {
        if (!CONFIG.websocket.enabled) {
            ConfigUtils.log('info', 'WebSocket disabled in configuration');
            return;
        }
        
        this.connect();
    },
    
    // Connect to WebSocket server
    connect: function() {
        try {
            // Import Socket.IO from CDN (should be included in HTML)
            if (typeof io === 'undefined') {
                ConfigUtils.log('error', 'Socket.IO library not loaded');
                return;
            }
            
            ConfigUtils.log('info', 'Connecting to WebSocket server', { url: CONFIG.websocket.url });
            
            this.socket = io(CONFIG.websocket.url, {
                ...CONFIG.websocket.options,
                auth: {
                    token: AuthModule.getToken()
                }
            });
            
            this.setupSocketEvents();
            
        } catch (error) {
            ConfigUtils.log('error', 'Failed to create WebSocket connection', error);
            this.scheduleReconnect();
        }
    },

    // Setup socket event listeners
    setupSocketEvents: function() {
        if (!this.socket) return;
        
        // Connection events
        this.socket.on('connect', () => {
            ConfigUtils.log('info', 'WebSocket connected', { id: this.socket.id });
            this.connectionStatus = 'connected';
            this.reconnectAttempts = 0;
            this.updateConnectionStatus(true);
            
            // Join user-specific room based on role
            const userData = AuthModule.getUserData();
            if (userData) {
                this.socket.emit('join-room', {
                    userId: userData.id,
                    role: userData.role
                });
            }
        });
        
        this.socket.on('disconnect', (reason) => {
            ConfigUtils.log('warn', 'WebSocket disconnected', { reason });
            this.connectionStatus = 'disconnected';
            this.updateConnectionStatus(false);
            
            if (reason === 'io server disconnect') {
                // Server disconnected, try to reconnect manually
                this.scheduleReconnect();
            }
        });
        
        this.socket.on('connect_error', (error) => {
            ConfigUtils.log('error', 'WebSocket connection error', error);
            this.connectionStatus = 'error';
            this.updateConnectionStatus(false);
            this.scheduleReconnect();
        });
        
        this.socket.on('reconnect', (attemptNumber) => {
            ConfigUtils.log('info', 'WebSocket reconnected', { attempt: attemptNumber });
            this.connectionStatus = 'connected';
            this.reconnectAttempts = 0;
            this.updateConnectionStatus(true);
        });
        
        // SOS and Emergency events
        this.socket.on(CONFIG.socketEvents.sosAlert, (data) => {
            ConfigUtils.log('info', 'SOS alert received', data);
            this.handleSosAlert(data);
        });
        
        this.socket.on(CONFIG.socketEvents.sosUpdate, (data) => {
            ConfigUtils.log('info', 'SOS update received', data);
            this.handleSosUpdate(data);
        });
        
        this.socket.on(CONFIG.socketEvents.sosResolved, (data) => {
            ConfigUtils.log('info', 'SOS resolved', data);
            this.handleSosResolved(data);
        });
        
        // Patient queue events
        this.socket.on(CONFIG.socketEvents.patientQueue, (data) => {
            ConfigUtils.log('info', 'Patient queue update', data);
            this.handlePatientQueueUpdate(data);
        });
        
        this.socket.on(CONFIG.socketEvents.consultationRequest, (data) => {
            ConfigUtils.log('info', 'Consultation request received', data);
            this.handleConsultationRequest(data);
        });
        
        this.socket.on(CONFIG.socketEvents.consultationUpdate, (data) => {
            ConfigUtils.log('info', 'Consultation update received', data);
            this.handleConsultationUpdate(data);
        });
        
        // ASHA worker events
        this.socket.on(CONFIG.socketEvents.ashaReport, (data) => {
            ConfigUtils.log('info', 'ASHA report received', data);
            this.handleAshaReport(data);
        });
        
        this.socket.on(CONFIG.socketEvents.ashaLocation, (data) => {
            ConfigUtils.log('debug', 'ASHA location update', data);
            this.handleAshaLocationUpdate(data);
        });
        
        // General notifications
        this.socket.on(CONFIG.socketEvents.notification, (data) => {
            ConfigUtils.log('info', 'Notification received', data);
            this.handleNotification(data);
        });
        
        this.socket.on(CONFIG.socketEvents.systemAlert, (data) => {
            ConfigUtils.log('warn', 'System alert received', data);
            this.handleSystemAlert(data);
        });
        
        this.socket.on(CONFIG.socketEvents.userStatusUpdate, (data) => {
            ConfigUtils.log('info', 'User status update', data);
            this.handleUserStatusUpdate(data);
        });
    },

    // Setup general event listeners
    setupEventListeners: function() {
        // Listen for authentication changes
        window.addEventListener('storage', (e) => {
            if (e.key === CONFIG.auth.tokenKey) {
                if (e.newValue) {
                    // Token updated, reconnect with new token
                    this.reconnect();
                } else {
                    // Token removed, disconnect
                    this.disconnect();
                }
            }
        });
        
        // Listen for page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                ConfigUtils.log('debug', 'Page hidden, reducing WebSocket activity');
            } else {
                ConfigUtils.log('debug', 'Page visible, resuming WebSocket activity');
                if (this.connectionStatus === 'disconnected') {
                    this.connect();
                }
            }
        });
    },

    // Schedule reconnection attempt
    scheduleReconnect: function() {
        if (this.reconnectAttempts >= CONFIG.websocket.reconnectAttempts) {
            ConfigUtils.log('error', 'Max reconnection attempts reached');
            return;
        }
        
        this.reconnectAttempts++;
        const delay = CONFIG.websocket.reconnectInterval * this.reconnectAttempts;
        
        ConfigUtils.log('info', 'Scheduling reconnection', { 
            attempt: this.reconnectAttempts,
            delay: delay 
        });
        
        setTimeout(() => {
            if (this.connectionStatus === 'disconnected' || this.connectionStatus === 'error') {
                this.connect();
            }
        }, delay);
    },

    // Reconnect WebSocket
    reconnect: function() {
        ConfigUtils.log('info', 'Manually reconnecting WebSocket');
        this.disconnect();
        setTimeout(() => {
            this.connect();
        }, 1000);
    },

    // Disconnect WebSocket
    disconnect: function() {
        if (this.socket) {
            ConfigUtils.log('info', 'Disconnecting WebSocket');
            this.socket.disconnect();
            this.socket = null;
        }
        this.connectionStatus = 'disconnected';
        this.updateConnectionStatus(false);
    },

    // Update connection status in UI
    updateConnectionStatus: function(connected) {
        const indicator = document.getElementById('connection-status');
        if (indicator) {
            indicator.className = connected ? 'connection-status connected' : 'connection-status disconnected';
            indicator.textContent = connected ? 'Connected' : 'Disconnected';
        }
        
        // Update any status badges
        const badges = document.querySelectorAll('.connection-badge');
        badges.forEach(badge => {
            badge.className = connected ? 'connection-badge connected' : 'connection-badge disconnected';
        });
    },

    // Handle SOS alert
    handleSosAlert: function(alertData) {
        // Show SOS alert notification
        this.showSosNotification(alertData);
        
        // Update SOS alerts in dashboard
        this.triggerEvent('sosAlert', alertData);
        
        // Play alert sound if enabled
        this.playAlertSound();
        
        // Show desktop notification if permitted
        this.showDesktopNotification('Emergency SOS Alert', 
            `Emergency at ${alertData.location}. Patient: ${alertData.patientName}`, 
            'error');
    },

    // Handle SOS update
    handleSosUpdate: function(updateData) {
        this.triggerEvent('sosUpdate', updateData);
        
        // Update specific SOS alert in UI
        const alertElement = document.getElementById(`sos-alert-${updateData.alertId}`);
        if (alertElement) {
            this.updateSosAlertElement(alertElement, updateData);
        }
    },

    // Handle SOS resolved
    handleSosResolved: function(resolvedData) {
        this.triggerEvent('sosResolved', resolvedData);
        
        // Remove SOS alert from UI or mark as resolved
        const alertElement = document.getElementById(`sos-alert-${resolvedData.alertId}`);
        if (alertElement) {
            alertElement.classList.add('resolved');
            setTimeout(() => {
                alertElement.remove();
            }, 3000);
        }
        
        this.showDesktopNotification('SOS Resolved', 
            `Emergency resolved at ${resolvedData.location}`, 
            'success');
    },

    // Handle patient queue update
    handlePatientQueueUpdate: function(queueData) {
        this.triggerEvent('patientQueueUpdate', queueData);
        
        // Update queue count in header
        const queueCount = document.getElementById('queue-count');
        if (queueCount) {
            queueCount.textContent = queueData.count || 0;
        }
        
        // Refresh patient queue if on doctor dashboard
        if (window.location.pathname.includes('doctor-dashboard')) {
            this.refreshPatientQueue();
        }
    },

    // Handle consultation request
    handleConsultationRequest: function(requestData) {
        this.triggerEvent('consultationRequest', requestData);
        
        // Show consultation request notification for doctors
        const userRole = AuthModule.getUserRole();
        if (userRole === 'doctor') {
            this.showConsultationNotification(requestData);
        }
    },

    // Handle consultation update
    handleConsultationUpdate: function(updateData) {
        this.triggerEvent('consultationUpdate', updateData);
    },

    // Handle ASHA report
    handleAshaReport: function(reportData) {
        this.triggerEvent('ashaReport', reportData);
        
        // Show notification for new ASHA reports
        this.showNotificationToast('New ASHA Report', 
            `Report from ${reportData.ashaWorkerName} in ${reportData.location}`);
    },

    // Handle ASHA location update
    handleAshaLocationUpdate: function(locationData) {
        this.triggerEvent('ashaLocationUpdate', locationData);
    },

    // Handle general notification
    handleNotification: function(notificationData) {
        this.triggerEvent('notification', notificationData);
        this.showNotificationToast(notificationData.title, notificationData.message);
    },

    // Handle system alert
    handleSystemAlert: function(alertData) {
        this.triggerEvent('systemAlert', alertData);
        this.showSystemAlert(alertData);
    },

    // Handle user status update
    handleUserStatusUpdate: function(statusData) {
        this.triggerEvent('userStatusUpdate', statusData);
    },

    // Show SOS notification
    showSosNotification: function(alertData) {
        const notification = document.createElement('div');
        notification.className = 'sos-notification';
        notification.innerHTML = `
            <div class="sos-notification-header">
                <span class="sos-icon">🚨</span>
                <span class="sos-title">EMERGENCY SOS ALERT</span>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="sos-notification-body">
                <p><strong>Location:</strong> ${alertData.location}</p>
                <p><strong>Patient:</strong> ${alertData.patientName}</p>
                <p><strong>Time:</strong> ${new Date(alertData.timestamp).toLocaleString()}</p>
                <div class="sos-actions">
                    <button class="btn btn-primary btn-sm" onclick="respondToSos('${alertData.id}')">Respond</button>
                    <button class="btn btn-outline btn-sm" onclick="viewSosDetails('${alertData.id}')">Details</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 30 seconds if not manually closed
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 30000);
    },

    // Show consultation notification
    showConsultationNotification: function(requestData) {
        const notification = document.createElement('div');
        notification.className = 'consultation-notification';
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-icon">👨‍⚕️</span>
                <span class="notification-title">New Consultation Request</span>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="notification-body">
                <p><strong>Patient:</strong> ${requestData.patientName}</p>
                <p><strong>Priority:</strong> ${requestData.priority}</p>
                <div class="notification-actions">
                    <button class="btn btn-primary btn-sm" onclick="acceptConsultation('${requestData.id}')">Accept</button>
                    <button class="btn btn-outline btn-sm" onclick="viewPatientDetails('${requestData.patientId}')">View Patient</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
    },

    // Show notification toast
    showNotificationToast: function(title, message) {
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, CONFIG.ui.toastDuration);
    },

    // Show system alert
    showSystemAlert: function(alertData) {
        const alert = document.createElement('div');
        alert.className = `system-alert ${alertData.type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <strong>${alertData.title}</strong>
                <p>${alertData.message}</p>
            </div>
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(alert);
    },

    // Show desktop notification
    showDesktopNotification: function(title, body, type = 'info') {
        if (!('Notification' in window)) {
            ConfigUtils.log('warn', 'Desktop notifications not supported');
            return;
        }
        
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: '/assets/images/logo.png',
                badge: '/assets/images/logo.png',
                tag: type,
                requireInteraction: type === 'error'
            });
            
            notification.onclick = function() {
                window.focus();
                notification.close();
            };
            
            // Auto-close after 10 seconds
            setTimeout(() => {
                notification.close();
            }, 10000);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showDesktopNotification(title, body, type);
                }
            });
        }
    },

    // Play alert sound
    playAlertSound: function() {
        try {
            const audio = new Audio('/assets/sounds/alert.mp3');
            audio.volume = 0.5;
            audio.play().catch(error => {
                ConfigUtils.log('warn', 'Could not play alert sound', error);
            });
        } catch (error) {
            ConfigUtils.log('warn', 'Alert sound not available', error);
        }
    },

    // Emit event to server
    emit: function(event, data) {
        if (this.socket && this.connectionStatus === 'connected') {
            ConfigUtils.log('debug', 'Emitting WebSocket event', { event, data });
            this.socket.emit(event, data);
        } else {
            ConfigUtils.log('warn', 'Cannot emit event - WebSocket not connected', { event });
        }
    },

    // Register event listener
    on: function(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    },

    // Remove event listener
    off: function(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    },

    // Trigger internal event
    triggerEvent: function(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    ConfigUtils.log('error', 'Error in event listener', { event, error });
                }
            });
        }
    },

    // Get connection status
    getConnectionStatus: function() {
        return this.connectionStatus;
    },

    // Check if connected
    isConnected: function() {
        return this.connectionStatus === 'connected';
    }
};

// Helper functions for UI interactions
function respondToSos(alertId) {
    // Implement SOS response logic
    EmergencyApi.respondToSos(alertId, {
        responderId: AuthModule.getUserData().id,
        response: 'responding',
        timestamp: new Date().toISOString()
    }).then(response => {
        if (response.success) {
            ApiUtils.showSuccessToast('SOS response sent successfully');
        } else {
            ApiUtils.showErrorToast(response.error);
        }
    });
}

function viewSosDetails(alertId) {
    // Implement view SOS details logic
    window.location.href = `#sos-details/${alertId}`;
}

function acceptConsultation(requestId) {
    // Implement accept consultation logic
    DoctorApi.startConsultation(requestId).then(response => {
        if (response.success) {
            ApiUtils.showSuccessToast('Consultation accepted');
            // Redirect to consultation interface
        } else {
            ApiUtils.showErrorToast(response.error);
        }
    });
}

function viewPatientDetails(patientId) {
    // Implement view patient details logic
    window.location.href = `#patient-details/${patientId}`;
}

// Initialize WebSocket module when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if user is authenticated
    if (AuthModule.isAuthenticated()) {
        WebSocketModule.init();
    }
});

// Make WebSocketModule available globally
window.WebSocketModule = WebSocketModule;