import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import CustomerDashboardLayout from './layouts/CustomerDashboardLayout';
import ProductsStorePage from './pages/ProductsShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductManagementPage from './pages/ProductsManagementPage';
import OrderManagementPage from './pages/OrdersManagementPage';
import UserOrdersPage from './pages/UserOrdersPage';
import RegisterPage from './pages/Register';
import LandingPage from './pages/LandingPage';
import LandingLayout from './layouts/LandingLayout';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminPayment from './components/AdminPayment';
import MakePayment from './components/MakePayment';


import ServiceType from "./components/ServiceTypes"
import Grooming from "./components/GroomingForm"
import Medical from "./components/MedicalForm"
import Training from "./components/TrainingForm"
import Boarding from "./components/BoardingForm"
import AppointmentList from './components/AppointmentList';
import UserAppointments from './components/UserAppointments';
import StaffAppointmentList from './components/StaffAppointment';

function App() {
  const [cartData] = useState([]);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/users/session', {
          credentials: 'include', 
        });
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, []);

  if (isLoading) {
    return  <div className="text-center py-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p></div>; 
  }

  return (
    <Routes>
      {/* Landing Layout Routes */}
      <Route path="/" element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="store" element={<ProductsStorePage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboardLayout session={session}/>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="payments" element={<AdminPayment />} />
        <Route path="AppointmentList" element ={<AppointmentList />} />
      </Route>

      {/* Customer Routes */}
      <Route path="/customer" element={<CustomerDashboardLayout session={session}/>}>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="products" element={<ProductsStorePage />} />
        <Route path="payment" element={<MakePayment />} />
        <Route path="products/cart" element={<CartPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="products/checkout" element={<CheckoutPage cartItems={cartData} />} />
        <Route path="orders" element={<UserOrdersPage />} />
        <Route path="ServiceType" element={<ServiceType />} />
        <Route path="bookGrooming" element={<Grooming />} />
        <Route path="bookMedical" element={<Medical />} />
        <Route path="bookTraining" element={<Training />} />
        <Route path="bookBoarding" element={<Boarding />} />
        <Route path="UserAppointments" element ={<UserAppointments />} />
      </Route>

       {/* staff Routes */}
      <Route path="/appointments/grooming" element={<StaffAppointmentList serviceType="Grooming" />} />
      <Route path="/appointments/training" element={<StaffAppointmentList serviceType="Training" />} />
      <Route path="/appointments/medical" element={<StaffAppointmentList serviceType="Medical" />} />
      <Route path="/appointments/boarding" element={<StaffAppointmentList serviceType="Boarding" />} />


      
    </Routes>
  );
}

export default App;
