const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const vendorController = require("../controllers/vendorController");
const vendorRoutes = express.Router();

vendorRoutes.delete("/delete",userAuthentication, vendorController.deleteVendor);
vendorRoutes.get("/viewall", userAuthentication,vendorController.getVendors);
vendorRoutes.get("/search", userAuthentication,vendorController.getVendorById);
vendorRoutes.put("/save", userAuthentication,vendorController.upsertVendor);

module.exports = vendorRoutes;