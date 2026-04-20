/**
 * Doctor In-Memory Data Store (Singleton)
 * Mirrors the patient store pattern for the MVP.
 */

let doctors = [];
let doctorIdCounter = 100;

// ─── Seed Doctors ─────────────────────────────────────────────────────────────
doctors = [
  {
    id: 'DOC-001',
    name: 'Dr. Abebu Tadesse',
    email: 'abebu@smarthealth.et',
    password: 'doctor123',
    department: 'Emergency',
    roomNumber: 'ER-1',
    status: 'AVAILABLE',
    activePatients: 0,
    completedToday: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: 'DOC-002',
    name: 'Dr. Hana Girma',
    email: 'hana@smarthealth.et',
    password: 'doctor123',
    department: 'General Medicine',
    roomNumber: 'GM-1',
    status: 'AVAILABLE',
    activePatients: 2,
    completedToday: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'DOC-003',
    name: 'Dr. Samuel Bekele',
    email: 'samuel@smarthealth.et',
    password: 'doctor123',
    department: 'General Medicine',
    roomNumber: 'GM-2',
    status: 'BUSY',
    activePatients: 4,
    completedToday: 8,
    createdAt: new Date().toISOString()
  },
  {
    id: 'DOC-004',
    name: 'Dr. Ruth Alemu',
    email: 'ruth@smarthealth.et',
    password: 'doctor123',
    department: 'Cardiology',
    roomNumber: 'CD-1',
    status: 'AVAILABLE',
    activePatients: 1,
    completedToday: 4,
    createdAt: new Date().toISOString()
  },
  {
    id: 'DOC-005',
    name: 'Dr. Michael Tesfaye',
    email: 'michael@smarthealth.et',
    password: 'doctor123',
    department: 'Pediatrics',
    roomNumber: 'PD-1',
    status: 'AVAILABLE',
    activePatients: 0,
    completedToday: 6,
    createdAt: new Date().toISOString()
  },
  {
    id: 'DOC-006',
    name: 'Dr. Liya Worku',
    email: 'liya@smarthealth.et',
    password: 'doctor123',
    department: 'Orthopedics',
    roomNumber: 'OR-1',
    status: 'AVAILABLE',
    activePatients: 1,
    completedToday: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: 'DOC-007',
    name: 'Dr. Fiker Haile',
    email: 'fiker@smarthealth.et',
    password: 'doctor123',
    department: 'Dermatology',
    roomNumber: 'DM-1',
    status: 'OFF_DUTY',
    activePatients: 0,
    completedToday: 0,
    createdAt: new Date().toISOString()
  }
];

// ─── Store API ─────────────────────────────────────────────────────────────────

const getAll        = ()    => doctors;
const getNextId     = ()    => `DOC-${++doctorIdCounter}`;
const findById      = (id)  => doctors.find(d => d.id === id);
const findByEmail   = (email) => doctors.find(d => d.email === email);
const findIndexById = (id)  => doctors.findIndex(d => d.id === id);
const addDoctor     = (d)   => { doctors.push(d); };
const updateDoctor  = (index, data) => {
  doctors[index] = { ...doctors[index], ...data };
};
const getByDepartment = (dept) => doctors.filter(d =>
  d.department.toLowerCase() === dept.toLowerCase()
);

module.exports = {
  getAll,
  getNextId,
  findById,
  findByEmail,
  findIndexById,
  addDoctor,
  updateDoctor,
  getByDepartment
};
