import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle2, Clock, Activity, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { getDoctorStats, getDoctorQueue } from '../../services/api';

const DoctorDashboard = () => {
  const doctorId = sessionStorage.getItem('doctor_id');
  const [stats, setStats]     = useState(null);
  const [queue, setQueue]     = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!doctorId) return;
    try {
      const [sRes, qRes] = await Promise.all([getDoctorStats(doctorId), getDoctorQueue(doctorId)]);
      if (sRes && sRes.stats) setStats(sRes.stats);
      if (qRes && qRes.queue) setQueue(qRes.queue);
    } catch (error) {
      console.error('Doctor Dashboard Load Error:', error);
      // Minimal fallback
      setStats(prev => prev || { 
        doctorName: sessionStorage.getItem('doctor_name'), 
        department: sessionStorage.getItem('doctor_dept'),
        status: 'AVAILABLE', 
        waiting: 0, 
        completedToday: 0 
      });
    } finally { setLoading(false); }
  }, [doctorId]);

  useEffect(() => { 
    load(); 
    const iv = setInterval(load, 8000); 
    return () => clearInterval(iv); 
  }, [load]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="text-center">
        <RefreshCw size={36} className="animate-spin" style={{ color: '#059669', margin: '0 auto 1rem' }} />
        <p className="font-semibold text-muted">Syncing with hospital cloud...</p>
      </div>
    </div>
  );

  const STATUS_COLOR = { AVAILABLE: '#059669', BUSY: '#ef4444', OFF_DUTY: '#6b7280' };
  const currentPatient = stats?.inConsultation;
  const nextTwo = (queue || []).filter(p => p.status === 'WAITING').slice(0, 2);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome, {stats?.doctorName?.split(' ')[1] || 'Doctor'}</h2>
          <p className="text-muted text-sm">{stats?.department || 'Medical Staff'} · Station {stats?.roomNumber || '--'}</p>
        </div>
        <div className="flex items-center gap-3">
          <span style={{
            background: (STATUS_COLOR[stats?.status] || '#6b7280') + '20',
            color: STATUS_COLOR[stats?.status] || '#6b7280', fontSize: '0.75rem', fontWeight: 700,
            padding: '0.4rem 1rem', borderRadius: '99px', border: `1px solid ${STATUS_COLOR[stats?.status] || '#6b7280'}40`
          }}>
            ● {stats?.status || 'AVAILABLE'}
          </span>
          <button onClick={load} className="hover:rotate-180 transition-all duration-500" style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '0.5rem 0.75rem', cursor: 'pointer' }}>
            <RefreshCw size={16} style={{ color: '#6b7280' }} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Waiting', value: stats?.waiting ?? 0, icon: <Users size={20} />, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Current Session', value: currentPatient ? 1 : 0, icon: <Activity size={20} />, color: '#059669', bg: '#f0fdf4' },
          { label: 'Done Today', value: stats?.completedToday ?? 0, icon: <CheckCircle2 size={20} />, color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Load Level', value: (stats?.waiting ?? 0) > 3 ? 'High' : 'Normal', icon: <Clock size={20} />, color: '#f59e0b', bg: '#fffbeb' },
        ].map((c, i) => (
          <div key={i} className="card text-center py-6">
            <div style={{ width: '40px', height: '40px', background: c.bg, borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, margin: '0 auto 0.75rem' }}>
              {c.icon}
            </div>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</p>
            <p style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 700, marginTop: '0.5rem', textTransform: 'uppercase' }}>{c.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>Live Session</h3>
          {currentPatient ? (
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '1.25rem', border: '1px solid #bbf7d0' }}>
              <div className="flex justify-between items-start">
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{currentPatient.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>{currentPatient.symptoms}</p>
                </div>
                <span className="badge badge-emergency">{currentPatient.triage?.level}</span>
              </div>
              <Link to={`/doctor/consultation/${currentPatient.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 700,
                  fontSize: '0.8rem', marginTop: '1.25rem', textDecoration: 'none' }}>
                Resume Consultation <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <CheckCircle2 size={32} style={{ color: '#94a3b8', margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 600, color: '#6b7280', fontSize: '0.85rem' }}>Ready for next patient</p>
              <Link to="/doctor/queue"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem',
                  background: '#059669', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px',
                  fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                Open Queue <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Upcoming Patients</h3>
            <Link to="/doctor/queue" style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
              Full Queue →
            </Link>
          </div>
          {(nextTwo || []).length > 0 ? nextTwo.map((p, i) => (
            <div key={p.id || i} style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem',
              background: i === 0 ? '#f0fdf4' : '#f8fafc', borderRadius: '10px',
              marginBottom: '0.5rem', border: `1px solid ${i === 0 ? '#bbf7d0' : 'var(--border)'}`
            }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: i === 0 ? '#059669' : '#e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 0 ? 'white' : '#6b7280',
                fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</p>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', truncate: true }}>{p.id}</p>
              </div>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '99px',
                background: '#fffbeb', color: '#92400e', border: '1px solid #fef3c7' }}>
                {p.triage?.level}
              </span>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
              <AlertCircle size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
              <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Active queue is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
