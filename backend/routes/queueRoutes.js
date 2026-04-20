const express = require('express');
const router  = express.Router();

const { 
  getQueue, 
  getStats, 
  callPatient, 
  startConsultation 
} = require('../controllers/queueController');

router.get('/',      getQueue);
router.get('/stats', getStats);

// Admin Direct Controls
router.post('/call/:id',  callPatient);
router.post('/start/:id', startConsultation);

module.exports = router;
