const mongoose = require('mongoose');
const Doctor   = require('./models/Doctor');
const path     = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const doctors = [
  { name: 'Dr. Abebu Tadesse',  email: 'abebu@smarthealth.et',  department: 'Emergency',        roomNumber: 'ER-1' },
  { name: 'Dr. Hana Girma',     email: 'hana@smarthealth.et',   department: 'General Medicine', roomNumber: 'GM-1' },
  { name: 'Dr. Samuel Bekele',  email: 'samuel@smarthealth.et', department: 'General Medicine', roomNumber: 'GM-2' },
  { name: 'Dr. Ruth Alemu',     email: 'ruth@smarthealth.et',   department: 'Cardiology',       roomNumber: 'CD-1' },
  { name: 'Dr. Michael Tesfaye',email: 'michael@smarthealth.et',department: 'Pediatrics',       roomNumber: 'PD-1' },
  { name: 'Dr. Liya Worku',     email: 'liya@smarthealth.et',   department: 'Orthopedics',       roomNumber: 'OR-1' }
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Seeding doctors...');
    
    // Clear existing
    await Doctor.deleteMany({});
    
    // Insert new
    await Doctor.insertMany(doctors);
    
    console.log('✅ Doctors seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDoctors();
