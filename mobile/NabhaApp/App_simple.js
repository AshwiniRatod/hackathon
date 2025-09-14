import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>🏥 ਨਭਾ ਸਿਹਤ ਐਪ</Text>
        <Text style={styles.subtitle}>Nabha Health App</Text>
        <Text style={styles.description}>
          ਪੰਜਾਬ ਦੇ ਕਿਸਾਨਾਂ ਅਤੇ ਮਰੀਜ਼ਾਂ ਲਈ ਟੈਲੀਮੈਡੀਸਿਨ
        </Text>
        <Text style={styles.descriptionEn}>
          Telemedicine for Farmers and Patients in Punjab
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>👩‍⚕️</Text>
          <Text style={styles.featureTitle}>ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰੋ</Text>
          <Text style={styles.featureTitleEn}>Consult Doctor</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🚨</Text>
          <Text style={styles.featureTitle}>ਐਮਰਜੈਂਸੀ SOS</Text>
          <Text style={styles.featureTitleEn}>Emergency SOS</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🩺</Text>
          <Text style={styles.featureTitle}>ਲੱਛਣ ਚੈਕ ਕਰੋ</Text>
          <Text style={styles.featureTitleEn}>Check Symptoms</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>👩‍🌾</Text>
          <Text style={styles.featureTitle}>ASHA ਵਰਕਰ</Text>
          <Text style={styles.featureTitleEn}>ASHA Worker</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>ਐਪ ਸ਼ੁਰੂ ਕਰੋ / Start App</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ✅ ਮਲਟੀ-ਲੈਂਗੂਏਜ ਸਪੋਰਟ: ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਅੰਗਰੇਜ਼ੀ
        </Text>
        <Text style={styles.footerText}>
          ✅ ਆਫਲਾਈਨ ਸਪੋਰਟ ✅ ਐਮਰਜੈਂਸੀ ਸਰਵਿਸ ✅ ਵੀਡੀਓ ਕਾਲ
        </Text>
        <Text style={styles.status}>
          🎉 ਮੋਬਾਈਲ ਐਪ ਸਫਲਤਾਪੂਰਵਕ ਚੱਲ ਰਿਹਾ ਹੈ!
        </Text>
        <Text style={styles.statusEn}>
          🎉 Mobile App is Running Successfully!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c5aa0',
    padding: 30,
    paddingTop: 60,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#e3f2fd',
    marginBottom: 15,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#e3f2fd',
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 24,
  },
  descriptionEn: {
    fontSize: 14,
    color: '#e3f2fd',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2c5aa0',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 3,
  },
  featureTitleEn: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 3,
  },
  statusEn: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '600',
  },
});
