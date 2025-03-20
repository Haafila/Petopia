import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

// Place an order
export const placeOrder = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "User not logged in" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: req.session.user._id }).populate(
      "items.product",
      "name price"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let totalAmount = 0;

    // Calculate the total amount and validate products
    for (let item of cart.items) {
      const product = item.product;
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`,
        });
      }

      // Calculate subtotal with 2 decimal places
      const subtotal = parseFloat((item.quantity * product.price).toFixed(2));
      totalAmount += subtotal;
    }

    // Round the final total to 2 decimal places
    totalAmount = parseFloat(totalAmount.toFixed(2));

    // Create and save the order
    const newOrder = new Order({
      user: req.session.user._id,
      products: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentMethod: req.body.paymentMethod, // Payment method from request body
      deliveryDetails: req.body.deliveryDetails, // Delivery details from request body
    });

    await newOrder.save();

    // Clear the user's cart after placing the order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
      // Ensure user is authenticated
      if (!req.user || !req.user._id) {
        const userId = req.user?._id ? req.user._id.toString() : 'not available';
        console.log(`Debug: User ID in session - ${userId}`); // Debug log
        return res.status(401).json({ 
            error: `Unauthorized: User not found. User ID: ${userId}` 
        });
      }

      // Fetch user orders sorted by creation date (newest first)
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

      res.status(200).json(orders);
  } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ error: "Internal Server Error" });
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

    console.log("Updating Order Status - Order ID:", orderId); // Debug
    console.log("New Status:", status); // Debug

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    console.log("Updated Order:", order); // Debug
    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error.message); // Debug
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    console.log("Updating Payment Status - Order ID:", orderId); // Debug
    console.log("New Payment Status:", paymentStatus); // Debug

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.paymentStatus = paymentStatus;
    await order.save();

    console.log("Updated Order:", order); // Debug
    res.json({ message: "Payment status updated", order });
  } catch (error) {
    console.error("Error updating payment status:", error.message); // Debug
    res.status(500).json({ error: "Server error" });
  }
};