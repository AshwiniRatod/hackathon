const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    required: true,
    index: true,
  },
  location: {
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
    accuracy: Number,
    address: String,
  },
  emergencyType: {
    type: String,
    enum: ['general', 'medical', 'fire', 'police', 'natural_disaster', 'accident'],
    default: 'general',
    index: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high',
    index: true,
  },
  status: {
    type: String,
    enum: ['sent', 'acknowledged', 'responding', 'resolved', 'false_alarm', 'cancelled'],
    default: 'sent',
    index: true,
  },
  userProfile: {
    name: String,
    age: Number,
    medicalHistory: [String],
    bloodGroup: String,
    allergies: [String],
    medications: [String],
    emergencyContacts: [{
      name: String,
      relationship: String,
      phone: String,
    }],
  },
  deviceInfo: {
    platform: String,
    version: String,
    model: String,
    appVersion: String,
  },
  responseTime: {
    type: Date,
    index: true,
  },
  resolvedTime: {
    type: Date,
    index: true,
  },
  assignedResponder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  responderDetails: {
    name: String,
    role: String,
    phone: String,
    estimatedArrival: Date,
  },
  notes: {
    type: String,
    maxlength: 1000,
  },
  attachments: [{
    type: String, // File URLs
    description: String,
  }],
  followUpRequired: {
    type: Boolean,
    default: false,
  },
  followUpNotes: String,
  notificationsSent: [{
    type: {
      type: String,
      enum: ['sms', 'email', 'push', 'call', 'whatsapp'],
    },
    recipient: String,
    timestamp: Date,
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent',
    },
    provider: String,
  }],
  metrics: {
    responseTimeMinutes: Number,
    resolutionTimeMinutes: Number,
    satisfactionRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: String,
  },
}, {
  timestamps: true,
});

// Indexes for performance
emergencyAlertSchema.index({ userId: 1, timestamp: -1 });
emergencyAlertSchema.index({ status: 1, timestamp: -1 });
emergencyAlertSchema.index({ emergencyType: 1, timestamp: -1 });
emergencyAlertSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

// Geospatial index for location-based queries
emergencyAlertSchema.index({
  'location': '2dsphere'
});

// Virtual for calculated response time
emergencyAlertSchema.virtual('responseTimeCalculated').get(function() {
  if (this.responseTime && this.timestamp) {
    return Math.round((this.responseTime - this.timestamp) / (1000 * 60)); // minutes
  }
  return null;
});

// Virtual for calculated resolution time
emergencyAlertSchema.virtual('resolutionTimeCalculated').get(function() {
  if (this.resolvedTime && this.timestamp) {
    return Math.round((this.resolvedTime - this.timestamp) / (1000 * 60)); // minutes
  }
  return null;
});

// Pre-save middleware to calculate metrics
emergencyAlertSchema.pre('save', function(next) {
  if (this.isModified('responseTime') && this.responseTime && this.timestamp) {
    this.metrics.responseTimeMinutes = Math.round((this.responseTime - this.timestamp) / (1000 * 60));
  }
  
  if (this.isModified('resolvedTime') && this.resolvedTime && this.timestamp) {
    this.metrics.resolutionTimeMinutes = Math.round((this.resolvedTime - this.timestamp) / (1000 * 60));
  }
  
  next();
});

// Static method to get emergency statistics
emergencyAlertSchema.statics.getStatistics = async function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: null,
        totalAlerts: { $sum: 1 },
        avgResponseTime: { $avg: '$metrics.responseTimeMinutes' },
        avgResolutionTime: { $avg: '$metrics.resolutionTimeMinutes' },
        statusBreakdown: {
          $push: '$status'
        },
        typeBreakdown: {
          $push: '$emergencyType'
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalAlerts: 1,
        avgResponseTime: { $round: ['$avgResponseTime', 2] },
        avgResolutionTime: { $round: ['$avgResolutionTime', 2] },
        statusBreakdown: 1,
        typeBreakdown: 1,
      }
    }
  ];

  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalAlerts: 0,
    avgResponseTime: 0,
    avgResolutionTime: 0,
    statusBreakdown: [],
    typeBreakdown: [],
  };
};

// Instance method to add notification record
emergencyAlertSchema.methods.addNotification = function(notificationData) {
  this.notificationsSent.push({
    type: notificationData.type,
    recipient: notificationData.recipient,
    timestamp: new Date(),
    status: notificationData.status || 'sent',
    provider: notificationData.provider,
  });
  return this.save();
};

// Instance method to update status with timestamp
emergencyAlertSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  this.notes = notes;
  
  if (newStatus === 'acknowledged' && !this.responseTime) {
    this.responseTime = new Date();
  }
  
  if (newStatus === 'resolved' && !this.resolvedTime) {
    this.resolvedTime = new Date();
  }
  
  return this.save();
};

// Instance method to check if alert is active
emergencyAlertSchema.methods.isActive = function() {
  return ['sent', 'acknowledged', 'responding'].includes(this.status);
};

// Instance method to check if alert is overdue
emergencyAlertSchema.methods.isOverdue = function(maxMinutes = 30) {
  if (!this.isActive()) return false;
  
  const now = new Date();
  const timeDiff = (now - this.timestamp) / (1000 * 60); // minutes
  return timeDiff > maxMinutes;
};

const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema);

module.exports = EmergencyAlert;
