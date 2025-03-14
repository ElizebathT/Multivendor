const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const adminController = require("../controllers/adminController");
const adminAuthentication = require("../middlewares/admin");
const adminRoutes = express.Router();

adminRoutes.put("/vendor", userAuthentication,adminAuthentication,adminController.approveOrRejectVendor);
adminRoutes.get("/viewall", userAuthentication,adminAuthentication,adminController.getDetails);

module.exports = adminRoutes;