const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const HealthRecord = require('../models/HealthRecord');
const Prescription = require('../models/Prescription');

const router = express.Router();

// Get health records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { patientId, doctorId, status, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (patientId) {
      query.patientId = patientId;
    }
    
    if (doctorId) {
      query.doctorId = doctorId;
    }
    
    if (status) {
      query.status = status;
    }

    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    }

    const healthRecords = await HealthRecord.find(query)
      .populate('patientId', 'name phone dateOfBirth gender')
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
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const query = { _id: req.params.id };
    
    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    }

    const healthRecord = await HealthRecord.findOne(query)
      .populate('patientId', 'name phone dateOfBirth gender address emergencyContact')
      .populate('doctorId', 'name specialization experience')
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

// Create health record
router.post('/', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { patientId, symptoms, visitType, vitalSigns, diagnosis, notes } = req.body;

    const healthRecord = new HealthRecord({
      patientId,
      doctorId: req.user._id,
      symptoms,
      visitType,
      vitalSigns,
      diagnosis,
      notes
    });

    await healthRecord.save();

    res.status(201).json({
      message: 'Health record created successfully',
      healthRecord
    });
  } catch (error) {
    console.error('Health record creation error:', error);
    res.status(500).json({ message: 'Failed to create health record', error: error.message });
  }
});

// Update health record
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { symptoms, vitalSigns, diagnosis, notes, followUpDate, status } = req.body;

    const query = { _id: req.params.id };
    
    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    }

    const healthRecord = await HealthRecord.findOneAndUpdate(
      query,
      {
        symptoms,
        vitalSigns,
        diagnosis,
        notes,
        followUpDate,
        status
      },
      { new: true, runValidators: true }
    )
    .populate('patientId', 'name phone')
    .populate('doctorId', 'name specialization')
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

// Add lab report to health record
router.post('/:id/lab-reports', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { testName, result, normalRange, fileUrl } = req.body;

    const healthRecord = await HealthRecord.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.user._id },
      {
        $push: {
          labReports: {
            testName,
            result,
            normalRange,
            fileUrl,
            date: new Date()
          }
        }
      },
      { new: true }
    )
    .populate('patientId', 'name phone')
    .populate('prescription');

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    res.json({
      message: 'Lab report added successfully',
      healthRecord
    });
  } catch (error) {
    console.error('Lab report addition error:', error);
    res.status(500).json({ message: 'Failed to add lab report', error: error.message });
  }
});

// Get offline health records (for sync)
router.get('/offline/pending', authenticateToken, async (req, res) => {
  try {
    const query = {
      isOffline: true,
      syncStatus: 'pending'
    };

    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    }

    const healthRecords = await HealthRecord.find(query)
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: 1 });

    res.json({ healthRecords });
  } catch (error) {
    console.error('Offline health records fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch offline health records', error: error.message });
  }
});

// Mark health record as synced
router.put('/:id/sync', authenticateToken, async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findOneAndUpdate(
      { _id: req.params.id, isOffline: true },
      {
        isOffline: false,
        syncStatus: 'synced',
        lastSynced: new Date()
      },
      { new: true }
    );

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found or already synced' });
    }

    res.json({
      message: 'Health record synced successfully',
      healthRecord
    });
  } catch (error) {
    console.error('Health record sync error:', error);
    res.status(500).json({ message: 'Failed to sync health record', error: error.message });
  }
});

// Get health record statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const query = {};
    
    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    }

    const [
      totalRecords,
      todayRecords,
      pendingRecords,
      completedRecords
    ] = await Promise.all([
      HealthRecord.countDocuments(query),
      HealthRecord.countDocuments({
        ...query,
        visitDate: { $gte: startOfDay, $lte: endOfDay }
      }),
      HealthRecord.countDocuments({
        ...query,
        status: 'active'
      }),
      HealthRecord.countDocuments({
        ...query,
        status: 'completed'
      })
    ]);

    res.json({
      totalRecords,
      todayRecords,
      pendingRecords,
      completedRecords
    });
  } catch (error) {
    console.error('Health records stats error:', error);
    res.status(500).json({ message: 'Failed to fetch health records statistics', error: error.message });
  }
});

module.exports = router;
