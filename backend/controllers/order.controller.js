import PDFDocument from 'pdfkit';
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer'; 
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,       
  port: Number(process.env.EMAIL_PORT),
  secure: false,                       
  auth: {
    user: process.env.EMAIL_USER,     
    pass: process.env.EMAIL_PASS      
  }
});

console.log('SMTP config:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER ? 'loaded' : 'missing',
});

// Send cancellation email
const sendOrderCancellationEmail = async (order, user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Cancellation - Order #${order._id.toString().substring(order._id.toString().length - 8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e91e63;">Order Cancellation Notice</h2>
          <p>Dear ${user.name},</p>
          <p>We're writing to inform you that your order <strong>#${order._id.toString().substring(order._id.toString().length - 8)}</strong> has been cancelled.</p>
          
          <h3>Order Summary:</h3>
          <ul>
            <li>Order ID: ${order._id.toString()}</li>
            <li>Total Amount: LKR ${order.totalAmount.toFixed(2)}</li>
            <li>Payment Method: ${order.paymentMethod}</li>
          </ul>
          
          <p>If you have any questions or concerns about this cancellation, please contact our customer service team.</p>
          
          <p>Thank you for your understanding.</p>
          
          <p>Best regards,<br>Petopia Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Cancellation email sent to ${user.email} for Order #${order._id}`);
    return true;
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return false;
  }
};

// Placing an order
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

    // Set paymentStatus
    const paymentStatus = req.body.paymentMethod === 'Card' ? 'Paid' : 'Pending';

    const newOrder = new Order({
      user: req.session.user._id,
      products: cart.items.map((item) => ({ product: item.product._id, quantity: item.quantity })),
      totalAmount,
      paymentMethod: req.body.paymentMethod,
      paymentStatus, 
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
    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Order cannot be canceled at this stage" });
    }

    // Update status
    order.status = "Cancelled";
    await order.save();
    
    // Send cancellation email
    if (order.user && order.user.email) {
      await sendOrderCancellationEmail(order, order.user);
    }
    
    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Error cancelling order:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all user orders
export const getUserOrders = async (req, res) => {
  try {
    // is authenticated ?
    if (!req.user || !req.user._id) {
      const userId = req.user?._id ? req.user._id.toString() : 'not available';
      console.log(`Debug: User ID in session - ${userId}`); // for debugging
      return res.status(401).json({ 
        error: `Unauthorized: User not found. User ID: ${userId}` 
      });
    }

    // Fetch user orders
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("products.product", "name price imageUrl");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log("Updating Order Status - Order ID:", orderId); // Debug
    console.log("New Status:", status); // Debug

    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) return res.status(404).json({ error: "Order not found" });

    const previousStatus = order.status; // Store previous status
    order.status = status;
    await order.save();
    
    // status change to Cancelled
    if (status === "Cancelled" && previousStatus !== "Cancelled") {
      if (order.user && order.user.email) {
        await sendOrderCancellationEmail(order, order.user);
      }
    }

    console.log("Updated Order:", order); // Debug
    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error.message); // Debug
    res.status(500).json({ error: "Server error" });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  // Existing code remains unchanged
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

// Update order status & payment status
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
    
    const order = await Order.findById(id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const previousStatus = order.status; // Store previous status
    
    if (updateData.status) {
      order.status = updateData.status;
      console.log("Updated order status to:", updateData.status);
    }
    
    if (updateData.paymentStatus) {
      order.paymentStatus = updateData.paymentStatus;
      console.log("Updated payment status to:", updateData.paymentStatus);
    }
    
    await order.save();
    
    // order status change to Cancelled
    if (updateData.status === "Cancelled" && previousStatus !== "Cancelled") {
      if (order.user && order.user.email) {
        const emailSent = await sendOrderCancellationEmail(order, order.user);
        console.log("Cancellation email status:", emailSent ? "Sent" : "Failed");
      } else {
        console.log("Could not send email: User or email not found");
      }
    }
    
    res.json({
      message: "Order updated successfully",
      order
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ 
      error: "Server error", 
      details: error.message,
      stack: error.stack 
    });
  }
};

// Download invoice as PDF
export async function downloadInvoice(req, res) {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .lean();
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Prepare PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${orderId}.pdf`
    );
    doc.pipe(res);
    
    // Theme colors
    const colors = {
      primary: '#F5C3C2',  
      accent: '#D3A4A4',  
      text: '#333333',  
      border: '#CCCCCC'
    };
    
    // Header
    doc
      .rect(0, 0, doc.page.width, 170)
      .fill(colors.primary);
    
    // Logo placement
    const logoPath = path.join(__dirname, '../assets/logo1.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 120 });
    }
    
    // Invoice title
    doc
      .fillColor(colors.text)
      .font('Courier-Bold')
      .fontSize(28)
      .text('INVOICE', 350, 85);
    
    // Order and Customer Information
    const infoY = 200;
    
    // Invoice number and date
    doc
      .font('Courier')
      .fontSize(12)
      .fillColor(colors.text)
      .text(`Invoice #: ${orderId}`, 50, infoY);
    
    doc
      .fontSize(12)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 420, infoY);
    
    // Bill to section
    doc
      .font('Courier-Bold')
      .text('Bill To:', 50, infoY + 30)
      .font('Courier')
      .text(order.user?.name || 'N/A', 50, infoY + 50)
      .text(order.user?.email || 'N/A', 50, infoY + 70);
    
    // table header
    const tableTop = infoY + 110;
    const cols = { item: 50, qty: 300, unit: 370, line: 460 };
    doc
      .font('Courier-Bold')
      .fontSize(12)
      .text('Item', cols.item, tableTop)
      .text('Qty', cols.qty, tableTop)
      .text('Unit Price', cols.unit, tableTop)
      .text('Line Total', cols.line, tableTop)
      .moveDown(0.5);

    // table rows
    let y = tableTop + 20;
    doc.font('Courier').fontSize(10);
    order.products.forEach(({ product, quantity }) => {
      const name      = product?.name || 'Unknown';
      const unitPrice = product?.price?.toFixed(2) || '0.00';
      const lineTotal = (product?.price * quantity).toFixed(2);

      doc
        .text(name,          cols.item, y)
        .text(quantity,      cols.qty,  y)
        .text(`LKR ${unitPrice}`, cols.unit, y)
        .text(`LKR ${lineTotal}`, cols.line, y);

      y += 20;
      // light separator
      doc
        .strokeColor(colors.border)
        .lineWidth(0.3)
        .moveTo(cols.item, y - 5)
        .lineTo(cols.line + 60, y - 5)
        .stroke();
    });
    
    // total box
    y += 20;
    
    doc
      .font('Courier-Bold')
      .fontSize(12)
      .text('Grand', 370, y)
      .text(`Total: LKR`, 370, y + 20)
      .fontSize(14)
      .text(`${order.totalAmount.toFixed(2)}`, 400, y + 20, {
        align: 'right'
      });
    
    // Thank you msg
    doc
      .font('Courier-Oblique')
      .fontSize(14)
      .fillColor(colors.accent)
      .text('Thank you for shopping with Petopia Pet Store!', 20, y + 80, { align: 'right' })
    
    doc.end();
  } catch (err) {
    console.error('Error generating invoice:', err);
    res.status(500).json({ message: 'Could not generate invoice' });
  }
}