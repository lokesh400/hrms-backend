const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

// Show login form
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// Handle login
router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login"
}));

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/login"));
});

// Registration form (for admin or dev only)
router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", async (req, res) => {
  const { username, password, name, role } = req.body;
  const user = new User({ username, name, role });
  await User.register(user, password);
  res.redirect("/login");
});

// Dashboard redirect
router.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  res.render("dashboard");
});

router.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });

      return res.json({
        success: true,
        user: {
          username: user.username,
          role: user.role,
        },
      });
    });
  })(req, res, next);
});


module.exports = router;
