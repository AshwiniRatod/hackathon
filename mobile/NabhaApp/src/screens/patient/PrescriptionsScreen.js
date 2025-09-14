import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const PrescriptionsScreen = ({ navigation }) => {
  const prescriptions = [
    {
      id: 1,
      date: '8 ਸਤੰਬਰ 2025',
      doctor: 'ਡਾ. ਰਮਨਦੀਪ ਸਿੰਘ',
      medicines: [
        { name: 'ਪੈਰਾਸਿਟਾਮੋਲ', dosage: '500mg', frequency: 'ਦਿਨ ਵਿੱਚ 3 ਵਾਰ' },
        { name: 'ਖੰਘ ਦੀ ਦਵਾਈ', dosage: '10ml', frequency: 'ਦਿਨ ਵਿੱਚ 2 ਵਾਰ' },
      ],
      status: 'ਸਕਿਰਿਅ',
    },
    {
      id: 2,
      date: '1 ਸਤੰਬਰ 2025',
      doctor: 'ਡਾ. ਸੁਨੀਤਾ ਕੌਰ',
      medicines: [
        { name: 'ਆਇਰਨ ਦੀ ਗੋਲੀ', dosage: '100mg', frequency: 'ਰੋਜ਼ 1 ਵਾਰ' },
      ],
      status: 'ਪੂਰਾ',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ਦਵਾਈਆਂ ਦੀ ਪਰਚੀ</Text>
        <Text style={styles.subtitle}>Prescriptions</Text>
      </View>

      <View style={styles.prescriptionsContainer}>
        {prescriptions.map((prescription) => (
          <View key={prescription.id} style={styles.prescriptionCard}>
            <View style={styles.prescriptionHeader}>
              <Text style={styles.prescriptionDate}>{prescription.date}</Text>
              <Text style={[
                styles.status,
                { color: prescription.status === 'ਸਕਿਰਿਅ' ? '#4CAF50' : '#999' }
              ]}>
                {prescription.status}
              </Text>
            </View>
            
            <Text style={styles.doctorName}>ਡਾਕਟਰ: {prescription.doctor}</Text>
            
            <View style={styles.medicinesContainer}>
              <Text style={styles.medicinesTitle}>ਦਵਾਈਆਂ / Medicines:</Text>
              {prescription.medicines.map((medicine, index) => (
                <View key={index} style={styles.medicineItem}>
                  <Text style={styles.medicineName}>• {medicine.name}</Text>
                  <Text style={styles.medicineDosage}>
                    {medicine.dosage} - {medicine.frequency}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>ਪੂਰੀ ਪਰਚੀ ਦੇਖੋ</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ ਨਵੀ ਪਰਚੀ ਸ਼ਾਮਲ ਕਰੋ</Text>
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
  prescriptionsContainer: {
    padding: 20,
  },
  prescriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  prescriptionDate: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  doctorName: {
    fontSize: 16,
    color: '#2c5aa0',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  medicinesContainer: {
    marginBottom: 15,
  },
  medicinesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  medicineItem: {
    marginBottom: 5,
  },
  medicineName: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  medicineDosage: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  viewButton: {
    backgroundColor: '#2c5aa0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PrescriptionsScreen;
