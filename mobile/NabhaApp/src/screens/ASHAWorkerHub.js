import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  FlatList,
  Alert
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ASHAWorkerHub = ({ visible, onClose, language = 'en' }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const translations = {
    en: {
      title: "👩‍🌾 ASHA Worker Hub",
      subtitle: "Community Health Management Center",
      patientRegistration: "Patient Registration",
      homeVisitScheduler: "Home Visit Scheduler",
      symptomRecording: "Symptom Recording",
      sosEmergency: "SOS Emergency",
      medicineTracking: "Medicine Tracking",
      healthEducation: "Health Education",
      communication: "Communication",
      dailyReports: "Daily Reports",
      vaccinationTracker: "Vaccination Tracker",
      patientHistory: "Patient History",
      nearbyFacilities: "Nearby Facilities",
      feedbackReporting: "Feedback & Reporting",
      comingSoon: "Coming Soon",
      featureInfo: "This feature will be available soon with full functionality."
    },
    hi: {
      title: "👩‍🌾 आशा कार्यकर्ता केंद्र",
      subtitle: "सामुदायिक स्वास्थ्य प्रबंधन केंद्र",
      patientRegistration: "रोगी पंजीकरण",
      homeVisitScheduler: "गृह भ्रमण योजनाकार",
      symptomRecording: "लक्षण रिकॉर्डिंग",
      sosEmergency: "SOS आपातकाल",
      medicineTracking: "दवा ट्रैकिंग",
      healthEducation: "स्वास्थ्य शिक्षा",
      communication: "संचार",
      dailyReports: "दैनिक रिपोर्ट",
      vaccinationTracker: "टीकाकरण ट्रैकर",
      patientHistory: "रोगी इतिहास",
      nearbyFacilities: "निकटतम सुविधाएं",
      feedbackReporting: "फीडबैक और रिपोर्टिंग",
      comingSoon: "जल्द आ रहा है",
      featureInfo: "यह सुविधा जल्द ही पूर्ण कार्यक्षमता के साथ उपलब्ध होगी।"
    },
    pa: {
      title: "👩‍🌾 ਆਸ਼ਾ ਵਰਕਰ ਹੱਬ",
      subtitle: "ਕਮਿਉਨਿਟੀ ਹੈਲਥ ਮੈਨੇਜਮੈਂਟ ਸੈਂਟਰ",
      patientRegistration: "ਮਰੀਜ਼ ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
      homeVisitScheduler: "ਘਰ ਮੁਲਾਕਾਤ ਸਿਡਿਊਲਰ",
      symptomRecording: "ਲੱਛਣ ਰਿਕਾਰਡਿੰਗ",
      sosEmergency: "SOS ਐਮਰਜੈਂਸੀ",
      medicineTracking: "ਦਵਾਈ ਟਰੈਕਿੰਗ",
      healthEducation: "ਸਿਹਤ ਸਿੱਖਿਆ",
      communication: "ਸੰਚਾਰ",
      dailyReports: "ਰੋਜ਼ਾਨਾ ਰਿਪੋਰਟਾਂ",
      vaccinationTracker: "ਟੀਕਾਕਰਣ ਟਰੈਕਰ",
      patientHistory: "ਮਰੀਜ਼ ਇਤਿਹਾਸ",
      nearbyFacilities: "ਨੇੜਲੀਆਂ ਸਹੂਲਤਾਂ",
      feedbackReporting: "ਫੀਡਬੈਕ ਅਤੇ ਰਿਪੋਰਟਿੰਗ",
      comingSoon: "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",
      featureInfo: "ਇਹ ਸੁਵਿਧਾ ਜਲਦੀ ਹੀ ਪੂਰੀ ਕਾਰਜਸ਼ੀਲਤਾ ਨਾਲ ਉਪਲਬਧ ਹੋਵੇਗੀ।"
    }
  };

  const t = translations[language] || translations.en;

  const ashaFunctionalities = [
    {
      id: 1,
      title: t.patientRegistration,
      icon: '👤',
      color: '#4CAF50',
      description: 'Register new patients and update information'
    },
    {
      id: 2,
      title: t.homeVisitScheduler,
      icon: '📅',
      color: '#2196F3',
      description: 'Schedule and manage home visits'
    },
    {
      id: 3,
      title: t.symptomRecording,
      icon: '📝',
      color: '#FF9800',
      description: 'Record patient symptoms and vital signs'
    },
    {
      id: 4,
      title: t.sosEmergency,
      icon: '🚨',
      color: '#F44336',
      description: 'Emergency alert system'
    },
    {
      id: 5,
      title: t.medicineTracking,
      icon: '💊',
      color: '#9C27B0',
      description: 'Track medicine distribution and stock'
    },
    {
      id: 6,
      title: t.healthEducation,
      icon: '📚',
      color: '#00BCD4',
      description: 'Health awareness and education materials'
    },
    {
      id: 7,
      title: t.communication,
      icon: '💬',
      color: '#607D8B',
      description: 'Chat with doctors and administrators'
    },
    {
      id: 8,
      title: t.dailyReports,
      icon: '📊',
      color: '#795548',
      description: 'Generate and view daily activity reports'
    },
    {
      id: 9,
      title: t.vaccinationTracker,
      icon: '💉',
      color: '#E91E63',
      description: 'Track vaccination schedules and status'
    },
    {
      id: 10,
      title: t.patientHistory,
      icon: '📋',
      color: '#3F51B5',
      description: 'View patient medical history and records'
    },
    {
      id: 11,
      title: t.nearbyFacilities,
      icon: '🏥',
      color: '#009688',
      description: 'Find nearby hospitals and clinics'
    },
    {
      id: 12,
      title: t.feedbackReporting,
      icon: '📄',
      color: '#FF5722',
      description: 'Submit feedback and incident reports'
    }
  ];

  const handleCardPress = (functionality) => {
    setSelectedCard(functionality);
    
    // Handle different functionalities based on ID
    switch(functionality.id) {
      case 1: // Patient Registration
        Alert.alert(
          '👤 Patient Registration',
          'Opening patient registration form...\n\n• Register new patients\n• Update patient information\n• Add medical history\n• Assign unique patient ID',
          [
            { text: 'Cancel' },
            { 
              text: 'Open Form', 
              onPress: () => {
                // Here you would navigate to patient registration screen
                console.log('Opening Patient Registration Form');
                setSelectedCard(null);
              }
            }
          ]
        );
        break;

      case 2: // Home Visit Scheduler
        Alert.alert(
          '📅 Home Visit Scheduler',
          'Managing home visit schedule...\n\n• Schedule new visits\n• View today\'s appointments\n• Mark visits as complete\n• Add visit notes',
          [
            { text: 'Cancel' },
            { 
              text: 'Open Scheduler', 
              onPress: () => {
                console.log('Opening Home Visit Scheduler');
                setSelectedCard(null);
              }
            }
          ]
        );
        break;

      case 3: // Symptom Recording
        Alert.alert(
          '📝 Symptom Recording',
          'Record patient symptoms and vital signs...\n\n• Log symptoms\n• Record temperature, BP\n• Add health observations\n• Update patient status',
          [
            { text: 'Cancel' },
            { 
              text: 'Start Recording', 
              onPress: () => {
                console.log('Opening Symptom Recording');
                setSelectedCard(null);
              }
            }
          ]
        );
        break;

      case 4: // SOS Emergency
        Alert.alert(
          '🚨 SOS Emergency',
          'Emergency Alert System\n\nChoose emergency service:',
          [
            { text: 'Cancel' },
            { 
              text: '🚑 Ambulance (108)', 
              onPress: () => {
                Alert.alert('🚑 Emergency Alert', 'Calling Ambulance Service 108...\n\nLocation shared automatically');
                setSelectedCard(null);
              }
            },
            { 
              text: '🚔 Police (100)', 
              onPress: () => {
                Alert.alert('🚔 Emergency Alert', 'Calling Police Service 100...\n\nLocation shared automatically');
                setSelectedCard(null);
              }
            }
          ]
        );
        break;

      case 5: // Medicine Tracking
        Alert.alert(
          '💊 Medicine Tracking',
          'Medicine distribution management...\n\n• Check medicine stock\n• Record distribution\n• Track patient compliance\n• Request new supplies',
          [
            { text: 'Cancel' },
            { 
              text: 'Open Tracker', 
              onPress: () => {
                console.log('Opening Medicine Tracker');
                setSelectedCard(null);
              }
            }
          ]
        );
        break;

      case 6: // Health Education
        Alert.alert(
          '📚 Health Education',
          'Health awareness materials...\n\n• Hygiene guidelines\n• Nutrition information\n• Disease prevention\n• Community health tips',
          [
            { text: 'Cancel' },
            { 
              text: 'View Materials', 
              onPress: () => {
                console.log('Opening Health Education');
                setSelectedCard(null);
              }
            }
          ]
        );
        break;

      case 7: // Communication
        Alert.alert(
          '💬 Communication',
          'Connect with healthcare team...\n\n• Chat with doctors\n• Contact admin\n• Community messages\n• Health updates',
          [
            { text: 'Cancel' },
            { 
              text: 'Open Messages', 
              onPress: () => {
                console.log('Opening Communication');
                setSelectedCard(null);
              }
            }
          ]
        );
        break;

      case 8: // Daily Reports
        Alert.alert(
          '📊 Daily Reports',
          'Generate and view reports...\n\n• Daily activity summary\n• Patient visit reports\n• Health statistics\n• Submit to authorities',
          [
            { text: 'Cancel' },
            { 
              text: 'View Reports', 
              onPress: () => {
                console.log('Opening Daily Reports');
                setSelectedCard(null);
              }
            }
          ]
        );
        break;

      case 9: // Vaccination Tracker
        Alert.alert(
          '💉 Vaccination Tracker',
          'Vaccination management system...\n\n• Schedule vaccinations\n• Track immunization status\n• Record vaccine doses\n• Send reminders',
          [
            { text: 'Cancel' },
            { 
              text: 'Open Tracker', 
              onPress: () => {
                console.log('Opening Vaccination Tracker');
                setSelectedCard(null);
              }
            }
          ]
        );
        break;

      case 10: // Patient History
        Alert.alert(
          '📋 Patient History',
          'Access patient medical records...\n\n• View medical history\n• Check previous visits\n• Review treatments\n• Update records',
          [
            { text: 'Cancel' },
            { 
              text: 'View History', 
              onPress: () => {
                console.log('Opening Patient History');
                setSelectedCard(null);
              }
            }
          ]
        );
        break;

      case 11: // Nearby Facilities
        Alert.alert(
          '🏥 Nearby Facilities',
          'Find healthcare facilities...\n\n• Nearest hospitals\n• Clinics and pharmacies\n• Specialist doctors\n• Emergency services',
          [
            { text: 'Cancel' },
            { 
              text: 'Find Facilities', 
              onPress: () => {
                console.log('Opening Nearby Facilities');
                setSelectedCard(null);
              }
            }
          ]
        );
        break;

      case 12: // Feedback & Reporting
        Alert.alert(
          '📄 Feedback & Reporting',
          'Submit feedback and reports...\n\n• Report health issues\n• Community feedback\n• Incident reports\n• Suggestions',
          [
            { text: 'Cancel' },
            { 
              text: 'Submit Report', 
              onPress: () => {
                console.log('Opening Feedback & Reporting');
                setSelectedCard(null);
              }
            }
          ]
        );
        break;

      default:
        Alert.alert(
          functionality.title,
          'This feature is being developed and will be available soon.',
          [{ text: 'OK', onPress: () => setSelectedCard(null) }]
        );
    }
  };

  const renderFunctionalityCard = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.functionalityCard,
        { backgroundColor: item.color + '15', borderColor: item.color }
      ]}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Text style={styles.cardIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={[styles.container, styles.safeArea]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{t.title}</Text>
            <Text style={styles.headerSubtitle}>{t.subtitle}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Patients Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Visits Scheduled</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Reports Submitted</Text>
          </View>
        </View>

        {/* Functionalities Grid */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Healthcare Management Tools</Text>
          <FlatList
            data={ashaFunctionalities}
            renderItem={renderFunctionalityCard}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.row}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* Emergency Quick Action */}
        <View style={styles.quickActionContainer}>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => {
              Alert.alert(
                '🚨 Emergency Alert',
                'Emergency services will be contacted immediately!\n\n📍 Location: Getting GPS coordinates...\n🕐 Time: ' + new Date().toLocaleString(),
                [
                  { text: 'Call Ambulance (108)', onPress: () => console.log('Calling 108') },
                  { text: 'Call Police (100)', onPress: () => console.log('Calling 100') },
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            }}
            activeOpacity={0.9}
          >
            <Text style={styles.emergencyIcon}>🚨</Text>
            <Text style={styles.emergencyText}>Emergency Alert</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safeArea: {
    paddingTop: 44, // Add top padding for safe area on iOS
  },
  header: {
    backgroundColor: '#2c5aa0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  notificationBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5aa0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  functionalityCard: {
    width: (width - 45) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    minHeight: 140,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
  quickActionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  emergencyButton: {
    backgroundColor: '#FF4444',
    borderRadius: 25,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emergencyIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ASHAWorkerHub;
