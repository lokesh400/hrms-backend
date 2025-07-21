const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  department: String,
  role: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
