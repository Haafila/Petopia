import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const placeOrder = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not logged in" });
    }

    const { products, deliveryDetails, paymentMethod } = req.body;

    // Validate inputs (unchanged)
    if (!products || products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let totalAmount = 0;

    // Debug: Log the request body
    console.log("Products in Request:", JSON.stringify(products, null, 2));

    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.product} not found` });
      }

      // Debug: Log product details
      console.log(
        `Calculating: ${product.name} (Quantity: ${item.quantity}, Price: ${product.price})`
      );

      // Calculate subtotal with 2 decimal places
      const subtotal = parseFloat((item.quantity * product.price).toFixed(2));
      totalAmount += subtotal;
    }

    // Round the final total to 2 decimal places
    totalAmount = parseFloat(totalAmount.toFixed(2));

    console.log("Final Total Amount:", totalAmount); // Debug

    // Create and save order (unchanged)
    const newOrder = new Order({
      user: req.session.user._id,
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