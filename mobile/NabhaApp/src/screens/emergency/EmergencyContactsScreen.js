import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';

const EmergencyContactsScreen = ({ navigation }) => {
  const emergencyContacts = [
    {
      id: 1,
      name: 'ਪੁਲਿਸ ਸਟੇਸ਼ਨ ਨਭਾ',
      nameEn: 'Nabha Police Station',
      number: '100',
      type: 'ਪੁਲਿਸ',
      icon: '🚔',
      available: '24/7',
    },
    {
      id: 2,
      name: 'ਸਿਵਲ ਹਸਪਤਾਲ ਨਭਾ',
      nameEn: 'Nabha Civil Hospital',
      number: '+91-1765-222222',
      type: 'ਹਸਪਤਾਲ',
      icon: '🏥',
      available: '24/7',
    },
    {
      id: 3,
      name: 'ਅੱਗ ਬੁਝਾਊ ਵਿਭਾਗ',
      nameEn: 'Fire Department',
      number: '101',
      type: 'ਅੱਗ ਬੁਝਾਊ',
      icon: '🚒',
      available: '24/7',
    },
    {
      id: 4,
      name: 'ਐਂਬੂਲੈਂਸ ਸੇਵਾ',
      nameEn: 'Ambulance Service',
      number: '108',
      type: 'ਐਂਬੂਲੈਂਸ',
      icon: '🚑',
      available: '24/7',
    },
  ];

  const handleCall = (number, name) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ</Text>
        <Text style={styles.subtitle}>Emergency Contacts</Text>
      </View>

      <View style={styles.contactsContainer}>
        {emergencyContacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactCard}
            onPress={() => handleCall(contact.number, contact.name)}
          >
            <Text style={styles.contactIcon}>{contact.icon}</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactNameEn}>{contact.nameEn}</Text>
              <Text style={styles.contactType}>{contact.type}</Text>
              <Text style={styles.contactAvailable}>ਉਪਲਬਧ: {contact.available}</Text>
            </View>
            <View style={styles.contactAction}>
              <Text style={styles.contactNumber}>{contact.number}</Text>
              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => handleCall(contact.number, contact.name)}
              >
                <Text style={styles.callButtonText}>📞 ਕਾਲ ਕਰੋ</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.helpSection}>
        <Text style={styles.helpTitle}>ਮਦਦ ਦੀ ਲੋੜ?</Text>
        <Text style={styles.helpText}>
          ਐਮਰਜੈਂਸੀ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਉਪਰੋਕਤ ਨੰਬਰਾਂ ਤੇ ਤੁਰੰਤ ਕਾਲ ਕਰੋ।
        </Text>
        <Text style={styles.helpTextEn}>
          In case of emergency, call the above numbers immediately.
        </Text>
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
  },
  contactsContainer: {
    padding: 20,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 2,
  },
  contactNameEn: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  contactType: {
    fontSize: 12,
    color: '#2c5aa0',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  contactAvailable: {
    fontSize: 11,
    color: '#4CAF50',
  },
  contactAction: {
    alignItems: 'flex-end',
  },
  contactNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  helpSection: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  helpTextEn: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default EmergencyContactsScreen;
