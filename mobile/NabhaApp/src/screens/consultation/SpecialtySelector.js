import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const translations = {
  en: {
    selectSpecialty: "Select Medical Specialty",
    selectSpecialtyDesc: "Choose the type of doctor you need to consult",
    generalPhysician: "General Physician",
    generalPhysicianDesc: "Common health issues & routine checkups",
    pediatrician: "Pediatrician",
    pediatricianDesc: "Child health & development",
    gynecologist: "Gynecologist",
    gynecologistDesc: "Women's health & pregnancy",
    dermatologist: "Dermatologist",
    dermatologistDesc: "Skin, hair & nail problems",
    cardiologist: "Cardiologist",
    cardiologistDesc: "Heart & blood pressure issues",
    ent: "ENT Specialist",
    entDesc: "Ear, nose & throat problems",
    mentalHealth: "Mental Health",
    mentalHealthDesc: "Stress, anxiety & counseling",
    orthopedic: "Orthopedic",
    orthopedicDesc: "Bone, joint & muscle issues",
    other: "Other Specialty",
    otherDesc: "Not sure? Get general consultation"
  },
  hi: {
    selectSpecialty: "चिकित्सा विशेषज्ञता चुनें",
    selectSpecialtyDesc: "आपको किस प्रकार के डॉक्टर से सलाह लेनी है",
    generalPhysician: "सामान्य चिकित्सक",
    generalPhysicianDesc: "सामान्य स्वास्थ्य समस्याएं और जांच",
    pediatrician: "बाल रोग विशेषज्ञ",
    pediatricianDesc: "बच्चों का स्वास्थ्य और विकास",
    gynecologist: "स्त्री रोग विशेषज्ञ",
    gynecologistDesc: "महिलाओं का स्वास्थ्य और गर्भावस्था",
    dermatologist: "त्वचा विशेषज्ञ",
    dermatologistDesc: "त्वचा, बाल और नाखून की समस्याएं",
    cardiologist: "हृदय रोग विशेषज्ञ",
    cardiologistDesc: "दिल और रक्तचाप की समस्याएं",
    ent: "ENT विशेषज्ञ",
    entDesc: "कान, नाक और गले की समस्याएं",
    mentalHealth: "मानसिक स्वास्थ्य",
    mentalHealthDesc: "तनाव, चिंता और परामर्श",
    orthopedic: "हड्डी रोग विशेषज्ञ",
    orthopedicDesc: "हड्डी, जोड़ और मांसपेशी की समस्याएं",
    other: "अन्य विशेषज्ञता",
    otherDesc: "निश्चित नहीं? सामान्य सलाह लें"
  },
  pa: {
    selectSpecialty: "ਮੈਡੀਕਲ ਵਿਸ਼ੇਸ਼ਤਾ ਚੁਣੋ",
    selectSpecialtyDesc: "ਤੁਸੀਂ ਕਿਸ ਕਿਸਮ ਦੇ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ",
    generalPhysician: "ਆਮ ਡਾਕਟਰ",
    generalPhysicianDesc: "ਆਮ ਸਿਹਤ ਸਮੱਸਿਆਵਾਂ ਅਤੇ ਜਾਂਚ",
    pediatrician: "ਬੱਚਿਆਂ ਦੇ ਡਾਕਟਰ",
    pediatricianDesc: "ਬੱਚਿਆਂ ਦੀ ਸਿਹਤ ਅਤੇ ਵਿਕਾਸ",
    gynecologist: "ਔਰਤਾਂ ਦੇ ਡਾਕਟਰ",
    gynecologistDesc: "ਔਰਤਾਂ ਦੀ ਸਿਹਤ ਅਤੇ ਗਰਭ ਅਵਸਥਾ",
    dermatologist: "ਚਮੜੀ ਦੇ ਡਾਕਟਰ",
    dermatologistDesc: "ਚਮੜੀ, ਵਾਲ ਅਤੇ ਨਹੁੰ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ",
    cardiologist: "ਦਿਲ ਦੇ ਡਾਕਟਰ",
    cardiologistDesc: "ਦਿਲ ਅਤੇ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ",
    ent: "ENT ਸਪੈਸ਼ਲਿਸਟ",
    entDesc: "ਕੰਨ, ਨੱਕ ਅਤੇ ਗਲੇ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ",
    mentalHealth: "ਮਾਨਸਿਕ ਸਿਹਤ",
    mentalHealthDesc: "ਤਣਾਅ, ਚਿੰਤਾ ਅਤੇ ਸਲਾਹ",
    orthopedic: "ਹੱਡੀਆਂ ਦੇ ਡਾਕਟਰ",
    orthopedicDesc: "ਹੱਡੀ, ਜੋੜ ਅਤੇ ਮਾਸਪੇਸ਼ੀ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ",
    other: "ਹੋਰ ਵਿਸ਼ੇਸ਼ਤਾ",
    otherDesc: "ਪੱਕਾ ਨਹੀਂ? ਆਮ ਸਲਾਹ ਲਓ"
  }
};

