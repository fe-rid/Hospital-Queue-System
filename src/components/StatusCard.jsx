import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Building2, UserCheck, Activity } from 'lucide-react';

const StatusCard = ({ type, level, label, value, explanation }) => {
  const getIcon = () => {
    switch (type) {
      case 'triage':
        if (level?.toUpperCase() === 'EMERGENCY') return <AlertCircle size={24} className="text-danger" />;
        if (level?.toUpperCase() === 'URGENT')    return <Clock size={24} className="text-urgent" />;
        return <CheckCircle2 size={24} className="text-normal" />;
      case 'department':
        return <Building2 size={24} className="text-primary" />;
      case 'status':
        return <Activity size={24} className="text-primary" />;
      default:
        return <UserCheck size={24} className="text-primary" />;
    }
  };

  const getBadgeColor = () => {
    if (type !== 'triage') return 'bg-blue';
    const l = level?.toUpperCase();
    if (l === 'EMERGENCY') return 'badge-emergency';
    if (l === 'URGENT')    return 'badge-urgent';
    return 'badge-normal';
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold uppercase text-muted tracking-widest">{label}</p>
        <div className="p-2 rounded-lg" style={{ background: '#f8fafc' }}>
          {getIcon()}
        </div>
      </div>
      
      <div className="mt-auto">
        {type === 'triage' ? (
          <span className={`badge ${getBadgeColor()} mb-2`}>{value}</span>
        ) : (
          <p className="font-bold text-lg mb-2">{value}</p>
        )}
        
        {explanation && (
          <p className="text-xs text-muted leading-relaxed italic mt-2 border-t pt-3 border-border">
            {explanation}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusCard;
