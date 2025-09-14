const mongoose = require('mongoose');
const User = require('./models/User');

async function fixDoctorPasswords() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/nabha_telemedicine_clean');
    console.log('✅ Connected to MongoDB');
    console.log('🔧 Fixing doctor passwords...');
    
    const doctors = await User.find({role: 'doctor'});
    console.log(`📊 Found ${doctors.length} doctors`);
    
    for (let doctor of doctors) {
      console.log(`👤 Processing ${doctor.name} (${doctor.email})`);
      console.log(`🔒 Current password: ${doctor.password.substring(0, 10)}...`);
      
      // Check if password is already hashed
      if (!doctor.password.startsWith('$2')) {
        console.log(`🔒 Hashing password for ${doctor.name}...`);
        doctor.password = 'doctor123'; // Set plain password
        await doctor.save(); // This will trigger the pre-save hook
        console.log(`✅ Password updated for ${doctor.name}`);
        
        // Verify the password was hashed
        const updatedDoctor = await User.findById(doctor._id);
        console.log(`🔍 New password hash: ${updatedDoctor.password.substring(0, 20)}...`);
      } else {
        console.log(`✅ Password already hashed for ${doctor.name}`);
      }
    }
    
    console.log('🎉 All doctor passwords fixed!');
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    mongoose.disconnect();
  }
}

fixDoctorPasswords();