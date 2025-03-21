import React from 'react';

const OrderDetailsView = ({ 
    order, 
    onClose, 
    onStatusUpdate,
    onPaymentStatusUpdate,
    formatPrice, 
    renderStatusBadge 
}) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-[var(--main-color)]/70">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Order Information</h3>
                        <p className="text-sm"><span className="font-medium">Order ID:</span> {order._id}</p>
                        <p className="text-sm"><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                        <p className="text-sm"><span className="font-medium">Status:</span> {renderStatusBadge(order.status)}</p>
                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={onStatusUpdate}
                                className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600"
                            >
                                Update Order Status
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Customer & Payment</h3>
                        <p className="text-sm"><span className="font-medium">Customer:</span> {order.deliveryDetails?.name || 'N/A'}</p>
                        <p className="text-sm"><span className="font-medium">Phone:</span> {order.deliveryDetails?.phone || 'N/A'}</p>
                        <p className="text-sm"><span className="font-medium">Payment Method:</span> {order.paymentMethod || 'N/A'}</p>
                        <p className="text-sm">
                            <span className="font-medium">Payment Status:</span> {renderStatusBadge(order.paymentStatus, 'payment')}
                        </p>
                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={onPaymentStatusUpdate}
                                className="bg-purple-500 text-white px-3 py-1 text-sm rounded hover:bg-purple-600"
                            >
                                Update Payment Status
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
                    <p className="text-sm">{order.deliveryDetails?.address || 'N/A'}</p>
                    <p className="text-sm">{`${order.deliveryDetails?.city || ''} ${order.deliveryDetails?.postalCode || ''}`}</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                              <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                              </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                              {order.products?.map((item, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                                          {item.product?._id || item.product || "N/A"}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                                          {item.quantity}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-base mt-2">
                        <span>Total:</span>
                        <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsView;