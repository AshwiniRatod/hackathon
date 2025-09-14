import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const BookConsultationScreen = ({ navigation, route }) => {
  const { doctor } = route.params || {};
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [consultationType, setConsultationType] = useState('video');

  const timeSlots = [
    { id: 1, time: '09:00 AM', available: true },
    { id: 2, time: '10:00 AM', available: true },
    { id: 3, time: '11:00 AM', available: false },
    { id: 4, time: '02:00 PM', available: true },
    { id: 5, time: '03:00 PM', available: true },
    { id: 6, time: '04:00 PM', available: true },
  ];

  const consultationTypes = [
    { id: 'video', name: 'ਵੀਡੀਓ ਕਾਲ', nameEn: 'Video Call', icon: '📹', price: '₹200' },
    { id: 'audio', name: 'ਆਡੀਓ ਕਾਲ', nameEn: 'Audio Call', icon: '📞', price: '₹150' },
    { id: 'chat', name: 'ਚੈਟ', nameEn: 'Chat', icon: '💬', price: '₹100' },
  ];

  const handleBookConsultation = () => {
    if (!selectedTimeSlot) {
      Alert.alert('Error', 'ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ ਚੁਣੋ / Please select a time slot');
      return;
    }

    Alert.alert(
      'ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ / Book Consultation',
      `ਕੀ ਤੁਸੀਂ ${doctor?.name} ਨਾਲ ${selectedTimeSlot.time} ਤੇ ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?`,
      [
        { text: 'ਰੱਦ ਕਰੋ / Cancel', style: 'cancel' },
        { 
          text: 'ਬੁੱਕ ਕਰੋ / Book', 
          onPress: () => {
            // Book consultation logic here
            Alert.alert('ਸਫਲ / Success', 'ਮੁਲਾਕਾਤ ਬੁੱਕ ਹੋ ਗਈ / Consultation booked successfully');
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ</Text>
        <Text style={styles.subtitle}>Book Consultation</Text>
      </View>

      {doctor && (
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorNameEn}>{doctor.nameEn}</Text>
          <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          <Text style={styles.rating}>⭐ {doctor.rating} • {doctor.experience}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ਮੁਲਾਕਾਤ ਦੀ ਕਿਸਮ / Consultation Type</Text>
        {consultationTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeCard,
              consultationType === type.id && styles.selectedType
            ]}
            onPress={() => setConsultationType(type.id)}
          >
            <Text style={styles.typeIcon}>{type.icon}</Text>
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>{type.name}</Text>
              <Text style={styles.typeNameEn}>{type.nameEn}</Text>
            </View>
            <Text style={styles.typePrice}>{type.price}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ਸਮਾਂ ਚੁਣੋ / Select Time</Text>
        <View style={styles.timeSlotsContainer}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.timeSlot,
                !slot.available && styles.unavailableSlot,
                selectedTimeSlot?.id === slot.id && styles.selectedTimeSlot
              ]}
              onPress={() => slot.available && setSelectedTimeSlot(slot)}
              disabled={!slot.available}
            >
              <Text style={[
                styles.timeSlotText,
                !slot.available && styles.unavailableText,
                selectedTimeSlot?.id === slot.id && styles.selectedTimeText
              ]}>
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>ਸੰਖੇਪ / Summary</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            ਡਾਕਟਰ: {doctor?.name || 'ਨਹੀਂ ਚੁਣਿਆ'}
          </Text>
          <Text style={styles.summaryText}>
            ਸਮਾਂ: {selectedTimeSlot?.time || 'ਨਹੀਂ ਚੁਣਿਆ'}
          </Text>
          <Text style={styles.summaryText}>
            ਕਿਸਮ: {consultationTypes.find(t => t.id === consultationType)?.name}
          </Text>
          <Text style={styles.summaryPrice}>
            ਕੁੱਲ ਫੀਸ: {consultationTypes.find(t => t.id === consultationType)?.price}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.bookButton, (!selectedTimeSlot || !doctor) && styles.disabledButton]}
        onPress={handleBookConsultation}
        disabled={!selectedTimeSlot || !doctor}
      >
        <Text style={styles.bookButtonText}>ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ</Text>
        <Text style={styles.bookButtonTextEn}>Book Consultation</Text>
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
  doctorInfo: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
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
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: '#FF9800',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  typeCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedType: {
    borderColor: '#2c5aa0',
    backgroundColor: '#f0f7ff',
  },
  typeIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  typeNameEn: {
    fontSize: 14,
    color: '#666',
  },
  typePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 100,
    alignItems: 'center',
  },
  unavailableSlot: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
  },
  selectedTimeSlot: {
    backgroundColor: '#2c5aa0',
    borderColor: '#2c5aa0',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  unavailableText: {
    color: '#999',
  },
  selectedTimeText: {
    color: '#fff',
  },
  summarySection: {
    padding: 20,
    paddingTop: 0,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 5,
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookButtonTextEn: {
    color: '#fff',
    fontSize: 14,
  },
});

export default BookConsultationScreen;
