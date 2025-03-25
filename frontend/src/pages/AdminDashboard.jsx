import React from 'react';
import { useOutletContext } from 'react-router-dom';

const AdminDashboard = () => {
  const { session } = useOutletContext();

  return (
    <div>
      <h1>Welcome, {session.name}</h1>
    </div>
  );
};

export default AdminDashboard;
