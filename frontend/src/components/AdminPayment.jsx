// frontend/src/components/AdminPayments.jsx
import React, { useEffect, useState } from "react";
import paymentService from "../services/paymentService";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [searchPaymentId, setSearchPaymentId] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter payments whenever search criteria change
  useEffect(() => {
    const filtered = payments.filter((payment) => {
      const matchesPaymentId = payment.paymentId
        .toLowerCase()
        .includes(searchPaymentId.toLowerCase());
      const matchesAmount = payment.amount.toString().includes(searchAmount);
      return matchesPaymentId && matchesAmount;
    });
    setFilteredPayments(filtered);
  }, [searchPaymentId, searchAmount, payments]);

  const fetchPayments = async () => {
    try {
      const data = await paymentService.getAllPayments();
      setPayments(data);
      setFilteredPayments(data); // Initialize filtered payments
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await paymentService.updatePayment(id, { status: newStatus });
      alert("Status updated successfully!");
      fetchPayments(); // Refresh the list
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Admin Payment Report", 10, 10);

    const tableData = filteredPayments.map((payment) => [
      payment.paymentId,
      payment.name,
      payment.email,
      payment.serviceType,
      payment.amount,
      payment.paymentMethod,
      payment.status,
    ]);

    autoTable(doc, {
      head: [
        [
          "Payment ID",
          "Name",
          "Email",
          "Service Type",
          "Amount",
          "Payment Method",
          "Status",
        ],
      ],
      body: tableData,
    });

    doc.save("admin_payments_report.pdf");
  };

  return (
    <div className="h-full flex flex-col bg-[#fef9ea]">
      {/* Navbar */}
      <nav className="bg-[#da828f] p-4 text-white">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Payments Management</h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4 flex-1">
        {/* Search Filters */}
        <div className="mb-4 flex gap-4">
          <span className="text-[#3d1e24]">Search Payment ID:</span>
          <input
            type="text"
            placeholder="Search by Payment ID"
            value={searchPaymentId}
            onChange={(e) => setSearchPaymentId(e.target.value)}
            className="w-50 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#da828f]"
          />
        </div>

        {/* Generate PDF Button */}
        <button
          onClick={generatePDF}
          className="mb-4 bg-[#3d1e24] text-white px-4 py-2 rounded-lg hover:bg-[#5a2d3a] transition duration-300"
        >
          Generate PDF Report
        </button>

        {/* Payments Table */}
        <table className="w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-[#da828f] text-white">
              <th className="p-3">Payment ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Service Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Status</th>
              <th className="p-3">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment._id} className="border-b">
                <td className="p-3 text-center">{payment.paymentId}</td>
                <td className="p-3 text-center">{payment.name}</td>
                <td className="p-3 text-center">{payment.email}</td>
                <td className="p-3 text-center">{payment.serviceType}</td>
                <td className="p-3 text-center">{payment.amount}</td>
                <td className="p-3 text-center">{payment.paymentMethod}</td>
                <td className="p-3 text-center">{payment.status}</td>
                <td className="p-3 text-center">
                  <select
                    value={payment.status}
                    onChange={(e) =>
                      handleStatusChange(payment._id, e.target.value)
                    }
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#da828f]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer className="bg-[#da828f] p-4 text-white text-center">
        <p>&copy; 2025 Admin Payments. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminPayments;
