const nodemailer = require('nodemailer');
const axios = require('axios');

class NotificationService {
  constructor() {
    this.emailTransporter = this.initializeEmailTransporter();
    this.smsProvider = process.env.SMS_PROVIDER || 'twilio'; // twilio, msg91, etc.
    this.whatsappProvider = process.env.WHATSAPP_PROVIDER || 'twilio';
  }

  /**
   * Initialize email transporter
   */
  initializeEmailTransporter() {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Send comprehensive emergency notifications
   */
  async sendEmergencyNotifications(alertData) {
    const {
      alertId,
      user,
      location,
      emergencyType,
      priority,
      timestamp,
    } = alertData;

    const contactedServices = [];
    const notifications = [];

    try {
      // 1. Send SMS to emergency contacts
      if (user.emergencyContacts && user.emergencyContacts.length > 0) {
        for (const contact of user.emergencyContacts) {
          try {
            const smsResult = await this.sendEmergencySMS({
              to: contact.phone,
              name: contact.name,
              relationship: contact.relationship,
              userN

: user.name,
              location,
              alertId,
              emergencyType,
            });
            
            if (smsResult.success) {
              contactedServices.push(`SMS to ${contact.name}`);
              notifications.push({
                type: 'sms',
                recipient: contact.phone,
                status: 'sent',
                provider: this.smsProvider,
              });
            }
          } catch (error) {
            console.error(`Failed to send SMS to ${contact.name}:`, error);
          }
        }
      }

      // 2. Send email notifications to healthcare providers
      try {
        const emailResult = await this.sendEmergencyEmail({
          user,
          location,
          alertId,
          emergencyType,
          priority,
          timestamp,
        });
        
        if (emailResult.success) {
          contactedServices.push('Healthcare Provider Email');
          notifications.push({
            type: 'email',
            recipient: process.env.EMERGENCY_EMAIL,
            status: 'sent',
            provider: 'email',
          });
        }
      } catch (error) {
        console.error('Failed to send emergency email:', error);
      }

      // 3. Send push notifications to nearby healthcare workers
      try {
        const pushResult = await this.sendNearbyWorkerNotifications({
          location,
          alertId,
          emergencyType,
          userProfile: user,
        });
        
        if (pushResult.success) {
          contactedServices.push(`${pushResult.count} nearby workers notified`);
          notifications.push(...pushResult.notifications);
        }
      } catch (error) {
        console.error('Failed to send push notifications:', error);
      }

      // 4. Alert emergency services (based on type)
      try {
        const emergencyServiceResult = await this.alertEmergencyServices({
          emergencyType,
          location,
          userProfile: user,
          alertId,
        });
        
        if (emergencyServiceResult.success) {
          contactedServices.push(...emergencyServiceResult.services);
          notifications.push(...emergencyServiceResult.notifications);
        }
      } catch (error) {
        console.error('Failed to alert emergency services:', error);
      }

      // 5. Send WhatsApp messages if available
      if (process.env.WHATSAPP_ENABLED === 'true') {
        try {
          const whatsappResult = await this.sendWhatsAppEmergencyMessage({
            user,
            location,
            alertId,
            emergencyType,
          });
          
          if (whatsappResult.success) {
            contactedServices.push('WhatsApp Emergency Group');
            notifications.push(whatsappResult.notification);
          }
        } catch (error) {
          console.error('Failed to send WhatsApp message:', error);
        }
      }

      return {
        success: true,
        contactedServices,
        notifications,
        alertId,
      };

    } catch (error) {
      console.error('Error in sendEmergencyNotifications:', error);
      return {
        success: false,
        error: error.message,
        contactedServices,
        notifications,
      };
    }
  }

  /**
   * Send emergency SMS
   */
  async sendEmergencySMS({ to, name, relationship, userName, location, alertId, emergencyType }) {
    try {
      const locationText = location 
        ? `Location: https://maps.google.com/maps?q=${location.latitude},${location.longitude}`
        : 'Location: Not available';

      const message = `🚨 EMERGENCY ALERT 🚨
${userName} needs immediate help!

Type: ${emergencyType.toUpperCase()}
Time: ${new Date().toLocaleString()}
${locationText}

Alert ID: ${alertId}

This is an automated emergency message from Nabha Health App.`;

      let result;

      if (this.smsProvider === 'twilio') {
        result = await this.sendTwilioSMS(to, message);
      } else if (this.smsProvider === 'msg91') {
        result = await this.sendMsg91SMS(to, message);
      } else {
        // Fallback to mock SMS for development
        result = await this.sendMockSMS(to, message);
      }

      return result;
    } catch (error) {
      console.error('Error sending emergency SMS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send emergency email
   */
  async sendEmergencyEmail({ user, location, alertId, emergencyType, priority, timestamp }) {
    try {
      const locationText = location 
        ? `<p><strong>Location:</strong> <a href="https://maps.google.com/maps?q=${location.latitude},${location.longitude}" target="_blank">${location.latitude}, ${location.longitude}</a></p>`
        : '<p><strong>Location:</strong> Not available</p>';

      const medicalHistory = user.medicalHistory && user.medicalHistory.length > 0
        ? `<p><strong>Medical History:</strong> ${user.medicalHistory.join(', ')}</p>`
        : '';

      const emailContent = `
        <h2>🚨 Emergency Alert - ${alertId}</h2>
        
        <div style="background-color: #ffebee; padding: 20px; border-left: 4px solid #f44336; margin: 20px 0;">
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Age:</strong> ${user.age || 'Not specified'}</p>
          <p><strong>Emergency Type:</strong> ${emergencyType.toUpperCase()}</p>
          <p><strong>Priority:</strong> ${priority.toUpperCase()}</p>
          <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
          ${locationText}
          ${medicalHistory}
        </div>

        <h3>Emergency Contacts</h3>
        ${user.emergencyContacts ? user.emergencyContacts.map(contact => 
          `<p>• ${contact.name} (${contact.relationship}): ${contact.phone}</p>`
        ).join('') : '<p>No emergency contacts available</p>'}

        <p><em>This is an automated emergency alert from Nabha Health App. Please respond immediately.</em></p>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMERGENCY_EMAIL || 'emergency@nabhahealth.com',
        subject: `🚨 EMERGENCY ALERT - ${emergencyType.toUpperCase()} - ${alertId}`,
        html: emailContent,
        priority: 'high',
      };

      await this.emailTransporter.sendMail(mailOptions);
      
      return { success: true, recipient: mailOptions.to };
    } catch (error) {
      console.error('Error sending emergency email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send push notifications to nearby healthcare workers
   */
  async sendNearbyWorkerNotifications({ location, alertId, emergencyType, userProfile }) {
    try {
      if (!location) {
        return { success: false, error: 'Location required for nearby notifications' };
      }

      // This would integrate with Firebase Cloud Messaging or similar
      // For now, return a mock successful response
      const mockNearbyWorkers = [
        { id: '1', name: 'Dr. Singh', role: 'doctor', distance: '2.3 km' },
        { id: '2', name: 'ASHA Kaur', role: 'asha', distance: '1.8 km' },
      ];

      const notifications = mockNearbyWorkers.map(worker => ({
        type: 'push',
        recipient: worker.id,
        status: 'sent',
        provider: 'fcm',
      }));

      return {
        success: true,
        count: mockNearbyWorkers.length,
        workers: mockNearbyWorkers,
        notifications,
      };
    } catch (error) {
      console.error('Error sending nearby worker notifications:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Alert emergency services based on emergency type
   */
  async alertEmergencyServices({ emergencyType, location, userProfile, alertId }) {
    try {
      const services = [];
      const notifications = [];

      // Determine which services to alert based on emergency type
      const serviceNumbers = {
        medical: ['108'], // Ambulance
        fire: ['101'], // Fire services
        police: ['100'], // Police
        general: ['112'], // Universal emergency
      };

      const numbersToAlert = serviceNumbers[emergencyType] || serviceNumbers.general;

      for (const number of numbersToAlert) {
        // In a real implementation, this would integrate with emergency services APIs
        // For now, we'll log the alert
        console.log(`EMERGENCY SERVICE ALERT: ${number} - ${emergencyType} - ${alertId}`);
        
        services.push(`Emergency Service ${number}`);
        notifications.push({
          type: 'emergency_service',
          recipient: number,
          status: 'sent',
          provider: 'emergency_api',
        });
      }

      return {
        success: true,
        services,
        notifications,
      };
    } catch (error) {
      console.error('Error alerting emergency services:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send WhatsApp emergency message
   */
  async sendWhatsAppEmergencyMessage({ user, location, alertId, emergencyType }) {
    try {
      const locationText = location 
        ? `📍 Location: https://maps.google.com/maps?q=${location.latitude},${location.longitude}`
        : '📍 Location: Not available';

      const message = `🚨 *EMERGENCY ALERT* 🚨

*Patient:* ${user.name}
*Type:* ${emergencyType.toUpperCase()}
*Time:* ${new Date().toLocaleString()}
${locationText}

*Alert ID:* ${alertId}

_Automated alert from Nabha Health App_`;

      // This would integrate with WhatsApp Business API
      // For now, return a mock successful response
      console.log('WhatsApp Emergency Message:', message);

      return {
        success: true,
        notification: {
          type: 'whatsapp',
          recipient: process.env.EMERGENCY_WHATSAPP_GROUP,
          status: 'sent',
          provider: 'whatsapp_business',
        },
      };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send status update notification to user
   */
  async sendStatusUpdateNotification({ userId, alertId, status, notes }) {
    try {
      const statusMessages = {
        acknowledged: 'Your emergency alert has been received. Help is being dispatched.',
        responding: 'Emergency responders are on their way to your location.',
        resolved: 'Your emergency alert has been resolved. We hope you are safe.',
      };

      const message = statusMessages[status] || `Your emergency alert status has been updated to: ${status}`;
      
      // This would send a push notification to the user's device
      console.log(`Status Update Notification - User: ${userId}, Alert: ${alertId}, Message: ${message}`);

      return { success: true };
    } catch (error) {
      console.error('Error sending status update notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Test notification service
   */
  async testService() {
    try {
      // Test email service
      if (this.emailTransporter) {
        await this.emailTransporter.verify();
      }

      return {
        status: 'healthy',
        message: 'Notification service is operational',
        providers: {
          email: !!process.env.EMAIL_USER,
          sms: !!process.env.SMS_API_KEY,
          whatsapp: process.env.WHATSAPP_ENABLED === 'true',
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Notification service test failed',
        error: error.message,
      };
    }
  }

  // SMS Provider Methods

  async sendTwilioSMS(to, message) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !fromNumber) {
        throw new Error('Twilio credentials not configured');
      }

      // Twilio API call would go here
      console.log(`Twilio SMS to ${to}: ${message}`);
      
      return { success: true, provider: 'twilio' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendMsg91SMS(to, message) {
    try {
      const apiKey = process.env.MSG91_API_KEY;
      const route = process.env.MSG91_ROUTE || '4';

      if (!apiKey) {
        throw new Error('MSG91 API key not configured');
      }

      // MSG91 API call would go here
      console.log(`MSG91 SMS to ${to}: ${message}`);
      
      return { success: true, provider: 'msg91' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendMockSMS(to, message) {
    // Mock SMS for development/testing
    console.log(`Mock SMS to ${to}: ${message}`);
    return { success: true, provider: 'mock' };
  }
}

module.exports = new NotificationService();
