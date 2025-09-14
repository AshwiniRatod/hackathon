const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const User = require('../models/User');
const HealthRecord = require('../models/HealthRecord');
const Prescription = require('../models/Prescription');
const SOSAlert = require('../models/SOSAlert');
const ASHAReport = require('../models/ASHAReport');
const Pharmacy = require('../models/Pharmacy');

const router = express.Router();

// Get admin dashboard statistics
router.get('/dashboard', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [
      totalPatients,
      totalDoctors,
      totalASHAs,
      totalPharmacies,
      todayConsultations,
      monthlyConsultations,
      activeSOSAlerts,
      pendingReports
    ] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      User.countDocuments({ role: 'asha' }),
      Pharmacy.countDocuments({ isActive: true }),
      HealthRecord.countDocuments({
        visitDate: { $gte: startOfDay, $lte: endOfDay }
      }),
      HealthRecord.countDocuments({
        visitDate: { $gte: startOfMonth, $lte: endOfMonth }
      }),
      SOSAlert.countDocuments({
        status: { $in: ['pending', 'acknowledged', 'in_progress'] }
      }),
      ASHAReport.countDocuments({ status: 'draft' })
    ]);

    res.json({
      totalPatients,
      totalDoctors,
      totalASHAs,
      totalPharmacies,
      todayConsultations,
      monthlyConsultations,
      activeSOSAlerts,
      pendingReports
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
});

// Get disease analytics
router.get('/analytics/diseases', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    }

    const diseaseStats = await HealthRecord.aggregate([
      {
        $match: {
          visitDate: { $gte: startDate, $lte: endDate },
          'diagnosis.primary': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$diagnosis.primary',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({ diseaseStats });
  } catch (error) {
    console.error('Disease analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch disease analytics', error: error.message });
  }
});

// Get user management data
router.get('/users', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -otp')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Update user status
router.put('/users/:id/status', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password -otp');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({ message: 'Failed to update user status', error: error.message });
  }
});

// Get SOS alerts management
router.get('/sos-alerts', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }

    const sosAlerts = await SOSAlert.find(query)
      .populate('patientId', 'name phone address')
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

// Assign SOS alert
router.put('/sos-alerts/:id/assign', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { doctorId, ashaId } = req.body;

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

// Get pharmacy management
router.get('/pharmacies', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { owner: { $regex: search, $options: 'i' } },
        { 'address.village': { $regex: search, $options: 'i' } }
      ];
    }

    const pharmacies = await Pharmacy.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Pharmacy.countDocuments(query);

    res.json({
      pharmacies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Pharmacies fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch pharmacies', error: error.message });
  }
});

// Update pharmacy status
router.put('/pharmacies/:id/status', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { isActive } = req.body;

    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    res.json({
      message: 'Pharmacy status updated successfully',
      pharmacy
    });
  } catch (error) {
    console.error('Pharmacy status update error:', error);
    res.status(500).json({ message: 'Failed to update pharmacy status', error: error.message });
  }
});

// Get system health
router.get('/system-health', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      offlineRecords,
      pendingSyncs,
      systemUptime
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      HealthRecord.countDocuments({ isOffline: true }),
      HealthRecord.countDocuments({ syncStatus: 'pending' }),
      process.uptime()
    ]);

    res.json({
      totalUsers,
      activeUsers,
      offlineRecords,
      pendingSyncs,
      systemUptime: Math.floor(systemUptime / 3600) // hours
    });
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({ message: 'Failed to fetch system health', error: error.message });
  }
});

module.exports = router;
