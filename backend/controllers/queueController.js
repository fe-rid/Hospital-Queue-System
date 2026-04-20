const Patient = require('../models/Patient');

/**
 * GET /api/queue
 */
exports.getQueue = async (req, res) => {
  try {
    const queue = await Patient.find({ 
      status: { $in: ['PENDING_ASSIGNMENT', 'WAITING', 'CALLED', 'IN_CONSULTATION'] } 
    }).sort({ queuePosition: 1, createdAt: 1 });
    res.json({ success: true, count: queue.length, queue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/queue/stats
 */
exports.getStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    const patientsToday = await Patient.find({ createdAt: { $gte: startOfToday } });

    const stats = {
      totalToday:     patientsToday.length,
      emergency:      patientsToday.filter(p => p.triage.level === 'EMERGENCY').length,
      urgent:         patientsToday.filter(p => p.triage.level === 'URGENT').length,
      normal:         patientsToday.filter(p => p.triage.level === 'NORMAL').length,
      currentWaiting: patientsToday.filter(p => ['PENDING_ASSIGNMENT', 'WAITING', 'CALLED', 'IN_CONSULTATION'].includes(p.status)).length,
      servedToday:    patientsToday.filter(p => p.status === 'SERVED').length
    };
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/queue/call/:id
 */
exports.callPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Not found' });
    patient.status = 'CALLED';
    await patient.save();
    res.json({ success: true, message: 'Patient called' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/queue/start/:id
 */
exports.startConsultation = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Not found' });
    patient.status = 'IN_CONSULTATION';
    await patient.save();
    res.json({ success: true, message: 'Consultation started' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
