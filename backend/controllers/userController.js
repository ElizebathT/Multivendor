const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler=require("express-async-handler")
const express=require('express');
const User = require("../models/userModel");

const userController={
    register : asyncHandler(async(req,res)=>{        
      const {username,email,password,role}=req.body
      const userExits=await User.findOne({email})
      if(userExits){
          throw new Error("User already exists")
      }
      const hashed_password=await bcrypt.hash(password,10)
      const userCreated=await User.create({
          username,
          email,
          password:hashed_password,
          role
      })
      if(!userCreated){
          throw new Error("User creation failed")
      }
      const payload={
          email:userCreated.email,
          id:userCreated.id
      }
      const token=jwt.sign(payload,process.env.JWT_SECRET_KEY)
      res.cookie("token",token,{
          maxAge:2*24*60*60*1000,
          http:true,
          sameSite:"none",
          secure:false
      })
      res.send("User created successfully")
        }),  
  
    login :asyncHandler(async(req,res)=>{
        const {email,password}=req.body
        const userExist=await User.findOne({email})
        if(!userExist){
            throw new Error("User not found")
        }
        const passwordMatch= bcrypt.compare(userExist.password,password)
        if(!passwordMatch){
            throw new Error("Passwords not matching")
        }
        const payload={
            email:userExist.email,
            id:userExist.id
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET_KEY)
        res.cookie("token",token,{
            maxAge:2*24*60*60*1000,
            sameSite:"none",
            http:true,
            secure:false
        })        
        res.send("Login successful")
        }),

    logout:asyncHandler(async(req,res)=>{
        res.clearCookie("token")
        res.send("User logged out")
        }),

    profile: asyncHandler(async (req, res) => {
        const { username, email, password, role, phone, address } = req.body;
        const userId = req.user.id;         
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            if (password) {
                user.password = await bcrypt.hash(password, 10);
            }
            user.username = username || user.username;
            user.email = email || user.email;
            user.role = role || user.role;
            user.phone = phone || user.phone;
            user.address = address || user.address;
            const updatedUser = await user.save();
            if (!updatedUser) {
                return res.status(500).json({ message: "Error updating profile" });
            }        
            res.send("User profile saved successfully");
    }),
        

    getUserProfile : asyncHandler(async (req, res) => {
        const userId = req.user.id;     
        const user = await User.findById(userId).select("-password"); 
        if (!user) {
            throw new Error("User not found");
        }    
        res.send({
            message: "User details retrieved successfully",
            user
        });
    }),

    changePassword: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
    
        // Validate input
        if (!oldPassword || !newPassword) {
            res.status(400);
            throw new Error("Both old and new passwords are required");
        }
    
        const user = await User.findById(userId);
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }
    
        // Check if old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(401);
            throw new Error("Incorrect old password");
        }
    
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
    
        // Save the updated user
        await user.save();
    
        res.send({
            message: "Password changed successfully",
        });
    })
    
}
module.exports=userController