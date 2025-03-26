import mongoose from 'mongoose';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export const clearCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "User not logged in" });
    }

    // Find and update the cart
    const cart = await Cart.findOneAndUpdate(
      { user: req.session.user._id },
      { $set: { items: [] } }, // Clear all items
      { new: true }
    ).populate("items.product", "name price images");

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    console.error("Error clearing cart:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "User not logged in" });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ user: req.session.user._id }).populate(
      "items.product",
      "name price images"
    );
    
    if (!cart) {
      cart = new Cart({
        user: req.session.user._id,
        items: [],
      });
      await cart.save();
    }

    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    console.error("Error fetching cart:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
  
    try {
      if (!req.session.user) {
        return res.status(401).json({ success: false, message: "User not logged in" });
      }
  
      console.log("Adding product to cart. Product ID:", productId); // Debug log
  
      // Validate product ID
      if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ success: false, message: "Invalid product ID" });
      }
  
      // Check if product exists
      console.log("Searching for product in database..."); // Debug log
      const product = await Product.findById(productId);
      console.log("Product found:", product); // Debug log
  
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      // Find user's cart or create new one
      let cart = await Cart.findOne({ user: req.session.user._id });
  
      if (!cart) {
        console.log("Creating new cart for user:", req.session.user._id); // Debug log
        cart = new Cart({
          user: req.session.user._id,
          items: [],
        });
      }
  
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );
  
      if (itemIndex > -1) {
        // Update quantity if product exists
        cart.items[itemIndex].quantity += quantity;
        console.log("Updated product quantity in cart:", productId); // Debug log
      } else {
        // Add new item
        cart.items.push({ product: productId, quantity });
        console.log("Added new product to cart:", productId); // Debug log
      }
  
      await cart.save();
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      console.error("Error adding to cart:", err.message); // Debug log
      res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const removeFromCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not logged in" });
    }

    const cart = await Cart.findOne({ user: req.session.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    await cart.save();

    // Fetch updated cart with populated product details
    const updatedCart = await Cart.findOne({ user: req.session.user._id }).populate("items.product");

    res.status(200).json({ success: true, data: updatedCart });
  } catch (err) {
    console.error("Error removing from cart:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  try {
      if (!req.session.user) {
          return res.status(401).json({ error: "User not logged in" });
      }

      const cart = await Cart.findOne({ user: req.session.user._id }).populate("items.product");

      if (!cart) {
          return res.status(404).json({ success: false, message: "Cart not found" });
      }

      const item = cart.items.find((item) => item._id.toString() === itemId);

      if (!item) {
          return res.status(404).json({ success: false, message: "Item not found in cart" });
      }

      item.quantity = quantity;
      await cart.save();

      // Re-fetch the cart with product details populated
      const updatedCart = await Cart.findOne({ user: req.session.user._id }).populate("items.product");

      res.status(200).json({ success: true, data: updatedCart });
  } catch (err) {
      console.error("Error updating cart item:", err.message);
      res.status(500).json({ success: false, message: "Server Error" });
  }
};
