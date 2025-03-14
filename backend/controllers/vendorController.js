const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");
const asyncHandler = require("express-async-handler");

const vendorController = {
    upsertVendor: asyncHandler(async (req, res) => {
        const { businessName, businessLicense, address, phone, accountStatus } = req.body;
        let vendor = await Vendor.findOne({ businessName });
        const user = await User.findById(req.user.id);

        if (vendor) {
            // Update existing vendor
            vendor.businessLicense = businessLicense || vendor.businessLicense;
            vendor.address = address || vendor.address;
            vendor.phone = phone || vendor.phone;
            vendor.accountStatus = accountStatus || vendor.accountStatus;
        } else {
            // Create new vendor
            vendor = new Vendor({
                user: user.id,
                businessName,
                businessLicense,
                address: address || user.address,
                phone: phone || user.phone,
            });
        }

        const savedVendor = await vendor.save();
        res.send(savedVendor);
    }),

    

    getVendorById: asyncHandler(async (req, res) => {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        
        const vendors = await Vendor.find({
            $or: [
                { businessName: { $regex: query, $options: "i" } }
            ]
        }).populate("user", "name email").populate("products");
        
        res.send(vendors);
    }),

    deleteVendor: asyncHandler(async (req, res) => {
        const {id}=req.body
        const vendor = await Vendor.findById(id);
        
        if (vendor) {
            await vendor.remove();
            res.send({ message: "Vendor removed successfully" });
        } else {
            throw new Error("Vendor not found");
        }
    }),

    getOrdersByVendor : asyncHandler(async (req, res) => {
        const vendor = await Vendor.find({ user: req.user.id });
            const vendorProducts = await Product.find({ vendor: vendor._id });
    
            const productIds = vendorProducts.map(product => product._id);
          console.log(productIds);
          
            // Find orders that include vendor's products
            const orders = await Order.find({
              "items.product": { $in: productIds }
          })   
            .populate("user", "name email") // Populate user details
            .populate("items.product", "name price") // Populate product details
            .sort({ createdAt: -1 });
    
            res.status(200).json(orders);
    }),

    updateOrderStatus: asyncHandler(async (req, res) => {
        const { orderId, status } = req.body;
    
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({ message: "Order not found." });
        }
    
        // Validate status update logic
        const validStatuses = ["Accepted", "Preparing", "Ready for Pickup", "Out for Delivery", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ message: "Invalid status update." });
        }
    
        order.status = status;
        await order.save();
    
        
    
        res.status(200).json({ message: "Order status updated successfully", orderId: order._id, newStatus: status });
      }),
};

module.exports = vendorController;
