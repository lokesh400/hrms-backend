require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const methodOverride = require("method-override");
const path = require("path");

const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/hrms");

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "layouts/main"); // default layout file views/layouts/main.ejs

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || "hrmsSecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Passport config
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // ✅ VERY IMPORTANT


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global user for EJS
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

const cors = require("cors");
app.use(cors({ origin: "", credentials: true }));


// Routes
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/holiday"));
app.use("/", require("./routes/leave"));
app.use("/employee", require("./routes/employee"));
app.use("/attendance", require("./routes/attendance"));

const apiAttendanceRoutes = require("./routes/mobile/attendance");
app.use("/api/attendance", apiAttendanceRoutes);

const userRoutes = require("./routes/mobile/user");
app.use("/api", userRoutes);

app.use("/api/leave", require("./routes/mobile/leave"));



app.post("/test", (req, res) => {
  console.log("TEST HIT", req.body);
  res.json({ ok: true });
});



app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://192.168.1.6:${PORT}`);
});

