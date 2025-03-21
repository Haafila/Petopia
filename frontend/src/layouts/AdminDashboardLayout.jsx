import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import AdminSideBar from '../components/AdminSideBar';

const AdminDashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--background-light)' }}>
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSideBar />
        <main className="flex-1 overflow-y-auto p-3">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
