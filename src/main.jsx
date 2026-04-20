import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * INITIALIZE LOCAL MOCK DATA
 * Used when the backend is not running (offline/demo mode).
 */
const initMockData = () => {
  const existing = localStorage.getItem('hospital_patients');
  if (!existing || JSON.parse(existing).length === 0) {
    const mockPatients = [
      {
        id: 'PAT-1001', fullName: 'Abebe Kebede', name: 'Abebe Kebede',
        age: '45', gender: 'male', phone: '0911223344',
        symptoms: 'Aggressive chest pain radiating to the left arm',
        assignedDoctor: 'Dr. Ruth Alemu', assignedDoctorId: 'DOC-004', assignedRoom: 'CD-1',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'WAITING',
        triage: { level: 'EMERGENCY', priority: 1, color: 'text-danger', badgeClass: 'badge-emergency', department: 'Cardiology', explanation: 'Life-threatening condition. Immediate attention required.' }
      },
      {
        id: 'PAT-1002', fullName: 'Tigist Belay', name: 'Tigist Belay',
        age: '28', gender: 'female', phone: '0922334455',
        symptoms: 'High fever 39°C and persistent vomiting',
        assignedDoctor: 'Dr. Hana Girma', assignedDoctorId: 'DOC-002', assignedRoom: 'GM-1',
        createdAt: new Date(Date.now() - 2400000).toISOString(),
        status: 'WAITING',
        triage: { level: 'URGENT', priority: 2, color: 'text-urgent', badgeClass: 'badge-urgent', department: 'General Medicine', explanation: 'Serious condition requiring timely attention.' }
      },
      {
        id: 'PAT-1003', fullName: 'Mulugeta Tesfaye', name: 'Mulugeta Tesfaye',
        age: '62', gender: 'male', phone: '0933445566',
        symptoms: 'Mild cough and routine checkup',
        assignedDoctor: 'Dr. Hana Girma', assignedDoctorId: 'DOC-002', assignedRoom: 'GM-1',
        createdAt: new Date(Date.now() - 1200000).toISOString(),
        status: 'WAITING',
        triage: { level: 'NORMAL', priority: 3, color: 'text-normal', badgeClass: 'badge-normal', department: 'General Medicine', explanation: 'Non-critical condition. Added to standard queue.' }
      }
    ];
    localStorage.setItem('hospital_patients', JSON.stringify(mockPatients));
  }
};

initMockData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
