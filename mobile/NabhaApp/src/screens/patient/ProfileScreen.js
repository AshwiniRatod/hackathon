import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const userProfile = {
    name: 'ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ',
    nameEn: 'Gurpreet Singh',
    phone: '+91-98765-43210',
    age: '35 ਸਾਲ',
    gender: 'ਮਰਦ',
    village: 'ਨਭਾ, ਪਟਿਆਲਾ',
    emergencyContact: '+91-98765-43211',
    bloodGroup: 'B+',
  };

  const profileSections = [
    {
      title: 'ਨਿੱਜੀ ਜਾਣਕਾਰੀ / Personal Information',
      items: [
        { label: 'ਨਾਮ / Name', value: `${userProfile.name} (${userProfile.nameEn})` },
        { label: 'ਫੋਨ / Phone', value: userProfile.phone },
        { label: 'ਉਮਰ / Age', value: userProfile.age },
        { label: 'ਲਿੰਗ / Gender', value: userProfile.gender },
        { label: 'ਪਿੰਡ / Village', value: userProfile.village },
      ],
    },
    {
      title: 'ਸਿਹਤ ਜਾਣਕਾਰੀ / Health Information',
      items: [
        { label: 'ਖੂਨ ਦਾ ਗਰੁੱਪ / Blood Group', value: userProfile.bloodGroup },
        { label: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ / Emergency Contact', value: userProfile.emergencyContact },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ</Text>
        <Text style={styles.subtitle}>My Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userProfile.name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userNameEn}>{userProfile.nameEn}</Text>
        </View>

        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.infoItem}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>ਪ੍ਰੋਫਾਈਲ ਸੰਪਾਦਿਤ ਕਰੋ</Text>
            <Text style={styles.editButtonTextEn}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>ਸੈਟਿੰਗਸ</Text>
            <Text style={styles.settingsButtonTextEn}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>ਲਾਗ ਆਉਟ</Text>
            <Text style={styles.logoutButtonTextEn}>Logout</Text>
          </TouchableOpacity>
        </View>
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
  },
  profileContainer: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2c5aa0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  userNameEn: {
    fontSize: 18,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  actionButtonsContainer: {
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButtonTextEn: {
    color: '#fff',
    fontSize: 12,
  },
  settingsButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsButtonTextEn: {
    color: '#fff',
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButtonTextEn: {
    color: '#fff',
    fontSize: 12,
  },
});

export default ProfileScreen;
