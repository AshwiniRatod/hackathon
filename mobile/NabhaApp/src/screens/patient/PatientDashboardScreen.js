import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const PatientDashboardScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);

  const quickActions = [
    {
      id: 'consult',
      title: 'ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰੋ',
      titleEn: 'Consult Doctor',
      icon: '👩‍⚕️',
      color: '#4CAF50',
      onPress: () => navigation.navigate('BookConsultation'),
    },
    {
      id: 'symptoms',
      title: 'ਲੱਛਣ ਚੈਕ ਕਰੋ',
      titleEn: 'Check Symptoms',
      icon: '🔍',
      color: '#FF9800',
      onPress: () => navigation.navigate('SymptomChecker'),
    },
    {
      id: 'records',
      title: 'ਸਿਹਤ ਰਿਕਾਰਡ',
      titleEn: 'Health Records',
      icon: '📋',
      color: '#2196F3',
      onPress: () => navigation.navigate('HealthRecords'),
    },
    {
      id: 'sos',
      title: 'ਐਮਰਜੈਂਸੀ SOS',
      titleEn: 'Emergency SOS',
      icon: '🚨',
      color: '#F44336',
      onPress: () => navigation.navigate('SOS'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>ਸਤ ਸ੍ਰੀ ਅਕਾਲ</Text>
        <Text style={styles.greetingEn}>Good Morning</Text>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.tagline}>ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?</Text>
        <Text style={styles.taglineEn}>How are you feeling today?</Text>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>ਤੁਰੰਤ ਸੇਵਾਵਾਂ / Quick Services</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={action.onPress}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionTitleEn}>{action.titleEn}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.healthTipsContainer}>
        <Text style={styles.sectionTitle}>ਅੱਜ ਦੀ ਸਿਹਤ ਸਲਾਹ / Today's Health Tip</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipText}>
              ਰੋਜ਼ਾਨਾ ਘੱਟੋ-ਘੱਟ 8 ਗਲਾਸ ਪਾਣੀ ਪੀਓ ਅਤੇ ਸਿਹਤਮੰਦ ਰਹੋ।
            </Text>
            <Text style={styles.tipTextEn}>
              Drink at least 8 glasses of water daily to stay healthy.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.emergencyContainer}>
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={() => navigation.navigate('SOS')}
        >
          <Text style={styles.emergencyIcon}>🚨</Text>
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>ਐਮਰਜੈਂਸੀ ਮਦਦ</Text>
            <Text style={styles.emergencyTitleEn}>Emergency Help</Text>
            <Text style={styles.emergencySubtitle}>24/7 ਉਪਲਬਧ</Text>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  greetingEn: {
    fontSize: 18,
    color: '#e3f2fd',
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#e3f2fd',
    marginBottom: 3,
  },
  taglineEn: {
    fontSize: 14,
    color: '#e3f2fd',
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionsGrid: {
    gap: 15,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  actionTitleEn: {
    fontSize: 14,
    color: '#666',
  },
  healthTipsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  tipCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  tipIcon: {
    fontSize: 25,
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    lineHeight: 20,
  },
  tipTextEn: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  emergencyContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
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
  emergencyContent: {
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 2,
  },
  emergencyTitleEn: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 2,
  },
  emergencySubtitle: {
    fontSize: 12,
    color: '#F44336',
  },
});

export default PatientDashboardScreen;
