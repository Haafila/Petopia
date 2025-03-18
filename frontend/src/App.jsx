import React from 'react'

import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import Login from './components/Login'
import AdminDashboardLayout from './pages/AdminDashboardLayout'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<AdminDashboardLayout />} />
      <Route path="/" element={<Login />} />
    </Routes>
  )
}

export default App
