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

    getVendors: asyncHandler(async (req, res) => {
        const vendors = await Vendor.find().populate("user", "name email").populate("products");
        res.send(vendors);
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
    })
};

module.exports = vendorController;
