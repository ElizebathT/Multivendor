const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const notificationController = require("../controllers/notificationController");
const notifyRouter = express.Router();

notifyRouter.get("/viewall", userAuthentication,notificationController.getNotifications);
notifyRouter.delete("/read", userAuthentication,notificationController.readNotification);

module.exports = notifyRouter;
