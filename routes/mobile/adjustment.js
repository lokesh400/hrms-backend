// routes/attendanceAdjustment.js
const express = require("express");
const router = express.Router();
const AttendanceAdjustment = require("../../models/AttendanceAdjustment");
const User = require("../../models/User");
// const { isLoggedIn, isAdmin } = require("./middleware");

// Employee: submit adjustment request
router.post("/attendance-adjustment/apply", async (req, res) => {
  try {
    const { date, reason } = req.body;
    const userId = req.user._id;

    // Prevent duplicate requests for same date
    const existing = await AttendanceAdjustment.findOne({ user: userId, date: new Date(date) });
    if (existing) return res.status(400).json({ error: "Request already submitted for this date" });

    const request = new AttendanceAdjustment({ user: userId, date, reason });
    await request.save();

    res.json({ success: true, message: "Attendance adjustment request submitted" });
  } catch (err) {
    console.error("Attendance adjustment apply error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Employee: list own requests
router.get("/attendance-adjustment/my-requests", async (req, res) => {
  const requests = await AttendanceAdjustment.find({ user: req.user._id }).sort({ appliedAt: -1 });
  res.json({ requests });
});

// Admin: list all pending requests
router.get("/admin/attendance-adjustments", async (req, res) => {
  const requests = await AttendanceAdjustment.find({ status: "Pending" }).populate("user");
  res.render("admin/attendanceAdjustments", { requests });
});

// Admin: approve or reject
router.post("/admin/attendance-adjustments/:id/:action", async (req, res) => {
  const { id, action } = req.params; // action = approve or reject

  if (!["approve", "reject"].includes(action)) return res.status(400).send("Invalid action");

  const status = action === "approve" ? "Approved" : "Rejected";

  const request = await AttendanceAdjustment.findByIdAndUpdate(id, { status }, { new: true });
  if (!request) return res.status(404).send("Request not found");

  // TODO: If approved, mark attendance for that date as present or adjust accordingly

  res.redirect("/admin/attendanceAdjustments");
});

module.exports = router;
