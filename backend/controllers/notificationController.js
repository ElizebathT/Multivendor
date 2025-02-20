const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");

const notificationController = {
    readNotification : asyncHandler(async (req,res) => {
        const {id}=req.body
        const notification = await Notification.findById(id);
        if (!notification) {
          throw new Error("Notification not found");
        }
        notification.isRead = true;
        await notification.deleteOne();
        res.send("Message marked read")
    }),

    getNotifications : asyncHandler(async (req,res) => {
        const notification= await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
        res.send(notification)
      })
}
module.exports=notificationController