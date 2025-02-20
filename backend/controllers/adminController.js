const Vendor = require("../models/vendorModel");
const asyncHandler = require("express-async-handler");

const adminController = {
    approveVendor: asyncHandler(async (req, res) => {
        const { id,accountStatus } = req.body;
        
        const vendor = await Vendor.findById(id);
        
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        
        vendor.accountStatus = accountStatus;
        await vendor.save();
        
        res.send({ message: "Vendor account approved successfully", vendor });
    }),
};

module.exports = adminController;
