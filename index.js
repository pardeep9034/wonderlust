const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const expresserr = require("./utils/expresserr");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users");
const flash = require("connect-flash");
require('dotenv').config();


// MongoDB Connection
async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
  console.log("Connected to MongoDB");
}
main().catch((err) => console.log(err));

// App Configuration
const port = 3000;
app.set("view engine", "ejs");
app.engine("ejs", ejsmate);  // Use ejs-mate for layouts
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));


// Store session in MongoDB
const store = MongoStore.create(
  { mongoUrl: process.env.ATLASDB_URL,
    crypto: {
    secret: process.env.SECRET || "thisisnotasecret"
  },
    touchAfter: 24 * 3600 
   }

);
store.on("error", function (e) {
  console.log("Session Store Error", e);
});

// Session Configuration

const sessionOptions = {
  store,
  secret: process.env.SECRET || "thisisnotasecret", // Better to use an env variable for production
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
};




app.use(session(sessionOptions));

// Passport & Flash Setup
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Set flash messages globally
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user
  next();
});

// Passport Configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get("/", (req, res) => {
  res.redirect("/listings"); // Home route redirects to /listings for now
});

app.use("/listings", require("./routes/listingRoute"));
app.use("/listings/:id/reviews", require("./routes/reviewRoute"));
app.use("/", require("./routes/userRoute"));

// Error Handling for All Undefined Routes
app.all("*", (req, res, next) => {
  next(new expresserr("Page Not Found", 404));
});

// General Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;

  if (!res.headersSent) {
    res.status(statusCode).send(message); // or res.render('error.ejs', { err });
  } else {
    next(err); // if headers are already sent, pass the error
  }
});


// Start the Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
