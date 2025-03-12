const express = require("express");
const reviewController = require("../controllers/reviewController");
const userAuthentication = require("../middlewares/userAuthentication");

const reviewRouter = express.Router();

reviewRouter.post("/add", userAuthentication,reviewController.addReview);

reviewRouter.get("/get", userAuthentication,reviewController.getReviews);

module.exports = reviewRouter;
