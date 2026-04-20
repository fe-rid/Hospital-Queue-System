import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, UserPlus, Search, History } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/patient', label: 'Home', icon: <Home size={18} /> },
    { path: '/patient/register', label: 'Register', icon: <UserPlus size={18} /> },
    { path: '/patient/track', label: 'Track Queue', icon: <Search size={18} /> },
  ];

  return (
    <nav className="patient-nav" style={{ position: 'relative' }}>
      <div className="container flex justify-between items-center h-full">
        
        {/* Brand Section */}
        <Link to="/patient" className="sidebar-logo p-0 flex items-center gap-2 no-underline">
          <div className="logo-icon" style={{ background: '#2563eb', color: 'white', fontWeight: '900', borderRadius: '10px' }}>H</div>
          <span style={{ color: '#2563eb', fontWeight: '800', fontSize: '1.25rem' }}>SmartHealth</span>
        </Link>
        
        {/* Navigation Middle */}
        <div className="flex gap-6">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`flex items-center gap-2 text-sm font-semibold transition px-3 py-2 rounded-lg ${isActive ? 'text-primary' : 'text-muted hover:text-primary'}`}
                style={{ background: isActive ? '#eff6ff' : 'transparent' }}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Placeholder for layout balance */}
        <div style={{ width: '120px' }}></div>
      </div>

      {/* ADMIN TOP RIGHT ALONE */}
      <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
        <Link to="/admin/login" className="btn-outline px-4 py-2 text-[10px] uppercase font-bold flex items-center gap-2" style={{ background: 'white', borderRadius: '8px' }}>
          Admin Portal <Shield size={14} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
