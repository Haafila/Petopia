import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboardLayout from './pages/AdminDashboardLayout';
import ProductsStorePage from './pages/ProductsShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboardLayout />}>
        <Route path="dashboard" element={<h1>Admin Dashboard</h1>} />
        <Route path="products" element={<ProductsStorePage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} /> 
      </Route>

      {/* Customer Routes 
      <Route path="/customer" element={<CustomerDashboardLayout />}>
        <Route path="dashboard" element={<h1>Customer Dashboard</h1>} />
        <Route path="store" element={<CustomerStorePage />} />
      </Route>*/}
    </Routes>
  );
}

export default App;
