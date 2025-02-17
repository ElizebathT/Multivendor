const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    vendor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    price: { 
        type: Number, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    images: [
        { 
            type: String }
        ],
    variations: [
        {
        size: String,
        color: String,
        additionalPrice: Number
    }],
    rating: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;