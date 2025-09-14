import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import EmergencySosButton from '../../components/EmergencySosButton';
import LocationService from '../../services/LocationService';
import EmergencyApiService from '../../services/EmergencyApiService';

const { width, height } = Dimensions.get('window');

const SOSScreen = ({ navigation }) => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  
  const user = useSelector(state => state.auth.user);

  const defaultEmergencyContacts = [
    { id: 1, name: 'ਪੁਲਿਸ / Police', number: '100', icon: '🚔', color: '#F44336', type: 'police' },
    { id: 2, name: 'ਐਂਬੂਲੈਂਸ / Ambulance', number: '108', icon: '🚑', color: '#FF9800', type: 'medical' },
    { id: 3, name: 'ਅੱਗ ਬੁਝਾਊ / Fire', number: '101', icon: '🚒', color: '#F44336', type: 'fire' },
    { id: 4, name: 'ਸਾਰਵਭੌਮਿਕ ਐਮਰਜੈਂਸੀ / Universal Emergency', number: '112', icon: '📞', color: '#9C27B0', type: 'general' },
    { id: 5, name: 'ਨਭਾ ਹਸਪਤਾਲ / Nabha Hospital', number: '+91-1672-222222', icon: '🏥', color: '#2196F3', type: 'hospital' },
  ];

  useEffect(() => {
    loadEmergencyData();
    checkSystemStatus();
  }, []);

  const loadEmergencyData = async () => {
    try {
      if (user?.id) {
        const response = await EmergencyApiService.getEmergencyContacts(user.id);
        if (response.success) {
          setEmergencyContacts([...defaultEmergencyContacts, ...response.contacts]);
        } else {
          setEmergencyContacts(defaultEmergencyContacts);
        }
      } else {
        setEmergencyContacts(defaultEmergencyContacts);
      }
    } catch (error) {
      console.error('Error loading emergency data:', error);
      setEmergencyContacts(defaultEmergencyContacts);
    }
  };

  const checkSystemStatus = async () => {
    try {
      const connectivity = await EmergencyApiService.checkConnectivity();
      const locationPermission = await LocationService.requestLocationPermission();
      
      setSystemStatus({
        connectivity,
        locationPermission: locationPermission.success,
        lastChecked: new Date(),
      });
    } catch (error) {
      console.error('Error checking system status:', error);
      setSystemStatus({
        connectivity: false,
        locationPermission: false,
        lastChecked: new Date(),
        error: error.message,
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadEmergencyData(),
      checkSystemStatus(),
    ]);
    setIsRefreshing(false);
  };

  const handleEmergencyCall = (number, name, type) => {
    Alert.alert(
      'ਐਮਰਜੈਂਸੀ ਕਾਲ / Emergency Call',
      `ਕੀ ਤੁਸੀਂ ${name} (${number}) ਨੂੰ ਕਾਲ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?\n\nDo you want to call ${name} (${number})?`,
      [
        { text: 'ਰੱਦ ਕਰੋ / Cancel', style: 'cancel' },
        {
          text: 'ਕਾਲ ਕਰੋ / Call',
          onPress: () => {
            Linking.openURL(`tel:${number}`);
          },
        },
      ]
    );
  };

  const handleSOSActivated = (response) => {
    console.log('SOS Activated:', response);
    setEmergencyActive(true);
    
    // Auto-reset after 30 seconds
    setTimeout(() => {
      setEmergencyActive(false);
    }, 30000);
  };

  const handleSOSCancelled = () => {
    console.log('SOS Cancelled');
    setEmergencyActive(false);
  };

  const testEmergencySystem = async () => {
    try {
      if (!user?.id) {
        Alert.alert('Error', 'Please log in to test the emergency system.');
        return;
      }

      const response = await EmergencyApiService.testEmergencySystem(user.id);
      
      if (response.success) {
        Alert.alert(
          'System Test Successful',
          'Emergency system is working properly. All components are functional.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'System Test Failed',
          `Emergency system test failed: ${response.error}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Test Error',
        `Unable to test system: ${error.message}`,
        [{ text: 'OK' }]
      );
    }
  };

  const renderSystemStatus = () => {
    if (!systemStatus) return null;

    return (
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>ਸਿਸਟਮ ਸਥਿਤੀ / System Status</Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>
              {systemStatus.connectivity ? '🟢' : '🔴'}
            </Text>
            <Text style={styles.statusText}>
              {systemStatus.connectivity ? 'ਆਨਲਾਈਨ / Online' : 'ਆਫਲਾਈਨ / Offline'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>
              {systemStatus.locationPermission ? '📍' : '❌'}
            </Text>
            <Text style={styles.statusText}>
              {systemStatus.locationPermission ? 'GPS ਚਾਲੂ / GPS On' : 'GPS ਬੰਦ / GPS Off'}
            </Text>
          </View>
        </View>
        {systemStatus.error && (
          <Text style={styles.errorText}>Error: {systemStatus.error}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🚨 ਐਮਰਜੈਂਸੀ SOS</Text>
          <Text style={styles.subtitle}>Emergency SOS</Text>
          <Text style={styles.description}>
            ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਤੁਰੰਤ ਮਦਦ ਲਈ
          </Text>
          <Text style={styles.descriptionEn}>
            For immediate help in emergency
          </Text>
        </View>

        {/* System Status */}
        {renderSystemStatus()}

        {/* Main SOS Button */}
        <View style={styles.sosContainer}>
          <EmergencySosButton
            size="large"
            position="center"
            onSOSActivated={handleSOSActivated}
            onSOSCancelled={handleSOSCancelled}
            userId={user?.id}
            userProfile={user}
            disabled={emergencyActive}
          />
          
          <Text style={styles.sosInstruction}>
            ਐਮਰਜੈਂਸੀ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਇਹ ਬਟਨ ਦਬਾਓ
          </Text>
          <Text style={styles.sosInstructionEn}>
            Press this button in case of emergency
          </Text>
          
          {emergencyActive && (
            <View style={styles.activeAlert}>
              <Text style={styles.activeAlertText}>🚨 ਐਮਰਜੈਂਸੀ ਸਕਿਰਿਅ / Emergency Active</Text>
              <Text style={styles.activeAlertSubtext}>
                ਮਦਦ ਆ ਰਹੀ ਹੈ / Help is on the way
              </Text>
            </View>
          )}
        </View>

        {/* Emergency Contacts */}
        <View style={styles.contactsContainer}>
          <Text style={styles.sectionTitle}>ਐਮਰਜੈਂਸੀ ਨੰਬਰ / Emergency Numbers</Text>
          
          <View style={styles.contactsGrid}>
            {emergencyContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[styles.contactCard, { borderLeftColor: contact.color }]}
                onPress={() => handleEmergencyCall(contact.number, contact.name, contact.type)}
                activeOpacity={0.7}
              >
                <Text style={styles.contactIcon}>{contact.icon}</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                </View>
                <Text style={styles.callIcon}>📞</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>ਤੁਰੰਤ ਸਹਾਇਤਾ / Quick Help</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ConsultationFlow')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>👩‍⚕️</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>ਡਾਕਟਰ ਨਾਲ ਤੁਰੰਤ ਗੱਲ ਕਰੋ</Text>
              <Text style={styles.actionTextEn}>Talk to Doctor Immediately</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('SymptomChecker')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🔍</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>ਲੱਛਣ ਚੈਕ ਕਰੋ</Text>
              <Text style={styles.actionTextEn}>Check Symptoms</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={testEmergencySystem}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🔧</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>ਸਿਸਟਮ ਟੈਸਟ ਕਰੋ</Text>
              <Text style={styles.actionTextEn}>Test Emergency System</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>ਐਮਰਜੈਂਸੀ ਸੁਝਾਅ / Emergency Tips</Text>
          
          <View style={styles.tip}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              ਸ਼ਾਂਤ ਰਹੋ ਅਤੇ ਸਪੱਸ਼ਟ ਬੋਲੋ / Stay calm and speak clearly
            </Text>
          </View>
          
          <View style={styles.tip}>
            <Text style={styles.tipIcon}>📍</Text>
            <Text style={styles.tipText}>
              ਆਪਣੀ ਸਥਿਤੀ ਸਾਂਝੀ ਕਰੋ / Share your location
            </Text>
          </View>
          
          <View style={styles.tip}>
            <Text style={styles.tipIcon}>👥</Text>
            <Text style={styles.tipText}>
              ਆਪਣੇ ਸੰਪਰਕ ਅਪਡੇਟ ਰੱਖੋ / Keep your contacts updated
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#F44336',
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
    color: '#ffebee',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#ffebee',
    textAlign: 'center',
    marginBottom: 3,
  },
  descriptionEn: {
    fontSize: 14,
    color: '#ffebee',
    textAlign: 'center',
  },
  statusContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    textAlign: 'center',
    marginTop: 8,
  },
  sosContainer: {
    alignItems: 'center',
    padding: 40,
    paddingTop: 20,
  },
  sosInstruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 3,
    marginTop: 20,
  },
  sosInstructionEn: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  activeAlert: {
    backgroundColor: '#F44336',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  activeAlertText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activeAlertSubtext: {
    color: '#FFEBEE',
    fontSize: 14,
  },
  contactsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  contactsGrid: {
    gap: 10,
  },
  contactCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  contactNumber: {
    fontSize: 14,
    color: '#2c5aa0',
    fontWeight: 'bold',
  },
  callIcon: {
    fontSize: 20,
    color: '#4CAF50',
  },
  quickActionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  actionButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  actionIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  actionTextEn: {
    fontSize: 14,
    color: '#666',
  },
  actionArrow: {
    fontSize: 20,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  tipsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  tip: {
    backgroundColor: '#E8F5E8',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
  },
});

export default SOSScreen;
