import React, { useState } from 'react';

const OrderFilter = ({ onFilterApply }) => {
    const [orderStatus, setOrderStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const orderStatuses = [
        'Pending', 
        'Processing', 
        'Shipped', 
        'Delivered', 
        'Cancelled'
    ];

    const paymentStatuses = [
        'Paid', 
        'Pending', 
        'Failed'
    ];

    const handleApplyFilter = () => {
        const filters = {
            orderStatus,
            paymentStatus,
            dateFrom,
            dateTo
        };
        onFilterApply(filters);
    };

    const handleResetFilter = () => {
        setOrderStatus('');
        setPaymentStatus('');
        setDateFrom('');
        setDateTo('');
        onFilterApply(null);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Filters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Order Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order Status
                    </label>
                    <select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="w-full border border-pink-300 rounded px-2 py-1"
                    >
                        <option value="">All Statuses</option>
                        {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Payment Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Status
                    </label>
                    <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="w-full border border-pink-300 rounded px-2 py-1"
                    >
                        <option value="">All Payment Statuses</option>
                        {paymentStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date From Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date From
                    </label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full border border-pink-300 rounded px-2 py-1"
                    />
                </div>

                {/* Date To Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date To
                    </label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full border border-pink-300 rounded px-2 py-1"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
                <button
                    onClick={handleResetFilter}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                    Reset
                </button>
                <button
                    onClick={handleApplyFilter}
                    className="bg-rose-300 text-white px-4 py-2 rounded hover:bg-rose-400 transition"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
};

export default OrderFilter;