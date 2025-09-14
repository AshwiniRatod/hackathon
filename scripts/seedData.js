const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');
const HealthRecord = require('../models/HealthRecord');
const Prescription = require('../models/Prescription');
const SOSAlert = require('../models/SOSAlert');
const ASHAReport = require('../models/ASHAReport');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nabha_telemedicine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('Starting seed data creation...');

    // Clear existing data
    await User.deleteMany({});
    await Medicine.deleteMany({});
    await Pharmacy.deleteMany({});
    await HealthRecord.deleteMany({});
    await Prescription.deleteMany({});
    await SOSAlert.deleteMany({});
    await ASHAReport.deleteMany({});

    console.log('Cleared existing data');

    // Create medicines
    const medicines = [
      {
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        manufacturer: 'Sun Pharma',
        category: 'painkiller',
        dosageForms: ['tablet'],
        strengths: ['500mg'],
        isPrescriptionRequired: false
      },
      {
        name: 'Amoxicillin 250mg',
        genericName: 'Amoxicillin',
        manufacturer: 'Cipla',
        category: 'antibiotic',
        dosageForms: ['capsule'],
        strengths: ['250mg'],
        isPrescriptionRequired: true
      },
      {
        name: 'Metformin 500mg',
        genericName: 'Metformin',
        manufacturer: 'Dr. Reddy\'s',
        category: 'diabetes',
        dosageForms: ['tablet'],
        strengths: ['500mg'],
        isPrescriptionRequired: true
      },
      {
        name: 'Cetirizine 10mg',
        genericName: 'Cetirizine',
        manufacturer: 'Lupin',
        category: 'antihistamine',
        dosageForms: ['tablet'],
        strengths: ['10mg'],
        isPrescriptionRequired: false
      },
      {
        name: 'Vitamin D3 60000 IU',
        genericName: 'Cholecalciferol',
        manufacturer: 'Zydus',
        category: 'vitamin',
        dosageForms: ['capsule'],
        strengths: ['60000 IU'],
        isPrescriptionRequired: false
      }
    ];

    const createdMedicines = await Medicine.insertMany(medicines);
    console.log('Created medicines');

    // Create admin user
    const admin = new User({
      phone: '9876543210',
      name: 'Admin User',
      email: 'admin@nabha.com',
      role: 'admin',
      password: 'admin123',
      isVerified: true
    });
    await admin.save();
    console.log('Created admin user');

    // Create doctors
    const doctors = [
      {
        phone: '9876543211',
        name: 'Dr. Rajesh Kumar',
        email: 'dr.rajesh@nabha.com',
        role: 'doctor',
        password: 'doctor123',
        specialization: 'General Medicine',
        licenseNumber: 'MED123456',
        experience: 15,
        consultationFee: 500,
        availableSlots: [
          { day: 'monday', startTime: '09:00', endTime: '17:00' },
          { day: 'tuesday', startTime: '09:00', endTime: '17:00' },
          { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
          { day: 'thursday', startTime: '09:00', endTime: '17:00' },
          { day: 'friday', startTime: '09:00', endTime: '17:00' }
        ],
        isVerified: true
      },
      {
        phone: '9876543212',
        name: 'Dr. Priya Sharma',
        email: 'dr.priya@nabha.com',
        role: 'doctor',
        password: 'doctor123',
        specialization: 'Pediatrics',
        licenseNumber: 'MED123457',
        experience: 12,
        consultationFee: 600,
        availableSlots: [
          { day: 'monday', startTime: '10:00', endTime: '18:00' },
          { day: 'tuesday', startTime: '10:00', endTime: '18:00' },
          { day: 'wednesday', startTime: '10:00', endTime: '18:00' },
          { day: 'thursday', startTime: '10:00', endTime: '18:00' },
          { day: 'friday', startTime: '10:00', endTime: '18:00' }
        ],
        isVerified: true
      },
      {
        phone: '9876543213',
        name: 'Dr. Amit Singh',
        email: 'dr.amit@nabha.com',
        role: 'doctor',
        password: 'doctor123',
        specialization: 'Cardiology',
        licenseNumber: 'MED123458',
        experience: 20,
        consultationFee: 800,
        availableSlots: [
          { day: 'monday', startTime: '08:00', endTime: '16:00' },
          { day: 'tuesday', startTime: '08:00', endTime: '16:00' },
          { day: 'wednesday', startTime: '08:00', endTime: '16:00' },
          { day: 'thursday', startTime: '08:00', endTime: '16:00' },
          { day: 'friday', startTime: '08:00', endTime: '16:00' }
        ],
        isVerified: true
      }
    ];

    const createdDoctors = await User.insertMany(doctors);
    console.log('Created doctors');

    // Create ASHA workers
    const ashas = [
      {
        phone: '9876543214',
        name: 'Sunita Devi',
        role: 'asha',
        password: 'asha123',
        ashaId: 'ASHA001',
        assignedVillages: ['Nabha', 'Bhadson', 'Ghuram'],
        isVerified: true
      },
      {
        phone: '9876543215',
        name: 'Kavita Rani',
        role: 'asha',
        password: 'asha123',
        ashaId: 'ASHA002',
        assignedVillages: ['Nabha', 'Dudhansadhan'],
        isVerified: true
      }
    ];

    const createdASHAs = await User.insertMany(ashas);
    console.log('Created ASHA workers');

    // Create patients
    const patients = [
      {
        phone: '9876543216',
        name: 'Ram Singh',
        role: 'patient',
        password: 'patient123',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'male',
        address: {
          village: 'Nabha',
          district: 'Patiala',
          state: 'Punjab',
          pincode: '147201'
        },
        emergencyContact: {
          name: 'Sita Devi',
          phone: '9876543217',
          relation: 'Wife'
        },
        isVerified: true,
        language: 'hi'
      },
      {
        phone: '9876543218',
        name: 'Kiran Kaur',
        role: 'patient',
        password: 'patient123',
        dateOfBirth: new Date('1990-07-22'),
        gender: 'female',
        address: {
          village: 'Bhadson',
          district: 'Patiala',
          state: 'Punjab',
          pincode: '147202'
        },
        emergencyContact: {
          name: 'Harbhajan Singh',
          phone: '9876543219',
          relation: 'Husband'
        },
        isVerified: true,
        language: 'pa'
      },
      {
        phone: '9876543220',
        name: 'Amit Kumar',
        role: 'patient',
        password: 'patient123',
        dateOfBirth: new Date('1978-11-08'),
        gender: 'male',
        address: {
          village: 'Ghuram',
          district: 'Patiala',
          state: 'Punjab',
          pincode: '147203'
        },
        emergencyContact: {
          name: 'Rekha Devi',
          phone: '9876543221',
          relation: 'Sister'
        },
        isVerified: true,
        language: 'en'
      }
    ];

    const createdPatients = await User.insertMany(patients);
    console.log('Created patients');

    // Create pharmacies
    const pharmacies = [
      {
        name: 'Nabha Medical Store',
        owner: 'Jagdish Kumar',
        phone: '9876543222',
        email: 'nabhamedical@gmail.com',
        address: {
          village: 'Nabha',
          district: 'Patiala',
          state: 'Punjab',
          pincode: '147201',
          coordinates: { latitude: 30.3753, longitude: 76.1522 }
        },
        licenseNumber: 'PHAR001',
        medicines: [
          {
            medicineId: createdMedicines[0]._id,
            name: 'Paracetamol 500mg',
            genericName: 'Acetaminophen',
            manufacturer: 'Sun Pharma',
            quantity: 100,
            unit: 'tablets',
            price: 2.50,
            isAvailable: true
          },
          {
            medicineId: createdMedicines[1]._id,
            name: 'Amoxicillin 250mg',
            genericName: 'Amoxicillin',
            manufacturer: 'Cipla',
            quantity: 50,
            unit: 'capsules',
            price: 15.00,
            isAvailable: true
          },
          {
            medicineId: createdMedicines[2]._id,
            name: 'Metformin 500mg',
            genericName: 'Metformin',
            manufacturer: 'Dr. Reddy\'s',
            quantity: 75,
            unit: 'tablets',
            price: 8.00,
            isAvailable: true
          }
        ],
        workingHours: {
          monday: { open: '08:00', close: '20:00', isOpen: true },
          tuesday: { open: '08:00', close: '20:00', isOpen: true },
          wednesday: { open: '08:00', close: '20:00', isOpen: true },
          thursday: { open: '08:00', close: '20:00', isOpen: true },
          friday: { open: '08:00', close: '20:00', isOpen: true },
          saturday: { open: '08:00', close: '18:00', isOpen: true },
          sunday: { open: '09:00', close: '17:00', isOpen: true }
        }
      },
      {
        name: 'Bhadson Pharmacy',
        owner: 'Suresh Chand',
        phone: '9876543223',
        address: {
          village: 'Bhadson',
          district: 'Patiala',
          state: 'Punjab',
          pincode: '147202',
          coordinates: { latitude: 30.3853, longitude: 76.1622 }
        },
        licenseNumber: 'PHAR002',
        medicines: [
          {
            medicineId: createdMedicines[3]._id,
            name: 'Cetirizine 10mg',
            genericName: 'Cetirizine',
            manufacturer: 'Lupin',
            quantity: 80,
            unit: 'tablets',
            price: 3.00,
            isAvailable: true
          },
          {
            medicineId: createdMedicines[4]._id,
            name: 'Vitamin D3 60000 IU',
            genericName: 'Cholecalciferol',
            manufacturer: 'Zydus',
            quantity: 30,
            unit: 'capsules',
            price: 25.00,
            isAvailable: true
          }
        ],
        workingHours: {
          monday: { open: '09:00', close: '19:00', isOpen: true },
          tuesday: { open: '09:00', close: '19:00', isOpen: true },
          wednesday: { open: '09:00', close: '19:00', isOpen: true },
          thursday: { open: '09:00', close: '19:00', isOpen: true },
          friday: { open: '09:00', close: '19:00', isOpen: true },
          saturday: { open: '09:00', close: '17:00', isOpen: true },
          sunday: { open: '10:00', close: '16:00', isOpen: true }
        }
      }
    ];

    const createdPharmacies = await Pharmacy.insertMany(pharmacies);
    console.log('Created pharmacies');

    // Create sample health records
    const healthRecords = [
      {
        patientId: createdPatients[0]._id,
        doctorId: createdDoctors[0]._id,
        visitDate: new Date('2024-01-15'),
        visitType: 'consultation',
        symptoms: [
          { name: 'Fever', severity: 'moderate', duration: '2 days' },
          { name: 'Headache', severity: 'mild', duration: '1 day' }
        ],
        diagnosis: {
          primary: 'Viral Fever',
          secondary: ['Upper Respiratory Infection'],
          notes: 'Patient presents with fever and headache. No signs of bacterial infection.'
        },
        vitalSigns: {
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 85,
          temperature: 101.2,
          weight: 70,
          height: 170,
          bmi: 24.2
        },
        status: 'completed'
      },
      {
        patientId: createdPatients[1]._id,
        doctorId: createdDoctors[1]._id,
        visitDate: new Date('2024-01-16'),
        visitType: 'consultation',
        symptoms: [
          { name: 'Cough', severity: 'severe', duration: '5 days' },
          { name: 'Chest Pain', severity: 'moderate', duration: '2 days' }
        ],
        diagnosis: {
          primary: 'Bronchitis',
          secondary: ['Chest Congestion'],
          notes: 'Patient has persistent cough with chest pain. Prescribed antibiotics.'
        },
        vitalSigns: {
          bloodPressure: { systolic: 110, diastolic: 75 },
          heartRate: 90,
          temperature: 99.8,
          weight: 55,
          height: 160,
          bmi: 21.5
        },
        status: 'completed'
      }
    ];

    const createdHealthRecords = await HealthRecord.insertMany(healthRecords);
    console.log('Created health records');

    // Create sample prescriptions
    const prescriptions = [
      {
        patientId: createdPatients[0]._id,
        doctorId: createdDoctors[0]._id,
        healthRecordId: createdHealthRecords[0]._id,
        prescriptionDate: new Date('2024-01-15'),
        medicines: [
          {
            name: 'Paracetamol 500mg',
            genericName: 'Acetaminophen',
            dosage: '500mg',
            frequency: 'Every 6 hours',
            duration: '3 days',
            instructions: 'Take with food',
            quantity: 18,
            unit: 'tablets'
          }
        ],
        instructions: 'Take rest and drink plenty of fluids. Return if symptoms worsen.',
        followUpDate: new Date('2024-01-18'),
        status: 'active'
      },
      {
        patientId: createdPatients[1]._id,
        doctorId: createdDoctors[1]._id,
        healthRecordId: createdHealthRecords[1]._id,
        prescriptionDate: new Date('2024-01-16'),
        medicines: [
          {
            name: 'Amoxicillin 250mg',
            genericName: 'Amoxicillin',
            dosage: '250mg',
            frequency: 'Three times daily',
            duration: '7 days',
            instructions: 'Take with food',
            quantity: 21,
            unit: 'capsules'
          },
          {
            name: 'Cetirizine 10mg',
            genericName: 'Cetirizine',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '5 days',
            instructions: 'Take at bedtime',
            quantity: 5,
            unit: 'tablets'
          }
        ],
        instructions: 'Complete the full course of antibiotics. Avoid cold foods.',
        followUpDate: new Date('2024-01-23'),
        status: 'active'
      }
    ];

    const createdPrescriptions = await Prescription.insertMany(prescriptions);
    console.log('Created prescriptions');

    // Update health records with prescription references
    await HealthRecord.findByIdAndUpdate(createdHealthRecords[0]._id, {
      prescription: createdPrescriptions[0]._id
    });
    await HealthRecord.findByIdAndUpdate(createdHealthRecords[1]._id, {
      prescription: createdPrescriptions[1]._id
    });

    // Create sample ASHA reports
    const ashaReports = [
      {
        ashaId: createdASHAs[0]._id,
        patientId: createdPatients[0]._id,
        reportType: 'general',
        visitDate: new Date('2024-01-14'),
        generalData: {
          symptoms: ['Fever', 'Weakness'],
          vitalSigns: {
            temperature: 100.5,
            heartRate: 88,
            bloodPressure: { systolic: 125, diastolic: 82 }
          },
          diagnosis: 'Fever - likely viral',
          treatment: 'Rest and fluids',
          referralRequired: true,
          referralReason: 'Persistent fever'
        },
        status: 'submitted'
      },
      {
        ashaId: createdASHAs[1]._id,
        patientId: createdPatients[1]._id,
        reportType: 'maternal',
        visitDate: new Date('2024-01-13'),
        maternalData: {
          pregnancyWeek: 28,
          bloodPressure: { systolic: 110, diastolic: 70 },
          weight: 58,
          hemoglobin: 11.2,
          complications: [],
          nextVisitDate: new Date('2024-01-27'),
          notes: 'Normal pregnancy progression'
        },
        status: 'submitted'
      }
    ];

    await ASHAReport.insertMany(ashaReports);
    console.log('Created ASHA reports');

    // Create sample SOS alert
    const sosAlert = new SOSAlert({
      patientId: createdPatients[0]._id,
      emergencyType: 'medical',
      description: 'Severe chest pain and difficulty breathing',
      location: {
        coordinates: { latitude: 30.3753, longitude: 76.1522 },
        address: 'Nabha, Patiala, Punjab',
        accuracy: 10
      },
      status: 'pending',
      priority: 'critical',
      assignedTo: {
        doctorId: createdDoctors[2]._id,
        ashaId: createdASHAs[0]._id
      }
    });

    await sosAlert.save();
    console.log('Created SOS alert');

    console.log('Seed data creation completed successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: 9876543210 / admin123');
    console.log('Doctor: 9876543211 / doctor123');
    console.log('ASHA: 9876543214 / asha123');
    console.log('Patient: 9876543216 / patient123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating seed data:', error);
    process.exit(1);
  }
};

seedData();
