/**
 * Triage Engine v3.1 (Production Rule-set)
 * Classifies symptoms into medical priority levels.
 * Department names are synchronized with Doctor model enums.
 */

const EMERGENCY_KEYWORDS = ['chest pain', 'breathing', 'unconscious', 'bleeding'];
const URGENT_KEYWORDS    = ['fever', 'pain', 'headache', 'infection'];

const classifyTriage = (symptoms = '') => {
  const s = symptoms.toLowerCase();

  const isEmergency = EMERGENCY_KEYWORDS.some(kw => s.includes(kw));
  const isUrgent    = URGENT_KEYWORDS.some(kw => s.includes(kw));

  if (isEmergency) {
    return {
      level: 'EMERGENCY',
      priority: 1,
      department: 'Emergency',
      explanation: 'Critical condition detected. Fast-tracked for immediate intervention.'
    };
  }

  if (isUrgent) {
    return {
      level: 'URGENT',
      priority: 2,
      department: 'General Medicine',
      explanation: 'Serious condition requiring timely medical assessment.'
    };
  }

  return {
    level: 'NORMAL',
    priority: 3,
    department: 'General Medicine',
    explanation: 'Non-critical condition. Added to standard queue.'
  };
};

module.exports = { classifyTriage };
