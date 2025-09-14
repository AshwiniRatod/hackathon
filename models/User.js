const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['patient', 'doctor', 'asha', 'admin'],
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  // Patient specific fields
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    village: String,
    district: String,
    state: String,
    pincode: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  // Doctor specific fields
  specialization: String,
  licenseNumber: String,
  experience: Number,
  consultationFee: Number,
  availableSlots: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  // ASHA specific fields
  ashaId: String,
  assignedVillages: [String],
  // Common fields
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
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  };
  return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function(otp) {
  if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
    return false;
  }
  if (this.otp.expiresAt < new Date()) {
    return false;
  }
  return this.otp.code === otp;
};

module.exports = mongoose.model('User', userSchema);
