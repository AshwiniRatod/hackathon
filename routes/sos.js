const express = require('express');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const SOSAlert = require('../models/SOSAlert');
const User = require('../models/User');

const router = express.Router();

// Create SOS alert (public endpoint for emergencies)
router.post('/', async (req, res) => {
  try {
    const { patientId, emergencyType, description, location, phone } = req.body;

    // If patientId is not provided, try to find by phone
    let patient = null;
    if (patientId) {
      patient = await User.findById(patientId);
    } else if (phone) {
      patient = await User.findOne({ phone, role: 'patient' });
    }

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const sosAlert = new SOSAlert({
      patientId: patient._id,
      emergencyType,
      description,
      location,
      priority: 'high'
    });

    await sosAlert.save();

    // In production, send notifications to emergency contacts
    console.log(`SOS Alert created: ${sosAlert._id} for patient ${patient.name}`);
    
    // Simulate SMS notification
    if (patient.emergencyContact && patient.emergencyContact.phone) {
      console.log(`SMS sent to emergency contact ${patient.emergencyContact.phone}: Emergency alert for ${patient.name}`);
    }

    res.status(201).json({
      message: 'SOS alert sent successfully',
      sosAlert: {
        id: sosAlert._id,
        emergencyType: sosAlert.emergencyType,
        status: sosAlert.status,
        createdAt: sosAlert.createdAt
      }
    });
  } catch (error) {
    console.error('SOS alert creation error:', error);
    res.status(500).json({ message: 'Failed to send SOS alert', error: error.message });
  }
});

// Get SOS alerts (authenticated)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }

    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query['assignedTo.doctorId'] = req.user._id;
    } else if (req.user.role === 'asha') {
      query['assignedTo.ashaId'] = req.user._id;
    }

    const sosAlerts = await SOSAlert.find(query)
      .populate('patientId', 'name phone address emergencyContact')
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

// Get specific SOS alert
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const query = { _id: req.params.id };
    
    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query['assignedTo.doctorId'] = req.user._id;
    } else if (req.user.role === 'asha') {
      query['assignedTo.ashaId'] = req.user._id;
    }

    const sosAlert = await SOSAlert.findOne(query)
      .populate('patientId', 'name phone address emergencyContact')
      .populate('assignedTo.doctorId', 'name specialization')
      .populate('assignedTo.ashaId', 'name');

    if (!sosAlert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }

    res.json({ sosAlert });
  } catch (error) {
    console.error('SOS alert fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch SOS alert', error: error.message });
  }
});

// Update SOS alert status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!['pending', 'acknowledged', 'in_progress', 'resolved', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const query = { _id: req.params.id };
    
    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query['assignedTo.doctorId'] = req.user._id;
    } else if (req.user.role === 'asha') {
      query['assignedTo.ashaId'] = req.user._id;
    }

    const sosAlert = await SOSAlert.findOneAndUpdate(
      query,
      { 
        status,
        notes: notes || sosAlert?.notes,
        ...(status === 'resolved' && { resolutionTime: Date.now() })
      },
      { new: true }
    )
    .populate('patientId', 'name phone')
    .populate('assignedTo.doctorId', 'name specialization')
    .populate('assignedTo.ashaId', 'name');

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

// Assign SOS alert (admin/doctor only)
router.put('/:id/assign', authenticateToken, async (req, res) => {
  try {
    const { doctorId, ashaId } = req.body;

    if (!doctorId && !ashaId) {
      return res.status(400).json({ message: 'At least one assignee is required' });
    }

    const sosAlert = await SOSAlert.findByIdAndUpdate(
      req.params.id,
      {
        'assignedTo.doctorId': doctorId,
        'assignedTo.ashaId': ashaId,
        status: 'acknowledged'
      },
      { new: true }
    )
    .populate('patientId', 'name phone')
    .populate('assignedTo.doctorId', 'name specialization')
    .populate('assignedTo.ashaId', 'name');

    if (!sosAlert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }

    res.json({
      message: 'SOS alert assigned successfully',
      sosAlert
    });
  } catch (error) {
    console.error('SOS alert assignment error:', error);
    res.status(500).json({ message: 'Failed to assign SOS alert', error: error.message });
  }
});

// Get emergency contacts for patient
router.get('/patient/:patientId/contacts', authenticateToken, async (req, res) => {
  try {
    const patient = await User.findById(req.params.patientId)
      .select('name phone emergencyContact address');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      patient: {
        name: patient.name,
        phone: patient.phone,
        address: patient.address,
        emergencyContact: patient.emergencyContact
      }
    });
  } catch (error) {
    console.error('Emergency contacts fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch emergency contacts', error: error.message });
  }
});

// Get SOS statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [
      totalAlerts,
      todayAlerts,
      activeAlerts,
      resolvedAlerts
    ] = await Promise.all([
      SOSAlert.countDocuments(),
      SOSAlert.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }),
      SOSAlert.countDocuments({
        status: { $in: ['pending', 'acknowledged', 'in_progress'] }
      }),
      SOSAlert.countDocuments({ status: 'resolved' })
    ]);

    res.json({
      totalAlerts,
      todayAlerts,
      activeAlerts,
      resolvedAlerts
    });
  } catch (error) {
    console.error('SOS stats error:', error);
    res.status(500).json({ message: 'Failed to fetch SOS statistics', error: error.message });
  }
});

module.exports = router;
