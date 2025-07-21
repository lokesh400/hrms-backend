// models/AttendanceAdjustment.js
const mongoose = require("mongoose");

const AttendanceAdjustmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AttendanceAdjustment", AttendanceAdjustmentSchema);
