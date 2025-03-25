import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

export const placeOrder = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "User not logged in" });
    }

    const cart = await Cart.findOne({ user: req.session.user._id }).populate("items.product", "name price quantity");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (!req.body.paymentMethod || !req.body.deliveryDetails) {
      return res.status(400).json({ success: false, message: "Missing payment method or delivery details" });
    }

    let totalAmount = 0;
    for (let item of cart.items) {
      const product = item.product;
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }
      totalAmount += parseFloat((item.quantity * product.price).toFixed(2));
      product.quantity -= item.quantity; // Deduct quantity
      await product.save();
    }
    totalAmount = parseFloat(totalAmount.toFixed(2));

    // Set paymentStatus based on the payment method selected
    const paymentStatus = req.body.paymentMethod === 'Online Payment' ? 'Paid' : 'Pending';

    const newOrder = new Order({
      user: req.session.user._id,
      products: cart.items.map((item) => ({ product: item.product._id, quantity: item.quantity })),
      totalAmount,
      paymentMethod: req.body.paymentMethod,
      paymentStatus, // Add paymentStatus to the order
      deliveryDetails: req.body.deliveryDetails,
    });

    await newOrder.save();
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, message: "Order placed successfully!", data: newOrder });
  } catch (error) {
    console.error("Error placing order:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
      const deletedOrder = await Order.findByIdAndDelete(req.params.id);
      
      if (!deletedOrder) {
          return res.status(404).json({ message: 'Order not found' });
      }
      
      res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({ message: 'Failed to delete order' });
  }
};

// Get order details
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("products.product").populate("user", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Order cannot be canceled at this stage" });
    }

    order.status = "Cancelled";
    await order.save();
    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Error cancelling order:", error.message);
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
      const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("products.product", "name price imageUrl");

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

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log("Updating Order:", id);
    console.log("Update Data:", updateData);
    
    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid order ID format" });
    }
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    if (updateData.status) {
      order.status = updateData.status;
      console.log("Updated order status to:", updateData.status);
    }
    
    if (updateData.paymentStatus) {
      order.paymentStatus = updateData.paymentStatus;
      console.log("Updated payment status to:", updateData.paymentStatus);
    }
    
    await order.save();
    
    res.json({
      message: "Order updated successfully",
      order
    });
  } catch (error) {
    console.error("Error updating order:", error);
    // Send more detailed error information
    res.status(500).json({ 
      error: "Server error", 
      details: error.message,
      stack: error.stack 
    });
  }
};
