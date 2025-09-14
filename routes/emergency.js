const express = require('express');
const router = express.Router();
const EmergencyAlert = require('../models/EmergencyAlert');
const User = require('../models/User');
const NotificationService = require('../services/NotificationService');
const { authenticateToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for SOS alerts (max 5 per hour per user)
const sosRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    error: 'Too many emergency alerts. Please wait before sending another alert.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/emergency/sos-alert
 * Send emergency SOS alert
 */
router.post('/sos-alert', authenticateToken, sosRateLimit, async (req, res) => {
  try {
    const {
      timestamp,
      location,
      emergencyType = 'general',
      deviceInfo,
      priority = 'high'
    } = req.body;

    // Validate required fields
    if (!timestamp) {
      return res.status(400).json({
        error: 'Timestamp is required',
        code: 'MISSING_TIMESTAMP'
      });
    }

    // Generate unique alert ID
    const alertId = `SOS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get user profile
    const user = await User.findById(req.user.id).select('name age medicalHistory emergencyContacts');
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Create emergency alert record
    const alertData = {
      alertId,
      userId: req.user.id,
      timestamp: new Date(timestamp),
      location: location ? {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        accuracy: location.accuracy || null,
      } : null,
      emergencyType,
      deviceInfo,
      priority,
      status: 'sent',
      userProfile: {
        name: user.name,
        age: user.age,
        medicalHistory: user.medicalHistory || [],
      }
    };

    const emergencyAlert = new EmergencyAlert(alertData);
    await emergencyAlert.save();

    // Trigger immediate notification workflow
    const notificationResult = await NotificationService.sendEmergencyNotifications({
      alertId,
      user,
      location: alertData.location,
      emergencyType,
      priority,
      timestamp: alertData.timestamp,
    });

    // Calculate estimated response time (placeholder logic)
    const estimatedResponseTime = calculateEstimatedResponseTime(location, emergencyType);

    // Log the alert for monitoring
    console.log(`Emergency SOS Alert: ${alertId} from user ${req.user.id}`);

    res.status(200).json({
      success: true,
      alertId,
      timestamp: alertData.timestamp,
      estimatedResponseTime,
      contactedServices: notificationResult.contactedServices || [],
      message: 'Emergency alert sent successfully',
    });

  } catch (error) {
    console.error('Error sending SOS alert:', error);
    res.status(500).json({
      error: 'Failed to send emergency alert',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/emergency/alerts/:alertId/status
 * Update emergency alert status
 */
router.put('/alerts/:alertId/status', authenticateToken, async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, notes = '', responderId } = req.body;

    const validStatuses = ['sent', 'acknowledged', 'responding', 'resolved', 'false_alarm'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses,
        code: 'INVALID_STATUS'
      });
    }

    const alert = await EmergencyAlert.findOne({ alertId });
    if (!alert) {
      return res.status(404).json({
        error: 'Alert not found',
        code: 'ALERT_NOT_FOUND'
      });
    }

    // Update alert status
    alert.status = status;
    alert.notes = notes;
    alert.responseTime = status === 'acknowledged' ? new Date() : alert.responseTime;
    alert.resolvedTime = status === 'resolved' ? new Date() : alert.resolvedTime;
    alert.assignedResponder = responderId || alert.assignedResponder;
    alert.updatedAt = new Date();

    await alert.save();

    // Send status update notification to user
    if (status === 'acknowledged' || status === 'resolved') {
      await NotificationService.sendStatusUpdateNotification({
        userId: alert.userId,
        alertId,
        status,
        notes,
      });
    }

    res.json({
      success: true,
      alertId,
      status,
      message: 'Alert status updated successfully',
    });

  } catch (error) {
    console.error('Error updating alert status:', error);
    res.status(500).json({
      error: 'Failed to update alert status',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/emergency/alerts/history/:userId
 * Get alert history for user
 */
router.get('/alerts/history/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    // Ensure user can only access their own history (or admin access)
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        code: 'ACCESS_DENIED'
      });
    }

    const alerts = await EmergencyAlert.find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .select('alertId timestamp location emergencyType status responseTime resolvedTime');

    const total = await EmergencyAlert.countDocuments({ userId });

    res.json({
      success: true,
      alerts,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });

  } catch (error) {
    console.error('Error getting alert history:', error);
    res.status(500).json({
      error: 'Failed to get alert history',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /api/emergency/test
 * Test emergency system
 */
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const { testType = 'system_check' } = req.body;

    // Perform system health checks
    const healthChecks = {
      database: await testDatabaseConnection(),
      notifications: await testNotificationService(),
      location: true, // Location is handled client-side
      timestamp: new Date().toISOString(),
    };

    const allHealthy = Object.values(healthChecks).every(check => 
      typeof check === 'boolean' ? check : check.status === 'healthy'
    );

    res.json({
      success: allHealthy,
      testType,
      checks: healthChecks,
      message: allHealthy ? 'All systems operational' : 'Some systems have issues',
    });

  } catch (error) {
    console.error('Error testing emergency system:', error);
    res.status(500).json({
      success: false,
      error: 'System test failed',
      code: 'TEST_FAILED'
    });
  }
});

/**
 * GET /api/emergency/nearby-responders
 * Get nearby emergency responders
 */
router.get('/nearby-responders', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Location coordinates required',
        code: 'MISSING_COORDINATES'
      });
    }

    // Find nearby ASHA workers, doctors, and emergency responders
    const responders = await User.find({
      role: { $in: ['asha', 'doctor', 'emergency_responder'] },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      },
      isAvailable: true
    }).select('name role phone location distance');

    res.json({
      success: true,
      responders,
      location: { latitude, longitude },
      searchRadius: radius
    });

  } catch (error) {
    console.error('Error finding nearby responders:', error);
    res.status(500).json({
      error: 'Failed to find nearby responders',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Helper functions

function calculateEstimatedResponseTime(location, emergencyType) {
  // Placeholder logic - in real implementation, this would consider:
  // - Distance to nearest hospital/responder
  // - Current traffic conditions
  // - Emergency type severity
  // - Available resources
  
  const baseTime = {
    'medical': 8, // 8 minutes for medical emergencies
    'fire': 6,    // 6 minutes for fire emergencies
    'police': 5,  // 5 minutes for police
    'general': 10 // 10 minutes for general emergencies
  };

  const estimatedMinutes = baseTime[emergencyType] || baseTime.general;
  
  return {
    estimatedMinutes,
    message: `Help expected in approximately ${estimatedMinutes} minutes`,
  };
}

async function testDatabaseConnection() {
  try {
    // Test database connection
    await EmergencyAlert.findOne().limit(1);
    return { status: 'healthy', message: 'Database connection successful' };
  } catch (error) {
    return { status: 'unhealthy', message: 'Database connection failed', error: error.message };
  }
}

async function testNotificationService() {
  try {
    // Test notification service
    const testResult = await NotificationService.testService();
    return testResult;
  } catch (error) {
    return { status: 'unhealthy', message: 'Notification service test failed', error: error.message };
  }
}

module.exports = router;
