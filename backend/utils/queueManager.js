const Patient = require('../models/Patient');
const { sortQueue } = require('./queueSorter');
const { calculateWaitTime } = require('./waitTimeCalculator');

/**
 * Global Queue Refresher
 * Fetches all WAITING patients from MongoDB, sorts them,
 * and updates their position and wait time metrics.
 */
const refreshQueueStatus = async () => {
  try {
    // 1. Get all waiting patients
    const waitingPatients = await Patient.find({ status: 'WAITING' });
    
    // 2. Sort by priority and time
    const sorted = sortQueue(waitingPatients);

    // 3. Update each patient records in DB
    const updates = sorted.map((patient, index) => {
      const position = index + 1;
      const waitTime = calculateWaitTime(patient.triage.level, position);

      return Patient.updateOne(
        { _id: patient._id },
        { 
          $set: { 
            queuePosition: position, 
            estimatedWait: waitTime 
          } 
        }
      );
    });

    await Promise.all(updates);
  } catch (error) {
    console.error('Error refreshing queue status:', error.message);
  }
};

module.exports = { refreshQueueStatus };
