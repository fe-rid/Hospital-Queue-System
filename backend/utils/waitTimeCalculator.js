/**
 * Wait Time Calculator
 * Logic based on triage priority and current queue position.
 */

const calculateWaitTime = (priority, position) => {
  const p = (priority || '').toUpperCase();

  if (p === 'EMERGENCY') {
    return '0-5 min';
  }

  if (p === 'URGENT') {
    const totalMin = position * 8;
    return `${totalMin} min`;
  }

  // NORMAL
  const totalMin = position * 15;
  return `${totalMin} min`;
};

module.exports = { calculateWaitTime };
