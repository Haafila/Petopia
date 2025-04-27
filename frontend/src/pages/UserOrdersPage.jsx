import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useConfirmDialog } from '../components/ConfirmDialog';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/my-orders`);
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  
  const handleCancelOrder = async (orderId) => {
    openConfirmDialog({
        title: 'Cancel Order',
        message: 'Are you sure you want to cancel this order? This action cannot be undone.',
        confirmText: 'Cancel Order',
        onConfirm: async () => {
            try {
                await axios.put(`/api/orders/${orderId}/cancel`); 
                toast.success('Order cancelled successfully');
            } catch (err) {
                toast.error('Failed to cancel order. Please try again.');
            }
        }
    });
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(
        `/api/orders/${orderId}/invoice`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Invoice download failed:', err);
      toast.error('Failed to download invoice. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (loading) return <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading your orders...</p>
                      </div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (orders.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
        <p className="text-gray-600">You don't have any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="container h-100 mx-auto px-20 py-8 mx-auto">
      <h2 className="text-3xl font-extrabold mb-6">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-sm text-gray-500">Order ID: {order._id}</span>
                <p className="font-medium">Placed on: {formatDate(order.createdAt)}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Order Items</h3>
              <ul className="space-y-2">
                {order.products?.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="font-medium">{item.product?.name || "No Name"}</span>
                    <span className="text-sm text-gray-500 ml-2">x{item.quantity || 0}</span>
                    <span>
                      LKR{" "}
                      {item.product?.price && item.quantity
                        ? (item.product.price * item.quantity).toFixed(2)
                        : "0.00"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between items-center border-t pt-4 mt-4">
              <p className="font-semibold text-lg">Total: LKR {order.totalAmount?.toFixed(2)}</p>
              {order.status === 'Pending' && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel Order
                </button>
              )}
              {order.status === 'Delivered' && (
                <button
                  onClick={() => handleDownloadInvoice(order._id)}
                  className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                >
                  Download Invoice
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrdersPage;