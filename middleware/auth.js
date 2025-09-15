const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const Patient = require('../models/Patient');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, userType = 'user' } = decoded;
    
    let user;
    
    // Find user based on userType
    if (userType === 'doctor') {
      user = await Doctor.findById(userId).select('-password');
      if (user) {
        user = { ...user.toObject(), role: 'doctor' };
      }
    } else if (userType === 'admin') {
      user = await Admin.findById(userId).select('-password');
      if (user) {
        user = { ...user.toObject(), role: 'admin' };
      }
    } else if (userType === 'patient') {
      user = await Patient.findById(userId).select('-password');
      if (user) {
        user = { ...user.toObject(), role: 'patient' };
      }
    } else {
      user = await User.findById(userId).select('-password');
    }
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

// Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId, userType = 'user' } = decoded;
      
      let user;
      
      // Find user based on userType
      if (userType === 'doctor') {
        user = await Doctor.findById(userId).select('-password');
        if (user) {
          user = { ...user.toObject(), role: 'doctor' };
        }
      } else if (userType === 'admin') {
        user = await Admin.findById(userId).select('-password');
        if (user) {
          user = { ...user.toObject(), role: 'admin' };
        }
      } else if (userType === 'patient') {
        user = await Patient.findById(userId).select('-password');
        if (user) {
          user = { ...user.toObject(), role: 'patient' };
        }
      } else {
        user = await User.findById(userId).select('-password');
      }
      
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Ignore token errors for optional auth
    next();
  }
};module.exports = {
  authenticateToken,
  authorize,
  optionalAuth
};
