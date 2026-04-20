/**
 * In-Memory Data Store (Shared Singleton)
 * Acts as the in-memory "database" for the MVP.
 */

let patients = [];
let idCounter = 1000;

// ─── Seed Data (with doctor assignments) ──────────────────────────────────────
patients = [
  {
    id: 'PAT-1001',
    name: 'Abebe Kebede',
    age: 45, gender: 'male', phone: '0911223344',
    symptoms: 'Aggressive chest pain radiating to the left arm',
    triage: { level: 'EMERGENCY', priority: 1, department: 'Cardiology', explanation: 'Life-threatening condition detected.', color: '#ef4444' },
    status: 'WAITING',
    assignedDoctorId: 'DOC-004',
    assignedDoctor:   'Dr. Ruth Alemu',
    assignedRoom:     'CD-1',
    createdAt: new Date(Date.now() - 3_600_000).toISOString()
  },
  {
    id: 'PAT-1002',
    name: 'Tigist Belay',
    age: 28, gender: 'female', phone: '0922334455',
    symptoms: 'High fever 39.5°C and persistent vomiting, severe headache',
    triage: { level: 'URGENT', priority: 2, department: 'General Medicine', explanation: 'Serious condition requiring timely attention.', color: '#f59e0b' },
    status: 'WAITING',
    assignedDoctorId: 'DOC-002',
    assignedDoctor:   'Dr. Hana Girma',
    assignedRoom:     'GM-1',
    createdAt: new Date(Date.now() - 2_400_000).toISOString()
  },
  {
    id: 'PAT-1003',
    name: 'Mulugeta Tesfaye',
    age: 62, gender: 'male', phone: '0933445566',
    symptoms: 'Mild cough and routine health checkup',
    triage: { level: 'NORMAL', priority: 3, department: 'General Medicine', explanation: 'Non-critical condition.', color: '#10b981' },
    status: 'WAITING',
    assignedDoctorId: 'DOC-002',
    assignedDoctor:   'Dr. Hana Girma',
    assignedRoom:     'GM-1',
    createdAt: new Date(Date.now() - 1_200_000).toISOString()
  },
  {
    id: 'PAT-1004',
    name: 'Fatuma Hassen',
    age: 33, gender: 'female', phone: '0944556677',
    symptoms: 'Severe bleeding wound on left hand after kitchen accident',
    triage: { level: 'EMERGENCY', priority: 1, department: 'Emergency', explanation: 'Life-threatening condition detected.', color: '#ef4444' },
    status: 'IN_CONSULTATION',
    assignedDoctorId: 'DOC-001',
    assignedDoctor:   'Dr. Abebu Tadesse',
    assignedRoom:     'ER-1',
    createdAt: new Date(Date.now() - 900_000).toISOString()
  },
  {
    id: 'PAT-1005',
    name: 'Yohannes Girma',
    age: 19, gender: 'male', phone: '0955667788',
    symptoms: 'Sprained ankle from football match, mild pain when walking',
    triage: { level: 'URGENT', priority: 2, department: 'Orthopedics', explanation: 'Moderate injury requiring assessment.', color: '#f59e0b' },
    status: 'WAITING',
    assignedDoctorId: 'DOC-006',
    assignedDoctor:   'Dr. Liya Worku',
    assignedRoom:     'OR-1',
    createdAt: new Date(Date.now() - 600_000).toISOString()
  }
];

// ─── Store API ─────────────────────────────────────────────────────────────────
const getAll        = ()    => patients;
const getNextId     = ()    => `PAT-${++idCounter}`;
const addPatient    = (p)   => { patients.push(p); };
const findById      = (id)  => patients.find(p => p.id === id);
const findIndexById = (id)  => patients.findIndex(p => p.id === id);
const updatePatient = (index, data) => { patients[index] = { ...patients[index], ...data }; };

module.exports = { getAll, getNextId, addPatient, findById, findIndexById, updatePatient };
