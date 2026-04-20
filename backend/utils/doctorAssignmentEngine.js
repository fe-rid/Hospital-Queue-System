/**
 * Smart Doctor Assignment Engine (MongoDB Version)
 */
const Doctor = require('../models/Doctor');

const DEPARTMENT_RULES = [
  { keywords: ['chest pain', 'heart', 'cardiac', 'palpitation', 'arrhythmia'], department: 'Cardiology' },
  { keywords: ['bleeding', 'unconscious', 'not breathing', 'stroke', 'trauma', 'accident', 'choking', 'overdose'], department: 'Emergency' },
  { keywords: ['child', 'infant', 'baby', 'toddler', 'pediatric', 'kid'], department: 'Pediatrics' },
  { keywords: ['fracture', 'broken', 'bone', 'sprain', 'joint', 'ankle', 'knee', 'ortho'], department: 'Orthopedics' },
  { keywords: ['skin', 'rash', 'itch', 'derma', 'acne', 'psoriasis', 'eczema'], department: 'Dermatology' },
];

const mapSymptomsToDepartment = (symptoms = '', triageLevel = 'NORMAL') => {
  if (triageLevel === 'EMERGENCY') return 'Emergency';
  const s = symptoms.toLowerCase();
  for (const rule of DEPARTMENT_RULES) {
    if (rule.keywords.some(kw => s.includes(kw))) return rule.department;
  }
  return 'General Medicine';
};

/**
 * findBestDoctor - Async DB search
 */
const findBestDoctor = async (department) => {
  // 1. Try target department first
  let doctor = await Doctor.findOne({ department, status: 'AVAILABLE' }).sort({ activePatients: 1 });
  
  if (!doctor && department !== 'General Medicine') {
    // 2. Fall back to General Medicine
    doctor = await Doctor.findOne({ department: 'General Medicine', status: 'AVAILABLE' }).sort({ activePatients: 1 });
  }

  if (!doctor) {
    // 3. Any available doctor
    doctor = await Doctor.findOne({ status: 'AVAILABLE' }).sort({ activePatients: 1 });
  }

  return doctor;
};

/**
 * assignDoctor - Async workflow
 */
const assignDoctor = async (symptoms, triageLevel) => {
  const department = mapSymptomsToDepartment(symptoms, triageLevel);
  const doctor = await findBestDoctor(department);

  if (!doctor) return null;

  // Atomically update doctor status
  doctor.activePatients += 1;
  if (doctor.activePatients >= 5) doctor.status = 'BUSY';
  await doctor.save();

  return {
    doctorId:   doctor._id.toString(),
    doctorName: doctor.name,
    department: doctor.department,
    roomNumber: doctor.roomNumber
  };
};

module.exports = { assignDoctor, mapSymptomsToDepartment, findBestDoctor };
