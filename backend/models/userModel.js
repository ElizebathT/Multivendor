const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    unique:true,
        minLength:[5,"Minimum 5 characters required"],
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    minLength:[5,"Minimum 5 characters required"]
  },
  role: { 
    type: String, 
    enum: ["customer", "admin", "restaurant_staff", "delivery_person"], 
    required: true 
  },
  phone: { 
      type: String,
  },
  address:{ 
      type:  String,
  },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;