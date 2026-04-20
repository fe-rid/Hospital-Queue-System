import React, { useState, useEffect, useCallback } from 'react';
import { Clipboard, Stethoscope, MessageSquare, ChevronRight, Video, AlertCircle, RefreshCw, User, CheckCircle2 } from 'lucide-react';
import { getNextPatient, getQueue, servePatient } from '../../services/api';
import { getPatients, sortQueue as localSort, servePatient as localServe } from '../../utils/queue';

const DoctorView = () => {
  const [current,  setCurrent]  = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [online,   setOnline]   = useState(true);
  const [notes,    setNotes]    = useState('');
  const [serving,  setServing]  = useState(false);

  const load = useCallback(async () => {
    try {
      const [nextData, queueData] = await Promise.all([getNextPatient(), getQueue()]);
      setCurrent(nextData.patient || null);
      setUpcoming((queueData.queue || []).slice(1, 4));
      setOnline(true);
    } catch {
      const sorted = localSort(getPatients());
      const first  = sorted[0] || null;
      setCurrent(first ? {
        id:          first.id,
        name:        first.name || first.fullName,
        age:         first.age,
        gender:      first.gender,
        symptoms:    first.symptoms,
        priority:    first.triage?.level || 'NORMAL',
        department:  first.triage?.department || '',
        explanation: first.triage?.explanation || '',
        triage:      first.triage,
        position:    1
      } : null);
      setUpcoming(sorted.slice(1, 4).map((p, i) => ({
        id:       p.id,
        name:     p.name || p.fullName,
        priority: p.triage?.level || 'NORMAL',
        triage:   p.triage
      })));
      setOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleComplete = async () => {
    if (!current) return;
    setServing(true);
    try {
      if (online) await servePatient(current.id);
      else localServe(current.id);
      setNotes('');
      await load();
    } finally {
      setServing(false);
    }
  };

  const getBadge = (level = '') => {
    const l = level.toUpperCase();
    if (l === 'EMERGENCY') return 'badge-emergency';
    if (l === 'URGENT')    return 'badge-urgent';
    return 'badge-normal';
  };

  const initials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) return (
    <div className="flex items-center justify-center" style={{ height: '60vh' }}>
      <div className="text-center">
        <RefreshCw size={32} className="text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted font-semibold">Loading patient data...</p>
      </div>
    </div>
  );

  if (!current) return (
    <div className="card flex flex-col items-center justify-center text-center" style={{ minHeight: '400px' }}>
      <div className="p-6 rounded-full mb-6" style={{ background: '#eff6ff' }}>
        <Stethoscope size={48} className="text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">No Active Patients</h3>
      <p className="text-muted text-sm max-w-sm">The queue is currently empty. Patients will appear here once they complete the triage registration.</p>
      <button onClick={load} className="btn-outline mt-6 flex items-center gap-2 text-sm">
        <RefreshCw size={15}/> Check Again
      </button>
    </div>
  );

  return (
    <div className="doctor-view">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

        {/* ── Left: Active Consultation ── */}
        <div>
          <div className="card mb-6">
            {/* Patient header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-4 items-center">
                <div className="flex items-center justify-center font-bold text-white"
                  style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'var(--primary)', fontSize: '1.5rem' }}>
                  {initials(current.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{current.name}</h2>
                  <div className="flex gap-2 items-center mt-2">
                    <span className={`badge ${getBadge(current.priority)}`}>{current.priority}</span>
                    <span className="text-sm text-muted">{current.id} · {current.age ?? '?'}y · {current.gender}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-outline px-4 py-2 flex items-center gap-2 text-sm"><Video size={16}/> Video</button>
                <button
                  onClick={handleComplete}
                  disabled={serving}
                  className="btn-primary px-6 flex items-center gap-2"
                  style={{ borderRadius: '10px' }}
                >
                  {serving ? <><RefreshCw size={16} className="animate-spin"/> Saving...</> : <><CheckCircle2 size={16}/> Complete</>}
                </button>
              </div>
            </div>

            {/* Mock vitals */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Temperature', value: '37.8°C', danger: false },
                { label: 'Pulse Rate',  value: current.priority?.toUpperCase() === 'EMERGENCY' ? '112 BPM' : '88 BPM', danger: current.priority?.toUpperCase() === 'EMERGENCY' },
                { label: 'Blood Press', value: current.priority?.toUpperCase() === 'EMERGENCY' ? '150/95'  : '120/80',  danger: current.priority?.toUpperCase() === 'EMERGENCY' },
              ].map(v => (
                <div key={v.label} className="p-5 rounded-2xl text-center" style={{ background: '#f8fafc', border: '1px solid var(--border)' }}>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-2">{v.label}</p>
                  <p className={`text-xl font-bold ${v.danger ? 'text-danger' : ''}`}>{v.value}</p>
                </div>
              ))}
            </div>

            {/* Symptom block */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold flex items-center gap-2"><Clipboard size={16} className="text-primary"/> Triage Symptom Record</h4>
                <span className="text-[10px] font-bold bg-main px-2 py-1 rounded border border-border uppercase">AI Generated</span>
              </div>
              <div className="p-5 rounded-xl" style={{ borderLeft: '5px solid var(--primary)', background: '#eff6ff' }}>
                <p className="text-sm italic leading-relaxed">"{current.symptoms}"</p>
                {current.explanation && (
                  <p className="text-[11px] text-primary opacity-70 mt-3 font-semibold">{current.explanation}</p>
                )}
                <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: '1px solid #dbeafe' }}>
                  <span className="text-[10px] font-bold text-primary">DEPT: {(current.department || '—').split('–')[0]}</span>
                  <span className="text-[10px] font-bold text-primary">RISK: {current.priority?.toUpperCase() === 'EMERGENCY' ? 'CRITICAL' : current.priority?.toUpperCase() === 'URGENT' ? 'ELEVATED' : 'LOW'}</span>
                </div>
              </div>
            </div>

            {/* Clinical notes */}
            <div>
              <h4 className="font-bold mb-3 flex items-center gap-2"><Stethoscope size={16} className="text-primary"/> Clinical Notes & Prescription</h4>
              <textarea
                rows={7}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Enter formal diagnosis, prescribed medications, and follow-up instructions..."
                style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border)', fontSize: '0.9rem', lineHeight: '1.7', resize: 'vertical' }}
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-muted flex items-center gap-1"><AlertCircle size={11}/> Notes auto-save to Patient Medical Record (PMR)</p>
                <button className="btn-outline text-xs px-4 py-2">Print Prescription</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Sidebar ── */}
        <div>
          <div className="card mb-6">
            <h3 className="font-bold mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2"><User size={16} className="text-primary"/> Up Next</div>
              <span className="text-[10px] text-muted font-semibold">{upcoming.length} waiting</span>
            </h3>
            <div className="flex flex-col gap-3">
              {upcoming.length > 0 ? upcoming.map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 rounded-xl" style={{ background: '#f8fafc', border: '1px solid var(--border)' }}>
                  <div>
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-[10px] text-muted">{p.id}</p>
                  </div>
                  <span className={`badge ${getBadge(p.priority)}`} style={{ fontSize: '9px' }}>{p.priority}</span>
                </div>
              )) : (
                <p className="text-xs text-muted text-center py-4 italic">No upcoming patients</p>
              )}
            </div>
            <button onClick={load} className="btn-outline w-full mt-5 py-3 text-xs font-bold flex items-center justify-center gap-2">
              <RefreshCw size={13}/> Refresh Queue <ChevronRight size={13}/>
            </button>
          </div>

          <div className="card">
            <h3 className="font-bold mb-5 flex items-center gap-2"><MessageSquare size={16} className="text-primary"/> Quick Actions</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Order Laboratory Panel',     danger: false },
                { label: 'Refer to Specialist Unit',   danger: false },
                { label: 'Request X-Ray / MRI',        danger: false },
                { label: 'Emergency Assist Alert',     danger: true  },
              ].map(({ label, danger }) => (
                <button key={label} className="btn-outline w-full px-4 py-3 text-sm flex items-center justify-between"
                  style={{ borderRadius: '10px', ...(danger ? { color: '#ef4444', borderColor: '#fecaca' } : {}) }}>
                  <span>{label}</span>
                  {danger ? <AlertCircle size={14}/> : <ChevronRight size={14} className="opacity-30"/>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorView;
