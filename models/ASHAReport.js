const mongoose = require('mongoose');

const ashaReportSchema = new mongoose.Schema({
  ashaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    enum: ['maternal', 'vaccination', 'nutrition', 'general', 'emergency'],
    required: true
  },
  visitDate: {
    type: Date,
    default: Date.now
  },
  // Maternal health fields
  maternalData: {
    pregnancyWeek: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    weight: Number,
    hemoglobin: Number,
    complications: [String],
    nextVisitDate: Date,
    notes: String
  },
  // Vaccination fields
  vaccinationData: {
    vaccineName: String,
    dose: String,
    batchNumber: String,
    administeredDate: Date,
    nextDueDate: Date,
    sideEffects: [String],
    administeredBy: String
  },
  // Nutrition fields
  nutritionData: {
    height: Number,
    weight: Number,
    age: Number,
    malnutritionType: {
      type: String,
      enum: ['severe_acute', 'moderate_acute', 'stunting', 'wasting', 'underweight', 'normal']
    },
    dietaryAdvice: String,
    supplements: [String],
    followUpDate: Date
  },
  // General health fields
  generalData: {
    symptoms: [String],
    vitalSigns: {
      temperature: Number,
      heartRate: Number,
      bloodPressure: {
        systolic: Number,
        diastolic: Number
      }
    },
    diagnosis: String,
    treatment: String,
    referralRequired: Boolean,
    referralReason: String
  },
  // Emergency fields
  emergencyData: {
    emergencyType: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    actionTaken: String,
    referralMade: Boolean,
    hospitalName: String
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'reviewed', 'approved'],
    default: 'draft'
  },
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
ashaReportSchema.index({ ashaId: 1, visitDate: -1 });
ashaReportSchema.index({ patientId: 1, reportType: 1 });
ashaReportSchema.index({ isOffline: 1, syncStatus: 1 });

module.exports = mongoose.model('ASHAReport', ashaReportSchema);
