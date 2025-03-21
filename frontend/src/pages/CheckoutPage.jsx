import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios'; 

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
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart?.items?.length) {
      alert("Your cart is empty.");
      return;
    }

    // Get user from your existing session handling
    const sessionUser = { _id: '67d7dda581850a0c88ab9b77' }; // Replace with your actual session user

    const orderData = {
      user: sessionUser._id, // Add user ID from session
      products: cart.items.map(item => ({
        product: item.product._id, // Send just product ID
        quantity: item.quantity
      })),
      totalAmount: cartTotal,
      paymentMethod: paymentMethod, // Add payment method
      paymentStatus: "Pending",
      status: "Pending", // Add order status
      deliveryDetails: {
        name: formData.name, // Name moved here from root
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode, // Correct field name
        phone: formData.phone
      }
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/orders/place-order", orderData);
      await clearCart(); // Wait for cart to clear
      alert("Order placed successfully!");
      navigate('/customer/products'); // Redirect after success
    } catch (error) {
      console.error("Order error:", error.response?.data || error.message);
      alert(`Failed to place order: ${error.response?.data?.message || error.message}`);
      navigate('/customer/products'); // Redirect even on error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-2xl font-extrabold mb-4">Checkout</h2>

      {/* Prevent checkout if cart is empty */}
      {cart?.items?.length === 0 ? (
        <p className="text-red-500">Your cart is empty. <a href="/customer/products" className="text-blue-500 underline">Go to shop</a></p>
      ) : (
        <>
          <h3 className="text-xl font-semibold">Order Summary</h3>
          <ul className="border rounded p-4 mb-4">
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
            {/* Delivery Details */}
            <h3 className="text-lg font-semibold">Delivery Details</h3>
            <input type="text" name="name" placeholder="Full Name" className="w-full p-2 border rounded" onChange={handleChange} required />
            <input type="text" name="address" placeholder="Address" className="w-full p-2 border rounded" onChange={handleChange} required />
            <input type="text" name="city" placeholder="City" className="w-full p-2 border rounded" onChange={handleChange} required />
            <input type="text" name="postalCode" placeholder="Postal Code" className="w-full p-2 border rounded" onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone Number" className="w-full p-2 border rounded" onChange={handleChange} required />

            {/* Payment Method Selection */}
            <h3 className="text-lg font-semibold">Payment Method</h3>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`px-4 py-2 rounded ${
                  paymentMethod === 'Cash on Delivery' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cash on Delivery
              </button>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              disabled={!paymentMethod || isSubmitting}
              className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
