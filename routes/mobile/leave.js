const express = require("express");
const router = express.Router();
const Leave = require("../../models/Leave");
const User = require("../../models/User");

// POST /api/leave/apply
router.post("/apply", async (req, res) => {
  try {
    const { username, dates, reason } = req.body;

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ error: "Leave dates required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const formattedDates = dates.map((d) => ({
      date: new Date(d.date),
      duration: d.duration,
      category: d.category || "Paid",
    }));

    const leave = new Leave({
      user: user._id,
      reason,
      dates: formattedDates,
    });

    await leave.save();
    res.json({ success: true, message: "Leave applied" });
  } catch (err) {
    console.error("Enhanced leave apply error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET /api/leave/history?username=...
router.get("/history", async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const leaves = await Leave.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ success: true, leaves });
  } catch (err) {
    console.error("Leave history error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
