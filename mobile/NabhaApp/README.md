# 📱 Nabha Health Mobile App

A comprehensive mobile telemedicine application for rural healthcare in Punjab, designed for patients, farmers, and ASHA workers.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── NotificationHandler.js
├── screens/            # App screens organized by role
│   ├── auth/           # Authentication screens
│   │   ├── OnboardingScreen.js
│   │   ├── PhoneInputScreen.js
│   │   ├── OTPVerificationScreen.js
│   │   ├── RoleSelectionScreen.js
│   │   └── ProfileSetupScreen.js
│   ├── patient/        # Patient-specific screens
│   │   ├── PatientDashboard.js
│   │   ├── SymptomCheckerScreen.js
│   │   ├── DoctorSearchScreen.js
│   │   ├── BookConsultationScreen.js
│   │   ├── HealthRecordsScreen.js
│   │   ├── PrescriptionsScreen.js
│   │   └── ProfileScreen.js
│   ├── asha/           # ASHA worker screens
│   │   ├── ASHADashboard.js
│   │   ├── FieldVisitsScreen.js
│   │   └── ReportsScreen.js
│   ├── emergency/      # Emergency/SOS screens
│   │   ├── SOSScreen.js
│   │   └── EmergencyContactsScreen.js
│   └── common/         # Common screens
│       ├── ConsultationScreen.js
│       ├── SettingsScreen.js
│       └── NotificationsScreen.js
├── navigation/         # Navigation setup
│   └── AppNavigator.js
├── services/           # API calls and external services
│   └── api.js
├── store/              # Redux store and slices
│   ├── store.js
│   └── slices/
│       ├── authSlice.js
│       ├── userSlice.js
│       ├── consultationSlice.js
│       ├── healthRecordsSlice.js
│       ├── emergencySlice.js
│       ├── offlineSlice.js
│       └── localizationSlice.js
├── utils/              # Helper functions and constants
│   └── theme.js
├── localization/       # Language files
│   ├── en.json
│   ├── hi.json
│   └── pa.json
└── assets/             # Images, icons, fonts
    ├── icon.png
    ├── splash-icon.png
    ├── adaptive-icon.png
    └── favicon.png
```

## 🚀 Features

### 🔐 Authentication
- Phone number-based OTP authentication
- Role selection (Patient, ASHA Worker)
- Biometric authentication support
- Multi-language onboarding

### 👥 Patient Features
- **Symptom Checker**: Interactive health assessment
- **Doctor Consultation**: Video/audio/chat consultations
- **Health Records**: Digital medical history
- **Prescriptions**: Digital prescription management
- **Emergency SOS**: One-tap emergency assistance

### 🏥 ASHA Worker Features
- **Field Visits**: House-to-house visit tracking
- **Data Collection**: Health monitoring forms
- **Reporting**: Government health system integration
- **Patient Management**: Community health tracking

### 🚨 Emergency Features
- **SOS Button**: Immediate emergency response
- **Location Sharing**: GPS-based emergency alerts
- **Emergency Contacts**: Automated contact notifications
- **Hospital Integration**: Direct hospital communication

### 🌐 Cross-Platform Features
- **Multilingual Support**: English, Hindi, Punjabi
- **Offline-First**: Works without internet connection
- **Data Sync**: Automatic synchronization when online
- **Push Notifications**: Real-time alerts and reminders

## 🛠️ Technology Stack

### Core Technologies
- **React Native** with Expo
- **Redux Toolkit** for state management
- **React Navigation v6** for navigation
- **React Native Paper** for Material Design UI

### Backend Integration
- **Axios** for API calls
- **AsyncStorage** for local data persistence
- **REST API** integration with existing backend

### Communication
- **WebRTC** for video/audio calling
- **Socket.io** for real-time messaging
- **Push Notifications** via Expo Notifications

### Offline Capabilities
- **SQLite** for local database
- **AsyncStorage** for app data
- **Background Sync** for data synchronization

### Localization
- **React Native Localization** for i18n
- **Multi-script Support** (Devanagari, Gurmukhi)
- **RTL Support** for future expansion

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation Steps

1. **Navigate to mobile app directory**
```bash
cd mobile/NabhaHealthApp
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Run on device/emulator**
```bash
# For Android
npm run android

# For iOS
npm run ios

# For web (development)
npm run web
```

## 🔧 Configuration

### Backend API Configuration
Update the API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url:5000/api';
```

### Notification Configuration
Configure push notifications in `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

## 🌍 Localization

### Adding New Languages
1. Create language file in `src/localization/`
2. Add language to `availableLanguages` in localization slice
3. Update language picker component

### Language Files Structure
```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "auth": {
    "login": "Login",
    "register": "Register"
  }
}
```

## 📊 State Management

### Redux Store Structure
- **auth**: Authentication state
- **user**: User profile and preferences
- **consultation**: Video call and consultation state
- **healthRecords**: Medical records and prescriptions
- **emergency**: SOS and emergency state
- **offline**: Offline data and sync queue
- **localization**: Language and locale settings

## 🔒 Security Features

- **Secure Token Storage** using Keychain/Keystore
- **Biometric Authentication** support
- **Data Encryption** for sensitive information
- **SSL Pinning** for API communications
- **Screen Recording Prevention** during consultations

## 📱 Offline Capabilities

### Offline Features
- Complete app functionality without internet
- Local SQLite database for critical data
- Image and document caching
- Emergency SOS with offline queue
- Symptom checker offline database

### Data Synchronization
- Background sync when connectivity restored
- Conflict resolution for data changes
- Priority-based sync (emergencies first)
- Delta sync to minimize data usage

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm test

# E2E tests (when implemented)
npm run test:e2e
```

### Test Coverage
- Authentication flows
- Offline functionality
- Emergency SOS system
- Data synchronization
- Multilingual content

## 🚀 Deployment

### Building for Production

#### Android APK
```bash
expo build:android
```

#### iOS App
```bash
expo build:ios
```

### App Store Deployment
1. Configure app signing certificates
2. Update app version in `app.json`
3. Build production version
4. Upload to respective app stores

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

---

**Note**: This mobile app is designed to work seamlessly with the existing Telemedicine backend system and web dashboards for doctors and admins.
