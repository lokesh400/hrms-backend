const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, "jwtsecret", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = verifyToken;


// middleware.js
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }
}

module.exports = { isAdmin };
