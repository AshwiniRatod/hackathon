const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const User = require('../models/User');
const HealthRecord = require('../models/HealthRecord');
const Prescription = require('../models/Prescription');
const SOSAlert = require('../models/SOSAlert');

const router = express.Router();

// Get patient profile
router.get('/profile', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const patient = await User.findById(req.user._id).select('-password -otp');
    res.json({ patient });
  } catch (error) {
    console.error('Patient profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Update patient profile
router.put('/profile', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.phone;
    delete updates.role;

    const patient = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -otp');

    res.json({
      message: 'Profile updated successfully',
      patient
    });
  } catch (error) {
    console.error('Patient profile update error:', error);
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
});

// Get patient's health records
router.get('/health-records', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { patientId: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const healthRecords = await HealthRecord.find(query)
      .populate('doctorId', 'name specialization')
      .populate('prescription')
      .sort({ visitDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await HealthRecord.countDocuments(query);

    res.json({
      healthRecords,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Health records fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch health records', error: error.message });
  }
});

// Get specific health record
router.get('/health-records/:id', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findOne({
      _id: req.params.id,
      patientId: req.user._id
    })
    .populate('doctorId', 'name specialization')
    .populate('prescription');

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    res.json({ healthRecord });
  } catch (error) {
    console.error('Health record fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch health record', error: error.message });
  }
});

// Get patient's prescriptions
router.get('/prescriptions', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { patientId: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const prescriptions = await Prescription.find(query)
      .populate('doctorId', 'name specialization')
      .populate('pharmacyId', 'name address')
      .sort({ prescriptionDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Prescription.countDocuments(query);

    res.json({
      prescriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Prescriptions fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch prescriptions', error: error.message });
  }
});

// Get available doctors
router.get('/doctors', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { specialization, page = 1, limit = 10 } = req.query;
    const query = { role: 'doctor', isActive: true };
    
    if (specialization) {
      query.specialization = new RegExp(specialization, 'i');
    }

    const doctors = await User.find(query)
      .select('name specialization experience consultationFee availableSlots profilePicture')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      doctors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Doctors fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
});

// Book consultation
router.post('/book-consultation', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { doctorId, symptoms, preferredTime, consultationType = 'video' } = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Create health record for consultation
    const healthRecord = new HealthRecord({
      patientId: req.user._id,
      doctorId,
      symptoms: symptoms.map(symptom => ({
        name: symptom,
        severity: 'moderate',
        duration: 'unknown'
      })),
      visitType: 'consultation',
      status: 'active'
    });

    await healthRecord.save();

    res.status(201).json({
      message: 'Consultation booked successfully',
      healthRecord
    });
  } catch (error) {
    console.error('Consultation booking error:', error);
    res.status(500).json({ message: 'Failed to book consultation', error: error.message });
  }
});

// Create SOS alert
router.post('/sos', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { emergencyType, description, location } = req.body;

    const sosAlert = new SOSAlert({
      patientId: req.user._id,
      emergencyType,
      description,
      location,
      priority: 'high'
    });

    await sosAlert.save();

    // In production, send notifications to emergency contacts
    console.log(`SOS Alert created: ${sosAlert._id} for patient ${req.user.name}`);

    res.status(201).json({
      message: 'SOS alert sent successfully',
      sosAlert
    });
  } catch (error) {
    console.error('SOS alert error:', error);
    res.status(500).json({ message: 'Failed to send SOS alert', error: error.message });
  }
});

// Get patient's SOS alerts
router.get('/sos-alerts', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { patientId: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const sosAlerts = await SOSAlert.find(query)
      .populate('assignedTo.doctorId', 'name specialization')
      .populate('assignedTo.ashaId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SOSAlert.countDocuments(query);

    res.json({
      sosAlerts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('SOS alerts fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch SOS alerts', error: error.message });
  }
});

// Update language preference
router.put('/language', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { language } = req.body;

    if (!['en', 'hi', 'pa'].includes(language)) {
      return res.status(400).json({ message: 'Invalid language code' });
    }

    const patient = await User.findByIdAndUpdate(
      req.user._id,
      { language },
      { new: true }
    ).select('-password -otp');

    res.json({
      message: 'Language preference updated successfully',
      patient
    });
  } catch (error) {
    console.error('Language update error:', error);
    res.status(500).json({ message: 'Failed to update language', error: error.message });
  }
});

module.exports = router;
