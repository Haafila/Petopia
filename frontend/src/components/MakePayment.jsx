import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import paymentService from "../services/paymentService";
import { toast } from "react-toastify";

const MakePayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Pre-filled data from URL
  const serviceType = searchParams.get("serviceType") || "Appointment";
  const amount = searchParams.get("amount") || 0;
  const userName = searchParams.get("userName") || "";

  const [formData, setFormData] = useState({
    // Service details
    name: userName,
    email: "",
    serviceType: serviceType,
    amount: amount,
    paymentMethod: "Credit Card",

    // Payment details
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
  });

  const [errors, setErrors] = useState({});

  // Regex for validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const amountRegex = /^(?!0(\.0{1,2})?$)\d+(\.\d{1,2})?$/;
  const cardNumberRegex = /^\d{16}$/;
  const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const cvvRegex = /^\d{3}$/;

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};

    // Validate service details
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email address";
    if (!amountRegex.test(formData.amount)) newErrors.amount = "Invalid amount";

    // Validate payment details
    if (!cardNumberRegex.test(formData.cardNumber)) {
      newErrors.cardNumber = "Invalid card number (16 digits)";
    }
    if (!expiryDateRegex.test(formData.expiryDate)) {
      newErrors.expiryDate = "Invalid expiry (MM/YY)";
    }
    if (!cvvRegex.test(formData.cvv)) {
      newErrors.cvv = "Invalid CVV (3 digits)";
    }
    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = "Cardholder name required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const paymentData = {
          ...formData,
          status: "Pending",
          cardNumber: undefined,
          expiryDate: undefined,
          cvv: undefined,
          cardHolderName: undefined,
        };

        await paymentService.createPayment(paymentData);
        
        toast.success("Payment processed successfully!");
        navigate("/customer/");
      } catch (error) {
        console.error("Error creating payment:", error);
        toast.error("Failed to create payment. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fef9ea] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl grid grid-cols-2 overflow-hidden">
        {/* Service Details Column */}
        <div className="bg-[#f8f4e6] p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-[#3d1e24]">Service Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3d1e24] mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#da828f]"
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d1e24] mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#da828f]"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d1e24] mb-2">Service Type</label>
              <input
                type="text"
                name="serviceType"
                value={formData.serviceType}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d1e24] mb-2">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Details Column */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-[#3d1e24]">Payment Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3d1e24] mb-2">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#da828f]"
                placeholder="1234 5678 9012 3456"
              />
              {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3d1e24] mb-2">Expiry (MM/YY)</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#da828f]"
                  placeholder="MM/YY"
                />
                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3d1e24] mb-2">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#da828f]"
                  placeholder="123"
                />
                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d1e24] mb-2">Cardholder Name</label>
              <input
                type="text"
                name="cardHolderName"
                value={formData.cardHolderName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#da828f]"
                placeholder="John Doe"
              />
              {errors.cardHolderName && <p className="text-red-500 text-sm mt-1">{errors.cardHolderName}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#da828f] text-white py-2 rounded-lg hover:bg-[#c5a7a3] transition duration-300"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;