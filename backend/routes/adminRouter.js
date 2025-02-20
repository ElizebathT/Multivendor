const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const adminController = require("../controllers/adminController");
const adminRoutes = express.Router();

adminRoutes.put("/aprrovevendor", userAuthentication,adminController.approveVendor);

module.exports = adminRoutes;