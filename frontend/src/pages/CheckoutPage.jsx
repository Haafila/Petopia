import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
      toast.warn('Full Name is required');
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      toast.warn('Address is required');
    }
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.match(/^[0-9]{5}$/)) newErrors.postalCode = 'Enter a valid 5-digit postal code';
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
      toast.warn('Please select a payment method');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const sessionUser = { _id: '67d7dda581850a0c88ab9b77' };
    const orderData = {
      user: sessionUser._id,
      products: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      totalAmount: cartTotal,
      paymentMethod,
      paymentStatus: 'Pending',
      status: 'Pending',
      deliveryDetails: { ...formData }
    };

    try {
      setIsSubmitting(true);
      await axios.post('/api/orders/place-order', orderData);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/customer/products');
    } catch (error) {
      toast.warn(`Failed to place order: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl bg-[var(--background-light)] p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-extrabold mb-4 text-[var(--dark-brown)]">Checkout</h2>
      {cart?.items?.length === 0 ? (
        <p className="text-red-500">Your cart is empty. <a href="/customer/products" className="text-[var(--main-color)] underline">Go to shop</a></p>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-[var(--dark-brown)]">Order Summary</h3>
          <ul className="border rounded p-4 mb-4 bg-[var(--light-grey)]">
            {cart.items.map(item => (
              <li key={item.product._id} className="flex justify-between py-2 border-b">
                <span>{item.product.name} x {item.quantity}</span>
                <span>LKR {(item.product.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
            <li className="font-semibold flex justify-between mt-2">
              <span>Total:</span>
              <span>LKR {cartTotal.toFixed(2)}</span>
            </li>
          </ul>

          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--dark-brown)]">Delivery Details</h3>
            {['name', 'address', 'city', 'postalCode', 'phone'].map(field => (
              <div key={field}>
                <input type="text" name={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} 
                  className="w-full p-2 border rounded bg-[var(--white)]" onChange={handleChange} required />
                {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
              </div>
            ))}

            <h3 className="text-lg font-semibold text-[var(--dark-brown)]">Payment Method</h3>
            <div className="flex gap-4">
              <button type="button" onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`px-4 py-2 rounded ${paymentMethod === 'Cash on Delivery' ? 'bg-[var(--puppy-brown)] text-white' : 'bg-[var(--light-grey)] hover:bg-[var(--grey)]'}`}>Cash on Delivery</button>
            </div>
            {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod}</p>}

            <button type="submit" disabled={!paymentMethod || isSubmitting} 
              className="w-full bg-[var(--main-color)] text-white py-3 rounded hover:bg-[var(--light-purple)] disabled:bg-[var(--grey)]">
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
