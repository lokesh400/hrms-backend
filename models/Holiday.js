// models/Holiday.js
const mongoose = require("mongoose");

const HolidaySchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Holiday", HolidaySchema);
