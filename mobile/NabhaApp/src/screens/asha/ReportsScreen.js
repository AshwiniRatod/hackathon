import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const ReportsScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ਰਿਪੋਰਟਸ</Text>
        <Text style={styles.subtitle}>Reports</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.message}>ਰਿਪੋਰਟਸ ਇੱਥੇ ਦਿਖਾਈਆਂ ਜਾਣਗੀਆਂ</Text>
        <Text style={styles.messageEn}>Reports will be displayed here</Text>
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
    backgroundColor: '#2196F3',
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
  content: {
    padding: 20,
    alignItems: 'center',
    marginTop: 50,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  messageEn: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default ReportsScreen;
