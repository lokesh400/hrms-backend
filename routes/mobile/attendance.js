const express = require("express");
const Attendance = require("../../models/Attendance");
const User = require("../../models/User");
const Holiday = require("../../models/Holiday"); // import holiday model
const router = express.Router();

// POST /api/attendance/checkin
// router.post("/checkin", async (req, res) => {
//   try {
//     const { username, latitude, longitude } = req.body;

//     const user = await User.findOne({ username });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const today = new Date().toDateString();
//     const existing = await Attendance.findOne({
//       user: user._id,
//       date: { $gte: new Date(today) },
//     });

//     if (existing) {
//       return res.status(400).json({ error: "Already checked in today" });
//     }

//     const attendance = new Attendance({
//       user: user._id,
//       date: new Date(),
//       checkInTime: new Date(),
//       location: { latitude, longitude },
//     });

//     await attendance.save();
//     res.json({ success: true, message: "Checked in successfully" });
//   } catch (err) {
//     console.error("Mobile check-in error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

router.post("/checkin", async (req, res) => {
  try {
    const { username, latitude, longitude } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // ⏰ Use zeroed midnight date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      user: user._id,
      date: { $gte: today },
    });

    if (existing) {
      return res.status(400).json({ error: "Already checked in today" });
    }

    const now = new Date();

    const attendance = new Attendance({
      user: user._id,
      date: today, // ✅ Correct date field
      checkInTime: now, // ✅ Add check-in time
      location: { latitude, longitude },
    });

    await attendance.save();
    res.json({ success: true, message: "Checked in successfully" });
  } catch (err) {
    console.error("Mobile check-in error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// POST /api/attendance/checkout
router.post("/checkout", async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const todayStart = new Date(new Date().toDateString());
    const attendance = await Attendance.findOne({
      user: user._id,
      date: { $gte: todayStart },
    });

    if (!attendance) {
      return res.status(400).json({ error: "Check-in record not found" });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ error: "Already checked out" });
    }

    attendance.checkOutTime = new Date();
    await attendance.save();

    res.json({ success: true, message: "Checked out successfully" });
  } catch (err) {
    console.error("Check-out error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET /api/attendance/today?username=...
router.get("/today", async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const today = new Date().toDateString();
    const record = await Attendance.findOne({
      user: user._id,
      date: { $gte: new Date(today) },
    });

    res.json({ success: true, record });
  } catch (err) {
    console.error("Fetch today's attendance failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});


//
// GET /api/attendance/history?username=...
router.get("/history", async (req, res) => {
  try {
    const { username, month, year } = req.query;
    if (!username) return res.status(400).json({ error: "Username is required" });
    if (!month || !year) return res.status(400).json({ error: "Month and year required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Calculate start and end dates for the month
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: start, $lt: end },
    }).sort({ date: 1 });

    const holidays = await Holiday.find({
      date: { $gte: start, $lt: end },
    });

    res.json({ success: true, records, holidays });
  } catch (err) {
    console.error("Fetch history error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
