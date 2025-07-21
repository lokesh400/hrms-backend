const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dates: [
    {
      date: { type: Date, required: true },
      duration: { type: String, enum: ["Full Day", "Half Day Morning", "Half Day Evening"], required: true },
      category: { type: String, enum: ["Paid", "Unpaid"], default: "Paid" }
    }
  ],
  reason: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Leave", LeaveSchema);
