const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emergencyType: {
    type: String,
    enum: ['medical', 'accident', 'fall', 'heart_attack', 'stroke', 'breathing', 'other'],
    required: true
  },
  description: String,
  location: {
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String,
    accuracy: Number
  },
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'in_progress', 'resolved', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high'
  },
  assignedTo: {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ashaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  notifications: [{
    contactType: {
      type: String,
      enum: ['sms', 'push', 'call', 'email']
    },
    recipient: String,
    sentAt: Date,
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed']
    },
    response: String
  }],
  responseTime: Number, // in minutes
  resolutionTime: Number, // in minutes
  notes: String,
  // Offline sync fields
  isOffline: {
    type: Boolean,
    default: false
  },
  syncStatus: {
    type: String,
    enum: ['pending', 'synced', 'failed'],
    default: 'pending'
  },
  lastSynced: Date
}, {
  timestamps: true
});

// Index for efficient queries
sosAlertSchema.index({ patientId: 1, createdAt: -1 });
sosAlertSchema.index({ status: 1, priority: 1 });
sosAlertSchema.index({ 'assignedTo.doctorId': 1 });
sosAlertSchema.index({ 'assignedTo.ashaId': 1 });

module.exports = mongoose.model('SOSAlert', sosAlertSchema);
