import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useOutletContext();
  const { cart, cartTotal, clearCart } = useCart();
  const [isDirectBuy, setIsDirectBuy] = useState(false);
  const [directBuyData, setDirectBuyData] = useState(null);
  const [directBuyTotal, setDirectBuyTotal] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [userDetailsLoaded, setUserDetailsLoaded] = useState(false);
  const [isLoadingDirectBuy, setIsLoadingDirectBuy] = useState(false);

  // Direct buy checkout?
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isDirect = queryParams.get('direct') === 'true';
    setIsDirectBuy(isDirect);
    
    if (isDirect) {
      fetchDirectBuyData();
    }
  }, [location.search]);

  // Fetch direct buy data if needed
  const fetchDirectBuyData = async () => {
    try {
      setIsLoadingDirectBuy(true);
      const response = await axios.get('/api/orders/direct-buy-data');
      if (response.data.success) {
        setDirectBuyData(response.data.directBuyData);
        setDirectBuyTotal(response.data.directBuyData.totalAmount);
      } else {
        toast.error('Failed to load product details');
        navigate('/customer/products');
      }
    } catch (error) {
      console.error('Error fetching direct buy data:', error);
      toast.error('Something went wrong. Redirecting to products.');
      navigate('/customer/products');
    } finally {
      setIsLoadingDirectBuy(false);
    }
  };

  // Fetch user data for both checkout types
  useEffect(() => {
    const fetchUserData = async () => {
      // Only proceed if session exists and details haven't been loaded yet
      if (!session || !session._id) {
        console.log('No session available for fetching user data');
        return;
      }
      
      if (userDetailsLoaded) {
        console.log('User details already loaded, skipping fetch');
        return;
      }
  
      try {
        setIsLoadingUserData(true);
        console.log('Fetching user data for delivery details...');
        
        const response = await axios.get(`/api/users/${session._id}`);
        const userData = response.data;
  
        // Populate form with user's saved delivery details or fallback to user profile data
        if (userData.deliveryDetails && Object.keys(userData.deliveryDetails).length > 0) {
          setFormData({
            name: userData.deliveryDetails.name || userData.name || '',
            address: userData.deliveryDetails.address || userData.address || '',
            city: userData.deliveryDetails.city || '',
            postalCode: userData.deliveryDetails.postalCode || '',
            phone: userData.deliveryDetails.phone || userData.phone || '',
          });
          
          toast.info('Your saved delivery details have been loaded', { autoClose: 2000 });
        } else {
          // Fallback to basic user profile data
          setFormData({
            name: userData.name || '',
            address: userData.address || '',
            city: '',
            postalCode: '',
            phone: userData.phone || '',
          });
          
          if (userData.name || userData.address || userData.phone) {
            toast.info('Some basic profile information was loaded', { autoClose: 2000 });
          }
        }
        setUserDetailsLoaded(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Could not load your saved delivery details');
      } finally {
        setIsLoadingUserData(false);
      }
    };
  
    // Trigger fetch user data when session is available, regardless of checkout type
    fetchUserData();
  }, [session]); 
  
  // Secondary effect for loading details when direct buy data is loaded
  useEffect(() => {
    // This ensures delivery details are loaded for direct buy after product data is retrieved
    if (isDirectBuy && directBuyData && !userDetailsLoaded && session) {
      console.log('Direct buy data loaded, ensuring delivery details are populated');
      setUserDetailsLoaded(false); // Reset flag to trigger data fetch
    }
  }, [isDirectBuy, directBuyData, userDetailsLoaded, session]);
  
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.match(/^[0-9]{5}$/)) newErrors.postalCode = 'Enter a valid 5-digit postal code';
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!paymentMethod) newErrors.paymentMethod = 'Please select a payment method';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const sessionUser = session;
    
    try {
      setIsSubmitting(true);
      
      if (isDirectBuy) {
        // Process direct buy order
        const directBuyOrderData = {
          paymentMethod: paymentMethod === 'Card' ? 'Card' : 'Cash on Delivery',
          deliveryDetails: { ...formData }
        };
        
        const response = await axios.post('/api/orders/process-direct-buy', directBuyOrderData);
        
        if (paymentMethod === 'Card') {
          navigate(`/customer/payment?serviceType=Order&amount=${directBuyTotal}&userName=${formData.name}`, { 
            state: { 
              serviceType: 'Order', 
              amount: directBuyTotal, 
              userName: formData.name,
              orderData: response.data.data 
            }
          });
        } else {
          toast.success('Order placed successfully!');
          navigate('/customer/products');
        }
      } else {
        // Process regular cart order
        const orderData = {
          user: sessionUser._id,
          products: (cart?.items || []).map(item => ({
            product: item.product._id,
            quantity: item.quantity
          })),
          totalAmount: cartTotal,
          paymentMethod: paymentMethod === 'Card' ? 'Card' : 'Cash on Delivery', 
          paymentStatus: paymentMethod === 'Card' ? 'Paid' : 'Pending',
          status: 'Pending',
          deliveryDetails: { ...formData }
        };
      
        const response = await axios.post('/api/orders/place-order', orderData);
      
        if (paymentMethod === 'Card') {
          navigate(`/customer/payment?serviceType=Order&amount=${cartTotal}&userName=${formData.name}`, { 
            state: { 
              serviceType: 'Order', 
              amount: cartTotal, 
              userName: formData.name,
              orderData: response.data.data 
            }
          });
        } else {
          await clearCart();
          toast.success('Order placed successfully!');
          navigate('/customer/products');
        }
      }
    } catch (error) {
      toast.warn(`Failed to place order: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save current delivery details to user profile
  const saveDeliveryDetails = async () => {
    if (!session || !session._id) {
      toast.error('You must be logged in to save delivery details');
      return;
    }

    // Before saving
    if (!formData.name || !formData.address || !formData.city || !formData.postalCode || !formData.phone) {
      toast.warn('Please fill in all delivery details before saving');
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append('deliveryDetails.name', formData.name);
      formPayload.append('deliveryDetails.address', formData.address);
      formPayload.append('deliveryDetails.city', formData.city);
      formPayload.append('deliveryDetails.postalCode', formData.postalCode);
      formPayload.append('deliveryDetails.phone', formData.phone);
      
      await axios.put(`/api/users/${session._id}`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Delivery details saved to your profile');
    } catch (error) {
      toast.error('Failed to save delivery details');
      console.error('Error saving delivery details:', error);
    }
  };

  // Check if cart is empty and not direct buy
  const isCartEmpty = !isDirectBuy && (!cart || cart.items?.length === 0);
  
  // Determine if loading
  const isLoading = (isDirectBuy && isLoadingDirectBuy) || isLoadingUserData;
  
  // Get items and total based on checkout type
  const items = isDirectBuy ? (directBuyData?.items || []) : (cart?.items || []);
  const total = isDirectBuy ? directBuyTotal : cartTotal;
  
  return (
    <div className="container h-100 mx-auto px-4 py-8 max-w-2xl bg-[var(--background-light)] p-6">
      <h2 className="text-2xl font-extrabold mb-4 text-[var(--dark-brown)]">
        {isDirectBuy ? 'Express Checkout' : 'Checkout'}
      </h2>
      
      {isLoading ? (
        <p className="text-center py-4">Loading checkout details...</p>
      ) : isCartEmpty ? (
        <p className="text-red-500">Your cart is empty. <a href="/customer/products" className="text-[var(--main-color)] underline">Go to shop</a></p>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-[var(--dark-brown)]">Order Summary</h3>
          <ul className="border rounded p-4 mb-4 bg-[var(--light-grey)]">
            {items.map(item => (
              <li key={item.product._id} className="flex justify-between py-2 border-b">
                <span>{item.product.name} x {item.quantity}</span>
                <span>LKR {(item.product.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
            <li className="font-semibold flex justify-between mt-2">
              <span>Total:</span>
              <span>LKR {total.toFixed(2)}</span>
            </li>
          </ul>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[var(--dark-brown)]">Delivery Details</h3>
              {isLoadingUserData && (
                <span className="text-sm text-gray-500">Loading saved details...</span>
              )}
              {userDetailsLoaded && session && (
                <button type="button" onClick={saveDeliveryDetails} className="text-sm bg-[var(--puppy-brown)] text-white px-3 py-1 rounded hover:bg-[var(--dark-brown)]">
                  Save for future orders
                </button>
              )}
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} placeholder="Recipient's full name" className="w-full p-2 border rounded bg-[var(--white)]" onChange={handleChange} required />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
              <input type="text" id="address" name="address" value={formData.address} placeholder="Street address, apartment, etc." className="w-full p-2 border rounded bg-[var(--white)]" onChange={handleChange} required />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" id="city" name="city" value={formData.city} placeholder="City" className="w-full p-2 border rounded bg-[var(--white)]" onChange={handleChange} required />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} placeholder="5-digit postal code" className="w-full p-2 border rounded bg-[var(--white)]" onChange={handleChange} required />
              {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} placeholder="10-digit phone number" className="w-full p-2 border rounded bg-[var(--white)]" onChange={handleChange} required />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <h3 className="text-lg font-semibold text-[var(--dark-brown)]">Payment Method</h3>
            <div className="flex gap-4">
              <button type="button" onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`px-4 py-2 rounded ${paymentMethod === 'Cash on Delivery' ? 'bg-[var(--puppy-brown)] text-white' : 'bg-[var(--light-grey)] hover:bg-[var(--grey)]'}`}>Cash on Delivery</button>
              
              <button type="button" onClick={() => setPaymentMethod('Card')}
                className={`px-4 py-2 rounded ${paymentMethod === 'Card' ? 'bg-[var(--puppy-brown)] text-white' : 'bg-[var(--light-grey)] hover:bg-[var(--grey)]'}`}>Online Payment</button>
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