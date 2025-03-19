import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import AdminSideBar from '../components/AdminSideBar';

const AdminDashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--background-light)' }}>
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSideBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet /> {/* 👈 This renders the nested routes! */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
