import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { loginDoctor } from '../../services/api';

// Offline fallback demo credentials
const DEMO_DOCTORS = [
  { id: 'DOC-001', name: 'Dr. Abebu Tadesse', email: 'abebu@smarthealth.et', password: 'doctor123', department: 'Emergency', roomNumber: 'ER-1', status: 'AVAILABLE', activePatients: 0, completedToday: 3 },
  { id: 'DOC-002', name: 'Dr. Hana Girma',    email: 'hana@smarthealth.et',  password: 'doctor123', department: 'General Medicine', roomNumber: 'GM-1', status: 'AVAILABLE', activePatients: 2, completedToday: 5 },
  { id: 'DOC-004', name: 'Dr. Ruth Alemu',    email: 'ruth@smarthealth.et',  password: 'doctor123', department: 'Cardiology', roomNumber: 'CD-1', status: 'AVAILABLE', activePatients: 1, completedToday: 4 },
];

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginDoctor(form);
      const doc  = data.doctor;
      sessionStorage.setItem('doctor_id',   doc.id);
      sessionStorage.setItem('doctor_name', doc.name);
      sessionStorage.setItem('doctor_dept', doc.department);
      navigate('/doctor/dashboard');
    } catch {
      // Offline fallback
      const match = DEMO_DOCTORS.find(d => d.email === form.email && d.password === form.password);
      if (match) {
        sessionStorage.setItem('doctor_id',   match.id);
        sessionStorage.setItem('doctor_name', match.name);
        sessionStorage.setItem('doctor_dept', match.department);
        navigate('/doctor/dashboard');
      } else {
        setError('Invalid email or password. Try: hana@smarthealth.et / doctor123');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div style={{
            width: '64px', height: '64px', background: '#059669', borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
          }}>
            <Stethoscope size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#064e3b' }}>Doctor Portal</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>SmartHealth Hospital Operations</p>
        </div>

        <div className="card p-8">
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b',
              padding: '0.875rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="flex items-center gap-2"><Mail size={14} /> Email Address</label>
              <input type="email" placeholder="e.g. hana@smarthealth.et" required
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="flex items-center gap-2"><Lock size={14} /> Password</label>
              <input type="password" placeholder="••••••••" required
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>

            <button type="submit" disabled={loading}
              style={{ background: '#059669', color: 'white', padding: '1rem', borderRadius: '12px',
                fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                opacity: loading ? 0.7 : 1 }}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing In...</> : 'Sign In to Portal'}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{ marginTop: '1.5rem', background: '#f0fdf4', padding: '0.875rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#065f46', marginBottom: '0.5rem' }}>
              <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
              DEMO ACCOUNT
            </p>
            <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>Email: <strong>hana@smarthealth.et</strong></p>
            <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>Password: <strong>doctor123</strong></p>
          </div>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          Need access? Contact hospital administration.
        </p>
      </div>
    </div>
  );
};

export default DoctorLogin;
