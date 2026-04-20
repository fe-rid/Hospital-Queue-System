const Patient = require('../models/Patient');
const Doctor  = require('../models/Doctor');
const { classifyTriage } = require('../utils/triageEngine');
const { refreshQueueStatus } = require('../utils/queueManager');

/**
 * POST /api/patients
 * Register a patient, run triage, set status to PENDING_ASSIGNMENT.
 * No auto-doctor assignment per user request.
 */
exports.registerPatient = async (req, res) => {
  try {
    const { name, age, gender, phone, symptoms } = req.body;

    if (!name || !symptoms) {
      return res.status(400).json({ success: false, message: 'Name and symptoms required' });
    }

    // 1. Classification
    const triage = classifyTriage(symptoms);

    // 2. Create Patient (No doctor assigned yet)
    const patient = new Patient({
      name, age, gender, phone, symptoms,
      triage: {
        level: triage.level,
        department: triage.department,
        explanation: triage.explanation,
        priority: triage.priority
      },
      status: 'PENDING_ASSIGNMENT'
    });

    await patient.save();

    // 3. Recalculate queue metadata
    await refreshQueueStatus();

    res.status(201).json({
      success: true,
      message: 'Registration successful. Waiting for Admin assignment.',
      patientId: patient._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/patients/assign/:id
 * Admin manually assigns a doctor to a patient.
 */
exports.manualAssignDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorId } = req.body;

    const patient = await Patient.findById(id);
    const doctor  = await Doctor.findById(doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({ success: false, message: 'Patient or Doctor not found' });
    }

    // Update patient record
    patient.assignedDoctorId = doctor._id.toString();
    patient.assignedDoctor   = doctor.name;
    patient.assignedRoom     = doctor.roomNumber;
    patient.status           = 'WAITING';
    await patient.save();

    // Increment doctor workload
    doctor.activePatients += 1;
    await doctor.save();

    // Refresh queue metadata
    await refreshQueueStatus();

    res.json({ success: true, message: `Patient assigned to ${doctor.name} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/patients
 */
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json({ success: true, count: patients.length, patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/patients/history/:id
 */
exports.getPatientHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const current = await Patient.findById(id).catch(() => null);
    const query = { $or: [ { _id: id }, { phone: current?.phone || 'NON_EXISTENT' } ] };
    const history = await Patient.find(query).sort({ createdAt: -1 });
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/patients/:id
 */
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/patients/serve/:id
 */
exports.servePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Not found' });

    // Decrement doctor workload if assigned
    if (patient.assignedDoctorId) {
      await Doctor.findByIdAndUpdate(patient.assignedDoctorId, { $inc: { activePatients: -1, completedToday: 1 } });
    }

    patient.status = 'SERVED';
    patient.servedAt = new Date();
    patient.queuePosition = null;
    patient.estimatedWait = 'COMPLETE';
    await patient.save();

    await refreshQueueStatus();
    res.json({ success: true, message: 'Patient served' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
