const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");
const router = express.Router();

// POST: Mobile login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) return res.status(401).json({ error: "Login failed" });

    req.login(user, { session: false }, (err) => {
      if (err) return res.status(401).json({ error: err });

      const token = jwt.sign({ id: user._id, role: user.role }, "jwtsecret", { expiresIn: "7d" });
      return res.json({ token });
    });
  })(req, res, next);
});

module.exports = router;