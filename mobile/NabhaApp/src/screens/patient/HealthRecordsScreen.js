import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const HealthRecordsScreen = ({ navigation }) => {
  const healthRecords = [
    {
      id: 1,
      date: '10 ਸਤੰਬਰ 2025',
      type: 'ਡਾਕਟਰੀ ਜਾਂਚ',
      typeEn: 'Medical Checkup',
      doctor: 'ਡਾ. ਰਮਨਦੀਪ ਸਿੰਘ',
      status: 'ਪੂਰਾ',
      statusEn: 'Completed',
    },
    {
      id: 2,
      date: '5 ਸਤੰਬਰ 2025',
      type: 'ਖੂਨ ਦੀ ਜਾਂਚ',
      typeEn: 'Blood Test',
      doctor: 'ਲੈਬ ਰਿਪੋਰਟ',
      status: 'ਦੇਖੋ',
      statusEn: 'View Report',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ਸਿਹਤ ਰਿਕਾਰਡ</Text>
        <Text style={styles.subtitle}>Health Records</Text>
      </View>

      <View style={styles.recordsContainer}>
        {healthRecords.map((record) => (
          <TouchableOpacity key={record.id} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <Text style={styles.recordType}>{record.type}</Text>
              <Text style={styles.recordDate}>{record.date}</Text>
            </View>
            <Text style={styles.recordTypeEn}>{record.typeEn}</Text>
            <Text style={styles.recordDoctor}>{record.doctor}</Text>
            <View style={styles.recordFooter}>
              <Text style={[styles.recordStatus, { color: '#4CAF50' }]}>
                {record.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ ਨਵਾ ਰਿਕਾਰਡ ਸ਼ਾਮਲ ਕਰੋ</Text>
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
  recordsContainer: {
    padding: 20,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  recordType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recordDate: {
    fontSize: 12,
    color: '#666',
  },
  recordTypeEn: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  recordDoctor: {
    fontSize: 14,
    color: '#2c5aa0',
    marginBottom: 10,
  },
  recordFooter: {
    alignItems: 'flex-end',
  },
  recordStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2c5aa0',
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

export default HealthRecordsScreen;
