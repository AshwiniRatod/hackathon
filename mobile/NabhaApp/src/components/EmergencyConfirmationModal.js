import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  BackHandler,
  Vibration,
  Dimensions,
  Alert,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const EmergencyConfirmationModal = ({ 
  visible, 
  onCancel, 
  onConfirm, 
  userLocation,
  emergencyContacts = []
}) => {
  const [countdown, setCountdown] = useState(10);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    if (visible) {
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoCancel();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Vibrate to alert user
      Vibration.vibrate([0, 100, 50, 100]);

      // Handle back button
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (visible) {
          handleCancel();
          return true;
        }
        return false;
      });

      return () => {
        clearInterval(timer);
        backHandler.remove();
      };
    } else {
      setCountdown(10);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  const handleCancel = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onCancel();
    });
  };

  const handleConfirm = () => {
    Vibration.vibrate([0, 200, 100, 200]);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onConfirm();
    });
  };

  const handleAutoCancel = () => {
    Alert.alert(
      'SOS Cancelled',
      'Emergency alert was automatically cancelled due to timeout.',
      [{ text: 'OK', onPress: onCancel }]
    );
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Warning Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.warningIcon}>🚨</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>ਐਮਰਜੈਂਸੀ ਅਲਰਟ ਭੇਜੋ?</Text>
          <Text style={styles.titleEn}>Send Emergency Alert?</Text>

          {/* Countdown */}
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.countdownLabel}>ਸਕਿੰਟ ਬਾਕੀ / seconds left</Text>
          </View>

          {/* Location Preview */}
          {userLocation && (
            <View style={styles.locationContainer}>
              <Text style={styles.locationIcon}>📍</Text>
              <View style={styles.locationText}>
                <Text style={styles.locationLabel}>ਤੁਹਾਡੀ ਸਥਿਤੀ / Your Location:</Text>
                <Text style={styles.coordinates}>
                  {userLocation.latitude?.toFixed(6)}, {userLocation.longitude?.toFixed(6)}
                </Text>
                <Text style={styles.accuracy}>
                  ਸਹੀਤਾ / Accuracy: ±{userLocation.accuracy?.toFixed(0)}m
                </Text>
              </View>
            </View>
          )}

          {/* Emergency Contacts Preview */}
          {emergencyContacts.length > 0 && (
            <View style={styles.contactsPreview}>
              <Text style={styles.contactsLabel}>
                ਸੰਪਰਕ ਕੀਤੇ ਜਾਣਗੇ / Will be contacted:
              </Text>
              {emergencyContacts.slice(0, 2).map((contact, index) => (
                <Text key={index} style={styles.contactItem}>
                  • {contact.name} ({contact.number})
                </Text>
              ))}
              {emergencyContacts.length > 2 && (
                <Text style={styles.moreContacts}>
                  +{emergencyContacts.length - 2} more contacts
                </Text>
              )}
            </View>
          )}

          {/* Warning Message */}
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              ⚠️ ਇਹ ਸਿਰਫ਼ ਅਸਲ ਐਮਰਜੈਂਸੀ ਲਈ ਵਰਤੋ
            </Text>
            <Text style={styles.warningTextEn}>
              Use only for real emergencies
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>ਰੱਦ ਕਰੋ / Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>🚨 ਅਲਰਟ ਭੇਜੋ / Send Alert</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    maxWidth: width * 0.9,
    width: '100%',
    maxHeight: height * 0.8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  warningIcon: {
    fontSize: 60,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 4,
  },
  titleEn: {
    fontSize: 20,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  countdownContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  countdownText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F57C00',
  },
  countdownLabel: {
    fontSize: 14,
    color: '#F57C00',
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  locationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 12,
    color: '#388E3C',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  accuracy: {
    fontSize: 11,
    color: '#66BB6A',
  },
  contactsPreview: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contactsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginBottom: 8,
  },
  contactItem: {
    fontSize: 12,
    color: '#8E24AA',
    marginBottom: 2,
  },
  moreContacts: {
    fontSize: 12,
    color: '#AB47BC',
    fontStyle: 'italic',
    marginTop: 4,
  },
  warningContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  warningText: {
    fontSize: 14,
    color: '#C62828',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  warningTextEn: {
    fontSize: 12,
    color: '#D32F2F',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default EmergencyConfirmationModal;
