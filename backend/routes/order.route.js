import express from "express";
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

// Customer Routes
router.post("/", placeOrder);
router.get("/my-orders", getUserOrders);

// Admin Routes
router.get("/", getAllOrders);
router.put("/:orderId", updateOrderStatus);

export default router;
