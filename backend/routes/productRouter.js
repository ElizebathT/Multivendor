const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const productController = require("../controllers/productController");
const  upload  = require("../middlewares/cloudinary");
const productRoutes = express.Router();

productRoutes.post("/add", userAuthentication,upload.single("images"),productController.createProduct);
productRoutes.delete("/delete",userAuthentication, productController.deleteProduct);
productRoutes.get("/view", userAuthentication,productController.getAllProducts);
productRoutes.put("/edit", userAuthentication,productController.updateProduct);

module.exports = productRoutes;