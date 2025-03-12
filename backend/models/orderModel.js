const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
      required: true,
    },
    otp:{
      type:Number,      
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Preparing", "Ready for Pickup", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    estimatedPreparationTime: {
      type: Number, // in minutes
      default: 30, // Default estimated preparation time
    },
    cancellationReason: {
      type: String,
      default: "",
    },
    paymentDetails: {
      type: String,
      default:"Cash on Delivery",
    },
    address:{
      type:String,
      require:true
    },
    contact:{
      type:Number,
      require:true
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
