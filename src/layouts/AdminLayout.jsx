import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const AdminLayout = () => {
  const location = useLocation();
  
  const getPageTitle = (path) => {
    switch(path) {
      case '/admin/dashboard': return 'Dashboard Overview';
      case '/admin/queue':     return 'Queue Management';
      case '/admin/doctor':    return 'Doctor Consultation';
      case '/admin/doctors':   return 'Doctor Management';
      default: return 'Admin Portal';
    }
  };

  return (
    <div className="admin-layout flex">
      <Sidebar />
      <div className="admin-main-wrapper flex-1" style={{marginLeft: '260px'}}>
        <Topbar title={getPageTitle(location.pathname)} />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
