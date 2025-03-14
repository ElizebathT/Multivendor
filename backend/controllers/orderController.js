const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Product = require("../models/productModel");

const orderController = {
  // Create a new order
  createOrder: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { address, contact } = req.body;
    
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

        // Create order record
    const order = await Order.create({
      user: userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      paymentStatus: "Pending",
      address,
      contact,
      status: "Accepted"
    });
    

    // Notify admin if stock is low
    const admin = await User.findOne({ role: "admin" });

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        product.availability = product.stock > 0;
        await product.save();

        // Send low stock notification
        if (product.stock < 5) {
          const notify = new Notification({
            user: product.vendor,
            message: `Low stock alert: ${product.name} has less than 5 units left.`
          });
          await notify.save();
        }
      }
    }

    // Clear cart after successful order
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({ message: "Order placed successfully", orderId: order._id });
  }),

  // Get orders for a user
  getOrdersByUser: asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ orders });
  }),

  // Cancel an order
  cancelOrder: asyncHandler(async (req, res) => {
    const { orderId, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.status === "Out for Delivery") {
      return res.status(400).json({ message: "Order cannot be cancelled once out for delivery." });
    }

    // Update the order status to cancelled
    order.status = "Cancelled";
    order.cancellationReason = reason;

    
    await order.save();
    
    res.status(200).json({ message: "Order cancelled successfully", orderId: order._id });
  }),

  
};

module.exports = orderController;
