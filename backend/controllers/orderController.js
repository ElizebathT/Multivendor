const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Delivery = require("../models/deliveryModel");
const Notification = require("../models/notificationModel");

const orderController = {
  // Create a new order
  createOrder: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { address, contact } = req.body;
    
    const cart = await Cart.findOne({ user: userId }).populate("items.productItem");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Find an available driver
    const driver = await User.findOne({ role: "delivery", isAvailable: true }).sort({ lastAssigned: 1 });
    if (!driver) {
      return res.status(503).json({ error: "No available drivers at the moment" });
    }

    // Create delivery record
    const delivery = new Delivery({
      driver: driver._id,
      status: "Out for Delivery",
      estimatedDeliveryTime: 60
    });

    // Create order record
    const order = new Order({
      user: userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      paymentStatus: "Pending",
      estimatedPreparationTime: 30,
      delivery: delivery.id,
      address,
      contact,
      status: "Processing"
    });

    try {
      await order.save();
      delivery.order = order.id;
      await delivery.save();
    } catch (error) {
      return res.status(500).json({ error: "Order creation failed" });
    }

    // Mark driver as unavailable
    driver.isAvailable = false;
    driver.lastAssigned = new Date();
    await driver.save();

    // Notify admin if stock is low
    const admin = await User.findOne({ role: "admin" });

    for (const item of cart.items) {
      const product = await product.findById(item.product._id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        product.availability = product.stock > 0;
        await product.save();

        // Send low stock notification
        if (product.stock < 5) {
          const notify = new Notification({
            recipient: admin._id,
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

    const order = await Order.findById(orderId).populate("delivery");
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.status === "Out for Delivery") {
      return res.status(400).json({ message: "Order cannot be cancelled once out for delivery." });
    }

    // Update the order status to cancelled
    order.status = "Cancelled";
    order.cancellationReason = reason;

    // Remove associated delivery
    if (order.delivery) {
      await Delivery.deleteOne({ _id: order.delivery });
    }

    await order.save();

    // Mark the driver as available again
    if (order.delivery && order.delivery.driver) {
      const driver = await User.findById(order.delivery.driver);
      if (driver) {
        driver.isAvailable = true;
        await driver.save();
      }
    }

    res.status(200).json({ message: "Order cancelled successfully", orderId: order._id });
  })
};

module.exports = orderController;
