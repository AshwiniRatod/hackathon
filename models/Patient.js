const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  address: {
    village: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  emergencyContact: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    relation: {
      type: String,
      required: true
    }
  },
  // Medical information
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  allergies: [String],
  chronicConditions: [String],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  // Authentication and verification
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  // Profile and settings
  profilePicture: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  language: {
    type: String,
    enum: ['en', 'hi', 'pa'],
    default: 'en'
  },
  // App specific settings
  notificationPreferences: {
    appointments: {
      type: Boolean,
      default: true
    },
    medicationReminders: {
      type: Boolean,
      default: true
    },
    healthTips: {
      type: Boolean,
      default: true
    }
  },
  // Health metrics tracking
  healthMetrics: {
    height: Number, // in cm
    weight: Number, // in kg
    bmi: Number
  }
}, {
  timestamps: true
});

// Calculate BMI before saving
patientSchema.pre('save', function(next) {
  if (this.healthMetrics.height && this.healthMetrics.weight) {
    const heightInMeters = this.healthMetrics.height / 100;
    this.healthMetrics.bmi = Number((this.healthMetrics.weight / (heightInMeters * heightInMeters)).toFixed(2));
  }
  next();
});

// Hash password before saving
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
patientSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP
patientSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  };
  return otp;
};

// Verify OTP
patientSchema.methods.verifyOTP = function(otp) {
  if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
    return false;
  }
  if (this.otp.expiresAt < new Date()) {
    return false;
  }
  return this.otp.code === otp;
};

// Calculate age from date of birth
patientSchema.methods.getAge = function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Get patient's medical summary
patientSchema.methods.getMedicalSummary = function() {
  return {
    name: this.name,
    age: this.getAge(),
    gender: this.gender,
    bloodType: this.bloodType,
    allergies: this.allergies,
    chronicConditions: this.chronicConditions,
    currentMedications: this.currentMedications,
    emergencyContact: this.emergencyContact
  };
};

module.exports = mongoose.model('Patient', patientSchema);