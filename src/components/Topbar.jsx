import React from 'react';
import { Bell, Search } from 'lucide-react';

const Topbar = ({ title }) => {
  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="icon-btn"><Search size={20} /></button>
          <button className="icon-btn"><Bell size={20} /></button>
        </div>
        
        <div className="user-profile">
          <div className="flex flex-col items-end">
            <span className="font-semibold text-sm">Dr. Alferid</span>
            <span className="text-xs text-muted">Administrator</span>
          </div>
          <div className="avatar">A</div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
