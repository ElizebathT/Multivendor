const express=require("express");
const userRoutes = require("./userRouter");
const router=express()

router.use("/users", userRoutes);

module.exports=router