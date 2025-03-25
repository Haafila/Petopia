import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import AdminSideBar from '../components/AdminSideBar';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useRef } from 'react';

const AdminDashboardLayout = ({ session }) => {
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!session || session.role !== 'admin') {
      if (!toastShownRef.current) {
        toast.warn('You are not authorized to access this page. Please login as an admin.');
        toastShownRef.current = true;
      }
    }
  }, [session]);

  if (!session || session.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--background-light)' }}>
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSideBar />
        <main className="flex-1 overflow-y-auto p-3">
          <Outlet context={{ session }}/> 
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
