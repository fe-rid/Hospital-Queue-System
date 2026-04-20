const express = require('express');
const router  = express.Router();

const {
  registerPatient,
  getAllPatients,
  getPatientById,
  servePatient,
  getPatientHistory,
  manualAssignDoctor
} = require('../controllers/patientController');

/**
 * POST /api/patients/assign/:id
 * Manually assign a doctor (Admin action).
 */
router.post('/assign/:id', manualAssignDoctor);

/**
 * POST /api/patients
 * Register a new patient and run the triage engine.
 */
router.post('/', registerPatient);

/**
 * GET /api/patients
 * Retrieve all patients (both WAITING and SERVED).
 */
router.get('/', getAllPatients);

/**
 * GET /api/patients/history/:id
 * Retrieve visit history for a specific patient.
 */
router.get('/history/:id', getPatientHistory);

/**
 * GET /api/patients/:id
 * Retrieve a single patient by their ID.
 */
router.get('/:id', getPatientById);

/**
 * POST /api/patients/serve/:id
 * Mark a specific patient as SERVED and update the queue.
 */
router.post('/serve/:id', servePatient);

module.exports = router;
