import express from "express";
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart } from "../controllers/cart.controller.js";
import sessionAuth from "../middleware/auth.session.js";

const router = express.Router();

// Customer Routes
router.get("/", sessionAuth, getCart); // Get user's cart
router.post("/add", sessionAuth, addToCart); // Add item to cart
router.delete("/clear", clearCart); // Clear all cart items
router.delete("/remove/:itemId", sessionAuth, removeFromCart); // Remove item from cart
router.put("/update/:itemId", sessionAuth, updateCartItem); // Update item quantity

export default router;