import React from 'react';
import { Outlet } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Navbar from '../components/Navbar';

const PatientLayout = () => {
  return (
    <div className="patient-layout">
      {/* ── Patient Portal Navbar ── */}
      <Navbar />
      
      <main className="patient-main" style={{ background: '#f8fafc' }}>
        <Outlet />
      </main>

      <footer className="patient-footer" style={{ borderTop: '1px solid var(--border)', background: 'white' }}>
        <div className="container text-center py-10">
          <div className="flex justify-center items-center gap-6 mb-6">
            <div className="flex items-center gap-2 font-bold text-primary opacity-50">
              <div className="logo-icon" style={{ width: '20px', height: '20px', fontSize: '0.6rem', borderRadius: '5px' }}>H</div>
              <span>SmartHealth</span>
            </div>
            <div className="w-[1px] h-4 bg-border"></div>
            <p className="text-xs text-muted font-medium">Patient Care Intelligence v1.0</p>
          </div>
          
          <p className="text-muted text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2">
            Made with <Heart size={12} className="text-danger" /> for Hospitals in Ethiopia
          </p>
          <p className="text-[10px] text-muted opacity-60 mt-3">&copy; 2024 SmartHealth SaaS Solutions · Privacy Policy · Support</p>
        </div>
      </footer>
    </div>
  );
};

export default PatientLayout;
