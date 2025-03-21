// pages/OrderManagementPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import OrderStatusForm from '../components/OrderStatusForm';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = async (page = 1, status = 'all') => {
    try {
      const response = await axios.get(`/api/orders?page=${page}&limit=10&status=${status}`);
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, filterStatus);
  }, [currentPage, filterStatus]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/orders/${id}`);
      toast.success('Order deleted successfully');
      fetchOrders(currentPage, filterStatus);
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleStatusUpdate = async (updatedStatus) => {
    try {
      await axios.put(`/api/orders/${editingOrder._id}`, { status: updatedStatus });
      toast.success('Order status updated successfully');
      setIsFormOpen(false);
      setEditingOrder(null);
      fetchOrders(currentPage, filterStatus);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      {/* Status Filter */}
      <div className="mb-4">
        <label className="mr-2">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Total (LKR)</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-2 border">{order._id}</td>
                <td className="px-4 py-2 border">{order.deliveryDetails.name}</td>
                <td className="px-4 py-2 border">{order.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.status === 'pending'
                        ? 'bg-yellow-200 text-yellow-800'
                        : order.status === 'delivered'
                        ? 'bg-green-200 text-green-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(order)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Update Form */}
      {isFormOpen && (
        <OrderStatusForm
          order={editingOrder}
          onSubmit={handleStatusUpdate}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default OrderManagementPage;