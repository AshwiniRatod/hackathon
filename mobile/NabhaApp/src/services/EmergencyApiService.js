import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { emergencyAPI } from './api';

class EmergencyApiService {
  static OFFLINE_QUEUE_KEY = 'emergency_offline_queue';
  static MAX_RETRIES = 3;
  static RETRY_DELAY = 2000; // 2 seconds

  /**
   * Send emergency SOS alert
   */
  static async sendSOSAlert(alertData) {
    const payload = {
      userId: alertData.userId,
      timestamp: new Date().toISOString(),
      location: alertData.location,
      emergencyType: alertData.emergencyType || 'general',
      userProfile: alertData.userProfile,
      deviceInfo: {
        platform: Platform.OS,
        version: Platform.Version,
        model: Platform.constants?.Model || 'Unknown',
      },
      priority: 'high',
      alertId: this.generateAlertId(),
    };

    try {
      const response = await emergencyAPI.sendSOSAlert(payload);
      
      if (response.data) {
        // Show local notification for confirmation
        await this.showSOSConfirmationNotification(response.data.alertId);
        
        // Clear any queued offline alerts
        await this.clearOfflineQueue();
        
        return {
          success: true,
          alertId: response.data.alertId,
          estimatedResponseTime: response.data.estimatedResponseTime,
          contactedServices: response.data.contactedServices || [],
        };
      } else {
        throw new Error('Failed to send SOS alert');
      }
    } catch (error) {
      console.error('Error sending SOS alert:', error);
      
      // Queue for offline retry
      await this.queueOfflineAlert(payload);
      
      // Try to send via fallback methods
      await this.triggerFallbackAlerts(alertData);
      
      return {
        success: false,
        error: error.message,
        queued: true,
        fallbackTriggered: true,
      };
    }
  }

  /**
   * Get emergency contacts for user
   */
  static async getEmergencyContacts(userId) {
    try {
      const response = await emergencyAPI.getEmergencyContacts(userId);
      
      if (response.data) {
        return {
          success: true,
          contacts: response.data.contacts || [],
        };
      } else {
        throw new Error('Failed to get emergency contacts');
      }
    } catch (error) {
      console.error('Error getting emergency contacts:', error);
      
      // Return default emergency contacts if API fails
      return {
        success: false,
        error: error.message,
        fallbackContacts: this.getDefaultEmergencyContacts(),
      };
    }
  }

  /**
   * Get default emergency contacts
   */
  static getDefaultEmergencyContacts() {
    return [
      { id: 1, name: 'Police', number: '100', type: 'police' },
      { id: 2, name: 'Ambulance', number: '108', type: 'medical' },
      { id: 3, name: 'Fire Emergency', number: '101', type: 'fire' },
      { id: 4, name: 'Emergency Helpline', number: '112', type: 'general' },
    ];
  }

