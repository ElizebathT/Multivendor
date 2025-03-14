const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");

const notificationController = {
  readNotification: asyncHandler(async (req, res) => {
    const result = await Notification.updateMany(
        { user: req.user.id, isRead: false }, // Find unread notifications
        { $set: { isRead: true } } // Mark them as read
    );

    if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "No unread notifications found" });
    }

    res.json({ message: "All notifications marked as read" });
  }),


  getNotifications: asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ 
        user: req.user.id, 
        isRead: false // Only fetch unread notifications
    }).sort({ createdAt: -1 });

    res.json(notifications);
}),

}
module.exports=notificationController