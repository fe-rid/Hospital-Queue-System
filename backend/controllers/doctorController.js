const Doctor  = require('../models/Doctor');
const Patient = require('../models/Patient');
const { sortQueue } = require('../utils/queueSorter');

// ─── GET /api/doctors ────────────────────────────────────────────────────────
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    return res.json({ success: true, doctors });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/doctors ───────────────────────────────────────────────────────
const createDoctor = async (req, res) => {
  try {
    const { name, email, password, department, roomNumber } = req.body;
    if (!name || !email || !department) {
      return res.status(400).json({ success: false, message: 'Name, email, and department are required.' });
    }
    
    const existing = await Doctor.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered.' });

    const doctor = new Doctor({ name, email, password, department, roomNumber: roomNumber || 'TBD' });
    await doctor.save();

    return res.status(201).json({ success: true, doctor });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/doctors/login ─────────────────────────────────────────────────
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor || doctor.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    return res.json({
      success: true,
      doctorId: doctor._id,
      doctor: doctor.toJSON()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/doctors/:id ─────────────────────────────────────────────────────
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });
    return res.json({ success: true, doctor });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/doctors/:id/queue ──────────────────────────────────────────────
const getDoctorQueue = async (req, res) => {
  try {
    const assigned = await Patient.find({
      assignedDoctorId: req.params.id,
      status: { $in: ['WAITING', 'CALLED', 'IN_CONSULTATION'] }
    });

    const sorted = sortQueue(assigned);
    return res.json({ success: true, queue: sorted, count: sorted.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/doctors/:id/stats ──────────────────────────────────────────────
const getDoctorStats = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });

    const waiting      = await Patient.countDocuments({ assignedDoctorId: req.params.id, status: 'WAITING' });
    const inConsult    = await Patient.findOne({ assignedDoctorId: req.params.id, status: 'IN_CONSULTATION' });
    const completedToday = await Patient.countDocuments({ assignedDoctorId: req.params.id, status: 'SERVED' }) + doctor.completedToday;

    return res.json({
      success: true,
      stats: {
        doctorName:    doctor.name,
        department:    doctor.department,
        roomNumber:    doctor.roomNumber,
        status:        doctor.status,
        waiting,
        inConsultation: inConsult,
        completedToday
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/doctors/:id/call-next ─────────────────────────────────────────
const callNextPatient = async (req, res) => {
  try {
    const next = await Patient.findOne({ assignedDoctorId: req.params.id, status: 'WAITING' }).sort({ queuePosition: 1 });
    if (!next) return res.status(404).json({ success: false, message: 'No patients in queue.' });

    next.status = 'CALLED';
    await next.save();

    return res.json({ success: true, message: `${next.name} has been called.`, patient: next });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/doctors/:id/start/:patientId ──────────────────────────────────
const startConsultation = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });

    patient.status = 'IN_CONSULTATION';
    await patient.save();

    await Doctor.findByIdAndUpdate(req.params.id, { status: 'BUSY' });

    return res.json({ success: true, patient });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/doctors/:id/complete/:patientId ───────────────────────────────
const completeConsultation = async (req, res) => {
  try {
    const { notes, prescription } = req.body;
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });

    patient.status = 'SERVED';
    patient.servedAt = new Date();
    patient.notes = notes || '';
    patient.prescription = prescription || '';
    await patient.save();

    const doctor = await Doctor.findById(req.params.id);
    const newCount = Math.max(0, doctor.activePatients - 1);
    doctor.activePatients = newCount;
    doctor.status = newCount === 0 ? 'AVAILABLE' : 'AVAILABLE'; // Doctors usually return to AVAILABLE after one patient
    await doctor.save();

    return res.json({ success: true, message: 'Consultation completed.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/doctors/:id/refer/:patientId ───────────────────────────────────
const referPatient = async (req, res) => {
  try {
    const { targetDepartment } = req.body;
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });

    patient.status = 'PENDING_ASSIGNMENT';
    patient.assignedDoctorId = null;
    patient.assignedDoctor = null;
    patient.assignedRoom = null;
    patient.triage = { ...patient.triage, department: targetDepartment };
    await patient.save();

    // Decrement current doctor workload
    await Doctor.findByIdAndUpdate(req.params.id, { $inc: { activePatients: -1 } });

    return res.json({ success: true, message: `Patient referred to ${targetDepartment}. Waiting for Admin assignment.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PATCH /api/doctors/:id/status ───────────────────────────────────────────
const updateDoctorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Doctor.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ success: false, message: 'Doctor not found.' });
    return res.json({ success: true, doctor: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  createDoctor,
  loginDoctor,
  getDoctorById,
  getDoctorQueue,
  getDoctorStats,
  callNextPatient,
  startConsultation,
  completeConsultation,
  referPatient,
  updateDoctorStatus
};
