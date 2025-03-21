import express from "express";
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, updatePaymentStatus, deleteOrder, getOrderDetails, cancelOrder, updateOrder } from "../controllers/order.controller.js";
import sessionAuth from "../middleware/session.auth.js";

const router = express.Router();

// Customer Routes
router.post("/place-order", sessionAuth, placeOrder);
router.get("/my-orders", sessionAuth, getUserOrders);
router.get("/:orderId", getOrderDetails);
router.put("/:orderId/cancel", cancelOrder);

// Admin Routes
router.get("/", getAllOrders);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
// Update order status
router.patch("/:orderId/status", updateOrderStatus);
// Update payment status
router.patch("/:orderId/payment-status", updatePaymentStatus);


export default router;
