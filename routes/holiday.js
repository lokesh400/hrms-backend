// routes/adminHoliday.js
const express = require("express");
const router = express.Router();
const Holiday = require("../models/Holiday");
const { isAdmin } = require("../middleware/verifyToken"); // your admin check middleware

// Get all holidays
router.get("/admin/holidays", isAdmin, async (req, res) => {
  const holidays = await Holiday.find().sort({ date: 1 });
  res.render("admin/holidays", { holidays });
});

// Add holiday
router.post("/admin/holidays/add", isAdmin, async (req, res) => {
  const { date, description } = req.body;
  try {
    await Holiday.create({ date, description });
    res.redirect("/admin/holidays");
  } catch (err) {
    console.error(err);
    res.send("Error adding holiday");
  }
});

// Delete holiday
router.post("/admin/holidays/delete/:id", isAdmin, async (req, res) => {
  await Holiday.findByIdAndDelete(req.params.id);
  res.redirect("/admin/holidays");
});

module.exports = router;
