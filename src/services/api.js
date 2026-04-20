/**
 * API Service Layer v2.0
 * Covers: Patients, Queue, Doctors
 */

const BASE_URL = 'http://localhost:5000/api';

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

// ─── Patient API ──────────────────────────────────────────────────────────────
export const registerPatient    = (payload) =>
  fetch(`${BASE_URL}/patients`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(handleResponse);

export const getAllPatients      = () => fetch(`${BASE_URL}/patients`).then(handleResponse);
export const getPatientById     = (id) => fetch(`${BASE_URL}/patients/${id}`).then(handleResponse);
export const getPatientHistory  = (id) => fetch(`${BASE_URL}/patients/history/${id}`).then(handleResponse);
export const servePatient       = (id) => fetch(`${BASE_URL}/patients/serve/${id}`, { method: 'POST' }).then(handleResponse);
export const assignDoctorToPatient = (patientId, doctorId) =>
  fetch(`${BASE_URL}/patients/assign/${patientId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doctorId })
  }).then(handleResponse);

// ─── Queue API ────────────────────────────────────────────────────────────────
export const getQueue           = () => fetch(`${BASE_URL}/queue`).then(handleResponse);
export const getQueueStats      = () => fetch(`${BASE_URL}/queue/stats`).then(handleResponse);
export const getNextPatient     = () => fetch(`${BASE_URL}/queue/next`).then(handleResponse);

// ─── Doctor API ───────────────────────────────────────────────────────────────
export const loginDoctor        = (payload) =>
  fetch(`${BASE_URL}/doctors/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(handleResponse);

export const getAllDoctors       = () => fetch(`${BASE_URL}/doctors`).then(handleResponse);
export const getDoctorById      = (id) => fetch(`${BASE_URL}/doctors/${id}`).then(handleResponse);
export const getDoctorQueue     = (id) => fetch(`${BASE_URL}/doctors/${id}/queue`).then(handleResponse);
export const getDoctorStats     = (id) => fetch(`${BASE_URL}/doctors/${id}/stats`).then(handleResponse);

export const createDoctor       = (payload) =>
  fetch(`${BASE_URL}/doctors`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(handleResponse);

export const callNextPatient    = (doctorId) =>
  fetch(`${BASE_URL}/doctors/${doctorId}/call-next`, { method: 'POST' }).then(handleResponse);

export const startConsultation  = (doctorId, patientId) =>
  fetch(`${BASE_URL}/doctors/${doctorId}/start/${patientId}`, { method: 'POST' }).then(handleResponse);

export const completeConsultation = (doctorId, patientId, body = {}) =>
  fetch(`${BASE_URL}/doctors/${doctorId}/complete/${patientId}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  }).then(handleResponse);

export const referPatient       = (doctorId, patientId, targetDepartment) =>
  fetch(`${BASE_URL}/doctors/${doctorId}/refer/${patientId}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetDepartment })
  }).then(handleResponse);

export const updateDoctorStatus = (doctorId, status) =>
  fetch(`${BASE_URL}/doctors/${doctorId}/status`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
  }).then(handleResponse);
