/**
 * Queue Sorting Logic - Priority-based ordering
 */
export const sortQueue = (patients = []) => {
  return [...patients].sort((a, b) => {
    // Sort by priority first (1=Emergency, 2=Urgent, 3=Normal)
    if (a.triage.priority !== b.triage.priority) {
      return a.triage.priority - b.triage.priority;
    }
    // Then sort by registration time (oldest first for same priority)
    const timeA = a.createdAt || a.timestamp;
    const timeB = b.createdAt || b.timestamp;
    return new Date(timeA) - new Date(timeB);
  });
};

/**
 * Persist patient to localStorage
 */
export const savePatient = (patient) => {
  const patients = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
  patients.push({
    ...patient,
    id: `P-${Math.floor(Math.random() * 9000) + 1000}`,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('hospital_patients', JSON.stringify(patients));
};

/**
 * Get all patients from localStorage
 */
export const getPatients = () => {
  return JSON.parse(localStorage.getItem('hospital_patients') || '[]');
};

/**
 * Remove/Serve patient
 */
export const servePatient = (patientId) => {
  const patients = getPatients();
  const updated = patients.filter(p => p.id !== patientId);
  localStorage.setItem('hospital_patients', JSON.stringify(updated));
};
