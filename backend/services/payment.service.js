import Payment from "../models/Payment.js";

const createPayment = async (paymentData) => {
  const payment = new Payment(paymentData);
  return await payment.save();
};

const getAllPayments = async () => {
  return await Payment.find();
};

const getPaymentById = async (id) => {
  return await Payment.findById(id);
};

const updatePayment = async (id, paymentData) => {
  return await Payment.findByIdAndUpdate(id, paymentData, { new: true });
};

const deletePayment = async (id) => {
  return await Payment.findByIdAndDelete(id);
};

export default {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
