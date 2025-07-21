const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: {
    type: Date,
    default: () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    },
  },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  location: {
    latitude: Number,
    longitude: Number,
  },
}, {
  timestamps: true,
});

AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
