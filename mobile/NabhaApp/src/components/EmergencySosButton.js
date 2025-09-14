import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import LocationService from '../services/LocationService';
import EmergencyApiService from '../services/EmergencyApiService';
import EmergencyConfirmationModal from './EmergencyConfirmationModal';

// Try to import expo-haptics, fallback to vibration if not available
let Haptics;
try {
  Haptics = require('expo-haptics');
} catch (error) {
  console.warn('expo-haptics not available, using fallback vibration');
  Haptics = null;
}

const { width } = Dimensions.get('window');

const EmergencySosButton = ({ 
  size = 'large', 
  position = 'floating',
  onSOSActivated,
  onSOSCancelled,
  userId,
  userProfile,
  disabled = false,
  style = {}
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start pulse animation
    startPulseAnimation();
    
    // Load emergency contacts
    loadEmergencyContacts();
    
    return () => {
      pulseAnim.stopAnimation();
      scaleAnim.stopAnimation();
    };
  }, []);

  const startPulseAnimation = () => {
    const createPulse = () => {
      return Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]);
    };

    const loop = Animated.loop(createPulse(), { iterations: -1 });
    
    // Start with a delay
    setTimeout(() => {
      loop.start();
    }, 3000);
  };

  const loadEmergencyContacts = async () => {
    try {
      const response = await EmergencyApiService.getEmergencyContacts(userId);
      
      if (response.success) {
        setEmergencyContacts(response.contacts);
      } else if (response.fallbackContacts) {
        setEmergencyContacts(response.fallbackContacts);
      }
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
      setEmergencyContacts(EmergencyApiService.getDefaultEmergencyContacts());
    }
  };

  const handleSOSPress = async () => {
    if (disabled || isLoading) return;

    try {
      // Haptic feedback
      if (Haptics && Haptics.impactAsync) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        Vibration.vibrate([0, 100, 50, 100]);
      }

      // Animate button press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      setIsLoading(true);

      // Get current location
      const locationResult = await LocationService.getEmergencyLocation();
      
      if (locationResult.success) {
        setUserLocation(locationResult.location);
      } else {
        console.warn('Location not available:', locationResult.error);
        // Continue with confirmation even without location
      }

      // Show confirmation modal
      setShowConfirmation(true);
      setIsLoading(false);

    } catch (error) {
      console.error('Error handling SOS press:', error);
      setIsLoading(false);
      
      Alert.alert(
        'Error',
        'Unable to prepare emergency alert. Try again or call emergency services directly.',
        [
          { text: 'Retry', onPress: handleSOSPress },
          { text: 'Call 112', onPress: () => Linking.openURL('tel:112') },
        ]
      );
    }
  };

  const handleConfirmSOS = async () => {
    setShowConfirmation(false);
    setIsLoading(true);

    try {
      const alertData = {
        userId,
        userProfile,
        location: userLocation,
        emergencyType: 'general',
      };

      const response = await EmergencyApiService.sendSOSAlert(alertData);
      
      if (response.success) {
        // Success feedback
        if (Haptics && Haptics.successAsync) {
          await Haptics.successAsync();
        } else {
          Vibration.vibrate([0, 200, 100, 200]);
        }

        Alert.alert(
          '✅ Emergency Alert Sent',
          `Alert ID: ${response.alertId}\n\nHelp is on the way! Emergency services have been notified.`,
          [
            { 
              text: 'OK', 
              onPress: () => onSOSActivated?.(response)
            }
          ]
        );
      } else {
        throw new Error(response.error || 'Failed to send emergency alert');
      }
    } catch (error) {
      console.error('Error sending SOS alert:', error);
      
      // Error feedback
      if (Haptics && Haptics.errorAsync) {
        await Haptics.errorAsync();
      } else {
        Vibration.vibrate([0, 100, 100, 100, 100, 100]);
      }

      Alert.alert(
        'Alert Failed',
        `Unable to send emergency alert: ${error.message}\n\nWould you like to call emergency services directly?`,
        [
          { text: 'Retry', onPress: handleConfirmSOS },
          { text: 'Call 112', onPress: () => Linking.openURL('tel:112') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSOS = () => {
    setShowConfirmation(false);
    onSOSCancelled?.();
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { width: 60, height: 60, fontSize: 20 };
      case 'medium':
        return { width: 80, height: 80, fontSize: 30 };
      case 'large':
      default:
        return { width: width * 0.35, height: width * 0.35, fontSize: 40 };
    }
  };

  const getButtonStyles = () => {
    const baseSize = getButtonSize();
    const positionStyle = position === 'floating' ? styles.floating : {};
    
    return [
      styles.sosButton,
      positionStyle,
      {
        width: baseSize.width,
        height: baseSize.height,
        borderRadius: baseSize.width / 2,
      },
      disabled && styles.sosButtonDisabled,
      isLoading && styles.sosButtonLoading,
      style,
    ];
  };

  return (
    <>
      <Animated.View
        style={[
          { transform: [{ scale: pulseAnim }, { scale: scaleAnim }] },
          position === 'floating' && styles.floatingContainer,
        ]}
      >
        <TouchableOpacity
          style={getButtonStyles()}
          onPress={handleSOSPress}
          disabled={disabled || isLoading}
          activeOpacity={0.8}
          accessibilityLabel="Emergency SOS Button"
          accessibilityHint="Press to send emergency alert to emergency contacts and services"
          accessibilityRole="button"
        >
          <Text style={[styles.sosIcon, { fontSize: getButtonSize().fontSize }]}>
            {isLoading ? '⏳' : '🚨'}
          </Text>
          
          {size === 'large' && (
            <>
              <Text style={styles.sosTextMain}>
                {isLoading ? 'ਭੇਜ ਰਹੇ ਹਾਂ...' : 'SOS'}
              </Text>
              <Text style={styles.sosTextSub}>
                {isLoading ? 'Sending...' : 'Emergency'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>

      <EmergencyConfirmationModal
        visible={showConfirmation}
        onCancel={handleCancelSOS}
        onConfirm={handleConfirmSOS}
        userLocation={userLocation}
        emergencyContacts={emergencyContacts}
      />
    </>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
  floating: {
    elevation: 12,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  sosButton: {
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  sosButtonDisabled: {
    backgroundColor: '#BDBDBD',
    opacity: 0.6,
  },
  sosButtonLoading: {
    backgroundColor: '#FF5722',
  },
  sosIcon: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 50,
  },
  sosTextMain: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  sosTextSub: {
    color: '#FFEBEE',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default EmergencySosButton;