  /**
   * Update emergency alert status
   */
  static async updateAlertStatus(alertId, status, notes = '') {
    try {
      const response = await emergencyAPI.updateAlertStatus(alertId, status, notes);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating alert status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get alert history for user
   */
  static async getAlertHistory(userId, limit = 10) {
    try {
      const response = await emergencyAPI.getAlertHistory(userId, limit);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error getting alert history:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check network connectivity
   */
  static async checkConnectivity() {
    try {
      const response = await emergencyAPI.healthCheck();
      return response.data ? true : false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Test emergency system
   */
  static async testEmergencySystem(userId) {
    try {
      const response = await emergencyAPI.testEmergencySystem();
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error testing emergency system:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update emergency alert status
   */
  static async updateAlertStatus(alertId, status, notes = '') {
    try {
      const response = await emergencyAPI.updateAlertStatus(alertId, status, notes);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating alert status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get alert history for user
   */
  static async getAlertHistory(userId, limit = 10) {
    try {
      const response = await emergencyAPI.getAlertHistory(userId, limit);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error getting alert history:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check network connectivity
   */
  static async checkConnectivity() {
    try {
      const response = await emergencyAPI.healthCheck();
      return response.data ? true : false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Test emergency system
   */
  static async testEmergencySystem(userId) {
    try {
      const response = await emergencyAPI.testEmergencySystem();
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error testing emergency system:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate unique alert ID
   */
  static generateAlertId() {
    return `SOS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Queue alert for offline retry
   */
  static async queueOfflineAlert(alertData) {
    try {
      const existingQueue = await AsyncStorage.getItem(this.OFFLINE_QUEUE_KEY);
      const queue = existingQueue ? JSON.parse(existingQueue) : [];
      
      queue.push({
        ...alertData,
        queuedAt: Date.now(),
      });

      await AsyncStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(queue));
      console.log('Alert queued for offline retry');
    } catch (error) {
      console.error('Error queuing offline alert:', error);
    }
  }

  /**
   * Process offline queue when connection is restored
   */
  static async processOfflineQueue() {
    try {
      const queueData = await AsyncStorage.getItem(this.OFFLINE_QUEUE_KEY);
      if (!queueData) return { success: true, processed: 0 };

      const queue = JSON.parse(queueData);
      let processed = 0;

      for (const alert of queue) {
        try {
          const response = await this.makeRequest('/emergency/sos-alert', 'POST', alert);
          if (response.success) {
            processed++;
            console.log(`Processed queued alert: ${alert.alertId}`);
          }
        } catch (error) {
          console.error('Error processing queued alert:', error);
        }
      }

      // Clear the queue after processing
      await AsyncStorage.removeItem(this.OFFLINE_QUEUE_KEY);
      
      return { success: true, processed };
    } catch (error) {
      console.error('Error processing offline queue:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Clear offline queue
   */
  static async clearOfflineQueue() {
    try {
      await AsyncStorage.removeItem(this.OFFLINE_QUEUE_KEY);
    } catch (error) {
      console.error('Error clearing offline queue:', error);
    }
  }

  /**
   * Trigger fallback emergency alerts
   */
  static async triggerFallbackAlerts(alertData) {
    const fallbackMethods = [];

    try {
      // 1. Send local notification
      await this.sendLocalEmergencyNotification(alertData);
      fallbackMethods.push('local_notification');

      // 2. Try to call emergency services directly
      if (Platform.OS === 'android') {
        // Note: Direct calling requires user interaction due to platform restrictions
        await this.showEmergencyCallDialog();
        fallbackMethods.push('emergency_call_dialog');
      }

      // 3. Send SMS if phone number is available (future implementation)
      // This would require SMS permissions and platform-specific implementation
      
      console.log('Fallback alerts triggered:', fallbackMethods);
      return { success: true, methods: fallbackMethods };
    } catch (error) {
      console.error('Error triggering fallback alerts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send local emergency notification
   */
  static async sendLocalEmergencyNotification(alertData) {
    try {
      const locationText = alertData.location 
        ? `Location: ${alertData.location.latitude}, ${alertData.location.longitude}`
        : 'Location: Not available';

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚨 Emergency SOS Activated',
          body: `Emergency alert sent. ${locationText}`,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  /**
   * Show confirmation notification after successful SOS
   */
  static async showSOSConfirmationNotification(alertId) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✅ Emergency Alert Sent',
          body: `Alert ID: ${alertId}. Help is on the way!`,
          sound: 'default',
          data: { alertId, type: 'sos_confirmation' },
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing confirmation notification:', error);
    }
  }

  /**
   * Show emergency call dialog
   */
  static async showEmergencyCallDialog() {
    // This would be implemented in the component layer
    // Return a promise that resolves when the dialog is handled
    return new Promise((resolve) => {
      // The actual implementation would be in the UI component
      // This is just a placeholder for the service interface
      setTimeout(resolve, 100);
    });
  }

  /**
   * Get emergency contacts for user
   */
  static async getEmergencyContacts(userId) {
    try {
      const response = await this.makeRequest(`/users/${userId}/emergency-contacts`);
      
      if (response.success) {
        return {
          success: true,
          contacts: response.data.contacts || [],
        };
      } else {
        throw new Error(response.error || 'Failed to get emergency contacts');
      }
    } catch (error) {
      console.error('Error getting emergency contacts:', error);
      
      // Return default emergency contacts if API fails
      return {
        success: false,
        error: error.message,
        fallbackContacts: this.getDefaultEmergencyContacts(),
      };
    }
  }

  /**
   * Get default emergency contacts
   */
  static getDefaultEmergencyContacts() {
    return [
      { id: 1, name: 'Police', number: '100', type: 'police' },
      { id: 2, name: 'Ambulance', number: '108', type: 'medical' },
      { id: 3, name: 'Fire Emergency', number: '101', type: 'fire' },
      { id: 4, name: 'Emergency Helpline', number: '112', type: 'general' },
    ];
  }

  /**
   * Update emergency alert status
   */
  static async updateAlertStatus(alertId, status, notes = '') {
    try {
      const response = await this.makeRequest(`/emergency/alerts/${alertId}/status`, 'PUT', {
        status,
        notes,
        timestamp: new Date().toISOString(),
      });

      return response;
    } catch (error) {
      console.error('Error updating alert status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get alert history for user
   */
  static async getAlertHistory(userId, limit = 10) {
    try {
      const response = await this.makeRequest(`/emergency/alerts/history/${userId}?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error getting alert history:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check network connectivity
   */
  static async checkConnectivity() {
    try {
      const response = await fetch(`${this.BASE_URL}/health`, {
        method: 'GET',
        timeout: 5000,
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Utility delay function
   */
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Test emergency system
   */
  static async testEmergencySystem(userId) {
    try {
      const response = await this.makeRequest('/emergency/test', 'POST', {
        userId,
        timestamp: new Date().toISOString(),
        testType: 'system_check',
      });

      return response;
    } catch (error) {
      console.error('Error testing emergency system:', error);
      return { success: false, error: error.message };
    }
  }
}

export default EmergencyApiService;
