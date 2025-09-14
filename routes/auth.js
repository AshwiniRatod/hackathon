const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register user
router.post('/register', async (req, res) => {
  try {
    const { phone, name, role, password, ...additionalData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    // Create new user
    const user = new User({
      phone,
      name,
      role,
      password,
      ...additionalData
    });

    await user.save();

    // Generate OTP for verification
    const otp = user.generateOTP();
    await user.save();

    // In production, send OTP via SMS
    console.log(`OTP for ${phone}: ${otp}`);

    res.status(201).json({
      message: 'User registered successfully. Please verify with OTP.',
      userId: user._id,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    const otp = user.generateOTP();
    await user.save();

    // In production, send OTP via SMS
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Failed to resend OTP', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    let user;
    
    // Check if this is email-based login
    if (email) {
      // Look for user with email (could be admin or doctor)
      user = await User.findOne({ email: email });
      
      if (user) {
        // Verify password using bcrypt
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          return res.status(401).json({ 
            success: false,
            message: 'Invalid email or password' 
          });
        }
      } else {
        // Fallback to environment variables for admin only
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
          // Create admin user if doesn't exist
          user = new User({
            email: process.env.ADMIN_EMAIL,
            name: 'System Admin',
            role: 'admin',
            phone: '9999999999',
            password: process.env.ADMIN_PASSWORD,
            isVerified: true
          });
          await user.save();
        } else {
          return res.status(401).json({ 
            success: false,
            message: 'Invalid email or password' 
          });
        }
      }
    } else if (phone) {
      // Regular user login with phone
      user = await User.findOne({ phone });
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }

      if (!user.isVerified) {
        return res.status(401).json({ 
          success: false,
          message: 'Please verify your phone number first' 
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }
    } else {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide phone number or email' 
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed', 
      error: error.message 
    });
  }
});

// Admin Login (using email instead of phone)
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if this is the admin user from environment
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Create/find admin user
      let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
      
      if (!adminUser) {
        // Create admin user if doesn't exist
        adminUser = new User({
          email: process.env.ADMIN_EMAIL,
          name: 'System Admin',
          role: 'admin',
          phone: '9999999999', // dummy phone for admin
          password: process.env.ADMIN_PASSWORD,
          isVerified: true
        });
        await adminUser.save();
      }

      adminUser.lastLogin = new Date();
      await adminUser.save();

      const token = generateToken(adminUser._id);

      res.json({
        message: 'Admin login successful',
        token,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          isVerified: true
        }
      });
    } else {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Admin login failed', error: error.message });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp');
    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password update through this route
    delete updates.phone; // Don't allow phone update through this route
    delete updates.role; // Don't allow role update through this route

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -otp');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Password change failed', error: error.message });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
