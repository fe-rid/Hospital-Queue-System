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
    <nav className="patient-nav">
      <div className="container flex justify-between items-center h-full">
        <Link to="/patient" className="sidebar-logo p-0">
          <div className="logo-icon">H</div>
          <span>SmartHealth</span>
        </Link>
        
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

        <div>
          <Link to="/admin/login" className="btn-outline px-4 py-2 text-xs flex items-center gap-2">
            <Shield size={14} /> Admin Portal
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
