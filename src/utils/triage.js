/**
 * Triage Engine - Rule-based symptom classification
 */
export const classifySymptoms = (symptoms = "") => {
  const s = symptoms.toLowerCase();
  
  // Rule-based classification
  const isEmergency = s.includes('chest pain') || 
                      s.includes('breathing') || 
                      s.includes('unconscious') || 
                      s.includes('bleeding');
                      
  const isUrgent = s.includes('fever') || 
                   s.includes('pain') || 
                   s.includes('infection') || 
                   s.includes('headache');

  if (isEmergency) {
    return {
      level: 'Emergency',
      priority: 1,
      color: 'text-danger',
      badgeClass: 'badge-emergency',
      explanation: 'Life-threatening condition. Immediate medical attention is required. You are being prioritized as Top Priority.',
      department: 'Emergency Room (ER) - Wing A'
    };
  }

  if (isUrgent) {
    return {
      level: 'Urgent',
      priority: 2,
      color: 'text-urgent',
      badgeClass: 'badge-urgent',
      explanation: 'Serious condition that requires timely intervention to prevent worsening. You will be seen as soon as an Emergency room or General practitioner is available.',
      department: 'General Clinic / Acute Care'
    };
  }

  return {
    level: 'Normal',
    priority: 3,
    color: 'text-normal',
    badgeClass: 'badge-normal',
    explanation: 'Stable condition. Non-urgent medical concern. Please proceed to the waiting area.',
    department: 'Outpatient Department'
  };
};
