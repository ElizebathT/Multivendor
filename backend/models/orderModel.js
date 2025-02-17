const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    products: [
        {
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Product" 
        },
        quantity: { 
            type: Number, 
            required: true 
        },
        price: { 
            type: Number, 
            required: true 
        }
    }],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
        default: "Pending" 
    },
    paymentStatus: { 
        type: String, 
        enum: ["Paid", "Pending", "Refunded"], 
        default: "Pending" 
    },
    transactionId: { 
        type: String 
    },
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;