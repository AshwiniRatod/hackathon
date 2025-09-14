import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { completeProfile } from '../../store/slices/authSlice';

const ProfileSetupScreen = ({ navigation, route }) => {
  const { role } = route.params;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    // Role-specific fields
    specialization: '', // For doctors
    licenseNumber: '', // For doctors
    village: '', // For ASHA workers
    district: '', // For ASHA workers
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'ਨਾਮ ਲਿਖੋ / Please enter name');
      return;
    }

    try {
      await dispatch(completeProfile({ ...formData, role })).unwrap();
      
      // Navigate based on role
      switch (role) {
        case 'patient':
          navigation.replace('PatientMain');
          break;
        case 'doctor':
          navigation.replace('DoctorMain');
          break;
        case 'asha':
          navigation.replace('ASHAMain');
          break;
        case 'admin':
          navigation.replace('AdminMain');
          break;
        default:
          navigation.replace('PatientMain');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Profile setup failed');
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'patient': return { pa: 'ਮਰੀਜ਼ ਦੀ ਜਾਣਕਾਰੀ', en: 'Patient Information' };
      case 'doctor': return { pa: 'ਡਾਕਟਰ ਦੀ ਜਾਣਕਾਰੀ', en: 'Doctor Information' };
      case 'asha': return { pa: 'ASHA ਵਰਕਰ ਦੀ ਜਾਣਕਾਰੀ', en: 'ASHA Worker Information' };
      case 'admin': return { pa: 'ਐਡਮਿਨ ਦੀ ਜਾਣਕਾਰੀ', en: 'Admin Information' };
      default: return { pa: 'ਜਾਣਕਾਰੀ', en: 'Information' };
    }
  };

  const roleTitle = getRoleTitle();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{roleTitle.pa}</Text>
        <Text style={styles.subtitle}>{roleTitle.en}</Text>
        <Text style={styles.description}>
          ਆਪਣੀ ਜਾਣਕਾਰੀ ਭਰੋ / Complete your profile
        </Text>
      </View>

      <View style={styles.form}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ਬੁਨਿਆਦੀ ਜਾਣਕਾਰੀ / Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ਨਾਮ / Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="ਆਪਣਾ ਨਾਮ ਲਿਖੋ / Enter your name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ਈਮੇਲ / Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="your@email.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ਜਨਮ ਤਾਰੀਖ / Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={formData.dateOfBirth}
              onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ਪਤਾ / Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="ਆਪਣਾ ਪਤਾ ਲਿਖੋ / Enter your address"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ / Emergency Contact</Text>
            <TextInput
              style={styles.input}
              value={formData.emergencyContact}
              onChangeText={(value) => handleInputChange('emergencyContact', value)}
              placeholder="+91XXXXXXXXXX"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Role-specific fields */}
        {role === 'doctor' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ਪੇਸ਼ੇਵਰ ਜਾਣਕਾਰੀ / Professional Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ਵਿਸ਼ੇਸ਼ਗਿਆਨ / Specialization</Text>
              <TextInput
                style={styles.input}
                value={formData.specialization}
                onChangeText={(value) => handleInputChange('specialization', value)}
                placeholder="ਜਿਵੇਂ: ਜਨਰਲ ਮੈਡੀਸਿਨ / e.g., General Medicine"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ਲਾਇਸੈਂਸ ਨੰਬਰ / License Number</Text>
              <TextInput
                style={styles.input}
                value={formData.licenseNumber}
                onChangeText={(value) => handleInputChange('licenseNumber', value)}
                placeholder="ਮੈਡੀਕਲ ਲਾਇਸੈਂਸ ਨੰਬਰ"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        )}

        {role === 'asha' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ਕਾਰਜ ਖੇਤਰ / Work Area</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ਪਿੰਡ / Village</Text>
              <TextInput
                style={styles.input}
                value={formData.village}
                onChangeText={(value) => handleInputChange('village', value)}
                placeholder="ਆਪਣੇ ਪਿੰਡ ਦਾ ਨਾਮ / Your village name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ਜ਼ਿਲਾ / District</Text>
              <TextInput
                style={styles.input}
                value={formData.district}
                onChangeText={(value) => handleInputChange('district', value)}
                placeholder="ਜ਼ਿਲੇ ਦਾ ਨਾਮ / District name"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'ਸੁਰੱਖਿਅਤ ਹੋ ਰਿਹਾ ਹੈ...' : 'ਪ੍ਰੋਫਾਈਲ ਸੁਰੱਖਿਅਤ ਕਰੋ'}
        </Text>
        <Text style={styles.submitButtonTextEn}>
          {loading ? 'Saving...' : 'Save Profile'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2c5aa0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButtonTextEn: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ProfileSetupScreen;
