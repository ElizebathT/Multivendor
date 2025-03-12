const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  comment: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 10
  },
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
