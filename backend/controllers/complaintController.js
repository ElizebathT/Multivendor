const asyncHandler = require("express-async-handler");
const Complaint = require("../models/complaintModel");
const Notification = require("../models/notificationModel");

const complaintController={
    fileComplaint  : asyncHandler(async (req, res) => {
    const { subject, description } = req.body;
    const complaint = new Complaint({
      user: req.user.id, 
      subject,
      description,
    });
    await complaint.save();
    if(!complaint){
        res.send("Error in filing complaint")
      }
      const notification = new Notification({
        user: req.user.id,
        message: `Complaint registered successfully.`
    });
    await notification.save();
    res.send('Complaint filed successfully');
}),

getAllComplaints :asyncHandler(async (req, res) => {
      const complaints = await Complaint.find().populate('user', 'name')
      if(!complaints){
        res.send("No complaints found")
      }
      res.send(complaints);
  }),

  getUserComplaints :asyncHandler(async (req, res) => {
      const complaints = await Complaint.find({ user: req.user.id })
      if(!complaints){
        res.send("No complaints found")
      }
      res.send(complaints);
  }),
  updateComplaintStatus :asyncHandler(async (req, res) => {
      const { id, status, response } = req.body;
  
      const complaint = await Complaint.findById(id);
      if (!complaint) throw new Error('Complaint not found');
  
      complaint.status = status|| '';
      complaint.response = response || '';
      await complaint.save();

      res.send({ message: 'Complaint updated successfully', complaint });
  }),
}
module.exports=complaintController