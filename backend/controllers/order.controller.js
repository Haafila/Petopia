import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { products, deliveryDetails, paymentMethod } = req.body;

    // Validate if cart items are provided
    if (!products || products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Validate delivery details
    if (!deliveryDetails || !deliveryDetails.address || !deliveryDetails.city || !deliveryDetails.postalCode || !deliveryDetails.phone) {
      return res.status(400).json({ error: "Delivery details are missing or incomplete" });
    }

    // Validate payment method
    if (!paymentMethod || !["Online Payment", "Cash on Delivery"].includes(paymentMethod)) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    let totalAmount = 0;

    // Validate each product and calculate total amount
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.product} not found` });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({ error: `Invalid quantity for product ${product.name}` });
      }

      // Calculate total price
      totalAmount += item.quantity * product.price;
    }

    // Create new order
    const newOrder = new Order({
      user: req.user._id, // User from JWT
      products,
      totalAmount,
      paymentMethod,
      deliveryDetails,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
};

export const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
  
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ error: "Order not found" });
  
      order.status = status;
      await order.save();
      res.json({ message: "Order status updated", order });
  
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
};

export const updatePaymentStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { paymentStatus } = req.body;
  
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ error: "Order not found" });
  
      order.paymentStatus = paymentStatus;
      await order.save();
      res.json({ message: "Payment status updated", order });
  
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
};
