import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking, Platform } from 'react-native';

class LocationService {
  static CACHE_KEY = 'lastKnownLocation';
  static LOCATION_TIMEOUT = 10000; // 10 seconds

  /**
   * Request location permissions with clear explanation
   */
  static async requestLocationPermission() {
    try {
      // Check current permission status
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        return { success: true, status: existingStatus };
      }

      // Show rationale dialog for Android
      if (Platform.OS === 'android' && existingStatus === 'denied') {
        return new Promise((resolve) => {
          Alert.alert(
            'Location Permission Required',
            'This app needs location access to send your exact position during emergencies. This helps emergency responders find you quickly.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => resolve({ success: false, status: 'denied' })
              },
              {
                text: 'Grant Permission',
                onPress: async () => {
                  const { status } = await Location.requestForegroundPermissionsAsync();
                  resolve({ success: status === 'granted', status });
                }
              }
            ]
          );
        });
      }

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'denied') {
        return this.handlePermissionDenied();
      }

      return { success: status === 'granted', status };
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle permission denied scenario
   */
  static handlePermissionDenied() {
    return new Promise((resolve) => {
      Alert.alert(
        'Location Access Denied',
        'Location permission is required for emergency services. You can enable it in app settings.',
        [
          {
            text: 'Manual Location',
            onPress: () => resolve({ success: false, status: 'denied', useManual: true })
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openSettings();
              resolve({ success: false, status: 'denied', openedSettings: true });
            }
          }
        ]
      );
    });
  }

  /**
   * Get current location with high accuracy
   */
  static async getCurrentLocation(options = {}) {
    const {
      timeout = this.LOCATION_TIMEOUT,
      enableHighAccuracy = true,
      showLocationDialog = true
    } = options;

    try {
      // Check if location services are enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled && showLocationDialog) {
        return this.handleLocationServicesDisabled();
      }

      // Get location with timeout
      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Location timeout')), timeout)
      );

      const location = await Promise.race([locationPromise, timeoutPromise]);

      // Cache the location
      await this.cacheLocation(location);

      return {
        success: true,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: location.timestamp,
          altitude: location.coords.altitude,
          speed: location.coords.speed,
        }
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      
      if (error.message === 'Location timeout') {
        return this.handleLocationTimeout();
      }

      return { success: false, error: error.message };
    }
  }

  /**
   * Handle location services disabled
   */
  static handleLocationServicesDisabled() {
    return new Promise((resolve) => {
      Alert.alert(
        'Location Services Disabled',
        'Please enable location services to get your current position for emergency alerts.',
        [
          {
            text: 'Use Cached Location',
            onPress: async () => {
              const cached = await this.getCachedLocation();
              resolve(cached);
            }
          },
          {
            text: 'Enable GPS',
            onPress: () => {
              if (Platform.OS === 'android') {
                // Android doesn't have direct GPS settings intent
                Linking.openSettings();
              } else {
                // iOS settings
                Linking.openURL('App-Prefs:root=Privacy&path=LOCATION');
              }
              resolve({ success: false, needsLocationServices: true });
            }
          }
        ]
      );
    });
  }

  /**
   * Handle location timeout
   */
  static async handleLocationTimeout() {
    const cached = await this.getCachedLocation();
    
    if (cached.success) {
      return new Promise((resolve) => {
        Alert.alert(
          'Location Timeout',
          `Unable to get current location. Use last known location from ${this.formatLocationAge(cached.location.timestamp)}?`,
          [
            {
              text: 'Manual Entry',
              onPress: () => resolve({ success: false, useManual: true })
            },
            {
              text: 'Use Cached',
              onPress: () => resolve(cached)
            }
          ]
        );
      });
    }

    return { success: false, error: 'Location timeout and no cached location available' };
  }

  /**
   * Cache location for offline use
   */
  static async cacheLocation(location) {
    try {
      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };
      
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(locationData));
      return true;
    } catch (error) {
      console.error('Error caching location:', error);
      return false;
    }
  }

  /**
   * Get cached location
   */
  static async getCachedLocation() {
    try {
      const cached = await AsyncStorage.getItem(this.CACHE_KEY);
      
      if (!cached) {
        return { success: false, error: 'No cached location available' };
      }

      const location = JSON.parse(cached);
      const age = Date.now() - location.timestamp;
      
      // Consider location stale after 1 hour
      if (age > 3600000) {
        return { 
          success: false, 
          error: 'Cached location too old',
          staleLocation: location 
        };
      }

      return { success: true, location, cached: true };
    } catch (error) {
      console.error('Error getting cached location:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Format location age for display
   */
  static formatLocationAge(timestamp) {
    const age = Date.now() - timestamp;
    const minutes = Math.floor(age / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  /**
   * Validate coordinates
   */
  static validateCoordinates(latitude, longitude) {
    return (
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  /**
   * Get location for emergency with fallback options
   */
  static async getEmergencyLocation() {
    try {
      // First try to get permission
      const permission = await this.requestLocationPermission();
      
      if (!permission.success) {
        // Try cached location if permission denied
        const cached = await this.getCachedLocation();
        if (cached.success) {
          return { ...cached, fallback: 'cached' };
        }
        return { success: false, error: 'No location access and no cached location' };
      }

      // Try to get current location
      const current = await this.getCurrentLocation({ timeout: 8000 });
      
      if (current.success) {
        return current;
      }

      // Fallback to cached location
      const cached = await this.getCachedLocation();
      if (cached.success) {
        return { ...cached, fallback: 'cached' };
      }

      return { success: false, error: 'Unable to get any location' };
    } catch (error) {
      console.error('Error in getEmergencyLocation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Start watching location changes (for background tracking)
   */
  static async startLocationTracking() {
    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      
      if (status !== 'granted') {
        return { success: false, error: 'Background location permission denied' };
      }

      await Location.startLocationUpdatesAsync('emergency-tracking', {
        accuracy: Location.Accuracy.High,
        timeInterval: 30000, // Update every 30 seconds
        distanceInterval: 10, // Update every 10 meters
      });

      return { success: true };
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Stop location tracking
   */
  static async stopLocationTracking() {
    try {
      await Location.stopLocationUpdatesAsync('emergency-tracking');
      return { success: true };
    } catch (error) {
      console.error('Error stopping location tracking:', error);
      return { success: false, error: error.message };
    }
  }
}

export default LocationService;
