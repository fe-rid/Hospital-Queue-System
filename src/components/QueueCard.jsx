import React from 'react';
import { Users, Clock, ArrowUpRight } from 'lucide-react';

const QueueCard = ({ label, value, subtext, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'position': return <Users size={20} />;
      case 'wait':     return <Clock size={20} />;
      default:         return <ArrowUpRight size={20} />;
    }
  };

  const getStyle = () => {
    if (type === 'position') return { borderColor: 'var(--primary)', background: '#eff6ff', color: 'var(--primary)' };
    return { background: 'white' };
  };

  return (
    <div className="card text-center flex flex-col items-center justify-center py-8" style={getStyle()}>
      <div className="mb-3 opacity-60">
        {getIcon()}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">{label}</p>
      <p className="text-4xl font-extrabold" style={{ lineHeight: 1 }}>{value}</p>
      {subtext && (
        <p className="text-[10px] mt-3 font-semibold uppercase opacity-60">{subtext}</p>
      )}
    </div>
  );
};

export default QueueCard;
