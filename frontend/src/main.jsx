import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ToastContainer } from "react-toastify";
import { ConfirmDialogProvider } from './components/ConfirmDialog.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfirmDialogProvider>
      <BrowserRouter>
        <CartProvider>
          <App />
          <ToastContainer position="top-center" />
        </CartProvider>
      </BrowserRouter>
    </ConfirmDialogProvider>
  </StrictMode>,
)
