// Doctor Dashboard JavaScript for Nabha Telemedicine

const DoctorDashboard = {
    patientQueue: [],
    currentPatient: null,
    refreshInterval: null,
    
    // Initialize doctor dashboard
    init: async function() {
        ConfigUtils.log('info', 'Initializing Doctor Dashboard');
        
        try {
            await this.loadDashboardData();
            this.setupEventListeners();
            this.setupWebSocketListeners();
            this.setupAutoRefresh();
            
            ConfigUtils.log('info', 'Doctor Dashboard initialized successfully');
        } catch (error) {
            ConfigUtils.log('error', 'Failed to initialize Doctor Dashboard', error);
            ApiUtils.showErrorToast('Failed to load dashboard data');
        }
    },

    // Load dashboard data
    loadDashboardData: async function() {
        try {
            // Load overview statistics
            await this.loadOverviewStats();
            
            // Load patient queue
            await this.loadPatientQueue();
            
            // Load appointments
            await this.loadAppointments();
            
            // Load ASHA reports
            await this.loadAshaReports();
            
            // Load recent prescriptions
            await this.loadRecentPrescriptions();
            
        } catch (error) {
            ConfigUtils.log('error', 'Error loading dashboard data', error);
            throw error;
        }
    },

    // Load overview statistics
    loadOverviewStats: async function() {
        try {
            const response = await DoctorApi.getStatistics();
            
            if (response.success) {
                const stats = response.data;
                
                // Update overview cards
                this.updateOverviewCard('patientsInQueueCount', stats.patientsInQueue || 0);
                this.updateOverviewCard('consultationsTodayCount', stats.consultationsToday || 0);
                this.updateOverviewCard('pendingReportsCount', stats.pendingReports || 0);
                this.updateOverviewCard('prescriptionsCount', stats.prescriptionsCount || 0);
                
                ConfigUtils.log('info', 'Doctor overview statistics loaded', stats);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load doctor overview statistics', error);
            // Set default values
            this.updateOverviewCard('patientsInQueueCount', 0);
            this.updateOverviewCard('consultationsTodayCount', 0);
            this.updateOverviewCard('pendingReportsCount', 0);
            this.updateOverviewCard('prescriptionsCount', 0);
        }
    },

    // Update overview card
    updateOverviewCard: function(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            // Animate number change
            this.animateNumber(element, parseInt(element.textContent) || 0, value);
        }
    },

    // Animate number change
    animateNumber: function(element, start, end) {
        const duration = 1000;
        const startTime = Date.now();
        
        const updateNumber = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        updateNumber();
    },

    // Load patient queue
    loadPatientQueue: async function() {
        try {
            const response = await DoctorApi.getPatientQueue();
            
            if (response.success) {
                this.patientQueue = response.data || [];
                this.renderPatientQueue();
                
                ConfigUtils.log('info', 'Patient queue loaded', { count: this.patientQueue.length });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load patient queue', error);
            this.patientQueue = [];
            this.renderPatientQueue();
        }
    },

    // Render patient queue
    renderPatientQueue: function() {
        const container = document.getElementById('patientQueueContainer');
        if (!container) return;
        
        if (this.patientQueue.length === 0) {
            container.innerHTML = `
                <div class="no-patients">
                    <div class="no-patients-icon">👥</div>
                    <h3>No Patients in Queue</h3>
                    <p>Your queue is empty. New patients will appear here automatically.</p>
                </div>
            `;
            return;
        }
        
        const queueHtml = this.patientQueue.map((patient, index) => `
            <div class="patient-queue-card" id="patient-${patient.id}">
                <div class="queue-number">${index + 1}</div>
                
                <div class="patient-info">
                    <h4>${patient.name}</h4>
                    <div class="patient-details">
                        <span>Age: ${patient.age || 'N/A'}</span>
                        <span>Gender: ${patient.gender || 'N/A'}</span>
                        <span>Phone: ${patient.phone || 'N/A'}</span>
                    </div>
                    <div class="patient-location">
                        📍 ${patient.location || 'Unknown location'}
                    </div>
                </div>
                
                <div class="patient-status">
                    <span class="priority ${patient.priority || 'normal'}">${(patient.priority || 'Normal').toUpperCase()}</span>
                    <span class="wait-time">${this.calculateWaitTime(patient.joinedAt)}</span>
                </div>
                
                <div class="patient-actions">
                    <button class="btn btn-primary" onclick="DoctorDashboard.startConsultation('${patient.id}')">
                        Start
                    </button>
                    <button class="btn btn-outline" onclick="DoctorDashboard.viewPatientHistory('${patient.id}')">
                        History
                    </button>
                    <button class="btn btn-outline" onclick="DoctorDashboard.postponePatient('${patient.id}')">
                        Postpone
                    </button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = queueHtml;
    },

    // Calculate wait time
    calculateWaitTime: function(joinedAt) {
        if (!joinedAt) return 'Unknown';
        
        const joinTime = new Date(joinedAt);
        const now = new Date();
        const diffMinutes = Math.floor((now - joinTime) / (1000 * 60));
        
        if (diffMinutes < 1) return 'Just joined';
        if (diffMinutes < 60) return `${diffMinutes}m`;
        
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        return `${hours}h ${minutes}m`;
    },

    // Load appointments
    loadAppointments: async function() {
        try {
            const response = await DoctorApi.getAppointments('today');
            
            if (response.success) {
                this.renderAppointments(response.data || []);
                ConfigUtils.log('info', 'Appointments loaded', { count: response.data?.length || 0 });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load appointments', error);
            this.renderAppointments([]);
        }
    },

    // Render appointments
    renderAppointments: function(appointments) {
        const container = document.getElementById('appointmentsContainer');
        if (!container) return;
        
        if (appointments.length === 0) {
            container.innerHTML = `
                <div class="no-appointments">
                    <div class="no-appointments-icon">📅</div>
                    <h3>No Appointments Today</h3>
                    <p>You have no scheduled appointments for today.</p>
                </div>
            `;
            return;
        }
        
        const appointmentsHtml = appointments.map(appointment => `
            <div class="appointment-card">
                <div class="appointment-time">
                    <strong>${ConfigUtils.formatTime(appointment.scheduledTime)}</strong>
                    <span>${appointment.type || 'General'}</span>
                </div>
                
                <div class="appointment-patient">
                    <h4>${appointment.patientName}</h4>
                    <p>${appointment.reason || 'Routine checkup'}</p>
                </div>
                
                <div class="appointment-status">
                    <span class="status ${appointment.status || 'scheduled'}">${(appointment.status || 'Scheduled').toUpperCase()}</span>
                </div>
                
                <div class="appointment-actions">
                    <button class="btn btn-sm btn-primary" onclick="DoctorDashboard.startAppointment('${appointment.id}')">
                        Start
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="DoctorDashboard.rescheduleAppointment('${appointment.id}')">
                        Reschedule
                    </button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = appointmentsHtml;
    },

    // Load ASHA reports
    loadAshaReports: async function() {
        try {
            const response = await DoctorApi.getAshaReports('pending');
            
            if (response.success) {
                this.renderAshaReports(response.data || []);
                ConfigUtils.log('info', 'ASHA reports loaded', { count: response.data?.length || 0 });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load ASHA reports', error);
            this.renderAshaReports([]);
        }
    },

    // Render ASHA reports
    renderAshaReports: function(reports) {
        const container = document.getElementById('ashaReportsContainer');
        if (!container) return;
        
        if (reports.length === 0) {
            container.innerHTML = `
                <div class="no-reports">
                    <div class="no-reports-icon">📋</div>
                    <h3>No Pending Reports</h3>
                    <p>All ASHA reports have been reviewed.</p>
                </div>
            `;
            return;
        }
        
        const reportsHtml = reports.map(report => `
            <div class="asha-report-card">
                <div class="report-header">
                    <div class="report-info">
                        <h4>${report.title || 'Health Report'}</h4>
                        <span>By: ${report.ashaWorkerName || 'Unknown ASHA'}</span>
                    </div>
                    <span class="report-date">${ConfigUtils.formatDate(report.createdAt)}</span>
                </div>
                
                <div class="report-content">
                    <p><strong>Patient:</strong> ${report.patientName || 'N/A'}</p>
                    <p><strong>Location:</strong> ${report.location || 'Unknown'}</p>
                    <p><strong>Summary:</strong> ${report.summary || 'No summary provided'}</p>
                </div>
                
                <div class="report-priority">
                    <span class="priority ${report.priority || 'normal'}">${(report.priority || 'Normal').toUpperCase()}</span>
                </div>
                
                <div class="report-actions">
                    <button class="btn btn-sm btn-primary" onclick="DoctorDashboard.reviewReport('${report.id}')">
                        Review
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="DoctorDashboard.viewReportDetails('${report.id}')">
                        Details
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="DoctorDashboard.contactAsha('${report.ashaId}')">
                        Contact ASHA
                    </button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = reportsHtml;
    },

    // Load recent prescriptions
    loadRecentPrescriptions: async function() {
        try {
            const response = await DoctorApi.getPrescriptions('recent', 5);
            
            if (response.success) {
                this.renderRecentPrescriptions(response.data || []);
                ConfigUtils.log('info', 'Recent prescriptions loaded', { count: response.data?.length || 0 });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load recent prescriptions', error);
            this.renderRecentPrescriptions([]);
        }
    },

    // Render recent prescriptions
    renderRecentPrescriptions: function(prescriptions) {
        const container = document.getElementById('recentPrescriptionsContainer');
        if (!container) return;
        
        if (prescriptions.length === 0) {
            container.innerHTML = `
                <div class="no-prescriptions">
                    <div class="no-prescriptions-icon">💊</div>
                    <h3>No Recent Prescriptions</h3>
                    <p>Your recent prescriptions will appear here.</p>
                </div>
            `;
            return;
        }
        
        const prescriptionsHtml = prescriptions.map(prescription => `
            <div class="prescription-card">
                <div class="prescription-header">
                    <h4>${prescription.patientName}</h4>
                    <span>${ConfigUtils.formatDate(prescription.createdAt)}</span>
                </div>
                
                <div class="prescription-medications">
                    ${prescription.medications?.slice(0, 2).map(med => `
                        <div class="medication-item">
                            <strong>${med.name}</strong> - ${med.dosage}
                        </div>
                    `).join('') || '<p>No medications listed</p>'}
                    ${prescription.medications?.length > 2 ? `<p>+${prescription.medications.length - 2} more...</p>` : ''}
                </div>
                
                <div class="prescription-actions">
                    <button class="btn btn-sm btn-outline" onclick="DoctorDashboard.viewPrescription('${prescription.id}')">
                        View
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="DoctorDashboard.duplicatePrescription('${prescription.id}')">
                        Duplicate
                    </button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = prescriptionsHtml;
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }
        
        // New prescription button
        const newPrescriptionBtn = document.getElementById('newPrescriptionBtn');
        if (newPrescriptionBtn) {
            newPrescriptionBtn.addEventListener('click', () => {
                this.createNewPrescription();
            });
        }
        
        // View all patients button
        const viewAllPatientsBtn = document.getElementById('viewAllPatientsBtn');
        if (viewAllPatientsBtn) {
            viewAllPatientsBtn.addEventListener('click', () => {
                this.viewAllPatients();
            });
        }
        
        // Emergency alert button
        const emergencyBtn = document.getElementById('emergencyBtn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => {
                this.handleEmergency();
            });
        }
    },

    // Setup WebSocket listeners
    setupWebSocketListeners: function() {
        if (window.WebSocketModule) {
            WebSocketModule.on('newPatientInQueue', (data) => {
                this.loadPatientQueue();
                this.loadOverviewStats();
                ApiUtils.showNotification('New patient joined the queue', 'info');
            });
            
            WebSocketModule.on('patientLeftQueue', (data) => {
                this.loadPatientQueue();
                this.loadOverviewStats();
            });
            
            WebSocketModule.on('sosAlert', (data) => {
                ApiUtils.showNotification('SOS Alert received - check admin dashboard', 'error');
            });
            
            WebSocketModule.on('ashaReportSubmitted', (data) => {
                this.loadAshaReports();
                this.loadOverviewStats();
                ApiUtils.showNotification('New ASHA report received', 'info');
            });
        }
    },

    // Setup auto refresh
    setupAutoRefresh: function() {
        this.refreshInterval = setInterval(() => {
            this.refreshDashboard();
        }, CONFIG.dashboard.refreshInterval);
    },

    // Refresh dashboard
    refreshDashboard: async function() {
        ConfigUtils.log('info', 'Refreshing doctor dashboard data');
        
        try {
            await this.loadDashboardData();
            ApiUtils.showSuccessToast('Dashboard refreshed');
        } catch (error) {
            ConfigUtils.log('error', 'Failed to refresh doctor dashboard', error);
            ApiUtils.showErrorToast('Failed to refresh dashboard');
        }
    },

    // Patient queue actions
    startConsultation: function(patientId) {
        const patient = this.patientQueue.find(p => p.id === patientId);
        if (!patient) {
            ApiUtils.showErrorToast('Patient not found');
            return;
        }
        
        showConfirmation(
            'Start Consultation',
            `Are you sure you want to start consultation with ${patient.name}?`,
            () => {
                DoctorApi.startConsultation(patientId).then(response => {
                    if (response.success) {
                        this.currentPatient = patient;
                        ApiUtils.showSuccessToast('Consultation started');
                        this.showConsultationModal(patient);
                        this.loadPatientQueue();
                    } else {
                        ApiUtils.showErrorToast(response.error);
                    }
                });
            }
        );
    },

    viewPatientHistory: function(patientId) {
        DoctorApi.getPatientHistory(patientId).then(response => {
            if (response.success) {
                this.showPatientHistoryModal(response.data);
            } else {
                ApiUtils.showErrorToast(response.error);
            }
        });
    },

    postponePatient: function(patientId) {
        const patient = this.patientQueue.find(p => p.id === patientId);
        if (!patient) {
            ApiUtils.showErrorToast('Patient not found');
            return;
        }
        
        showConfirmation(
            'Postpone Patient',
            `Are you sure you want to postpone ${patient.name}'s consultation?`,
            () => {
                DoctorApi.postponePatient(patientId).then(response => {
                    if (response.success) {
                        ApiUtils.showSuccessToast('Patient postponed');
                        this.loadPatientQueue();
                    } else {
                        ApiUtils.showErrorToast(response.error);
                    }
                });
            }
        );
    },

    // Appointment actions
    startAppointment: function(appointmentId) {
        DoctorApi.startAppointment(appointmentId).then(response => {
            if (response.success) {
                ApiUtils.showSuccessToast('Appointment started');
                this.loadAppointments();
            } else {
                ApiUtils.showErrorToast(response.error);
            }
        });
    },

    rescheduleAppointment: function(appointmentId) {
        ApiUtils.showSuccessToast('Reschedule appointment feature coming soon');
    },

    // ASHA report actions
    reviewReport: function(reportId) {
        DoctorApi.getReportDetails(reportId).then(response => {
            if (response.success) {
                this.showReportReviewModal(response.data);
            } else {
                ApiUtils.showErrorToast(response.error);
            }
        });
    },

    viewReportDetails: function(reportId) {
        DoctorApi.getReportDetails(reportId).then(response => {
            if (response.success) {
                this.showReportDetailsModal(response.data);
            } else {
                ApiUtils.showErrorToast(response.error);
            }
        });
    },

    contactAsha: function(ashaId) {
        ApiUtils.showSuccessToast('Contact ASHA feature coming soon');
    },

    // Prescription actions
    viewPrescription: function(prescriptionId) {
        DoctorApi.getPrescriptionDetails(prescriptionId).then(response => {
            if (response.success) {
                this.showPrescriptionDetailsModal(response.data);
            } else {
                ApiUtils.showErrorToast(response.error);
            }
        });
    },

    duplicatePrescription: function(prescriptionId) {
        DoctorApi.getPrescriptionDetails(prescriptionId).then(response => {
            if (response.success) {
                showPrescriptionModal(response.data);
            } else {
                ApiUtils.showErrorToast(response.error);
            }
        });
    },

    createNewPrescription: function() {
        showPrescriptionModal();
    },

    // Modal functions
    showConsultationModal: function(patient) {
        // Implementation for consultation modal
        ApiUtils.showSuccessToast('Consultation interface coming soon');
    },

    showPatientHistoryModal: function(history) {
        // Implementation for patient history modal
        ApiUtils.showSuccessToast('Patient history modal coming soon');
    },

    showReportReviewModal: function(report) {
        // Implementation for report review modal
        ApiUtils.showSuccessToast('Report review modal coming soon');
    },

    showReportDetailsModal: function(report) {
        // Implementation for report details modal
        ApiUtils.showSuccessToast('Report details modal coming soon');
    },

    showPrescriptionDetailsModal: function(prescription) {
        // Implementation for prescription details modal
        ApiUtils.showSuccessToast('Prescription details modal coming soon');
    },

    // Other actions
    viewAllPatients: function() {
        ApiUtils.showSuccessToast('View all patients feature coming soon');
    },

    handleEmergency: function() {
        showConfirmation(
            'Emergency Alert',
            'Are you sure you want to trigger an emergency alert?',
            () => {
                EmergencyApi.triggerEmergencyAlert({
                    doctorId: AuthModule.getUserData().id,
                    type: 'medical_emergency',
                    timestamp: new Date().toISOString()
                }).then(response => {
                    if (response.success) {
                        ApiUtils.showSuccessToast('Emergency alert sent');
                    } else {
                        ApiUtils.showErrorToast(response.error);
                    }
                });
            }
        );
    },

    // Cleanup
    destroy: function() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.patientQueue = [];
        this.currentPatient = null;
        
        ConfigUtils.log('info', 'Doctor Dashboard destroyed');
    }
};

// Initialize doctor dashboard function
async function initializeDoctorDashboard() {
    await DoctorDashboard.init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (window.DoctorDashboard) {
        DoctorDashboard.destroy();
    }
});

// Make DoctorDashboard available globally
window.DoctorDashboard = DoctorDashboard;