const SpecialtySelector = ({ language = 'en', selectedSpecialty, onSelect }) => {
  const t = translations[language];

  const specialties = [
    {
      id: 'general',
      icon: '👩‍⚕️',
      title: t.generalPhysician,
      description: t.generalPhysicianDesc,
      color: '#4facfe',
      popular: true
    },
    {
      id: 'pediatric',
      icon: '👶',
      title: t.pediatrician,
      description: t.pediatricianDesc,
      color: '#ff6b9d'
    },
    {
      id: 'gynecology',
      icon: '👩‍⚕️',
      title: t.gynecologist,
      description: t.gynecologistDesc,
      color: '#c44569'
    },
    {
      id: 'dermatology',
      icon: '🧴',
      title: t.dermatologist,
      description: t.dermatologistDesc,
      color: '#f8b500'
    },
    {
      id: 'cardiology',
      icon: '❤️',
      title: t.cardiologist,
      description: t.cardiologistDesc,
      color: '#ff4757'
    },
    {
      id: 'ent',
      icon: '👂',
      title: t.ent,
      description: t.entDesc,
      color: '#3742fa'
    },
    {
      id: 'mental',
      icon: '🧠',
      title: t.mentalHealth,
      description: t.mentalHealthDesc,
      color: '#2f3542'
    },
    {
      id: 'orthopedic',
      icon: '🦴',
      title: t.orthopedic,
      description: t.orthopedicDesc,
      color: '#ff9ff3'
    },
    {
      id: 'other',
      icon: '🏥',
      title: t.other,
      description: t.otherDesc,
      color: '#7bed9f'
    }
  ];

  const renderSpecialtyCard = (specialty) => (
    <TouchableOpacity
      key={specialty.id}
      style={[
        styles.specialtyCard,
        selectedSpecialty === specialty.id && styles.selectedCard,
        { borderLeftColor: specialty.color }
      ]}
      onPress={() => onSelect(specialty.id)}
      activeOpacity={0.7}
    >
      {specialty.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}
      
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.specialtyIcon}>{specialty.icon}</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.specialtyTitle}>{specialty.title}</Text>
          <Text style={styles.specialtyDescription}>{specialty.description}</Text>
        </View>
        
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.selectSpecialty}</Text>
        <Text style={styles.subtitle}>{t.selectSpecialtyDesc}</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {specialties.map(renderSpecialtyCard)}
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  specialtyCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 6,
    minHeight: 80,
    position: 'relative',
  },
  selectedCard: {
    elevation: 4,
    shadowOpacity: 0.2,
    backgroundColor: '#f8f9ff',
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  specialtyIcon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  specialtyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  specialtyDescription: {
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 18,
  },
  arrowContainer: {
    width: 30,
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    color: '#adb5bd',
    fontWeight: 'bold',
  },
});

export default SpecialtySelector;
