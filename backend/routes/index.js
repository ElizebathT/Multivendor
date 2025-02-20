const express=require("express");
const userRoutes = require("./userRouter");
const productRoutes = require("./productRouter");
const vendorRoutes = require("./vendorRouter");
const adminRoutes = require("./adminRouter");
const cartRouter = require("./cartRoutes");
const orderRouter = require("./orderRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const router=express()

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/vendor", vendorRoutes);
router.use("/admin", adminRoutes);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/wishlist", wishlistRoutes);

module.exports=router