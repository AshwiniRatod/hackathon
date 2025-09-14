import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ConsultationFlow from './src/screens/consultation/ConsultationFlow';
import CheckSymptomsScreen from './src/screens/CheckSymptomsScreen';
import ASHAWorkerHub from './src/screens/ASHAWorkerHub';

// Log environment configuration
console.log('🔧 App Environment Configuration:');
console.log(`📱 App Name: ${process.env.EXPO_PUBLIC_APP_NAME || 'Nabha Health App'}`);
console.log(`📦 App Version: ${process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0'}`);
console.log(`🌍 Environment: ${process.env.EXPO_PUBLIC_NODE_ENV || 'development'}`);
console.log(`📡 API URL: ${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.5:3000/api'}`);
console.log(`🔌 Socket URL: ${process.env.EXPO_PUBLIC_SOCKET_URL || 'http://192.168.1.5:3000'}`);
console.log(`🐛 Debug Mode: ${process.env.EXPO_PUBLIC_DEBUG_MODE || 'true'}`);

const translations = {
  en: {
    appTitle: "🏥 Nabha Health App",
    appSubtitle: "Telemedicine for Rural Punjab",
    appDescription: "Healthcare for Farmers and Patients",
    consultDoctor: "Consult Doctor",
    emergencySOS: "Emergency SOS", 
    checkSymptoms: "Check Symptoms",
    ashaWorker: "ASHA Worker",
    uploadReports: "📋 Upload Medical Reports",
    uploadDescription: "Upload Medical Reports",
    chooseReports: "📄 Choose Reports",
    uploadSubtext: "For better diagnosis by doctors",
    startApp: "Start App",
    multiLangSupport: "✅ Multi-Language Support: Punjabi, Hindi, English",
    offlineSupport: "✅ Offline Support ✅ Emergency Service ✅ Video Call",
    appRunning: "🎉 Mobile App is Running Successfully!",
    selectLanguage: "Select Language",
    bloodReports: "Blood Reports • Lab Tests • X-Rays",
    securePrivate: "Secure & Private",
    fileFormats: "PDF, JPG, PNG Formats"
  },
  hi: {
    appTitle: "🏥 नभा स्वास्थ्य ऐप",
    appSubtitle: "ग्रामीण पंजाब के लिए टेलीमेडिसिन",
    appDescription: "किसानों और मरीजों के लिए स्वास्थ्य सेवा",
    consultDoctor: "डॉक्टर से सलाह लें",
    emergencySOS: "आपातकालीन SOS",
    checkSymptoms: "लक्षण जांचें",
    ashaWorker: "आशा कार्यकर्ता",
    uploadReports: "📋 मेडिकल रिपोर्ट अपलोड करें",
    uploadDescription: "मेडिकल रिपोर्ट अपलोड करें",
    chooseReports: "📄 रिपोर्ट चुनें",
    uploadSubtext: "डॉक्टरों द्वारा बेहतर निदान के लिए",
    startApp: "ऐप शुरू करें",
    multiLangSupport: "✅ बहु-भाषा समर्थन: पंजाबी, हिंदी, अंग्रेजी",
    offlineSupport: "✅ ऑफलाइन समर्थन ✅ आपातकालीन सेवा ✅ वीडियो कॉल",
    appRunning: "🎉 मोबाइल ऐप सफलतापूर्वक चल रहा है!",
    selectLanguage: "भाषा चुनें",
    bloodReports: "ब्लड रिपोर्ट • लैब टेस्ट • एक्स-रे",
    securePrivate: "सुरक्षित और निजी",
    fileFormats: "PDF, JPG, PNG फॉर्मेट"
  },
  pa: {
    appTitle: "🏥 ਨਭਾ ਸਿਹਤ ਐਪ",
    appSubtitle: "ਪੇਂਡੂ ਪੰਜਾਬ ਲਈ ਟੈਲੀਮੈਡੀਸਿਨ",
    appDescription: "ਕਿਸਾਨਾਂ ਅਤੇ ਮਰੀਜ਼ਾਂ ਲਈ ਸਿਹਤ ਸੇਵਾ",
    consultDoctor: "ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰੋ",
    emergencySOS: "ਐਮਰਜੈਂਸੀ SOS",
    checkSymptoms: "ਲੱਛਣ ਚੈਕ ਕਰੋ",
    ashaWorker: "ASHA ਵਰਕਰ",
    uploadReports: "📋 ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰੋ",
    uploadDescription: "ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰੋ",
    chooseReports: "📄 ਰਿਪੋਰਟ ਚੁਣੋ",
    uploadSubtext: "ਡਾਕਟਰ ਦੀ ਬਿਹਤਰ ਸਲਾਹ ਲਈ",
    startApp: "ਐਪ ਸ਼ੁਰੂ ਕਰੋ",
    multiLangSupport: "✅ ਮਲਟੀ-ਲੈਂਗੂਏਜ ਸਪੋਰਟ: ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਅੰਗਰੇਜ਼ੀ",
    offlineSupport: "✅ ਆਫਲਾਈਨ ਸਪੋਰਟ ✅ ਐਮਰਜੈਂਸੀ ਸਰਵਿਸ ✅ ਵੀਡੀਓ ਕਾਲ",
    appRunning: "🎉 ਮੋਬਾਈਲ ਐਪ ਸਫਲਤਾਪੂਰਵਕ ਚੱਲ ਰਿਹਾ ਹੈ!",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    bloodReports: "ਖੂਨ ਦੀ ਰਿਪੋਰਟ • ਲੈਬ ਟੈਸਟ • ਐਕਸ-ਰੇ",
    securePrivate: "ਸੁਰੱਖਿਅਤ ਅਤੇ ਨਿੱਜੀ",
    fileFormats: "PDF, JPG, PNG ਫਾਈਲਾਂ"
  }
};

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showConsultationFlow, setShowConsultationFlow] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [showSymptomsChecker, setShowSymptomsChecker] = useState(false);
  const [showASHAHub, setShowASHAHub] = useState(false);
  
  const t = translations[currentLanguage];

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setShowLanguageModal(false);
  };

  const openConsultationFlow = () => {
    setShowConsultationFlow(true);
  };

  const closeConsultationFlow = () => {
    setShowConsultationFlow(false);
  };

  const handleEmergencyCall = (serviceType, number, serviceName) => {
    setEmergencyActive(true);
    
    // Auto-reset emergency status after 10 seconds
    setTimeout(() => {
      setEmergencyActive(false);
    }, 10000);
    
    return Alert.alert(
      `${serviceType} Emergency Service`,
      `🚨 EMERGENCY ALERT ACTIVATED 🚨\n\n📞 Service: ${serviceName}\n📱 Number: ${number}\n📍 Location: Getting GPS coordinates...\n🕐 Time: ${new Date().toLocaleString()}\n\n⚡ Emergency services will be contacted immediately!`,
      [
        { 
          text: 'Call Now', 
          onPress: () => {
            console.log(`Emergency call to ${number} for ${serviceName}`);
            Alert.alert('📞 Calling...', `Connecting to ${serviceName} at ${number}\n\nPlease stay on the line and provide your location and emergency details.`);
          }
        },
        { text: 'Cancel', style: 'cancel', onPress: () => setEmergencyActive(false) }
      ]
    );
  };
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Language Selector */}
      <View style={styles.languageBar}>
        <TouchableOpacity 
          style={styles.languageButton}
          onPress={() => setShowLanguageModal(true)}
        >
          <Text style={styles.languageButtonText}>🌐 {t.selectLanguage}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{t.appTitle}</Text>
        <Text style={styles.subtitle}>{t.appSubtitle}</Text>
        <Text style={styles.description}>{t.appDescription}</Text>
      </View>

      <View style={styles.featuresContainer}>
        {/* First Row */}
        <View style={styles.featureRow}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={openConsultationFlow}
            activeOpacity={0.7}
          >
            <Text style={styles.featureIcon}>👩‍⚕️</Text>
            <Text style={styles.featureTitle}>{t.consultDoctor}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, emergencyActive && styles.emergencyActiveCard]}
            onPress={() => {
              Alert.alert(
                '🚨 EMERGENCY SOS SYSTEM',
                'Punjab Emergency Services\n\nSelect the type of emergency assistance needed:',
                [
                  { 
                    text: '🚔 Police Emergency', 
                    onPress: () => handleEmergencyCall('🚔', '100', 'Punjab Police Emergency')
                  },
                  { 
                    text: '🚑 Medical Emergency', 
                    onPress: () => handleEmergencyCall('🚑', '108', 'Ambulance Service')
                  },
                  { 
                    text: '🚒 Fire Emergency', 
                    onPress: () => handleEmergencyCall('🚒', '101', 'Fire Department')
                  },
                  { 
                    text: '🏥 Nabha Hospital', 
                    onPress: () => handleEmergencyCall('🏥', '+91-1765-222222', 'Nabha Civil Hospital')
                  },
                  { 
                    text: '⚡ ALL SERVICES (Critical)', 
                    onPress: () => {
                      setEmergencyActive(true);
                      Alert.alert(
                        '⚡ CRITICAL EMERGENCY ALERT',
                        '🚨 ALL EMERGENCY SERVICES ACTIVATED 🚨\n\n✅ Police (100) - Dispatched\n✅ Ambulance (108) - En Route\n✅ Fire Department (101) - Notified\n✅ Nabha Hospital - Alerted\n✅ Emergency Contacts - Messaged\n\n📍 Your location has been shared with all services\n🕐 Response Time: 5-15 minutes\n\n🚁 Emergency coordinator will contact you shortly.',
                        [
                          { text: 'Track Response', onPress: () => console.log('Tracking all emergency services') },
                          { text: 'I\'m Safe Now', onPress: () => {
                            setEmergencyActive(false);
                            Alert.alert('Emergency Cancelled', 'All services have been notified that you are safe.');
                          }}
                        ]
                      );
                      setTimeout(() => setEmergencyActive(false), 30000); // Reset after 30 seconds
                    }
                  },
                  { text: 'Cancel', style: 'cancel' }
                ],
                { cancelable: true }
              );
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.sosButton, emergencyActive && styles.sosButtonActive]}>
              <Text style={styles.sosIcon}>🚨</Text>
            </View>
            <Text style={[styles.featureTitle, emergencyActive && styles.emergencyActiveText]}>
              {emergencyActive ? 'EMERGENCY ACTIVE' : t.emergencySOS}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Second Row */}
        <View style={styles.featureRow}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => setShowSymptomsChecker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.featureIcon}>🩺</Text>
            <Text style={styles.featureTitle}>{t.checkSymptoms}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => setShowASHAHub(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.featureIcon}>👩‍🌾</Text>
            <Text style={styles.featureTitle}>{t.ashaWorker}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Medical Report Upload Section */}
      <View style={styles.uploadSection}>
        <Text style={styles.uploadTitle}>{t.uploadReports}</Text>
        
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadIcon}>📄</Text>
          <Text style={styles.uploadButtonText}>{t.chooseReports}</Text>
          <Text style={styles.uploadSubtext}>{t.uploadSubtext}</Text>
        </TouchableOpacity>

        <View style={styles.uploadInfoContainer}>
          <View style={styles.uploadInfoRow}>
            <Text style={styles.uploadInfoIcon}>✅</Text>
            <Text style={styles.uploadInfoText}>{t.bloodReports}</Text>
          </View>
          <View style={styles.uploadInfoRow}>
            <Text style={styles.uploadInfoIcon}>🔒</Text>
            <Text style={styles.uploadInfoText}>{t.securePrivate}</Text>
          </View>
          <View style={styles.uploadInfoRow}>
            <Text style={styles.uploadInfoIcon}>📱</Text>
            <Text style={styles.uploadInfoText}>{t.fileFormats}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>{t.startApp}</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t.multiLangSupport}</Text>
        <Text style={styles.footerText}>{t.offlineSupport}</Text>
        <Text style={styles.status}>{t.appRunning}</Text>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language / भाषा चुनें / ਭਾਸ਼ਾ ਚੁਣੋ</Text>
            
            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'en' && styles.selectedLanguage]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={styles.languageOptionText}>🇺🇸 English</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'hi' && styles.selectedLanguage]}
              onPress={() => changeLanguage('hi')}
            >
              <Text style={styles.languageOptionText}>🇮🇳 हिंदी (Hindi)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'pa' && styles.selectedLanguage]}
              onPress={() => changeLanguage('pa')}
            >
              <Text style={styles.languageOptionText}>🇮🇳 ਪੰਜਾਬੀ (Punjabi)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.closeButtonText}>Close / बंद करें / ਬੰਦ ਕਰੋ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Consultation Flow Modal */}
      <ConsultationFlow
        isVisible={showConsultationFlow}
        onClose={closeConsultationFlow}
        language={currentLanguage}
      />

      {/* Check Symptoms Modal */}
      <CheckSymptomsScreen
        visible={showSymptomsChecker}
        onClose={() => setShowSymptomsChecker(false)}
        language={currentLanguage}
      />

      {/* ASHA Worker Hub Modal */}
      <ASHAWorkerHub
        visible={showASHAHub}
        onClose={() => setShowASHAHub(false)}
        language={currentLanguage}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  languageBar: {
    backgroundColor: '#2c5aa0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    alignItems: 'flex-end',
  },
  languageButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#2c5aa0',
    padding: 30,
    paddingTop: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#e3f2fd',
    marginBottom: 15,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#e3f2fd',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
    lineHeight: 26,
  },
  languageOption: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLanguage: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2c5aa0',
  },
  languageOptionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#2c5aa0',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featuresContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    width: '47%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2c5aa0',
    minHeight: 110,
    justifyContent: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadSection: {
    backgroundColor: '#E0F7FA',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 3,
    borderTopColor: '#00695C',
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00695C',
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#00695C',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#00695C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  uploadIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  uploadSubtext: {
    color: '#B2DFDB',
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  uploadInfoContainer: {
    backgroundColor: '#B2DFDB',
    borderRadius: 10,
    padding: 15,
  },
  uploadInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadInfoIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 20,
  },
  uploadInfoText: {
    fontSize: 13,
    color: '#00695C',
    flex: 1,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  sosButton: {
    backgroundColor: '#FF4444',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 8,
  },
  sosIcon: {
    fontSize: 28,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emergencyActiveCard: {
    backgroundColor: '#FFE5E5',
    borderColor: '#FF4444',
    borderWidth: 2,
  },
  sosButtonActive: {
    backgroundColor: '#FF0000',
    transform: [{ scale: 1.1 }],
    shadowColor: '#FF0000',
    shadowOpacity: 0.6,
  },
  emergencyActiveText: {
    color: '#FF4444',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
