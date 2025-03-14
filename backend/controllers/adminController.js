const Notification = require("../models/notificationModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Vendor = require("../models/vendorModel");
const asyncHandler = require("express-async-handler");

const adminController = {
    approveOrRejectVendor: asyncHandler(async (req, res) => {
        const { id, accountStatus } = req.body;
    
        // Validate accountStatus value
        if (!["approved", "rejected"].includes(accountStatus)) {
            return res.status(400).json({ message: "Invalid account status" });
        }
    
        const vendor = await Vendor.findById(id);
    
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
    
        // Update account status
        vendor.accountStatus = accountStatus;
        await vendor.save();
        const notification = new Notification({
            user: vendor._id,
            message: `Your vendor account has been ${accountStatus}.`
        });
        await notification.save();
        const statusMessage = accountStatus === "approved" ? "approved" : "rejected";
        res.json({ message: `Vendor account ${statusMessage} successfully`, vendor });
    }),

    getDetails: asyncHandler(async (req, res) => {
            const orders = await Order.find()
            const products = await Product.find()
            const vendors = await Vendor.find()
            if (orders.length === 0) {
              return res.status(404).json({ message: "No orders found" });
            }
            if (products.length === 0) {
                return res.status(404).json({ message: "No products found" });
              }
            res.status(200).json({ orders,products,vendors });
          }),
};

module.exports = adminController;
