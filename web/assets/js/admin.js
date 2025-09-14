// Admin Dashboard JavaScript for Nabha Telemedicine

const AdminDashboard = {
    charts: {},
    refreshInterval: null,
    
    // Initialize admin dashboard
    init: async function() {
        ConfigUtils.log('info', 'Initializing Admin Dashboard');
        
        try {
            await this.loadDashboardData();
            this.setupEventListeners();
            this.setupCharts();
            this.setupAutoRefresh();
            this.setupWebSocketListeners();
            
            ConfigUtils.log('info', 'Admin Dashboard initialized successfully');
        } catch (error) {
            ConfigUtils.log('error', 'Failed to initialize Admin Dashboard', error);
            ApiUtils.showErrorToast('Failed to load dashboard data');
        }
    },

    // Load dashboard data
    loadDashboardData: async function() {
        try {
            // Load overview statistics
            await this.loadOverviewStats();
            
            // Load SOS alerts
            await this.loadSosAlerts();
            
            // Load user management data
            await this.loadUserManagement();
            
            // Load recent activity
            await this.loadRecentActivity();
            
            // Load analytics data
            await this.loadAnalyticsData();
            
        } catch (error) {
            ConfigUtils.log('error', 'Error loading dashboard data', error);
            throw error;
        }
    },

    // Load overview statistics
    loadOverviewStats: async function() {
        try {
            const response = await AdminApi.getStatistics();
            
            if (response.success) {
                const stats = response.data;
                
                // Update overview cards
                this.updateOverviewCard('totalPatientsCount', stats.totalPatients || 0);
                this.updateOverviewCard('activeDoctorsCount', stats.activeDoctors || 0);
                this.updateOverviewCard('ashaWorkersCount', stats.ashaWorkers || 0);
                this.updateOverviewCard('consultationsTodayCount', stats.consultationsToday || 0);
                
                ConfigUtils.log('info', 'Overview statistics loaded', stats);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load overview statistics', error);
            // Set default values
            this.updateOverviewCard('totalPatientsCount', 0);
            this.updateOverviewCard('activeDoctorsCount', 0);
            this.updateOverviewCard('ashaWorkersCount', 0);
            this.updateOverviewCard('consultationsTodayCount', 0);
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

    // Load SOS alerts
    loadSosAlerts: async function() {
        try {
            const response = await EmergencyApi.getSosAlerts('active');
            
            if (response.success) {
                const alerts = response.data || [];
                this.renderSosAlerts(alerts);
                
                // Update alert count
                const alertCount = document.getElementById('sosAlertCount');
                if (alertCount) {
                    alertCount.textContent = alerts.length;
                }
                
                ConfigUtils.log('info', 'SOS alerts loaded', { count: alerts.length });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load SOS alerts', error);
            this.renderSosAlerts([]);
        }
    },

    // Render SOS alerts
    renderSosAlerts: function(alerts) {
        const container = document.getElementById('sosAlertsContainer');
        if (!container) return;
        
        if (alerts.length === 0) {
            container.innerHTML = `
                <div class="no-alerts">
                    <div class="no-alerts-icon">✅</div>
                    <h3>No Active SOS Alerts</h3>
                    <p>All emergency situations are currently resolved.</p>
                </div>
            `;
            return;
        }
        
        const alertsHtml = alerts.map(alert => `
            <div class="sos-alert-card" id="sos-alert-${alert.id}">
                <div class="alert-header">
                    <div class="alert-info">
                        <strong>${alert.patientName || 'Unknown Patient'}</strong>
                        <span>${ConfigUtils.formatDateTime(alert.timestamp)}</span>
                    </div>
                    <span class="alert-priority ${alert.priority || 'high'}">${(alert.priority || 'high').toUpperCase()}</span>
                </div>
                
                <div class="alert-info">
                    <div>
                        <strong>Location:</strong> ${alert.location || 'Unknown'}
                    </div>
                    <div>
                        <strong>Contact:</strong> ${alert.contactNumber || 'N/A'}
                    </div>
                    <div>
                        <strong>Description:</strong> ${alert.description || 'Emergency situation'}
                    </div>
                    <div>
                        <strong>ASHA Worker:</strong> ${alert.ashaWorkerName || 'Not assigned'}
                    </div>
                </div>
                
                <div class="alert-actions">
                    <button class="btn btn-sm btn-primary" onclick="AdminDashboard.respondToSos('${alert.id}')">
                        Respond
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="AdminDashboard.assignDoctor('${alert.id}')">
                        Assign Doctor
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="AdminDashboard.viewSosDetails('${alert.id}')">
                        Details
                    </button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = alertsHtml;
    },

    // Load user management data
    loadUserManagement: async function() {
        try {
            // Load initial tab (doctors)
            await this.loadUsersTab('doctors');
            
            ConfigUtils.log('info', 'User management data loaded');
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load user management data', error);
        }
    },

    // Load users for specific tab
    loadUsersTab: async function(userType) {
        const tableBody = document.getElementById('userTableBody');
        const tableHead = document.getElementById('userTableHead');
        
        if (!tableBody || !tableHead) return;
        
        // Show loading
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Loading...</td></tr>';
        
        try {
            let response;
            
            switch (userType) {
                case 'doctors':
                    response = await AdminApi.getDoctors(1, 10);
                    this.renderDoctorsTable(response.data, tableHead, tableBody);
                    break;
                case 'asha':
                    response = await AdminApi.getAshaWorkers(1, 10);
                    this.renderAshaTable(response.data, tableHead, tableBody);
                    break;
                case 'patients':
                    response = await AdminApi.getPatients(1, 10);
                    this.renderPatientsTable(response.data, tableHead, tableBody);
                    break;
                default:
                    throw new Error('Invalid user type');
            }
            
            ConfigUtils.log('info', `${userType} data loaded`, { count: response.data?.length || 0 });
        } catch (error) {
            ConfigUtils.log('error', `Failed to load ${userType} data`, error);
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Failed to load data</td></tr>';
        }
    },

    // Render doctors table
    renderDoctorsTable: function(doctors, tableHead, tableBody) {
        tableHead.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Patients</th>
                <th>Actions</th>
            </tr>
        `;
        
        if (!doctors || doctors.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No doctors found</td></tr>';
            return;
        }
        
        const doctorsHtml = doctors.map(doctor => `
            <tr>
                <td>
                    <div class="user-info">
                        <strong>Dr. ${doctor.firstName} ${doctor.lastName}</strong>
                        <span>${doctor.email}</span>
                    </div>
                </td>
                <td>${doctor.specialization || 'General'}</td>
                <td>${doctor.experience || 0} years</td>
                <td>
                    <span class="user-status ${doctor.isActive ? 'active' : 'inactive'}">
                        ${doctor.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>${doctor.patientCount || 0}</td>
                <td>
                    <div class="user-actions">
                        <button class="btn btn-sm btn-outline" onclick="AdminDashboard.viewUserDetails('${doctor.id}', 'doctor')">View</button>
                        <button class="btn btn-sm btn-outline" onclick="AdminDashboard.editUser('${doctor.id}', 'doctor')">Edit</button>
                        <button class="btn btn-sm btn-outline" onclick="AdminDashboard.toggleUserStatus('${doctor.id}', ${doctor.isActive})">
                            ${doctor.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        tableBody.innerHTML = doctorsHtml;
    },

    // Render ASHA workers table
    renderAshaTable: function(ashaWorkers, tableHead, tableBody) {
        tableHead.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Reports</th>
                <th>Actions</th>
            </tr>
        `;
        
        if (!ashaWorkers || ashaWorkers.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No ASHA workers found</td></tr>';
            return;
        }
        
        const ashaHtml = ashaWorkers.map(asha => `
            <tr>
                <td>
                    <div class="user-info">
                        <strong>${asha.name}</strong>
                        <span>${asha.email || 'N/A'}</span>
                    </div>
                </td>
                <td>${asha.location || 'Unknown'}</td>
                <td>${asha.phone || 'N/A'}</td>
                <td>
                    <span class="user-status ${asha.isActive ? 'active' : 'inactive'}">
                        ${asha.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>${asha.reportCount || 0}</td>
                <td>
                    <div class="user-actions">
                        <button class="btn btn-sm btn-outline" onclick="AdminDashboard.viewUserDetails('${asha.id}', 'asha')">View</button>
                        <button class="btn btn-sm btn-outline" onclick="AdminDashboard.editUser('${asha.id}', 'asha')">Edit</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        tableBody.innerHTML = ashaHtml;
    },

    // Render patients table
    renderPatientsTable: function(patients, tableHead, tableBody) {
        tableHead.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Location</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        `;
        
        if (!patients || patients.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No patients found</td></tr>';
            return;
        }
        
        const patientsHtml = patients.map(patient => `
            <tr>
                <td>
                    <div class="user-info">
                        <strong>${patient.name}</strong>
                        <span>${patient.phone || 'N/A'}</span>
                    </div>
                </td>
                <td>${patient.age || 'N/A'}</td>
                <td>${patient.location || 'Unknown'}</td>
                <td>${patient.lastVisit ? ConfigUtils.formatDate(patient.lastVisit) : 'Never'}</td>
                <td>
                    <span class="user-status ${patient.isActive ? 'active' : 'inactive'}">
                        ${patient.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div class="user-actions">
                        <button class="btn btn-sm btn-outline" onclick="AdminDashboard.viewUserDetails('${patient.id}', 'patient')">View</button>
                        <button class="btn btn-sm btn-outline" onclick="AdminDashboard.viewMedicalHistory('${patient.id}')">History</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        tableBody.innerHTML = patientsHtml;
    },

    // Load recent activity
    loadRecentActivity: async function() {
        const activityContainer = document.getElementById('recentActivity');
        if (!activityContainer) return;
        
        try {
            // Simulate recent activity data
            const activities = [
                {
                    type: 'user_registered',
                    message: 'New doctor Dr. Sharma registered',
                    timestamp: new Date(Date.now() - 5 * 60 * 1000),
                    icon: '👨‍⚕️'
                },
                {
                    type: 'sos_alert',
                    message: 'SOS alert resolved in Village Nabha',
                    timestamp: new Date(Date.now() - 15 * 60 * 1000),
                    icon: '🚨'
                },
                {
                    type: 'consultation',
                    message: '15 consultations completed today',
                    timestamp: new Date(Date.now() - 30 * 60 * 1000),
                    icon: '🩺'
                },
                {
                    type: 'report',
                    message: 'Weekly ASHA report submitted',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    icon: '📋'
                }
            ];
            
            const activitiesHtml = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        ${activity.icon}
                    </div>
                    <div class="activity-content">
                        <h4>${activity.message}</h4>
                        <p>${ConfigUtils.formatDateTime(activity.timestamp)}</p>
                    </div>
                </div>
            `).join('');
            
            activityContainer.innerHTML = activitiesHtml;
            
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load recent activity', error);
            activityContainer.innerHTML = '<p>Failed to load recent activity</p>';
        }
    },

    // Load analytics data
    loadAnalyticsData: async function() {
        try {
            // Load different analytics
            await this.loadPatientTrends();
            await this.loadConsultationVolume();
            await this.loadDiseaseDistribution();
            await this.loadAshaPerformance();
            
            ConfigUtils.log('info', 'Analytics data loaded');
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load analytics data', error);
        }
    },

    // Setup charts
    setupCharts: function() {
        // Chart.js is included via CDN in the HTML
        if (typeof Chart === 'undefined') {
            ConfigUtils.log('error', 'Chart.js library not loaded');
            return;
        }
        
        Chart.defaults.font.family = 'Inter';
        Chart.defaults.font.size = 12;
        Chart.defaults.color = '#6b7280';
    },

    // Load patient trends chart
    loadPatientTrends: async function() {
        const canvas = document.getElementById('patientTrendsChart');
        if (!canvas) return;
        
        try {
            // Mock data - replace with actual API call
            const data = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Patients',
                    data: [120, 150, 180, 220, 280, 320],
                    borderColor: CONFIG.dashboard.chartColors.primary,
                    backgroundColor: CONFIG.dashboard.chartColors.primary + '20',
                    tension: 0.4
                }]
            };
            
            this.charts.patientTrends = new Chart(canvas, {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
            
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load patient trends chart', error);
        }
    },

    // Load consultation volume chart
    loadConsultationVolume: async function() {
        const canvas = document.getElementById('consultationVolumeChart');
        if (!canvas) return;
        
        try {
            const data = {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Consultations',
                    data: [45, 52, 38, 48, 56, 42, 35],
                    backgroundColor: CONFIG.dashboard.chartColors.success,
                    borderRadius: 4
                }]
            };
            
            this.charts.consultationVolume = new Chart(canvas, {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
            
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load consultation volume chart', error);
        }
    },

    // Load disease distribution chart
    loadDiseaseDistribution: async function() {
        const canvas = document.getElementById('diseaseDistributionChart');
        if (!canvas) return;
        
        try {
            const data = {
                labels: ['Fever', 'Hypertension', 'Diabetes', 'Respiratory', 'Others'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        CONFIG.dashboard.chartColors.error,
                        CONFIG.dashboard.chartColors.warning,
                        CONFIG.dashboard.chartColors.info,
                        CONFIG.dashboard.chartColors.success,
                        CONFIG.dashboard.chartColors.primary
                    ]
                }]
            };
            
            this.charts.diseaseDistribution = new Chart(canvas, {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
            
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load disease distribution chart', error);
        }
    },

    // Load ASHA performance chart
    loadAshaPerformance: async function() {
        const canvas = document.getElementById('ashaPerformanceChart');
        if (!canvas) return;
        
        try {
            const data = {
                labels: ['Reports', 'Visits', 'Follow-ups', 'Referrals'],
                datasets: [{
                    label: 'This Month',
                    data: [85, 78, 92, 67],
                    backgroundColor: CONFIG.dashboard.chartColors.info + '80',
                    borderColor: CONFIG.dashboard.chartColors.info,
                    pointBackgroundColor: CONFIG.dashboard.chartColors.info
                }]
            };
            
            this.charts.ashaPerformance = new Chart(canvas, {
                type: 'radar',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
            
        } catch (error) {
            ConfigUtils.log('error', 'Failed to load ASHA performance chart', error);
        }
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
        
        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportReport();
            });
        }
        
        // User management tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadUsersTab(btn.getAttribute('data-tab'));
            });
        });
        
        // Filter users button
        const filterUsersBtn = document.getElementById('filterUsersBtn');
        if (filterUsersBtn) {
            filterUsersBtn.addEventListener('click', () => {
                this.showFilterModal();
            });
        }
        
        // Add user button
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                this.showAddUserModal();
            });
        }
    },

    // Setup auto refresh
    setupAutoRefresh: function() {
        this.refreshInterval = setInterval(() => {
            this.refreshDashboard();
        }, CONFIG.dashboard.refreshInterval);
    },

    // Setup WebSocket listeners
    setupWebSocketListeners: function() {
        if (window.WebSocketModule) {
            WebSocketModule.on('sosAlert', (data) => {
                this.loadSosAlerts();
            });
            
            WebSocketModule.on('sosResolved', (data) => {
                this.loadSosAlerts();
                this.loadOverviewStats();
            });
            
            WebSocketModule.on('userStatusUpdate', (data) => {
                this.loadOverviewStats();
            });
        }
    },

    // Refresh dashboard
    refreshDashboard: async function() {
        ConfigUtils.log('info', 'Refreshing dashboard data');
        
        try {
            await this.loadDashboardData();
            ApiUtils.showSuccessToast('Dashboard refreshed');
        } catch (error) {
            ConfigUtils.log('error', 'Failed to refresh dashboard', error);
            ApiUtils.showErrorToast('Failed to refresh dashboard');
        }
    },

    // Export report
    exportReport: function() {
        const reportData = {
            timestamp: new Date().toISOString(),
            overview: {
                totalPatients: document.getElementById('totalPatientsCount')?.textContent || 0,
                activeDoctors: document.getElementById('activeDoctorsCount')?.textContent || 0,
                ashaWorkers: document.getElementById('ashaWorkersCount')?.textContent || 0,
                consultationsToday: document.getElementById('consultationsTodayCount')?.textContent || 0
            }
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        ApiUtils.showSuccessToast('Report exported successfully');
    },

    // SOS alert actions
    respondToSos: function(alertId) {
        showConfirmation(
            'Respond to SOS Alert',
            'Are you sure you want to respond to this SOS alert?',
            () => {
                EmergencyApi.respondToSos(alertId, {
                    responderId: AuthModule.getUserData().id,
                    response: 'admin_responding',
                    timestamp: new Date().toISOString()
                }).then(response => {
                    if (response.success) {
                        ApiUtils.showSuccessToast('SOS response sent');
                        this.loadSosAlerts();
                    } else {
                        ApiUtils.showErrorToast(response.error);
                    }
                });
            }
        );
    },

    assignDoctor: function(alertId) {
        // Implementation for assigning doctor to SOS alert
        ApiUtils.showSuccessToast('Doctor assignment feature coming soon');
    },

    viewSosDetails: function(alertId) {
        // Implementation for viewing SOS details
        ApiUtils.showSuccessToast('SOS details feature coming soon');
    },

    // User management actions
    viewUserDetails: function(userId, userType) {
        // Implementation for viewing user details
        ApiUtils.showSuccessToast(`View ${userType} details feature coming soon`);
    },

    editUser: function(userId, userType) {
        // Implementation for editing user
        ApiUtils.showSuccessToast(`Edit ${userType} feature coming soon`);
    },

    toggleUserStatus: function(userId, currentStatus) {
        const action = currentStatus ? 'deactivate' : 'activate';
        
        showConfirmation(
            `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
            `Are you sure you want to ${action} this user?`,
            () => {
                AdminApi.updateUserStatus(userId, !currentStatus).then(response => {
                    if (response.success) {
                        ApiUtils.showSuccessToast(`User ${action}d successfully`);
                        // Reload current tab
                        const activeTab = document.querySelector('.tab-btn.active');
                        if (activeTab) {
                            this.loadUsersTab(activeTab.getAttribute('data-tab'));
                        }
                    } else {
                        ApiUtils.showErrorToast(response.error);
                    }
                });
            }
        );
    },

    viewMedicalHistory: function(patientId) {
        // Implementation for viewing patient medical history
        ApiUtils.showSuccessToast('Medical history feature coming soon');
    },

    showFilterModal: function() {
        // Implementation for filter modal
        ApiUtils.showSuccessToast('Filter feature coming soon');
    },

    showAddUserModal: function() {
        // Implementation for add user modal
        ApiUtils.showSuccessToast('Add user feature coming soon');
    },

    // Cleanup
    destroy: function() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        
        ConfigUtils.log('info', 'Admin Dashboard destroyed');
    }
};

// Initialize admin dashboard function
async function initializeAdminDashboard() {
    await AdminDashboard.init();
}

// Component loader function
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
        
        ConfigUtils.log('debug', 'Component loaded', { elementId, componentPath });
    } catch (error) {
        ConfigUtils.log('error', 'Failed to load component', { elementId, componentPath, error });
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (window.AdminDashboard) {
        AdminDashboard.destroy();
    }
});

// Make AdminDashboard available globally
window.AdminDashboard = AdminDashboard;