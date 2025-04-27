import React from 'react';

const OrderDetailsView = ({ 
    order, 
    onClose, 
    onStatusUpdate, 
    onPaymentStatusUpdate, 
    onCancelOrder, 
    formatPrice, 
    renderStatusBadge 
}) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-rose bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Order Information</h3>
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p><span className="font-medium">Order ID:</span> {order._id}</p>
                            <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                            <div className="flex items-center mt-1">
                                <span className="font-medium mr-2">Status:</span> 
                                {renderStatusBadge(order.status)}
                            </div>
                            <div className="flex items-center mt-1">
                                <span className="font-medium mr-2">Payment Status:</span>
                                {renderStatusBadge(order.paymentStatus, 'payment')}
                            </div>
                            <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                            <p><span className="font-medium">Total Amount:</span> {formatPrice(order.totalAmount)}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Delivery Information</h3>
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p><span className="font-medium">Name:</span> {order.deliveryDetails?.name}</p>
                            <p><span className="font-medium">Phone:</span> {order.deliveryDetails?.phone}</p>
                            <p><span className="font-medium">Email:</span> {order.deliveryDetails?.email || (order.user?.email || 'N/A')}</p>
                            <p><span className="font-medium">Address:</span> {order.deliveryDetails?.address}</p>
                            <p><span className="font-medium">City:</span> {order.deliveryDetails?.city}</p>
                            <p><span className="font-medium">Postal Code:</span> {order.deliveryDetails?.postalCode}</p>
                        </div>
                    </div>
                </div>

                <h3 className="font-semibold text-gray-700 mb-2">Order Items</h3>
                <div className="overflow-x-auto mb-6">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Product</th>
                                <th className="py-2 px-4 border-b text-right">Quantity</th>
                                <th className="py-2 px-4 border-b text-right">Price</th>
                                <th className="py-2 px-4 border-b text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.products && order.products.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex items-center">
                                            {item.product?.imageUrl && (
                                                <img 
                                                    src={item.product.imageUrl} 
                                                    alt={item.product.name}
                                                    className="w-12 h-12 object-cover mr-3 rounded"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium">{item.product?.name || 'Unknown Product'}</div>
                                                {item.product?._id && (
                                                    <div className="text-xs text-gray-500">ID: {item.product._id.toString().substr(-8)}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b text-right">{item.quantity}</td>
                                    <td className="py-2 px-4 border-b text-right">
                                        {item.product?.price ? formatPrice(item.product.price) : 'N/A'}
                                    </td>
                                    <td className="py-2 px-4 border-b text-right">
                                        {item.product?.price ? formatPrice(item.product.price * item.quantity) : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                            <tr>
                                <td colSpan="3" className="py-2 px-4 text-right font-semibold">Total:</td>
                                <td className="py-2 px-4 text-right font-semibold">{formatPrice(order.totalAmount)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-end border-t pt-3">
                    {onStatusUpdate && (
                        <button 
                            onClick={onStatusUpdate}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Update Order Status
                        </button>
                    )}
                    
                    {onPaymentStatusUpdate && (
                        <button 
                            onClick={onPaymentStatusUpdate}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Update Payment Status
                        </button>
                    )}
                    
                    {onCancelOrder && order.status !== 'Cancelled' && (
                        <button 
                            onClick={onCancelOrder}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Cancel Order & Send Email
                        </button>
                    )}
                    
                    <button 
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Close
                    </button>
                </div>
                
                {order.status === 'Cancelled' && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                        <p className="font-medium">This order has been cancelled.</p>
                        <p>The customer has been notified via email about the cancellation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailsView;