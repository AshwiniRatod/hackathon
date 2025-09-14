# 🏥 Nabha Telemedicine - Web Platform

A comprehensive web-based telemedicine platform for rural healthcare delivery in Punjab, perfectly integrated with mobile applications and backend systems.

## 🚀 Project Overview

This web platform serves as the primary interface for healthcare professionals, administrators, and ASHA workers in the Nabha Telemedicine ecosystem. It provides real-time patient management, emergency response, and healthcare analytics capabilities.

## 📋 Features

### 🔐 Authentication & Authorization
- **Multi-role authentication** (Admin, Doctor, ASHA Worker, Patient)
- **JWT-based security** with automatic token refresh
- **Role-based access control** with protected routes
- **Secure registration** with medical license validation

### 👨‍⚕️ Doctor Dashboard
- **Real-time patient queue** management
- **Video consultation** interface
- **Electronic prescription** creation and management
- **Patient medical history** access
- **ASHA worker report** review and approval
- **Emergency alert** response system

### 🛡️ Admin Dashboard
- **System-wide analytics** and reporting
- **User management** (Doctors, ASHA workers, Patients)
- **SOS alert monitoring** and emergency coordination
- **Performance metrics** and health statistics
- **Data visualization** with interactive charts

### 🚨 Emergency Management
- **Real-time SOS alerts** with GPS location
- **Emergency response coordination**
- **Alert prioritization** and assignment
- **Mobile app integration** for field emergencies

### 📱 Mobile App Integration
- **Real-time synchronization** with mobile applications
- **WebSocket-based communication** for instant updates
- **Push notification** support
- **Offline capability** synchronization

### 📊 Analytics & Reporting
- **Patient trend analysis**
- **Disease distribution** tracking
- **Consultation volume** metrics
- **ASHA worker performance** monitoring
- **System health** dashboards

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup and accessibility
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - ES6+ features and modules
- **Chart.js** - Data visualization and analytics
- **Socket.IO Client** - Real-time communication

### Backend Integration
- **REST API** integration with Node.js backend
- **JWT authentication** with automatic refresh
- **WebSocket connections** for real-time features
- **File upload/download** capabilities

### External Services
- **Socket.IO** - Real-time bidirectional communication
- **Chart.js** - Interactive charts and graphs
- **Web APIs** - Geolocation, Notifications, Camera access

## 📁 Project Structure

```
web/
├── index.html                 # Landing page
├── admin-login.html          # Admin authentication
├── doctor-login.html         # Doctor authentication
├── doctor-register.html      # Doctor registration
├── admin-dashboard.html      # Admin control panel
├── doctor-dashboard.html     # Doctor workspace
├── test-integration.html     # Integration testing suite
├── assets/
│   ├── css/
│   │   ├── main.css          # Global styles and utilities
│   │   ├── dashboard.css     # Dashboard-specific styles
│   │   └── components.css    # Reusable component styles
│   ├── js/
│   │   ├── config.js         # Application configuration
│   │   ├── auth.js           # Authentication module
│   │   ├── api.js            # API communication utilities
│   │   ├── enhanced-api.js   # Advanced API features
│   │   ├── websocket.js      # Real-time communication
│   │   ├── admin.js          # Admin dashboard logic
│   │   └── doctor.js         # Doctor dashboard logic
│   └── images/               # Static assets
└── components/
    ├── header.html           # Reusable header component
    ├── sidebar.html          # Navigation sidebar
    └── modals.html           # Modal dialogs and overlays
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js backend server running on `http://localhost:3000`
- Socket.IO server for real-time features
- Modern web browser with ES6+ support

### Quick Start

1. **Clone or download** the project files
2. **Configure the backend** connection in `assets/js/config.js`
3. **Start a local server** (for development):
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8080
   ```
4. **Open your browser** and navigate to `http://localhost:8080`

### Configuration

Edit `assets/js/config.js` to match your environment:

```javascript
const CONFIG = {
    api: {
        baseUrl: 'http://localhost:3000/api',  // Your backend URL
        timeout: 10000
    },
    websocket: {
        url: 'http://localhost:3000',          // Your Socket.IO server
        enabled: true
    }
    // ... other settings
};
```

## 🚀 Usage Guide

### For Administrators

1. **Login** at `/admin-login.html`
2. **Monitor** system health and user activity
3. **Manage** doctors, ASHA workers, and patients
4. **Respond** to emergency SOS alerts
5. **View** analytics and generate reports

### For Doctors

1. **Register** at `/doctor-register.html` or login at `/doctor-login.html`
2. **Manage** patient queue and consultations
3. **Create** electronic prescriptions
4. **Review** ASHA worker reports
5. **Respond** to emergency situations

### For Testing

1. **Open** `/test-integration.html`
2. **Run** comprehensive integration tests
3. **Monitor** real-time events and system performance
4. **Export** test logs for analysis

## 🔗 API Integration

The platform integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh

### Admin APIs
- `GET /api/admin/statistics` - System statistics
- `GET /api/admin/doctors` - Doctor management
- `GET /api/admin/patients` - Patient management

