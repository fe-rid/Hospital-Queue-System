import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, LogOut, Clock, Stethoscope, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard',       icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Queue HQ',        icon: <Clock size={20} />,           path: '/admin/queue' },
    { name: 'Doctors Staff',   icon: <Stethoscope size={20} />,     path: '/admin/doctors' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl mb-2">H</div>
        <span className="font-black text-lg">SmartHealth</span>
        <div className="flex items-center gap-1 mt-1">
             <ShieldCheck size={10} className="text-primary" />
             <p className="text-[9px] uppercase tracking-tighter text-muted font-bold">Admin Authority</p>
        </div>
      </div>

      {/* Quick portal links */}
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <Link to="/patient" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#3b82f6', background: '#eff6ff', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', marginBottom: '8px' }}>
           Patient View ➜
        </Link>
        <Link to="/doctor/login" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#059669', background: '#f0fdf4', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', textDecoration: 'none' }}>
           Doctor Console ➜
        </Link>
      </div>

      <nav className="sidebar-nav" style={{ marginTop: '1rem' }}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                {item.icon}
                <span className="font-bold text-sm ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/admin/login" className="nav-link logout">
          <LogOut size={20} />
          <span>Exit System</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
