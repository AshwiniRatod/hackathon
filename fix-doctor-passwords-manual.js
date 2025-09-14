const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function fixDoctorPasswordsManually() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/nabha_telemedicine_clean');
    console.log('✅ Connected to MongoDB');
    console.log('🔧 Manually hashing doctor passwords...');
    
    const doctors = await User.find({role: 'doctor'});
    console.log(`📊 Found ${doctors.length} doctors`);
    
    for (let doctor of doctors) {
      console.log(`👤 Processing ${doctor.name} (${doctor.email})`);
      console.log(`🔒 Current password: ${doctor.password}`);
      
      // Manually hash the password
      const hashedPassword = await bcrypt.hash('doctor123', 12);
      console.log(`🔒 Hashed password: ${hashedPassword.substring(0, 20)}...`);
      
      // Update directly using updateOne to bypass middleware
      await User.updateOne(
        { _id: doctor._id },
        { password: hashedPassword }
      );
      
      console.log(`✅ Password manually updated for ${doctor.name}`);
    }
    
    console.log('🎉 All doctor passwords manually fixed!');
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    mongoose.disconnect();
  }
}

fixDoctorPasswordsManually();