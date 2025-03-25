import React from 'react';
import { useOutletContext } from 'react-router-dom';

const CustomerDashboard = () => {
  const { session } = useOutletContext();

  return (
    <div>
      <h1>Welcome, {session.email}</h1>
    </div>
  );
}

export default CustomerDashboard;