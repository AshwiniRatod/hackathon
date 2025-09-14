import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

const DoctorSearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const doctors = [
    {
      id: 1,
      name: 'ਡਾ. ਰਮਨਦੀਪ ਸਿੰਘ',
      nameEn: 'Dr. Ramandeep Singh',
      specialty: 'ਜਨਰਲ ਮੈਡੀਸਿਨ',
      specialtyEn: 'General Medicine',
      experience: '10 ਸਾਲ',
      rating: 4.8,
      available: true,
      languages: 'ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਅੰਗਰੇਜ਼ੀ',
      location: 'ਨਭਾ ਸਿਵਲ ਹਸਪਤਾਲ',
    },
    {
      id: 2,
      name: 'ਡਾ. ਸੁਨੀਤਾ ਕੌਰ',
      nameEn: 'Dr. Sunita Kaur',
      specialty: 'ਔਰਤਾਂ ਦੇ ਰੋਗ',
      specialtyEn: 'Gynecology',
      experience: '8 ਸਾਲ',
      rating: 4.9,
      available: true,
      languages: 'ਪੰਜਾਬੀ, ਹਿੰਦੀ',
      location: 'ਪਟਿਆਲਾ ਮੈਡੀਕਲ ਕਾਲਜ',
    },
    {
      id: 3,
      name: 'ਡਾ. ਅਮਰਜੀਤ ਸਿੰਘ',
      nameEn: 'Dr. Amarjeet Singh',
      specialty: 'ਬੱਚਿਆਂ ਦੇ ਰੋਗ',
      specialtyEn: 'Pediatrics',
      experience: '12 ਸਾਲ',
      rating: 4.7,
      available: false,
      languages: 'ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਅੰਗਰੇਜ਼ੀ',
      location: 'ਰਾਜਿੰਦਰਾ ਹਸਪਤਾਲ',
    },
  ];

  const specialties = [
    { id: 'all', name: 'ਸਭ', nameEn: 'All' },
    { id: 'general', name: 'ਜਨਰਲ', nameEn: 'General' },
    { id: 'gynecology', name: 'ਔਰਤਾਂ ਦੇ ਰੋਗ', nameEn: 'Gynecology' },
    { id: 'pediatrics', name: 'ਬੱਚਿਆਂ ਦੇ ਰੋਗ', nameEn: 'Pediatrics' },
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            doctor.specialty.includes(selectedSpecialty) ||
                            doctor.specialtyEn.toLowerCase().includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ਡਾਕਟਰ ਲੱਭੋ</Text>
        <Text style={styles.subtitle}>Find Doctor</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ਡਾਕਟਰ ਦਾ ਨਾਮ ਲਿਖੋ / Search doctor name"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.specialtyContainer}>
        <Text style={styles.sectionTitle}>ਵਿਸ਼ੇਸ਼ਗਿਆਨ / Specialties</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {specialties.map((specialty) => (
            <TouchableOpacity
              key={specialty.id}
              style={[
                styles.specialtyChip,
                selectedSpecialty === specialty.id && styles.selectedSpecialty
              ]}
              onPress={() => setSelectedSpecialty(specialty.id)}
            >
              <Text style={[
                styles.specialtyText,
                selectedSpecialty === specialty.id && styles.selectedSpecialtyText
              ]}>
                {specialty.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.doctorsContainer}>
        <Text style={styles.sectionTitle}>
          ਉਪਲਬਧ ਡਾਕਟਰ / Available Doctors ({filteredDoctors.length})
        </Text>
        
        {filteredDoctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.id}
            style={[styles.doctorCard, !doctor.available && styles.unavailableCard]}
            onPress={() => navigation.navigate('BookConsultation', { doctor })}
            disabled={!doctor.available}
          >
            <View style={styles.doctorHeader}>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorNameEn}>{doctor.nameEn}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                <Text style={styles.doctorSpecialtyEn}>{doctor.specialtyEn}</Text>
              </View>
              <View style={styles.doctorStatus}>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: doctor.available ? '#4CAF50' : '#F44336' }
                ]}>
                  <Text style={styles.statusText}>
                    {doctor.available ? 'ਉਪਲਬਧ' : 'ਵਿਅਸਤ'}
                  </Text>
                </View>
                <Text style={styles.rating}>⭐ {doctor.rating}</Text>
              </View>
            </View>
            
            <View style={styles.doctorDetails}>
              <Text style={styles.experience}>ਤਜਰਬਾ: {doctor.experience}</Text>
              <Text style={styles.languages}>ਭਾਸ਼ਾਵਾਂ: {doctor.languages}</Text>
              <Text style={styles.location}>📍 {doctor.location}</Text>
            </View>

            {doctor.available && (
              <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => navigation.navigate('BookConsultation', { doctor })}
              >
                <Text style={styles.bookButtonText}>ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ</Text>
                <Text style={styles.bookButtonTextEn}>Book Consultation</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
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
  searchContainer: {
    padding: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  specialtyContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  specialtyChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedSpecialty: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  specialtyText: {
    fontSize: 14,
    color: '#666',
  },
  selectedSpecialtyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  doctorsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unavailableCard: {
    opacity: 0.6,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  doctorNameEn: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#2c5aa0',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  doctorSpecialtyEn: {
    fontSize: 12,
    color: '#2c5aa0',
  },
  doctorStatus: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  doctorDetails: {
    marginBottom: 15,
  },
  experience: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  languages: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookButtonTextEn: {
    color: '#fff',
    fontSize: 12,
  },
});

export default DoctorSearchScreen;
