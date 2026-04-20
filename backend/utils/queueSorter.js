/**
 * Queue Sorter Utility (MongoDB Version)
 * Sorts active patients by triage priority levels and arrival time.
 */

const sortQueue = (patients = []) => {
  const priorityMap = { 'EMERGENCY': 1, 'URGENT': 2, 'NORMAL': 3 };

  return [...patients].sort((a, b) => {
    const pA = priorityMap[a.triage?.level] || 3;
    const pB = priorityMap[b.triage?.level] || 3;

    if (pA !== pB) return pA - pB;

    // FIFO within same priority
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
};

module.exports = { sortQueue };
