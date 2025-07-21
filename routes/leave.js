const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");
const User = require("../models/User");

// Middleware to ensure admin access
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && (req.user.role === "admin" || req.user.role === "hr")) {
    return next();
  }
  res.redirect("/login");
}

// Show all leave applications
router.get("/admin/leave", isAdmin, async (req, res) => {
  const leaves = await Leave.find()
    .populate("user")
    .sort({ createdAt: -1 });

  res.render("leave/admin", { leaves });
});

// Approve or Reject leave
router.post("/admin/leave/:id/:action", isAdmin, async (req, res) => {
  const { id, action } = req.params;
  if (!["Approved", "Rejected"].includes(action)) return res.send("Invalid action");

  await Leave.findByIdAndUpdate(id, { status: action });
  res.redirect("/admin/leave");
});

module.exports = router;
