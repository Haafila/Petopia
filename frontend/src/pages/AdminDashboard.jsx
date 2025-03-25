import React from 'react';
import { useOutletContext } from 'react-router-dom';

const AdminDashboard = () => {
  const { session } = useOutletContext();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="mb-2"><strong>User ID:</strong> {session._id}</p>
        <p className="mb-2"><strong>Name:</strong> {session.name}</p>
        <p className="mb-2"><strong>Email:</strong> {session.email}</p>
        <p className="mb-2"><strong>Role:</strong> {session.role}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
