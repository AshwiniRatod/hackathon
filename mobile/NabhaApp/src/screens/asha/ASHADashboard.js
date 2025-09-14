import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const ASHADashboard = ({ navigation }) => {
  const todayStats = {
    visits: 8,
    reports: 3,
    emergencies: 1,
    vaccinations: 5,
  };

  const quickActions = [
    {
      id: 'field-visit',
      title: 'ਫੀਲਡ ਵਿਜ਼ਿਟ',
      titleEn: 'Field Visit',
      icon: '🏠',
      color: '#4CAF50',
      onPress: () => navigation.navigate('FieldVisits'),
    },
    {
      id: 'report',
      title: 'ਰਿਪੋਰਟ ਲਿਖੋ',
      titleEn: 'Write Report',
      icon: '📝',
      color: '#2196F3',
      onPress: () => navigation.navigate('Reports'),
    },
    {
      id: 'emergency',
      title: 'ਐਮਰਜੈਂਸੀ',
      titleEn: 'Emergency',
      icon: '🚨',
      color: '#F44336',
      onPress: () => navigation.navigate('Emergency'),
    },
    {
      id: 'health-survey',
      title: 'ਸਿਹਤ ਸਰਵੇਖਣ',
      titleEn: 'Health Survey',
      icon: '📊',
      color: '#FF9800',
      onPress: () => navigation.navigate('HealthSurvey'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ASHA ਵਰਕਰ</Text>
        <Text style={styles.greetingEn}>Good Morning, ASHA Worker</Text>
        <Text style={styles.userName}>ਸਿਮਰਨਜੀਤ ਕੌਰ</Text>
        <Text style={styles.location}>ਪਿੰਡ: ਨਭਾ, ਜ਼ਿਲਾ: ਪਟਿਆਲਾ</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>ਅੱਜ ਦੇ ਅੰਕੜੇ / Today's Stats</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#4CAF50' }]}>
            <Text style={styles.statNumber}>{todayStats.visits}</Text>
            <Text style={styles.statLabel}>ਘਰੇਲੂ ਵਿਜ਼ਿਟਸ</Text>
            <Text style={styles.statLabelEn}>Home Visits</Text>
          </View>
          
          <View style={[styles.statCard, { borderLeftColor: '#2196F3' }]}>
            <Text style={styles.statNumber}>{todayStats.reports}</Text>
            <Text style={styles.statLabel}>ਰਿਪੋਰਟਸ</Text>
            <Text style={styles.statLabelEn}>Reports</Text>
          </View>
          
          <View style={[styles.statCard, { borderLeftColor: '#F44336' }]}>
            <Text style={styles.statNumber}>{todayStats.emergencies}</Text>
            <Text style={styles.statLabel}>ਐਮਰਜੈਂਸੀ</Text>
            <Text style={styles.statLabelEn}>Emergency</Text>
          </View>
          
          <View style={[styles.statCard, { borderLeftColor: '#FF9800' }]}>
            <Text style={styles.statNumber}>{todayStats.vaccinations}</Text>
            <Text style={styles.statLabel}>ਟੀਕਾਕਰਣ</Text>
            <Text style={styles.statLabelEn}>Vaccinations</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>ਤੁਰੰਤ ਕਾਰਵਾਈ / Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={action.onPress}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionTitleEn}>{action.titleEn}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.todayTasksContainer}>
        <Text style={styles.sectionTitle}>ਅੱਜ ਦੇ ਕੰਮ / Today's Tasks</Text>
        
        <View style={styles.taskCard}>
          <Text style={styles.taskTitle}>📅 ਪ੍ਰੀਤੀ ਦੇਵੀ ਦੀ ਜਾਂਚ</Text>
          <Text style={styles.taskDescription}>ਗਰਭਵਤੀ ਔਰਤ ਦਾ ਮਾਸਿਕ ਚੈਕਅੱਪ</Text>
          <Text style={styles.taskTime}>ਸਮਾਂ: 2:00 PM</Text>
        </View>
        
        <View style={styles.taskCard}>
          <Text style={styles.taskTitle}>💉 ਬੱਚਿਆਂ ਦਾ ਟੀਕਾਕਰਣ</Text>
          <Text style={styles.taskDescription}>5 ਬੱਚਿਆਂ ਦਾ ਪੋਲੀਓ ਟੀਕਾ</Text>
          <Text style={styles.taskTime}>ਸਮਾਂ: 4:00 PM</Text>
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
    backgroundColor: '#FF9800',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  greetingEn: {
    fontSize: 16,
    color: '#fff3e0',
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#fff3e0',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flex: 1,
    minWidth: 150,
    borderLeftWidth: 4,
    elevation: 2,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  statLabelEn: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
  quickActionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  actionsGrid: {
    gap: 15,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  actionTitleEn: {
    fontSize: 14,
    color: '#666',
  },
  todayTasksContainer: {
    padding: 20,
    paddingTop: 0,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  taskTime: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: 'bold',
  },
});

export default ASHADashboard;
