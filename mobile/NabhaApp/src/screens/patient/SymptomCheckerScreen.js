import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const SymptomCheckerScreen = ({ navigation }) => {
  const commonSymptoms = [
    { id: 1, name: 'ਬੁਖਾਰ / Fever', icon: '🌡️', severity: 'medium' },
    { id: 2, name: 'ਖੰਘ / Cough', icon: '😷', severity: 'low' },
    { id: 3, name: 'ਸਿਰ ਦਰਦ / Headache', icon: '🤕', severity: 'low' },
    { id: 4, name: 'ਸਾਹ ਦੀ ਤਕਲੀਫ / Breathing Issues', icon: '😮‍💨', severity: 'high' },
    { id: 5, name: 'ਪੇਟ ਦਰਦ / Stomach Pain', icon: '🤰', severity: 'medium' },
    { id: 6, name: 'ਚੱਕਰ ਆਉਣਾ / Dizziness', icon: '😵‍💫', severity: 'medium' },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#2196F3';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ਲੱਛਣ ਚੈਕ ਕਰੋ</Text>
        <Text style={styles.subtitle}>Symptom Checker</Text>
        <Text style={styles.description}>
          ਆਪਣੇ ਲੱਛਣ ਚੁਣੋ ਅਤੇ ਸਲਾਹ ਲਓ
        </Text>
        <Text style={styles.descriptionEn}>Select your symptoms and get advice</Text>
      </View>

      <View style={styles.symptomsContainer}>
        {commonSymptoms.map((symptom) => (
          <TouchableOpacity
            key={symptom.id}
            style={[styles.symptomCard, { borderLeftColor: getSeverityColor(symptom.severity) }]}
            onPress={() => {
              // Navigate to detailed symptom analysis
              navigation.navigate('SymptomDetails', { symptom });
            }}
          >
            <Text style={styles.symptomIcon}>{symptom.icon}</Text>
            <View style={styles.symptomContent}>
              <Text style={styles.symptomName}>{symptom.name}</Text>
              <Text style={[styles.severityBadge, { backgroundColor: getSeverityColor(symptom.severity) }]}>
                {symptom.severity === 'high' ? 'ਤੁਰੰਤ / Urgent' :
                 symptom.severity === 'medium' ? 'ਮੱਧਮ / Moderate' : 'ਹਲਕਾ / Mild'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.emergencySection}>
        <Text style={styles.emergencyTitle}>ਐਮਰਜੈਂਸੀ ਲੱਛਣ / Emergency Symptoms</Text>
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={() => navigation.navigate('SOS')}
        >
          <Text style={styles.emergencyIcon}>🚨</Text>
          <View>
            <Text style={styles.emergencyText}>ਗੰਭੀਰ ਲੱਛਣ ਹਨ?</Text>
            <Text style={styles.emergencyTextEn}>Having serious symptoms?</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c5aa0',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    color: '#e3f2fd',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#e3f2fd',
    textAlign: 'center',
    marginBottom: 3,
  },
  descriptionEn: {
    fontSize: 14,
    color: '#e3f2fd',
    textAlign: 'center',
  },
  symptomsContainer: {
    padding: 20,
  },
  symptomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  symptomIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  symptomContent: {
    flex: 1,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  emergencySection: {
    padding: 20,
    paddingTop: 0,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 15,
    textAlign: 'center',
  },
  emergencyButton: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F44336',
  },
  emergencyIcon: {
    fontSize: 35,
    marginRight: 15,
  },
  emergencyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
  emergencyTextEn: {
    fontSize: 14,
    color: '#F44336',
  },
});

export default SymptomCheckerScreen;
