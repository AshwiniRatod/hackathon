const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');

// Load environment variables
require('dotenv').config();

async function migrateUserData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telemedicine');
    console.log('Connected to MongoDB');

    // Find all doctors in the User collection
    const doctors = await User.find({ role: 'doctor' });
    console.log(`Found ${doctors.length} doctors to migrate`);

    // Migrate doctors
    for (const doctorData of doctors) {
      const doctorObj = doctorData.toObject();
      delete doctorObj._id;
      delete doctorObj.role;
      delete doctorObj.__v;

      // Create new doctor document
      const newDoctor = new Doctor(doctorObj);
      await newDoctor.save();
      console.log(`Migrated doctor: ${doctorData.name} (ID: ${newDoctor._id})`);
    }

    // Find all admins in the User collection
    const admins = await User.find({ role: 'admin' });
    console.log(`Found ${admins.length} admins to migrate`);

    // Migrate admins
    for (const adminData of admins) {
      const adminObj = adminData.toObject();
      delete adminObj._id;
      delete adminObj.role;
      delete adminObj.__v;

      // Set default admin permissions and level
      adminObj.adminLevel = adminObj.adminLevel || 'admin';
      adminObj.permissions = adminObj.permissions || [
        'manage_users',
        'manage_doctors',
        'manage_asha',
        'manage_pharmacies',
        'view_reports',
        'manage_emergency'
      ];

      // Create new admin document
      const newAdmin = new Admin(adminObj);
      await newAdmin.save();
      console.log(`Migrated admin: ${adminData.name} (ID: ${newAdmin._id})`);
    }

    // Remove doctors and admins from User collection
    const deleteResult = await User.deleteMany({ role: { $in: ['doctor', 'admin'] } });
    console.log(`Removed ${deleteResult.deletedCount} doctors and admins from User collection`);

    // Update remaining users to ensure they only have patient/asha roles
    const remainingUsers = await User.find({ role: { $nin: ['patient', 'asha'] } });
    if (remainingUsers.length > 0) {
      console.log(`Found ${remainingUsers.length} users with invalid roles, updating to 'patient'`);
      await User.updateMany(
        { role: { $nin: ['patient', 'asha'] } },
        { $set: { role: 'patient' } }
      );
    }

    console.log('\n--- Migration Summary ---');
    console.log(`✅ Migrated ${doctors.length} doctors to Doctor collection`);
    console.log(`✅ Migrated ${admins.length} admins to Admin collection`);
    console.log(`✅ Cleaned up ${deleteResult.deletedCount} records from User collection`);
    
    // Final counts
    const [userCount, doctorCount, adminCount] = await Promise.all([
      User.countDocuments(),
      Doctor.countDocuments(),
      Admin.countDocuments()
    ]);
    
    console.log('\n--- Final Collection Counts ---');
    console.log(`Users (patients/ASHA): ${userCount}`);
    console.log(`Doctors: ${doctorCount}`);
    console.log(`Admins: ${adminCount}`);
    
    console.log('\n🎉 Migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Handle script termination
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT, closing connections...');
  await mongoose.disconnect();
  process.exit(0);
});

// Run the migration
if (require.main === module) {
  console.log('Starting user data migration...');
  console.log('This will move doctors and admins from User collection to separate collections');
  console.log('Press Ctrl+C to cancel\n');
  
  // Give user 5 seconds to cancel
  setTimeout(() => {
    migrateUserData();
  }, 5000);
}

module.exports = migrateUserData;