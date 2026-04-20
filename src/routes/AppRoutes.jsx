import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PatientLayout from '../layouts/PatientLayout';
import AdminLayout   from '../layouts/AdminLayout';
import DoctorLayout  from '../layouts/DoctorLayout';

// ── Patient Portal ────────────────────────────────────────────────────────────
import PortalHome  from '../pages/patient/PortalHome';
import Register    from '../pages/patient/Register';
import Result      from '../pages/patient/Result';
import TrackQueue  from '../pages/patient/TrackQueue';
import History     from '../pages/patient/History';

// ── Admin Dashboard ───────────────────────────────────────────────────────────
import AdminLogin      from '../pages/admin/Login';
import Dashboard       from '../pages/admin/Dashboard';
import QueueManagement from '../pages/admin/QueueManagement';
import DoctorView      from '../pages/admin/DoctorView';
import Doctors         from '../pages/admin/Doctors';

// ── Doctor Portal ─────────────────────────────────────────────────────────────
import DoctorLogin    from '../pages/doctor/Login';
import DoctorDashboard from '../pages/doctor/Dashboard';
import DoctorQueue    from '../pages/doctor/Queue';
import Consultation   from '../pages/doctor/Consultation';

// ── Auth Guard ────────────────────────────────────────────────────────────────
const DoctorGuard = ({ children }) => {
  const id = sessionStorage.getItem('doctor_id');
  return id ? children : <Navigate to="/doctor/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Root redirect */}
    <Route path="/" element={<Navigate to="/patient" replace />} />

    {/* ── Patient Portal ─────────────────────────────────────────── */}
    <Route path="/patient" element={<PatientLayout />}>
      <Route index              element={<PortalHome />} />
      <Route path="register"   element={<Register />} />
      <Route path="result/:id" element={<Result />} />
      <Route path="track"      element={<TrackQueue />} />
      <Route path="history/:id" element={<History />} />
    </Route>

    {/* ── Admin Dashboard ────────────────────────────────────────── */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="queue"     element={<QueueManagement />} />
      <Route path="doctor"    element={<DoctorView />} />
      <Route path="doctors"   element={<Doctors />} />
    </Route>

    {/* ── Doctor Portal ──────────────────────────────────────────── */}
    <Route path="/doctor/login" element={<DoctorLogin />} />
    <Route path="/doctor" element={<DoctorGuard><DoctorLayout /></DoctorGuard>}>
      <Route index                         element={<Navigate to="/doctor/dashboard" replace />} />
      <Route path="dashboard"              element={<DoctorDashboard />} />
      <Route path="queue"                  element={<DoctorQueue />} />
      <Route path="consultation/:patientId" element={<Consultation />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/patient" replace />} />
  </Routes>
);

export default AppRoutes;
