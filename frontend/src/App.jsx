import React, { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import CustomerDashboardLayout from './layouts/CustomerDashboardLayout';

import ProductsStorePage from './pages/ProductsShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductManagementPage from './pages/ProductsManagementPage';
import OrderManagementPage from './pages/OrdersManagementPage';
import UserOrdersPage from './pages/UserOrdersPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [cartData] = useState([]); 

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RegisterPage />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboardLayout />}>
        <Route path="dashboard" element={<h1>Admin Dashboard</h1>} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
      </Route>

      {/* Customer Routes */}
      <Route path="/customer" element={<CustomerDashboardLayout />}>
        <Route path="dashboard" element={<h1>Customer Dashboard</h1>} />
        <Route path="products" element={<ProductsStorePage />} />
        <Route path="products/cart" element={<CartPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} /> 
        <Route path="products/checkout" element={<CheckoutPage cartItems={cartData} />} />
        <Route path="orders" element={<UserOrdersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
