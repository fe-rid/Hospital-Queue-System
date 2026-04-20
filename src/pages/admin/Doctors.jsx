import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, RefreshCw, Wifi, WifiOff, Stethoscope, X } from 'lucide-react';
import { getAllDoctors, createDoctor, updateDoctorStatus } from '../../services/api';

const DEPARTMENTS = ['Emergency', 'General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Dermatology'];

const STATUS_STYLE = {
  AVAILABLE: { bg: '#f0fdf4', color: '#059669', dot: '#059669' },
  BUSY:      { bg: '#fef2f2', color: '#dc2626', dot: '#dc2626' },
  OFF_DUTY:  { bg: '#f1f5f9', color: '#6b7280', dot: '#94a3b8' },
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [online,  setOnline]  = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: 'doctor123', department: 'General Medicine', roomNumber: '' });

  const load = useCallback(async () => {
    try {
      const data = await getAllDoctors();
      setDoctors(data.doctors || []);
      setOnline(true);
    } catch {
      setOnline(false);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (doctorId, newStatus) => {
    try {
      await updateDoctorStatus(doctorId, newStatus);
      await load();
    } catch { alert('Failed to update status. Is the backend running?'); }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createDoctor(form);
      setShowAdd(false);
      setForm({ name: '', email: '', password: 'doctor123', department: 'General Medicine', roomNumber: '' });
      await load();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const stats = {
    available: doctors.filter(d => d.status === 'AVAILABLE').length,
    busy:      doctors.filter(d => d.status === 'BUSY').length,
    offDuty:   doctors.filter(d => d.status === 'OFF_DUTY').length,
    total:     doctors.length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Doctor Management</h2>
          <div className="flex items-center gap-2 mt-1">
            {online
              ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700, color: '#059669', background: '#f0fdf4', padding: '0.2rem 0.6rem', borderRadius: '99px' }}><Wifi size={10} /> API Live</span>
              : <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700, color: '#92400e', background: '#fef3c7', padding: '0.2rem 0.6rem', borderRadius: '99px' }}><WifiOff size={10} /> Offline</span>}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9',
            border: '1px solid var(--border)', padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--primary)', color: 'white', border: 'none', padding: '0.6rem 1.25rem',
            borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
            <UserPlus size={15} /> Add Doctor
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Doctors', value: stats.total,     color: '#2563eb', bg: '#eff6ff' },
          { label: 'Available',     value: stats.available, color: '#059669', bg: '#f0fdf4' },
          { label: 'In Session',    value: stats.busy,      color: '#dc2626', bg: '#fef2f2' },
          { label: 'Off Duty',      value: stats.offDuty,   color: '#6b7280', bg: '#f1f5f9' },
        ].map(s => (
          <div key={s.label} className="card text-center py-5" style={{ border: `1px solid ${s.color}20` }}>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginTop: '0.25rem' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Doctors table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
          <p className="text-muted font-semibold">Loading staff directory...</p>
        </div>
      ) : !online ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <WifiOff size={40} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 700 }}>Backend not reachable</p>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>Run <code style={{ background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>npm run dev:all</code> to start the full stack.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Doctor', 'Department', 'Room', 'Status', 'Active Pts', 'Done Today', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', fontSize: '0.7rem', color: '#6b7280', fontWeight: 700,
                    textAlign: 'left', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => {
                const s = STATUS_STYLE[doc.status] || STATUS_STYLE.AVAILABLE;
                return (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Stethoscope size={16} style={{ color: 'var(--primary)' }} />
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{doc.name}</p>
                          <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>{doc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>{doc.department}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>{doc.roomNumber}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: s.bg, color: s.color, fontSize: '0.7rem', fontWeight: 700,
                        padding: '0.25rem 0.65rem', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot }}></span>
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center' }}>{doc.activePatients}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#059669', fontWeight: 700, textAlign: 'center' }}>{doc.completedToday}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {['AVAILABLE', 'BUSY', 'OFF_DUTY'].filter(s => s !== doc.status).map(s => (
                          <button key={s} onClick={() => handleStatusChange(doc.id, s)}
                            style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border)',
                              background: 'white', cursor: 'pointer', color: STATUS_STYLE[s].color }}>
                            {s.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '480px', maxWidth: '95vw', position: 'relative' }}>
            <button onClick={() => setShowAdd(false)} style={{ position: 'absolute', top: '1rem', right: '1rem',
              background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Add New Doctor</h3>
            <form onSubmit={handleAddDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label>Full Name</label><input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} required /></div>
              <div><label>Email</label><input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} required /></div>
              <div><label>Department</label>
                <select value={form.department} onChange={e => setForm(p=>({...p,department:e.target.value}))}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div><label>Room Number</label><input placeholder="e.g. ER-2" value={form.roomNumber} onChange={e => setForm(p=>({...p,roomNumber:e.target.value}))} /></div>
              <button type="submit" disabled={saving}
                style={{ background: 'var(--primary)', color: 'white', padding: '0.875rem', borderRadius: '10px',
                  fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>
                {saving ? 'Adding...' : 'Add to Staff Directory'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
