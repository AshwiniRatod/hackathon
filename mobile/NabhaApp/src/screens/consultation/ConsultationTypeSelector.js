import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const translations = {
  en: {
    selectConsultationType: "Choose Consultation Type",
    selectTypeDesc: "How would you like to consult with the doctor?",
    videoCall: "Video Call",
    videoCallDesc: "Face-to-face consultation",
    voiceCall: "Voice Call",
    voiceCallDesc: "Audio-only consultation",
    chat: "Chat Consultation",
    chatDesc: "Text-based consultation",
    schedule: "Schedule Appointment",
    scheduleDesc: "Book for a specific time",
    startNow: "Start Now",
    scheduleLater: "Schedule for Later",
    waitTime: "Avg Wait Time",
    minutes: "mins",
    available: "Available Now",
    offline: "Currently Offline"
  },
  hi: {
    selectConsultationType: "परामर्श का प्रकार चुनें",
    selectTypeDesc: "आप डॉक्टर से कैसे सलाह लेना चाहते हैं?",
    videoCall: "वीडियो कॉल",
    videoCallDesc: "आमने-सामने परामर्श",
    voiceCall: "वॉइस कॉल",
    voiceCallDesc: "केवल आवाज़ में परामर्श",
    chat: "चैट परामर्श",
    chatDesc: "लिखित परामर्श",
    schedule: "अपॉइंटमेंट बुक करें",
    scheduleDesc: "एक विशिष्ट समय के लिए बुक करें",
    startNow: "अभी शुरू करें",
    scheduleLater: "बाद के लिए बुक करें",
    waitTime: "औसत प्रतीक्षा समय",
    minutes: "मिनट",
    available: "अभी उपलब्ध",
    offline: "फिलहाल ऑफलाइन"
  },
  pa: {
    selectConsultationType: "ਸਲਾਹ ਦੀ ਕਿਸਮ ਚੁਣੋ",
    selectTypeDesc: "ਤੁਸੀਂ ਡਾਕਟਰ ਨਾਲ ਕਿਵੇਂ ਸਲਾਹ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    videoCall: "ਵੀਡੀਓ ਕਾਲ",
    videoCallDesc: "ਸਾਹਮਣੇ-ਸਾਹਮਣੇ ਸਲਾਹ",
    voiceCall: "ਵੌਇਸ ਕਾਲ",
    voiceCallDesc: "ਸਿਰਫ਼ ਆਵਾਜ਼ ਵਿੱਚ ਸਲਾਹ",
    chat: "ਚੈਟ ਸਲਾਹ",
    chatDesc: "ਲਿਖਤੀ ਸਲਾਹ",
    schedule: "ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ",
    scheduleDesc: "ਇੱਕ ਖਾਸ ਸਮੇਂ ਲਈ ਬੁੱਕ ਕਰੋ",
    startNow: "ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ",
    scheduleLater: "ਬਾਅਦ ਲਈ ਬੁੱਕ ਕਰੋ",
    waitTime: "ਔਸਤ ਇੰਤਜ਼ਾਰ ਸਮਾਂ",
    minutes: "ਮਿੰਟ",
    available: "ਹੁਣ ਉਪਲਬਧ",
    offline: "ਫਿਲਹਾਲ ਆਫਲਾਈਨ"
  }
};

const ConsultationTypeSelector = ({ language = 'en', selectedType, onSelect }) => {
  const [isScheduleMode, setIsScheduleMode] = useState(false);
  const t = translations[language];

  const consultationTypes = [
    {
      id: 'video',
      icon: '📹',
      title: t.videoCall,
      description: t.videoCallDesc,
      waitTime: 5,
      available: true,
      color: '#4facfe',
      popular: true
    },
    {
      id: 'voice',
      icon: '📞',
      title: t.voiceCall,
      description: t.voiceCallDesc,
      waitTime: 3,
      available: true,
      color: '#2ed573'
    },
    {
      id: 'chat',
      icon: '💬',
      title: t.chat,
      description: t.chatDesc,
      waitTime: 1,
      available: true,
      color: '#ff6b9d'
    },
    {
      id: 'schedule',
      icon: '📅',
      title: t.schedule,
      description: t.scheduleDesc,
      waitTime: 0,
      available: true,
      color: '#ffa502'
    }
  ];

  const renderConsultationCard = (type) => (
    <TouchableOpacity
      key={type.id}
      style={[
        styles.consultationCard,
        selectedType === type.id && styles.selectedCard,
        !type.available && styles.disabledCard
      ]}
      onPress={() => type.available && onSelect(type.id)}
      activeOpacity={type.available ? 0.7 : 1}
    >
      {type.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}

      <View style={[styles.iconContainer, { backgroundColor: type.color + '20' }]}>
        <Text style={styles.consultationIcon}>{type.icon}</Text>
      </View>

      <Text style={styles.consultationTitle}>{type.title}</Text>
      <Text style={styles.consultationDescription}>{type.description}</Text>

      <View style={styles.statusContainer}>
        {type.available ? (
          <View style={styles.waitTimeContainer}>
            <View style={styles.availableIndicator} />
            <Text style={styles.availableText}>{t.available}</Text>
          </View>
        ) : (
          <View style={styles.offlineContainer}>
            <View style={styles.offlineIndicator} />
            <Text style={styles.offlineText}>{t.offline}</Text>
          </View>
        )}
        
        {type.available && type.waitTime > 0 && (
          <Text style={styles.waitTimeText}>
            {t.waitTime}: {type.waitTime} {t.minutes}
          </Text>
        )}
      </View>

      {selectedType === type.id && (
        <View style={[styles.selectedIndicator, { backgroundColor: type.color }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.selectConsultationType}</Text>
        <Text style={styles.subtitle}>{t.selectTypeDesc}</Text>
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !isScheduleMode && styles.activeToggle]}
          onPress={() => setIsScheduleMode(false)}
        >
          <Text style={[styles.toggleText, !isScheduleMode && styles.activeToggleText]}>
            {t.startNow}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.toggleButton, isScheduleMode && styles.activeToggle]}
          onPress={() => setIsScheduleMode(true)}
        >
          <Text style={[styles.toggleText, isScheduleMode && styles.activeToggleText]}>
            {t.scheduleLater}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardsGrid}>
          {consultationTypes
            .filter(type => isScheduleMode ? type.id === 'schedule' : type.id !== 'schedule')
            .map(renderConsultationCard)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderRadius: 25,
    padding: 4,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  activeToggleText: {
    color: '#212529',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  consultationCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    minHeight: 180,
    position: 'relative',
  },
  selectedCard: {
    elevation: 6,
    shadowOpacity: 0.2,
    transform: [{ scale: 1.02 }],
  },
  disabledCard: {
    opacity: 0.5,
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  consultationIcon: {
    fontSize: 30,
  },
  consultationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  consultationDescription: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 16,
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  waitTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  availableIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ed573',
    marginRight: 6,
  },
  availableText: {
    fontSize: 12,
    color: '#2ed573',
    fontWeight: '600',
  },
  offlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4757',
    marginRight: 6,
  },
  offlineText: {
    fontSize: 12,
    color: '#ff4757',
    fontWeight: '600',
  },
  waitTimeText: {
    fontSize: 11,
    color: '#6c757d',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default ConsultationTypeSelector;
