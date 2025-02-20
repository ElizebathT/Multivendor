const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const wishlistController = require("../controllers/wishlistController");
const wishlistRoutes = express.Router();

wishlistRoutes.delete("/delete",userAuthentication, wishlistController.removeFromWishlist);
wishlistRoutes.get("/view", userAuthentication,wishlistController.getWishlist);
wishlistRoutes.post("/save", userAuthentication,wishlistController.addToWishlist);

module.exports = wishlistRoutes;