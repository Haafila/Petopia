import express from "express";
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, updatePaymentStatus, deleteOrder, getOrderDetails, cancelOrder, updateOrder } from "../controllers/order.controller.js";
import sessionAuth from "../middleware/auth.session.js";

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
router.patch("/:orderId/status", updateOrderStatus);
router.patch("/:orderId/payment-status", updatePaymentStatus);


export default router;
