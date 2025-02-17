const express=require("express");
const userRoutes = require("./userRouter");
const productRoutes = require("./productRouter");
const router=express()

router.use("/users", userRoutes);
router.use("/products", productRoutes);

module.exports=router