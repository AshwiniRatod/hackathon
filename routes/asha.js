const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const User = require('../models/User');
const ASHAReport = require('../models/ASHAReport');
const SOSAlert = require('../models/SOSAlert');

const router = express.Router();

// Get ASHA profile
router.get('/profile', authenticateToken, authorize('asha'), async (req, res) => {
  try {
    const asha = await User.findById(req.user._id).select('-password -otp');
    res.json({ asha });
  } catch (error) {
    console.error('ASHA profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Update ASHA profile
router.put('/profile', authenticateToken, authorize('asha'), async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.phone;
    delete updates.role;

    const asha = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -otp');

    res.json({
      message: 'Profile updated successfully',
      asha
    });
  } catch (error) {
    console.error('ASHA profile update error:', error);
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
});

// Register new patient (offline)
router.post('/register-patient', authenticateToken, authorize('asha'), async (req, res) => {
  try {
    const { name, phone, dateOfBirth, gender, address, emergencyContact } = req.body;

    // Check if patient already exists
    const existingPatient = await User.findOne({ phone });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists with this phone number' });
    }

    // Create new patient
    const patient = new User({
      phone,
      name,
      role: 'patient',
      password: 'temp123', // Temporary password, patient will set their own
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      isVerified: true // ASHA registered patients are pre-verified
    });

    await patient.save();

    res.status(201).json({
      message: 'Patient registered successfully',
      patient: {
        id: patient._id,
        name: patient.name,
        phone: patient.phone,
        address: patient.address
      }
    });
  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({ message: 'Patient registration failed', error: error.message });
  }
});

// Create maternal health report
router.post('/reports/maternal', authenticateToken, authorize('asha'), async (req, res) => {
  try {
    const { patientId, maternalData } = req.body;

    const report = new ASHAReport({
      ashaId: req.user._id,
      patientId,
      reportType: 'maternal',
      maternalData
    });

    await report.save();

    res.status(201).json({
      message: 'Maternal health report created successfully',
      report
    });
  } catch (error) {
    console.error('Maternal report creation error:', error);
    res.status(500).json({ message: 'Failed to create maternal report', error: error.message });
  }
});

// Create vaccination report
router.post('/reports/vaccination', authenticateToken, authorize('asha'), async (req, res) => {
  try {
    const { patientId, vaccinationData } = req.body;

    const report = new ASHAReport({
      ashaId: req.user._id,
      patientId,
      reportType: 'vaccination',
      vaccinationData
    });

    await report.save();

    res.status(201).json({
      message: 'Vaccination report created successfully',
      report
    });
  } catch (error) {
    console.error('Vaccination report creation error:', error);
    res.status(500).json({ message: 'Failed to create vaccination report', error: error.message });
  }
});

// Create nutrition report
router.post('/reports/nutrition', authenticateToken, authorize('asha'), async (req, res) => {
  try {
    const { patientId, nutritionData } = req.body;

    const report = new ASHAReport({
      ashaId: req.user._id,
      patientId,
      reportType: 'nutrition',
      nutritionData
    });

    await report.save();

    res.status(201).json({
      message: 'Nutrition report created successfully',
      report
    });
  } catch (error) {
    console.error('Nutrition report creation error:', error);
    res.status(500).json({ message: 'Failed to create nutrition report', error: error.message });
  }
});

// Create general health report
router.post('/reports/general', authenticateToken, authorize('asha'), async (req, res) => {
  try {
    const { patientId, generalData } = req.body;

    const report = new ASHAReport({
      ashaId: req.user._id,
      patientId,
      reportType: 'general',
      generalData
    });

    await report.save();

    res.status(201).json({
      message: 'General health report created successfully',
      report
    });
  } catch (error) {
    console.error('General report creation error:', error);
    res.status(500).json({ message: 'Failed to create general report', error: error.message });
  }
});

// Get ASHA's reports
router.get('/reports', authenticateToken, authorize('asha'), async (req, res) => {
  try {
    const { reportType, status, page = 1, limit = 10 } = req.query;
    const query = { ashaId: req.user._id };
    
    if (reportType) {
      query.reportType = reportType;
    }
    
    if (status) {
      query.status = status;
    }

    const reports = await ASHAReport.find(query)
      .populate('patientId', 'name phone address')
      .sort({ visitDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ASHAReport.countDocuments(query);

    res.json({
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('ASHA reports fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
});

// Get SOS alerts assigned to ASHA
router.get('/sos-alerts', authenticateToken, authorize('asha'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { 'assignedTo.ashaId': req.user._id };
    
    if (status) {
      query.status = status;
    }

    const sosAlerts = await SOSAlert.find(query)
      .populate('patientId', 'name phone address emergencyContact')
      .populate('assignedTo.doctorId', 'name specialization')
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

// Update SOS alert status
router.put('/sos-alerts/:id/status', authenticateToken, authorize('asha'), async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!['pending', 'acknowledged', 'in_progress', 'resolved', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const sosAlert = await SOSAlert.findOneAndUpdate(
      { _id: req.params.id, 'assignedTo.ashaId': req.user._id },
      { 
        status,
        notes: notes || sosAlert.notes,
        ...(status === 'resolved' && { resolutionTime: Date.now() })
      },
      { new: true }
    )
    .populate('patientId', 'name phone');

    if (!sosAlert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }

    res.json({
      message: 'SOS alert status updated successfully',
      sosAlert
    });
  } catch (error) {
    console.error('SOS alert status update error:', error);
    res.status(500).json({ message: 'Failed to update SOS alert status', error: error.message });
  }
});

// Get assigned patients
router.get('/patients', authenticateToken, authorize('asha'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Get patients from ASHA's assigned villages
    const asha = await User.findById(req.user._id);
    const villageQuery = asha.assignedVillages.length > 0 
      ? { 'address.village': { $in: asha.assignedVillages } }
      : {};

    const patients = await User.find({
      role: 'patient',
      ...villageQuery
    })
    .select('name phone dateOfBirth gender address emergencyContact')
    .sort({ name: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await User.countDocuments({
      role: 'patient',
      ...villageQuery
    });

    res.json({
      patients,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Assigned patients fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch assigned patients', error: error.message });
  }
});

// Get ASHA statistics
router.get('/stats', authenticateToken, authorize('asha'), async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [
      totalPatients,
      todayReports,
      pendingSOSAlerts,
      totalReports
    ] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      ASHAReport.countDocuments({
        ashaId: req.user._id,
        visitDate: { $gte: startOfDay, $lte: endOfDay }
      }),
      SOSAlert.countDocuments({
        'assignedTo.ashaId': req.user._id,
        status: { $in: ['pending', 'acknowledged', 'in_progress'] }
      }),
      ASHAReport.countDocuments({ ashaId: req.user._id })
    ]);

    res.json({
      totalPatients,
      todayReports,
      pendingSOSAlerts,
      totalReports
    });
  } catch (error) {
    console.error('ASHA stats fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
});

module.exports = router;
