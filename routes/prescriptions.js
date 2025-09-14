const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const Prescription = require('../models/Prescription');
const HealthRecord = require('../models/HealthRecord');

const router = express.Router();

// Get prescriptions
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

    const prescriptions = await Prescription.find(query)
      .populate('patientId', 'name phone dateOfBirth gender')
      .populate('doctorId', 'name specialization')
      .populate('pharmacyId', 'name address')
      .populate('healthRecordId', 'visitDate symptoms diagnosis')
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

// Get specific prescription
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const query = { _id: req.params.id };
    
    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    }

    const prescription = await Prescription.findOne(query)
      .populate('patientId', 'name phone dateOfBirth gender address')
      .populate('doctorId', 'name specialization experience')
      .populate('pharmacyId', 'name address phone')
      .populate('healthRecordId', 'visitDate symptoms diagnosis vitalSigns');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ prescription });
  } catch (error) {
    console.error('Prescription fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch prescription', error: error.message });
  }
});

// Create prescription
router.post('/', authenticateToken, authorize('doctor'), async (req, res) => {
  try {
    const { patientId, healthRecordId, medicines, instructions, followUpDate } = req.body;

    // Validate that the health record belongs to the doctor
    const healthRecord = await HealthRecord.findOne({
      _id: healthRecordId,
      doctorId: req.user._id,
      patientId
    });

    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found or access denied' });
    }

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

// Update prescription
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { medicines, instructions, followUpDate, status } = req.body;

    const query = { _id: req.params.id };
    
    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    }

    const prescription = await Prescription.findOneAndUpdate(
      query,
      {
        medicines,
        instructions,
        followUpDate,
        status
      },
      { new: true, runValidators: true }
    )
    .populate('patientId', 'name phone')
    .populate('doctorId', 'name specialization')
    .populate('pharmacyId', 'name address');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({
      message: 'Prescription updated successfully',
      prescription
    });
  } catch (error) {
    console.error('Prescription update error:', error);
    res.status(500).json({ message: 'Failed to update prescription', error: error.message });
  }
});

// Mark prescription as dispensed
router.put('/:id/dispense', authenticateToken, async (req, res) => {
  try {
    const { pharmacyId } = req.body;

    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user._id },
      {
        isDispensed: true,
        dispensedDate: new Date(),
        pharmacyId
      },
      { new: true }
    )
    .populate('pharmacyId', 'name address');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({
      message: 'Prescription marked as dispensed',
      prescription
    });
  } catch (error) {
    console.error('Prescription dispense error:', error);
    res.status(500).json({ message: 'Failed to mark prescription as dispensed', error: error.message });
  }
});

// Get offline prescriptions (for sync)
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

    const prescriptions = await Prescription.find(query)
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: 1 });

    res.json({ prescriptions });
  } catch (error) {
    console.error('Offline prescriptions fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch offline prescriptions', error: error.message });
  }
});

// Mark prescription as synced
router.put('/:id/sync', authenticateToken, async (req, res) => {
  try {
    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, isOffline: true },
      {
        isOffline: false,
        syncStatus: 'synced',
        lastSynced: new Date()
      },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found or already synced' });
    }

    res.json({
      message: 'Prescription synced successfully',
      prescription
    });
  } catch (error) {
    console.error('Prescription sync error:', error);
    res.status(500).json({ message: 'Failed to sync prescription', error: error.message });
  }
});

// Get prescription statistics
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
      totalPrescriptions,
      todayPrescriptions,
      activePrescriptions,
      dispensedPrescriptions
    ] = await Promise.all([
      Prescription.countDocuments(query),
      Prescription.countDocuments({
        ...query,
        prescriptionDate: { $gte: startOfDay, $lte: endOfDay }
      }),
      Prescription.countDocuments({
        ...query,
        status: 'active'
      }),
      Prescription.countDocuments({
        ...query,
        isDispensed: true
      })
    ]);

    res.json({
      totalPrescriptions,
      todayPrescriptions,
      activePrescriptions,
      dispensedPrescriptions
    });
  } catch (error) {
    console.error('Prescriptions stats error:', error);
    res.status(500).json({ message: 'Failed to fetch prescriptions statistics', error: error.message });
  }
});

// Search prescriptions by medicine
router.get('/search/medicines', authenticateToken, async (req, res) => {
  try {
    const { medicineName, page = 1, limit = 10 } = req.query;

    const query = {
      'medicines.name': { $regex: medicineName, $options: 'i' }
    };

    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    }

    const prescriptions = await Prescription.find(query)
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name specialization')
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
    console.error('Prescription search error:', error);
    res.status(500).json({ message: 'Failed to search prescriptions', error: error.message });
  }
});

module.exports = router;
