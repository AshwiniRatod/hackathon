const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  address: {
    village: String,
    district: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  medicines: [{
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine'
    },
    name: String,
    genericName: String,
    manufacturer: String,
    batchNumber: String,
    expiryDate: Date,
    quantity: {
      type: Number,
      default: 0
    },
    unit: String,
    price: Number,
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  workingHours: {
    monday: { open: String, close: String, isOpen: Boolean },
    tuesday: { open: String, close: String, isOpen: Boolean },
    wednesday: { open: String, close: String, isOpen: Boolean },
    thursday: { open: String, close: String, isOpen: Boolean },
    friday: { open: String, close: String, isOpen: Boolean },
    saturday: { open: String, close: String, isOpen: Boolean },
    sunday: { open: String, close: String, isOpen: Boolean }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for location-based queries
pharmacySchema.index({ 'address.coordinates': '2dsphere' });
pharmacySchema.index({ 'medicines.name': 'text' });

module.exports = mongoose.model('Pharmacy', pharmacySchema);
