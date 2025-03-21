const express=require("express");
const userRoutes = require("./userRouter");
const productRoutes = require("./productRouter");
const vendorRoutes = require("./vendorRouter");
const adminRoutes = require("./adminRouter");
const cartRouter = require("./cartRoutes");
const orderRouter = require("./orderRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const paymentRoutes = require("./paymentRoutes");
const reviewRouter = require("./reviewRoutes");
const complaintRouter = require("./complaintRoutes");
const notifyRouter = require("./notificationRoutes");
const chatRoutes = require("./chatRouter");
const router=express()

router.use("/payment", paymentRoutes);

router.use(express.json())
router.use("/complaint", complaintRouter);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/notification", notifyRouter);
router.use("/vendor", vendorRoutes);
router.use("/admin", adminRoutes);
router.use("/cart", cartRouter);
router.use("/complaint", complaintRouter);
router.use("/chat", chatRoutes);
router.use("/review", reviewRouter);
router.use("/order", orderRouter);
router.use("/wishlist", wishlistRoutes);

module.exports=router