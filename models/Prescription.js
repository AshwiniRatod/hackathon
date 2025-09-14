const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
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
  healthRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthRecord',
    required: true
  },
  prescriptionDate: {
    type: Date,
    default: Date.now
  },
  medicines: [{
    name: {
      type: String,
      required: true
    },
    genericName: String,
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    instructions: String,
    quantity: Number,
    unit: String
  }],
  instructions: String,
  followUpDate: Date,
  isEmergency: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  // Pharmacy information
  pharmacyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy'
  },
  isDispensed: {
    type: Boolean,
    default: false
  },
  dispensedDate: Date,
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
prescriptionSchema.index({ patientId: 1, prescriptionDate: -1 });
prescriptionSchema.index({ doctorId: 1, prescriptionDate: -1 });
prescriptionSchema.index({ isOffline: 1, syncStatus: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);
