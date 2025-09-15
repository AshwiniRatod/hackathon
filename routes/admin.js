const express = require('express');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const HealthRecord = require('../models/HealthRecord');
const Prescription = require('../models/Prescription');
const SOSAlert = require('../models/SOSAlert');
const ASHAReport = require('../models/ASHAReport');
const Pharmacy = require('../models/Pharmacy');

const router = express.Router();

// Generate JWT token
const generateToken = (userId, userType = 'admin') => {
  return jwt.sign({ userId, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Admin registration endpoint
router.post('/register', async (req, res) => {
  try {
    const {
      phone,
      name,
      email,
      password,
      adminLevel = 'admin',
      permissions = ['view_reports'],
      department,
      employeeId,
      language = 'en'
    } = req.body;

    // Validate required fields
    if (!phone || !name || !email || !password) {
      return res.status(400).json({
        message: 'All required fields must be provided',
        required: ['phone', 'name', 'email', 'password']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Validate admin level
    const validAdminLevels = ['super_admin', 'admin', 'moderator'];
    if (!validAdminLevels.includes(adminLevel)) {
      return res.status(400).json({
        message: 'Invalid admin level',
        validLevels: validAdminLevels
      });
    }

    // Validate permissions
    const validPermissions = [
      'manage_users',
      'manage_doctors',
      'manage_asha',
      'manage_pharmacies',
      'view_reports',
      'manage_emergency',
      'system_config'
    ];
    const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        message: 'Invalid permissions',
        invalidPermissions,
        validPermissions
      });
    }

    // Check if admin already exists with phone or email
    const existingAdminByPhone = await Admin.findOne({ phone });
    if (existingAdminByPhone) {
      return res.status(400).json({ message: 'Admin already exists with this phone number' });
    }

    const existingAdminByEmail = await Admin.findOne({ email });
    if (existingAdminByEmail) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    // Create new admin
    const admin = new Admin({
      phone,
      name,
      email,
      password,
      adminLevel,
      permissions,
      department: department || undefined,
      employeeId: employeeId || undefined,
      language,
      isVerified: true, // Admins are verified by default
      isActive: true
    });

    await admin.save();

    // Generate OTP for verification (optional step)
    const otp = admin.generateOTP();
    await admin.save();

    // Generate access token for immediate login
    const accessToken = generateToken(admin._id, 'admin');

    // In development, return OTP for testing
    console.log(`Admin registration OTP for ${phone}: ${otp}`);

    res.status(201).json({
      message: 'Admin registered successfully',
      adminId: admin._id,
      adminLevel: admin.adminLevel,
      permissions: admin.permissions,
      accessToken: accessToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRE || '7d',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        adminLevel: admin.adminLevel,
        permissions: admin.permissions,
        department: admin.department,
        employeeId: admin.employeeId,
        language: admin.language
      },
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      message: 'Admin registration failed',
      error: error.message
    });
  }
});

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
      Doctor.countDocuments(),
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
    
    let users = [];
    let total = 0;
    
    if (role === 'doctor') {
      // Get only doctors
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      
      users = await Doctor.find(query)
        .select('-password -otp')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      
      // Add role field for consistency
      users = users.map(user => ({ ...user.toObject(), role: 'doctor' }));
      total = await Doctor.countDocuments(query);
      
    } else if (role === 'admin') {
      // Get only admins
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      
      users = await Admin.find(query)
        .select('-password -otp')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      
      // Add role field for consistency
      users = users.map(user => ({ ...user.toObject(), role: 'admin' }));
      total = await Admin.countDocuments(query);
      
    } else {
      // Get users (patients and ASHA) from User collection
      let query = { role: { $in: ['patient', 'asha'] } };
      
      if (role && ['patient', 'asha'].includes(role)) {
        query.role = role;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      users = await User.find(query)
        .select('-password -otp')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      total = await User.countDocuments(query);
      
      // If no specific role is requested, also get doctors and admins
      if (!role) {
        const [doctors, admins] = await Promise.all([
          Doctor.find(search ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { phone: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ]
          } : {})
            .select('-password -otp')
            .sort({ createdAt: -1 }),
          Admin.find(search ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { phone: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ]
          } : {})
            .select('-password -otp')
            .sort({ createdAt: -1 })
        ]);
        
        // Add role field and combine all users
        const doctorsWithRole = doctors.map(user => ({ ...user.toObject(), role: 'doctor' }));
        const adminsWithRole = admins.map(user => ({ ...user.toObject(), role: 'admin' }));
        
        const allUsers = [...users, ...doctorsWithRole, ...adminsWithRole];
        allUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Apply pagination to combined results
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        users = allUsers.slice(startIndex, endIndex);
        
        total = allUsers.length;
      }
    }

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
    const { isActive, userType } = req.body;
    let user;

    // Try to find and update user based on userType or search all collections
    if (userType === 'doctor') {
      user = await Doctor.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true }
      ).select('-password -otp');
    } else if (userType === 'admin') {
      user = await Admin.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true }
      ).select('-password -otp');
    } else {
      // Try User collection first (patients, ASHA)
      user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true }
      ).select('-password -otp');
      
      // If not found, try Doctor collection
      if (!user) {
        user = await Doctor.findByIdAndUpdate(
          req.params.id,
          { isActive },
          { new: true }
        ).select('-password -otp');
        
        if (user) {
          user = { ...user.toObject(), role: 'doctor' };
        }
      }
      
      // If still not found, try Admin collection
      if (!user) {
        user = await Admin.findByIdAndUpdate(
          req.params.id,
          { isActive },
          { new: true }
        ).select('-password -otp');
        
        if (user) {
          user = { ...user.toObject(), role: 'admin' };
        }
      }
    }

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
      // Count users from all collections
      Promise.all([
        User.countDocuments(),
        Doctor.countDocuments(),
        Admin.countDocuments()
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
      // Count active users from all collections
      Promise.all([
        User.countDocuments({ isActive: true }),
        Doctor.countDocuments({ isActive: true }),
        Admin.countDocuments({ isActive: true })
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
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
