import React from 'react'
import AdminHeader from '../components/AdminHeader'  // Import your header component
import AdminSideBar from '../components/AdminSideBar'  // Assuming this exists

const AdminDashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--background-light)' }}>
      {/* Header at the top */}
      <AdminHeader />
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSideBar />
        
        {/* Main content */}
        <main className="flex-1 p-4 overflow-y-auto">
          {children}  {/* This will render nested routes/content */}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboardLayout