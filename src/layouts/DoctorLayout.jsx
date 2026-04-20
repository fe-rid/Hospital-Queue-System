import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, LogOut, Activity } from 'lucide-react';

const DoctorLayout = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const doctorId   = sessionStorage.getItem('doctor_id');
  const doctorName = sessionStorage.getItem('doctor_name') || 'Doctor';
  const doctorDept = sessionStorage.getItem('doctor_dept') || '';

  const handleLogout = () => {
    sessionStorage.removeItem('doctor_id');
    sessionStorage.removeItem('doctor_name');
    sessionStorage.removeItem('doctor_dept');
    navigate('/doctor/login');
  };

  const navItems = [
    { path: `/doctor/dashboard`, label: 'Dashboard',    icon: <LayoutDashboard size={18} /> },
    { path: `/doctor/queue`,     label: 'My Queue',     icon: <Users size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px', background: 'white', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 50
      }}>
        {/* Logo */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div style={{
              background: '#059669', color: 'white', width: '38px', height: '38px',
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
            }}>
              <Stethoscope size={20} />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#059669' }}>Doctor Portal</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>SmartHealth v2.0</p>
            </div>
          </div>
        </div>

        {/* Doctor info */}
        <div style={{ padding: '1.25rem 1.5rem', background: '#f0fdf4', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', background: '#059669',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem'
            }}>
              {doctorName.split(' ').slice(-1)[0]?.[0] || 'D'}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{doctorName}</p>
              <p style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>{doctorDept}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem' }}>
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '4px',
                background: isActive(item.path) ? '#f0fdf4' : 'transparent',
                color: isActive(item.path) ? '#059669' : 'var(--text-muted)',
                fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.2s'
              }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '1rem 1rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
              padding: '0.8rem 1rem', borderRadius: '10px', color: '#ef4444',
              background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem'
            }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: '260px', flex: 1 }}>
        {/* Top bar */}
        <header style={{
          height: '64px', background: 'white', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2rem', position: 'sticky', top: 0, zIndex: 40
        }}>
          <div className="flex items-center gap-2">
            <Activity size={18} style={{ color: '#059669' }} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Doctor Workstation</span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{
              background: '#f0fdf4', color: '#059669', fontSize: '0.7rem',
              fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '99px', border: '1px solid #bbf7d0'
            }}>
              ● ACTIVE SESSION
            </span>
          </div>
        </header>

        <main style={{ padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
