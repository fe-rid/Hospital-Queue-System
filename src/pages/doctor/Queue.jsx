import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, PhoneCall, Stethoscope, AlertCircle, Users, CheckCircle2 } from 'lucide-react';
import { getDoctorQueue, callNextPatient, startConsultation } from '../../services/api';

const DoctorQueue = () => {
  const doctorId = sessionStorage.getItem('doctor_id');
  const [queue,    setQueue]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState(null); // patientId being acted on

  const load = useCallback(async () => {
    try {
      const data = await getDoctorQueue(doctorId);
      setQueue(data.queue || []);
    } catch {
      // offline: read localStorage, filter by doctorId stored in session
      const local = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
      setQueue(local.filter(p => ['WAITING','CALLED','IN_CONSULTATION'].includes(p.status)).map((p,i) => ({...p, position: i+1, estimatedWait: `${i*12} min`})));
    } finally { setLoading(false); }
  }, [doctorId]);

  useEffect(() => { load(); const iv = setInterval(load, 5000); return () => clearInterval(iv); }, [load]);

  const handleCallNext = async () => {
    setActing('call');
    try { await callNextPatient(doctorId); await load(); }
    catch (e) { console.warn(e); }
    finally { setActing(null); }
  };

  const handleStart = async (patientId) => {
    setActing(patientId);
    try { await startConsultation(doctorId, patientId); await load(); }
    catch (e) { console.warn(e); }
    finally { setActing(null); }
  };

  const STATUS_STYLE = {
    WAITING:        { bg: '#f1f5f9', color: '#475569', label: 'Waiting' },
    CALLED:         { bg: '#fef3c7', color: '#92400e', label: '📣 Called' },
    IN_CONSULTATION:{ bg: '#f0fdf4', color: '#065f46', label: '🩺 In Consult' },
  };

  const TRIAGE_STYLE = {
    EMERGENCY: { bg: '#fef2f2', color: '#991b1b' },
    URGENT:    { bg: '#fffbeb', color: '#92400e' },
    NORMAL:    { bg: '#f0fdf4', color: '#065f46' },
  };

  const waiting = queue.filter(p => p.status === 'WAITING');
  const called  = queue.filter(p => p.status === 'CALLED');
  const active  = queue.find(p => p.status === 'IN_CONSULTATION');

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>My Patient Queue</h2>
          <p className="text-muted text-sm">{queue.length} assigned · Auto-updates every 5s</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', border: '1px solid var(--border)',
              padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={handleCallNext} disabled={!!acting || waiting.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#059669', color: 'white',
              border: 'none', padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700,
              cursor: 'pointer', opacity: (!!acting || waiting.length === 0) ? 0.6 : 1 }}>
            <PhoneCall size={15} />
            {acting === 'call' ? 'Calling...' : 'Call Next Patient'}
          </button>
        </div>
      </div>

      {/* Active consultation banner */}
      {active && (
        <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', borderRadius: '16px',
          padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', color: 'white' }}>
          <div className="flex items-center gap-3">
            <Stethoscope size={22} />
            <div>
              <p style={{ fontWeight: 700, fontSize: '1rem' }}>{active.name}</p>
              <p style={{ opacity: 0.8, fontSize: '0.8rem' }}>🩺 In Consultation · {active.triage?.level}</p>
            </div>
          </div>
          <Link to={`/doctor/consultation/${active.id}`}
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1.25rem',
              borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none' }}>
            Open Session →
          </Link>
        </div>
      )}

      {/* Queue table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <RefreshCw size={32} className="animate-spin" style={{ color: '#059669', margin: '0 auto 1rem' }} />
          <p className="text-muted font-semibold">Loading queue...</p>
        </div>
      ) : queue.filter(p => p.status !== 'IN_CONSULTATION').length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <CheckCircle2 size={48} style={{ color: '#059669', margin: '0 auto 1rem', opacity: 0.3 }} />
          <p style={{ fontWeight: 700, color: '#374151' }}>Queue is clear!</p>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>All assigned patients have been seen.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['#', 'Priority', 'Patient', 'Symptoms', 'Wait', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '1rem', fontSize: '0.7rem', color: '#6b7280', fontWeight: 700,
                    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queue.filter(p => p.status !== 'IN_CONSULTATION').map((p, i) => {
                const tri   = TRIAGE_STYLE[(p.triage?.level || 'NORMAL').toUpperCase()] || TRIAGE_STYLE.NORMAL;
                const stat  = STATUS_STYLE[p.status] || STATUS_STYLE.WAITING;
                const isCalled = p.status === 'CALLED';
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', background: isCalled ? '#fffbeb' : 'white' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: i === 0 ? '#059669' : '#f1f5f9',
                        color: i === 0 ? 'white' : '#6b7280', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>{p.position}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: tri.bg, color: tri.color, fontSize: '0.65rem', fontWeight: 700,
                        padding: '0.2rem 0.6rem', borderRadius: '99px' }}>{p.triage?.level || 'NORMAL'}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</p>
                      <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>{p.id}</p>
                    </td>
                    <td style={{ padding: '1rem', maxWidth: '180px' }}>
                      <p style={{ fontSize: '0.78rem', color: '#6b7280', fontStyle: 'italic',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{p.symptoms}"</p>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.estimatedWait || '--'}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: stat.bg, color: stat.color, fontSize: '0.65rem', fontWeight: 700,
                        padding: '0.25rem 0.65rem', borderRadius: '99px' }}>{stat.label}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {isCalled ? (
                        <button onClick={() => handleStart(p.id)} disabled={acting === p.id}
                          style={{ background: '#059669', color: 'white', border: 'none', padding: '0.45rem 0.9rem',
                            borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Stethoscope size={13} />
                          {acting === p.id ? '...' : 'Start'}
                        </button>
                      ) : (
                        <Link to={`/doctor/consultation/${p.id}`}
                          style={{ background: '#f0fdf4', color: '#059669', padding: '0.45rem 0.9rem',
                            borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary footer */}
      {queue.length > 0 && (
        <div className="flex gap-4 mt-6">
          {[
            { label: 'Waiting', count: waiting.length, color: '#2563eb' },
            { label: 'Called', count: called.length, color: '#f59e0b' },
            { label: 'In Consultation', count: active ? 1 : 0, color: '#059669' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '1rem 1.25rem',
              border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.count}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorQueue;
