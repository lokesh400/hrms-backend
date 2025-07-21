const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const User = require("../models/User");

// Middleware to ensure user is admin or HR
function isAdminOrHR(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect("/login");
  if (["admin", "hr"].includes(req.user.role)) return next();
  res.status(403).send("Unauthorized");
}

// List all employees
router.get("/", isAdminOrHR, async (req, res) => {
  const employees = await Employee.find();
  res.render("employee/index", { employees });
});

// Show form to add new employee
router.get("/new", isAdminOrHR, (req, res) => {
  res.render("employee/new");
});

// Handle new employee form submission
router.post("/", isAdminOrHR, async (req, res) => {
  const { name, email, phone, department, role } = req.body;

  // Step 1: Create Employee
  const emp = await Employee.create({ name, email, phone, department, role });

  // Step 2: Optionally create login
  if (req.body.createLogin === "yes") {
    const { loginUsername, loginRole, loginPassword } = req.body;

    // Check if username already exists
    const exists = await User.findOne({ username: loginUsername });
    if (exists) {
      return res.send("User with this username already exists.");
    }

    try {
      const newUser = new User({
        username: loginUsername,
        role: loginRole,
      });
      await User.register(newUser, loginPassword);
    } catch (err) {
      console.error("Error creating login user:", err);
      return res.send("Error creating login user.");
    }
  }

  res.redirect("/employee");
});


// Show edit form
router.get("/:id/edit", isAdminOrHR, async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.redirect("/employee");
  res.render("employee/edit", { employee });
});

// Handle edit form submission
router.put("/:id", isAdminOrHR, async (req, res) => {
  const { name, email, phone, department, role } = req.body;
  await Employee.findByIdAndUpdate(req.params.id, { name, email, phone, department, role });
  res.redirect("/employee");
});

// Handle delete
router.delete("/:id", isAdminOrHR, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.redirect("/employee");
});

module.exports = router;
