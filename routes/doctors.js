const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const User = require('../models/User');
const HealthRecord = require('../models/HealthRecord');
const Prescription = require('../models/Prescription');
const ASHAReport = require('../models/ASHAReport');

const router = express.Router();

// Real-time event emitter helper
const emitToClients = (req, event, data) => {
  const io = req.app.get('io');
  if (io) {
    io.emit(event, data);
    console.log(`Emitted ${event}:`, data);
  }
};

// Doctor Registration (for web platform)
router.post('/register', async (req, res) => {
  try {
    const doctorData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      specialty: req.body.specialty,
      qualification: req.body.qualification,
      experience: req.body.experience,
      role: 'doctor',
      isVerified: false,
      consultationFee: req.body.consultationFee || 500,
      availability: req.body.availability || {
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        slots: ['09:00-12:00', '14:00-17:00']
      },
      profileImage: req.body.profileImage || null,
      rating: 0,
      totalConsultations: 0,
      isActive: true
    };

    const doctor = new User(doctorData);
    await doctor.save();

    // Emit real-time event to mobile apps
    emitToClients(req, 'doctor-added', {
      action: 'new_doctor',
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        specialty: doctor.specialty,
        qualification: doctor.qualification,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        rating: doctor.rating,
        isActive: doctor.isActive
      }
    });

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctor: doctor
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
});

// Get available doctors (for mobile app)
router.get('/available', async (req, res) => {
  try {
    const { specialty, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {
      role: 'doctor',
      isActive: true,
      isVerified: true
    };

    if (specialty && specialty !== 'all') {
      filter.specialty = specialty;
    }

    const doctors = await User.find(filter)
      .select('name specialty qualification experience consultationFee rating totalConsultations profileImage availability isActive')
      .sort({ rating: -1, totalConsultations: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      doctors,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: doctors.length,
        totalDoctors: total
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
});

// Update doctor status (for web admin)
router.put('/:doctorId/status', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { isActive, isVerified } = req.body;

    const doctor = await User.findByIdAndUpdate(
      doctorId,
      { isActive, isVerified },
      { new: true }
    ).select('name specialty isActive isVerified');

    // Emit real-time event
    emitToClients(req, 'doctor-updated', {
      action: 'status_updated',
      doctor: doctor
    });

    res.json({
      message: 'Doctor status updated',
      doctor
    });
  } catch (error) {
    console.error('Update doctor status error:', error);
    res.status(500).json({ message: 'Status update failed', error: error.message });
  }
});

// Get doctor profile
router.get('/profile', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id).select('-password -otp');
    res.json({ doctor });
  } catch (error) {
    console.error('Doctor profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Update doctor profile
router.put('/profile', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.phone;
    delete updates.role;

    const doctor = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -otp');

    res.json({
      message: 'Profile updated successfully',
      doctor
    });
  } catch (error) {
    console.error('Doctor profile update error:', error);
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
});

// Get patient queue
router.get('/patient-queue', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { status = 'active', page = 1, limit = 10 } = req.query;

    const healthRecords = await HealthRecord.find({
      doctorId: req.user._id,
      status
    })
    .populate('patientId', 'name phone dateOfBirth gender')
    .sort({ visitDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await HealthRecord.countDocuments({
      doctorId: req.user._id,
      status
    });

    res.json({
      healthRecords,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Patient queue fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch patient queue', error: error.message });
  }
});

// Get specific patient's history
router.get('/patients/:patientId/history', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const healthRecords = await HealthRecord.find({
      patientId: req.params.patientId
    })
    .populate('patientId', 'name phone dateOfBirth gender address')
    .populate('prescription')
    .sort({ visitDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await HealthRecord.countDocuments({
      patientId: req.params.patientId
    });

    res.json({
      healthRecords,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Patient history fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch patient history', error: error.message });
  }
});

// Update health record
router.put('/health-records/:id', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { diagnosis, vitalSigns, notes, followUpDate } = req.body;

    const healthRecord = await HealthRecord.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.user._id },
      {
        diagnosis,
        vitalSigns,
        notes,
        followUpDate,
        status: 'completed'
      },
      { new: true, runValidators: true }
    )
    .populate('patientId', 'name phone')
    .populate('prescription');

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    res.json({
      message: 'Health record updated successfully',
      healthRecord
    });
  } catch (error) {
    console.error('Health record update error:', error);
    res.status(500).json({ message: 'Failed to update health record', error: error.message });
  }
});

// Create prescription
router.post('/prescriptions', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { patientId, healthRecordId, medicines, instructions, followUpDate } = req.body;

    const prescription = new Prescription({
      patientId,
      doctorId: req.user._id,
      healthRecordId,
      medicines,
      instructions,
      followUpDate
    });

    await prescription.save();

    // Update health record with prescription reference
    await HealthRecord.findByIdAndUpdate(healthRecordId, {
      prescription: prescription._id
    });

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription
    });
  } catch (error) {
    console.error('Prescription creation error:', error);
    res.status(500).json({ message: 'Failed to create prescription', error: error.message });
  }
});

// Get ASHA reports for assigned patients
router.get('/asha-reports', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { patientId, reportType, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (patientId) {
      query.patientId = patientId;
    }
    
    if (reportType) {
      query.reportType = reportType;
    }

    const ashaReports = await ASHAReport.find(query)
      .populate('ashaId', 'name ashaId')
      .populate('patientId', 'name phone')
      .sort({ visitDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ASHAReport.countDocuments(query);

    res.json({
      ashaReports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('ASHA reports fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch ASHA reports', error: error.message });
  }
});

// Get doctor's statistics
router.get('/stats', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [
      totalPatients,
      todayConsultations,
      pendingConsultations,
      totalPrescriptions
    ] = await Promise.all([
      HealthRecord.distinct('patientId', { doctorId: req.user._id }).then(ids => ids.length),
      HealthRecord.countDocuments({
        doctorId: req.user._id,
        visitDate: { $gte: startOfDay, $lte: endOfDay }
      }),
      HealthRecord.countDocuments({
        doctorId: req.user._id,
        status: 'active'
      }),
      Prescription.countDocuments({ doctorId: req.user._id })
    ]);

    res.json({
      totalPatients,
      todayConsultations,
      pendingConsultations,
      totalPrescriptions
    });
  } catch (error) {
    console.error('Doctor stats fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
});

// Update consultation status
router.put('/consultations/:id/status', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const healthRecord = await HealthRecord.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.user._id },
      { status },
      { new: true }
    )
    .populate('patientId', 'name phone');

    if (!healthRecord) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    res.json({
      message: 'Consultation status updated successfully',
      healthRecord
    });
  } catch (error) {
    console.error('Consultation status update error:', error);
    res.status(500).json({ message: 'Failed to update consultation status', error: error.message });
  }
});

module.exports = router;
