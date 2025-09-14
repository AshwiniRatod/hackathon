const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visitDate: {
    type: Date,
    default: Date.now
  },
  visitType: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency', 'routine'],
    default: 'consultation'
  },
  symptoms: [{
    name: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    duration: String
  }],
  diagnosis: {
    primary: String,
    secondary: [String],
    notes: String
  },
  vitalSigns: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    bmi: Number
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  labReports: [{
    testName: String,
    result: String,
    normalRange: String,
    date: Date,
    fileUrl: String
  }],
  followUpDate: Date,
  notes: String,
  isEmergency: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
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
healthRecordSchema.index({ patientId: 1, visitDate: -1 });
healthRecordSchema.index({ doctorId: 1, visitDate: -1 });
healthRecordSchema.index({ isOffline: 1, syncStatus: 1 });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
