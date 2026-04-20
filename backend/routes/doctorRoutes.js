const express = require('express');
const router  = express.Router();

const {
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
} = require('../controllers/doctorController');

// Auth
router.post('/login',    loginDoctor);

// CRUD
router.get  ('/',        getAllDoctors);
router.post ('/',        createDoctor);
router.get  ('/:id',     getDoctorById);

// Queue & workflow
router.get  ('/:id/queue',                    getDoctorQueue);
router.get  ('/:id/stats',                    getDoctorStats);
router.post ('/:id/call-next',                callNextPatient);
router.post ('/:id/start/:patientId',         startConsultation);
router.post ('/:id/complete/:patientId',      completeConsultation);
router.post ('/:id/refer/:patientId',         referPatient);

// Status toggle
router.patch('/:id/status',                   updateDoctorStatus);

module.exports = router;
