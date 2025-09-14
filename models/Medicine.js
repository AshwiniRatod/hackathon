const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  genericName: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['antibiotic', 'painkiller', 'antihistamine', 'vitamin', 'diabetes', 'heart', 'respiratory', 'digestive', 'other'],
    required: true
  },
  dosageForms: [{
    type: String,
    enum: ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'inhaler', 'patch']
  }],
  strengths: [String],
  description: String,
  sideEffects: [String],
  contraindications: [String],
  storageInstructions: String,
  isPrescriptionRequired: {
    type: Boolean,
    default: true
  },
  isControlled: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Text search index
medicineSchema.index({ name: 'text', genericName: 'text', manufacturer: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);
