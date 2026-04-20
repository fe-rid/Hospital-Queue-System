import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RefreshCcw, Loader2, User, Thermometer, Building2 } from 'lucide-react';
import { getPatientById, completeConsultation, referPatient } from '../../services/api';

const DEPARTMENTS = ['Emergency', 'General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Dermatology'];

const Consultation = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const doctorId = sessionStorage.getItem('doctor_id');

  const [patient,  setPatient]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [notes,    setNotes]    = useState('');
  const [rx,       setRx]       = useState('');
  const [referTo,  setReferTo]  = useState('');
  const [tab,      setTab]      = useState('notes'); // 'notes' | 'refer'

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPatientById(patientId);
        setPatient(data.patient);
      } catch {
        const local = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
        setPatient(local.find(p => p.id === patientId) || null);
      } finally { setLoading(false); }
    };
    load();
  }, [patientId]);

  const handleComplete = async () => {
    setSaving(true);
    try {
      await completeConsultation(doctorId, patientId, { notes, prescription: rx });
      navigate('/doctor/queue');
    } catch (e) {
      alert('Error: ' + e.message);
    } finally { setSaving(false); }
  };

  const handleRefer = async () => {
    if (!referTo) return;
    setSaving(true);
    try {
      await referPatient(doctorId, patientId, referTo);
      navigate('/doctor/queue');
    } catch (e) {
      alert('Error: ' + e.message);
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <Loader2 size={36} className="animate-spin" style={{ color: '#059669' }} />
    </div>
  );

  if (!patient) return (
    <div className="text-center" style={{ padding: '4rem' }}>
      <p className="font-bold">Patient not found.</p>
      <button onClick={() => navigate('/doctor/queue')} style={{ marginTop: '1rem', background: '#059669', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
        ← Back to Queue
      </button>
    </div>
  );

  const tri = patient.triage || {};
  const TRIAGE_COLOR = { EMERGENCY: '#ef4444', URGENT: '#f59e0b', NORMAL: '#059669' };
  const triColor = TRIAGE_COLOR[(tri.level || '').toUpperCase()] || '#6b7280';

  return (
    <div style={{ maxWidth: '820px' }}>
      {/* Back */}
      <button onClick={() => navigate('/doctor/queue')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none',
          color: '#6b7280', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Queue
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Patient info */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem',
            paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: triColor + '20',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={22} style={{ color: triColor }} />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{patient.name}</p>
              <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>{patient.id} · {patient.age}y · {patient.gender}</p>
            </div>
          </div>

          {/* Triage badge */}
          <div style={{ background: triColor + '15', borderRadius: '10px', padding: '0.875rem', marginBottom: '1rem', borderLeft: `4px solid ${triColor}` }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: triColor, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Triage Level</p>
            <p style={{ fontWeight: 800, fontSize: '1.1rem', color: triColor }}>{tri.level || 'NORMAL'}</p>
          </div>

          {/* Info rows */}
          {[
            { icon: <Thermometer size={14} />, label: 'Symptoms', val: patient.symptoms },
            { icon: <Building2 size={14} />, label: 'Department', val: tri.department || '--' },
            { icon: <RefreshCcw size={14} />, label: 'Status', val: patient.status },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: '0.875rem' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                {r.icon} {r.label}
              </p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937', fontStyle: r.label === 'Symptoms' ? 'italic' : 'normal' }}>
                {r.val}
              </p>
            </div>
          ))}

          {/* Assigned room */}
          {patient.assignedDoctor && (
            <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '0.75rem', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>Assigned Doctor</p>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{patient.assignedDoctor}</p>
              <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>Room: {patient.assignedRoom}</p>
            </div>
          )}
        </div>

        {/* Right: Action panel */}
        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Consultation Notes</h3>

          {/* Tab switcher */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '1.25rem' }}>
            {['notes', 'refer'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.8rem', textTransform: 'capitalize',
                  background: tab === t ? 'white' : 'transparent',
                  color: tab === t ? '#059669' : '#6b7280',
                  boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
                {t === 'notes' ? '📋 Notes & Prescription' : '🔄 Refer Patient'}
              </button>
            ))}
          </div>

          {tab === 'notes' ? (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151',
                  marginBottom: '0.4rem' }}>Clinical Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                  placeholder="Patient presents with... Examination findings... Diagnosis..."
                  style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border)', padding: '0.75rem',
                    fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151',
                  marginBottom: '0.4rem' }}>Prescription / Treatment Plan</label>
                <textarea value={rx} onChange={e => setRx(e.target.value)} rows={3}
                  placeholder="e.g. Paracetamol 500mg TID x 5 days..."
                  style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border)', padding: '0.75rem',
                    fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical' }} />
              </div>

              <button onClick={handleComplete} disabled={saving}
                style={{ width: '100%', background: '#059669', color: 'white', border: 'none', padding: '1rem',
                  borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  opacity: saving ? 0.7 : 1 }}>
                {saving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                {saving ? 'Saving...' : 'Finish Visit & Mark Served'}
              </button>
            </>
          ) : (
            <>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.25rem' }}>
                Transfer this patient to another department's queue. Their triage priority will be maintained.
              </p>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>
                  Transfer to Department
                </label>
                <select value={referTo} onChange={e => setReferTo(e.target.value)}
                  style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border)', padding: '0.75rem', fontSize: '0.875rem' }}>
                  <option value="">Select department...</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button onClick={handleRefer} disabled={!referTo || saving}
                style={{ width: '100%', background: '#f59e0b', color: 'white', border: 'none', padding: '1rem',
                  borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  opacity: (!referTo || saving) ? 0.6 : 1 }}>
                {saving ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
                {saving ? 'Transferring...' : `Refer to ${referTo || 'Department'}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Consultation;
