import React from 'react';

const Card = ({ title, value, icon, color, trend }) => {
  return (
    <div className="card stat-card">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted text-sm font-semibold mb-2">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend && (
            <p className={`text-xs mt-2 ${trend.positive ? 'text-success' : 'text-danger'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value} <span className="text-muted">vs last hour</span>
            </p>
          )}
        </div>
        <div className={`card-icon ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Card;
