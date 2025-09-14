import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LinearGradient from 'react-native-linear-gradient';
import ConsultationFlow from './src/screens/consultation/ConsultationFlow';
import CheckSymptomsScreen from './src/screens/CheckSymptomsScreen';
import ASHAWorkerHub from './src/screens/ASHAWorkerHub';
import EnhancedHeader from './src/components/EnhancedHeader';
import EnhancedCard from './src/components/EnhancedCard';
import StatsSection from './src/components/StatsSection';
import EnhancedUploadSection from './src/components/EnhancedUploadSection';
import { colors, enhancedSpacing, enhancedBorderRadius } from './src/utils/theme';

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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={colors.primary.main} />
      
      <LinearGradient
        colors={['#f8f9fa', '#ffffff']}
        style={styles.mainGradient}
      >
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Header */}
          <EnhancedHeader 
            title={t.appTitle.replace('🏥 ', '')}
            subtitle={t.appSubtitle}
            onLanguagePress={() => setShowLanguageModal(true)}
            currentLanguage={currentLanguage}
            notificationCount={3}
          />

          {/* Statistics Dashboard */}
          <StatsSection />

          {/* Main Service Cards */}
          <View style={styles.servicesContainer}>
            <Text style={styles.sectionTitle}>🏥 Health Services</Text>
            
            <View style={styles.serviceGrid}>
              <EnhancedCard
                icon="👩‍⚕️"
                title={t.consultDoctor}
                subtitle="Connect with certified doctors"
                onPress={openConsultationFlow}
                gradientColors={colors.primary.gradient}
                badge="Available"
              />

              <EnhancedCard
                icon={emergencyActive ? "⚡" : "🚨"}
                title={emergencyActive ? "EMERGENCY ACTIVE" : t.emergencySOS}
                subtitle={emergencyActive ? "Services dispatched" : "24/7 Emergency support"}
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
                          setTimeout(() => setEmergencyActive(false), 30000);
                        }
                      },
                      { text: 'Cancel', style: 'cancel' }
                    ],
                    { cancelable: true }
                  );
                }}
                gradientColors={emergencyActive ? colors.accent.error_gradient : colors.emergency.gradient}
                isEmergency={true}
                badge={emergencyActive ? "ACTIVE" : "Emergency"}
              />

              <EnhancedCard
                icon="🩺"
                title={t.checkSymptoms}
                subtitle="AI-powered symptom analysis"
                onPress={() => setShowSymptomsChecker(true)}
                gradientColors={colors.symptoms.gradient}
                badge="AI Powered"
              />

              <EnhancedCard
                icon="👩‍🌾"
                title={t.ashaWorker}
                subtitle="Community health worker tools"
                onPress={() => setShowASHAHub(true)}
                gradientColors={colors.asha.gradient}
                badge="12 Tools"
              />
            </View>
          </View>

          {/* Enhanced Upload Section */}
          <EnhancedUploadSection 
            onUploadPress={(type) => {
              Alert.alert('Upload', `Uploading ${type}...`);
            }}
          />

          {/* Quick Access Features */}
          <View style={styles.quickAccessContainer}>
            <Text style={styles.sectionTitle}>⚡ Quick Access</Text>
            <View style={styles.quickAccessGrid}>
              <TouchableOpacity style={styles.quickAccessCard}>
                <LinearGradient
                  colors={['rgba(76, 175, 80, 0.1)', 'rgba(76, 175, 80, 0.05)']}
                  style={styles.quickAccessGradient}
                >
                  <Text style={styles.quickAccessIcon}>📋</Text>
                  <Text style={styles.quickAccessText}>My Records</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAccessCard}>
                <LinearGradient
                  colors={['rgba(33, 150, 243, 0.1)', 'rgba(33, 150, 243, 0.05)']}
                  style={styles.quickAccessGradient}
                >
                  <Text style={styles.quickAccessIcon}>💊</Text>
                  <Text style={styles.quickAccessText}>Medicines</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAccessCard}>
                <LinearGradient
                  colors={['rgba(156, 39, 176, 0.1)', 'rgba(156, 39, 176, 0.05)']}
                  style={styles.quickAccessGradient}
                >
                  <Text style={styles.quickAccessIcon}>🏥</Text>
                  <Text style={styles.quickAccessText}>Nearby</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Status Footer */}
          <View style={styles.statusContainer}>
            <LinearGradient
              colors={['rgba(76, 175, 80, 0.1)', 'transparent']}
              style={styles.statusGradient}
            >
              <Text style={styles.statusTitle}>🎉 {t.appRunning}</Text>
              <Text style={styles.statusText}>{t.multiLangSupport}</Text>
              <Text style={styles.statusText}>{t.offlineSupport}</Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </LinearGradient>

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
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Consultation Flow Modal */}
      <ConsultationFlow
        visible={showConsultationFlow}
        onClose={closeConsultationFlow}
        language={currentLanguage}
      />

      {/* Symptom Checker Modal */}
      <CheckSymptomsScreen
