import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUserRole } from '../../store/slices/authSlice';

const { width } = Dimensions.get('window');

const roles = [
  {
    id: 'patient',
    title: 'ਮਰੀਜ਼',
    titleEn: 'Patient',
    description: 'ਇਲਾਜ ਲਈ ਡਾਕਟਰਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
    descriptionEn: 'Connect with doctors for treatment',
    icon: '🏥',
    color: '#4CAF50',
  },
  {
    id: 'doctor',
    title: 'ਡਾਕਟਰ',
    titleEn: 'Doctor',
    description: 'ਮਰੀਜ਼ਾਂ ਨੂੰ ਇਲਾਜ ਪ੍ਰਦਾਨ ਕਰੋ',
    descriptionEn: 'Provide medical care to patients',
    icon: '👩‍⚕️',
    color: '#2196F3',
  },
  {
    id: 'asha',
    title: 'ASHA ਵਰਕਰ',
    titleEn: 'ASHA Worker',
    description: 'ਕਮਿਊਨਿਟੀ ਸਿਹਤ ਸੇਵਾਵਾਂ',
    descriptionEn: 'Community health services',
    icon: '👩‍🌾',
    color: '#FF9800',
  },
  {
    id: 'admin',
    title: 'ਐਡਮਿਨ',
    titleEn: 'Admin',
    description: 'ਸਿਸਟਮ ਪ੍ਰਬੰਧਨ',
    descriptionEn: 'System management',
    icon: '⚙️',
    color: '#9C27B0',
  },
];

const RoleSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਭੂਮਿਕਾ ਚੁਣੋ / Please select a role');
      return;
    }

    try {
      await dispatch(setUserRole(selectedRole)).unwrap();
      navigation.navigate('ProfileSetup', { role: selectedRole });
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ</Text>
        <Text style={styles.subtitle}>Select Your Role</Text>
        <Text style={styles.description}>
          ਆਪਣੇ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵੀਂ ਭੂਮਿਕਾ ਚੁਣੋ
        </Text>
        <Text style={styles.descriptionEn}>
          Choose the role that best describes you
        </Text>
      </View>

      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleCard,
              selectedRole === role.id && styles.selectedRoleCard,
              { borderColor: role.color },
            ]}
            onPress={() => handleRoleSelect(role.id)}
          >
            <View style={styles.roleHeader}>
              <Text style={styles.roleIcon}>{role.icon}</Text>
              <View style={styles.roleTitles}>
                <Text style={[styles.roleTitle, { color: role.color }]}>
                  {role.title}
                </Text>
                <Text style={[styles.roleTitleEn, { color: role.color }]}>
                  {role.titleEn}
                </Text>
              </View>
            </View>
            <Text style={styles.roleDescription}>{role.description}</Text>
            <Text style={styles.roleDescriptionEn}>{role.descriptionEn}</Text>
            {selectedRole === role.id && (
              <View style={[styles.selectedIndicator, { backgroundColor: role.color }]}>
                <Text style={styles.selectedText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedRole && styles.continueButtonActive,
          loading && styles.disabledButton,
        ]}
        onPress={handleContinue}
        disabled={!selectedRole || loading}
      >
        <Text style={styles.continueButtonText}>
          {loading ? 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...' : 'ਜਾਰੀ ਰੱਖੋ'}
        </Text>
        <Text style={styles.continueButtonTextEn}>
          {loading ? 'Loading...' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  descriptionEn: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  rolesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  selectedRoleCard: {
    borderWidth: 3,
    backgroundColor: '#f8f9ff',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  roleIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  roleTitles: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  roleTitleEn: {
    fontSize: 16,
    fontWeight: '600',
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  roleDescriptionEn: {
    fontSize: 12,
    color: '#888',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#2c5aa0',
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButtonTextEn: {
    color: '#fff',
    fontSize: 14,
  },
});

export default RoleSelectionScreen;
