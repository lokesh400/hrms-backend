const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// Middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// Show today's attendance record
router.get("/today", isLoggedIn, async (req, res) => {
  const today = new Date().toDateString();
  const record = await Attendance.findOne({
    user: req.user._id,
    date: { $gte: new Date(today) },
  });
  res.render("attendance/today", { record });
});

// Mark check-in
router.post("/checkin", isLoggedIn, async (req, res) => {
  const today = new Date();
  try {
    await Attendance.create({
      user: req.user._id,
      date: today,
      checkInTime: new Date(),
    });
  } catch (err) {
    console.log("Already checked in or duplicate entry.");
  }
  res.redirect("/attendance/today");
});

// Mark check-out
router.post("/checkout", isLoggedIn, async (req, res) => {
  await Attendance.findOneAndUpdate(
    {
      user: req.user._id,
      date: { $gte: new Date(new Date().toDateString()) },
    },
    { checkOutTime: new Date() }
  );
  res.redirect("/attendance/today");
});

// Admin view: all attendance
router.get("/all", isLoggedIn, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "hr") return res.send("Unauthorized");
  const records = await Attendance.find().populate("user");
  res.render("attendance/all", { records });
});

module.exports = router;
