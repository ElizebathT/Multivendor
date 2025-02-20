const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    businessName:{ 
        type:  String,
    },
    businessLicense: { 
        type: String,
    },
    address: { 
        type: String,
    },
    phone: { 
        type: String,
    },
    products: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Product" 
        }
    ],
    totalSales: { 
        type: Number, 
        default: 0 
    },
    commissionRate: { 
        type: Number, 
        default: 10 
    }, 
    accountStatus: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
},{timestamps: true});

const Vendor = mongoose.model("Vendor", VendorSchema);
module.exports = Vendor;