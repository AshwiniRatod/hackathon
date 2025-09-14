import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  FlatList
} from 'react-native';

const HomeVisitScheduler = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [visits, setVisits] = useState([
    {
      id: 1,
      patientName: 'Rajinder Kaur',
      time: '10:00 AM',
      purpose: 'Routine Checkup',
      address: 'Village Nabha, Punjab',
      status: 'scheduled'
    },
    {
      id: 2,
      patientName: 'Harpreet Singh',
      time: '2:00 PM',
      purpose: 'Vaccination',
      address: 'Sector 5, Nabha',
      status: 'completed'
    },
    {
      id: 3,
      patientName: 'Simran Kaur',
      time: '4:00 PM',
      purpose: 'Follow-up',
      address: 'Village Samastipur',
      status: 'pending'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'scheduled': return '#2196F3';
      case 'pending': return '#FF9800';
      default: return '#666';
    }
  };

  const renderVisitCard = ({ item }) => (
    <View style={styles.visitCard}>
      <View style={styles.visitHeader}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.visitTime}>🕐 {item.time}</Text>
      <Text style={styles.visitPurpose}>📋 {item.purpose}</Text>
      <Text style={styles.visitAddress}>📍 {item.address}</Text>
      
      <View style={styles.visitActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📍 Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.completeButton]}>
          <Text style={[styles.actionButtonText, styles.completeButtonText]}>✓ Complete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📅 Home Visit Scheduler</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <Text style={styles.dateText}>Today: {new Date().toLocaleDateString()}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => Alert.alert('Add Visit', 'Schedule new home visit functionality coming soon!')}
          >
            <Text style={styles.addButtonText}>+ Add Visit</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Today's Visits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Visits List */}
        <View style={styles.visitsSection}>
          <Text style={styles.sectionTitle}>Today's Scheduled Visits</Text>
          <FlatList
            data={visits}
            renderItem={renderVisitCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>Visit Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📱</Text>
            <Text style={styles.quickActionText}>Emergency Contacts</Text>
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
  calendarHeader: {
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5aa0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  visitsSection: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  visitCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  visitTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  visitPurpose: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  visitAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  visitActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  completeButtonText: {
    color: '#fff',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});

export default HomeVisitScheduler;
