import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const FieldVisitsScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ਫੀਲਡ ਵਿਜ਼ਿਟਸ</Text>
        <Text style={styles.subtitle}>Field Visits</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.message}>ਫੀਲਡ ਵਿਜ਼ਿਟ ਦਾ ਵੇਰਵਾ ਇੱਥੇ ਦਿਖਾਇਆ ਜਾਵੇਗਾ</Text>
        <Text style={styles.messageEn}>Field visit details will be shown here</Text>
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
    backgroundColor: '#4CAF50',
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
    color: '#e8f5e8',
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

export default FieldVisitsScreen;
