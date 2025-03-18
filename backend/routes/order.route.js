import express from "express";
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, updatePaymentStatus } from "../controllers/order.controller.js";
import sessionAuth from "../middleware/session.auth.js";

const router = express.Router();

// Customer Routes
router.post("/place-order", sessionAuth, placeOrder);
router.get("/my-orders", sessionAuth, getUserOrders);

// Admin Routes
router.get("/", getAllOrders);
// Update order status
router.patch("/:orderId/status", updateOrderStatus);
// Update payment status
router.patch("/:orderId/payment-status", updatePaymentStatus);


export default router;