### Doctor APIs
- `GET /api/doctor/queue` - Patient queue
- `POST /api/doctor/consultation` - Start consultation
- `GET /api/doctor/prescriptions` - Prescription management

### Emergency APIs
- `GET /api/emergency/sos-alerts` - SOS alert management
- `POST /api/emergency/respond` - Emergency response

## 🌐 Real-time Features

### WebSocket Events
- `sosAlert` - Emergency SOS notifications
- `patientQueue` - Queue updates
- `consultation` - Consultation status changes
- `ashaReport` - ASHA worker submissions
- `mobileSync` - Mobile app synchronization

### Notification System
- **Desktop notifications** for critical alerts
- **In-app toast messages** for user feedback
- **Real-time status updates** for all connected users
- **Push notification** integration ready

## 🎨 Design System

### Color Palette
- **Primary**: `#2c5aa0` (Medical Blue)
- **Success**: `#16a34a` (Green)
- **Warning**: `#ca8a04` (Amber)
- **Error**: `#dc2626` (Red)
- **Info**: `#0891b2` (Cyan)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: System monospace fonts
- **Responsive sizing** with fluid typography

### Components
- **Responsive design** for all device sizes
- **Accessible** forms and navigation
- **Consistent** button and input styles
- **Medical-themed** icons and imagery

## 🧪 Testing

### Integration Tests
Run the comprehensive test suite at `/test-integration.html`:

- **Authentication** flow testing
- **API endpoint** verification
- **WebSocket** connection testing
- **Component** functionality
- **Performance** monitoring

### Manual Testing
1. **Cross-browser** compatibility
2. **Mobile responsiveness**
3. **Real-time** feature validation
4. **Error handling** scenarios

## 📱 Mobile Integration

### Synchronization Features
- **Real-time data sync** between web and mobile
- **Offline queue** management
- **Emergency alert** broadcasting
- **Patient data** synchronization

### Communication Protocol
- **WebSocket-based** bidirectional communication
- **Event-driven** architecture
- **Automatic reconnection** handling
- **Message queuing** for offline scenarios

## 🔒 Security

### Authentication
- **JWT tokens** with expiration
- **Automatic token refresh**
- **Role-based access control**
- **Secure password** policies

### Data Protection
- **HTTPS enforcement** (in production)
- **Input validation** and sanitization
- **XSS protection** measures
- **CSRF token** implementation ready

### Privacy
- **HIPAA compliance** considerations
- **Patient data** anonymization
- **Audit logging** capabilities
- **Secure communication** channels

## 🚀 Deployment

### Production Checklist
- [ ] Update API URLs in `config.js`
- [ ] Enable HTTPS
- [ ] Configure CSP headers
- [ ] Optimize assets (minify CSS/JS)
- [ ] Set up CDN for static assets
- [ ] Configure monitoring and logging

### Environment Variables
```javascript
// Production config example
const CONFIG = {
    api: {
        baseUrl: 'https://api.nabha-telemedicine.com/api',
        timeout: 15000
    },
    websocket: {
        url: 'https://ws.nabha-telemedicine.com',
        enabled: true
    }
};
```

## 🐛 Troubleshooting

### Common Issues

1. **WebSocket connection fails**
   - Check backend server is running
   - Verify Socket.IO version compatibility
   - Check firewall settings

2. **API calls return 401**
   - Verify backend is running
   - Check JWT token validity
   - Ensure correct API endpoints

3. **Charts not displaying**
   - Verify Chart.js CDN is accessible
   - Check console for JavaScript errors
   - Ensure canvas elements exist

### Debug Mode
Enable debug logging in `config.js`:
```javascript
debug: {
    enabled: true,
    level: 'debug'
}
```

## 🤝 Contributing

### Development Guidelines
1. **Follow** existing code structure
2. **Test** all changes thoroughly
3. **Document** new features
4. **Maintain** responsive design
5. **Consider** accessibility

### Code Style
- **ES6+** JavaScript features
- **Semantic** HTML structure
- **BEM methodology** for CSS
- **Modular** component architecture

## 📞 Support

For technical support or questions:
- **Email**: support@nabha-telemedicine.com
- **Documentation**: Available in `/test-integration.html`
- **Logs**: Check browser console for detailed errors

## 📄 License

This project is part of the Smart India Hackathon (SIH) submission for rural healthcare delivery in Punjab, India.

---

## 🎯 Quick Start Commands

```bash
# Development server
npm install -g serve
serve . -p 8080

# Or with Python
python -m http.server 8080

# Open in browser
open http://localhost:8080
```

## 📊 Project Statistics

- **Total Files**: 15+ HTML/CSS/JS files
- **Lines of Code**: 5000+ lines
- **Components**: 10+ reusable components
- **API Endpoints**: 20+ integrated endpoints
- **Real-time Events**: 15+ WebSocket events
- **Test Coverage**: 50+ integration tests

---

**Built with ❤️ for rural healthcare in Punjab, India**