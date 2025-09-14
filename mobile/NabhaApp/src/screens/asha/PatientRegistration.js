import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView
} from 'react-native';

const PatientRegistration = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    address: '',
    phone: '',
    medicalHistory: '',
    emergencyContact: ''
  });

  const handleSubmit = () => {
    Alert.alert(
      'Success',
      'Patient registered successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>👤 Patient Registration</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Patient Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
            placeholder="Enter full name"
          />

          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => setFormData({...formData, age: text})}
            placeholder="Enter age"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Gender *</Text>
          <View style={styles.genderContainer}>
            {['Male', 'Female', 'Other'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderButton,
                  formData.gender === gender && styles.selectedGender
                ]}
                onPress={() => setFormData({...formData, gender})}
              >
                <Text style={[
                  styles.genderText,
                  formData.gender === gender && styles.selectedGenderText
                ]}>
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.address}
            onChangeText={(text) => setFormData({...formData, address: text})}
            placeholder="Enter complete address"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Medical History</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.medicalHistory}
            onChangeText={(text) => setFormData({...formData, medicalHistory: text})}
            placeholder="Any existing conditions, allergies, medications..."
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Register Patient</Text>
          </TouchableOpacity>
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
  header: {
    backgroundColor: '#2c5aa0',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    color: '#fff',
    fontSize: 24,
    marginRight: 15,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedGender: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  genderText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedGenderText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PatientRegistration;
