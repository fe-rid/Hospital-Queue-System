import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle2, ChevronRight, Building2 } from 'lucide-react';

const LEVEL_CONFIG = {
  EMERGENCY: {
    icon:    <AlertCircle size={56} />,
    cls:     'text-danger',
    badge:   'badge-emergency',
    bg:      '#fff5f5',
    border:  '#fecaca',
    barColor:'#ef4444'
  },
  Urgent:    { icon: <Clock size={56} />, cls: 'text-urgent', badge: 'badge-urgent', bg: '#fffbeb', border: '#fde68a', barColor: '#f59e0b' },
  URGENT:    { icon: <Clock size={56} />, cls: 'text-urgent', badge: 'badge-urgent', bg: '#fffbeb', border: '#fde68a', barColor: '#f59e0b' },
  Normal:    { icon: <CheckCircle2 size={56} />, cls: 'text-normal', badge: 'badge-normal', bg: '#f0fdf4', border: '#bbf7d0', barColor: '#10b981' },
  NORMAL:    { icon: <CheckCircle2 size={56} />, cls: 'text-normal', badge: 'badge-normal', bg: '#f0fdf4', border: '#bbf7d0', barColor: '#10b981' }
};

const TriageResult = () => {
  const location = useLocation();
  const { patient, queuePosition } = location.state || {};

  if (!patient) return <Navigate to="/register" replace />;

  // Normalise case — ensure 'Emergency' matches 'EMERGENCY'
  const rawLevel = (patient.triage?.level || 'NORMAL').toUpperCase();
  const cfg      = LEVEL_CONFIG[rawLevel] || LEVEL_CONFIG['NORMAL'];
  const dept     = patient.triage?.department || 'Outpatient Department';
  const explain  = patient.triage?.explanation || '';
  const name     = patient.name || patient.fullName || 'Patient';
  const symptoms = patient.symptoms || '';

  return (
    <div className="py-20">
      <div className="container" style={{ maxWidth: '720px' }}>
        <div className="card p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`${cfg.cls}`}>{cfg.icon}</div>
          </div>

          {/* Level badge */}
          <div className="text-center mb-6">
            <p className="text-xs text-muted font-bold uppercase tracking-widest mb-2">AI Triage Classification</p>
            <span className={`badge ${cfg.badge}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1.2rem' }}>
              {rawLevel}
            </span>
          </div>

          {/* Patient card */}
          <div className="p-5 mb-6 rounded-xl border" style={{ background: cfg.bg, borderColor: cfg.border }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{name}</p>
                <p className="text-sm text-muted mt-1">"{symptoms}"</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted uppercase font-bold mb-1">Queue #</p>
                <p className={`text-2xl font-bold ${cfg.cls}`}>{queuePosition ?? '--'}</p>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-5 rounded-xl border border-border text-center">
              <Building2 size={20} className="text-primary mx-auto mb-2" />
              <p className="text-[10px] text-muted uppercase font-bold mb-1">Assigned Department</p>
              <p className="text-sm font-bold">{dept}</p>
            </div>
            <div className="p-5 rounded-xl border border-border text-center">
              <p className="text-[10px] text-muted uppercase font-bold mb-1">Priority Score</p>
              <p className={`text-4xl font-bold ${cfg.cls}`}>P{patient.triage?.priority ?? 3}</p>
              <p className="text-[10px] text-muted mt-1">Lower = Higher Priority</p>
            </div>
          </div>

          {/* Explanation */}
          <div className="p-5 rounded-xl mb-8" style={{ background: '#eff6ff', borderLeft: `5px solid ${cfg.barColor}` }}>
            <p className="text-xs font-bold uppercase text-primary mb-2 flex items-center gap-2">
              <AlertCircle size={14} /> System Explanation
            </p>
            <p className="text-sm leading-relaxed">{explain}</p>
          </div>

          {/* Actions */}
          <Link to="/queue" className="btn-primary w-full py-4" style={{ fontSize: '1rem', borderRadius: '12px' }}>
            View Live Queue Status <ChevronRight size={20} />
          </Link>
          <p className="text-center text-xs text-muted mt-4">
            Your record has been securely added to the hospital management system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TriageResult;
