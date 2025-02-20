const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    vendor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Vendor", 
        required: true 
    },
    name: { 
        type: String,},
    description: { 
        type: String,},
    category: { 
        type: String,},
    images: { 
        type: [String],},
    price: { 
        type: Number,},
    stock: { 
        type: Number,},
    bulkDiscounts: [
        { 
            minQuantity: Number, 
            discountedPrice: Number 
        }
    ],
    variations: [
        {
            attribute: String, // e.g., color, size
            value: String
        }
    ],
    ratings: { 
        type: Number, 
        default: 0 },
    totalReviews: { 
        type: Number, 
        default: 0 },
    availability:
        {
            type:Boolean,
            default:true
        }
},{timestamps: true});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;