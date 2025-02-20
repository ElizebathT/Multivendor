const express = require("express");
const orderController = require("../controllers/orderController");
const userAuthentication = require("../middlewares/userAuthentication");

const orderRouter = express.Router();

orderRouter.post("/add", userAuthentication, orderController.createOrder);
orderRouter.get("/view", userAuthentication, orderController.getOrdersByUser);
orderRouter.post("/cancel", userAuthentication, orderController.cancelOrder);
orderRouter.get("/vendor", userAuthentication, orderController.getOrdersByVendor);

module.exports = orderRouter;
