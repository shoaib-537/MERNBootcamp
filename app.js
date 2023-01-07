var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const { Strategy } = require("passport-local");
const authMiddleware = require("./middleware/authMiddleware");
// var indexRouter = require('./routes/index');
const inputMiddleware = require("./middleware/inputMiddleware");
const { userRoutes, adminRoutes, clientRoutes } = require("./routes");

var app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mydb", (err) => {
  if (err) {
    return console.log("Error connecting with DB", err);
  }

  console.log(`DB connected successfully`);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

passport.use(
  new Strategy((username, password, done) => {
    authMiddleware.executeLogin(username, password, done);
  })
);

app.use(inputMiddleware.handleOptions);
//actual routes
app.post("/signup", authMiddleware.userSignUp);
app.post(
  "/login",
  passport.initialize(),
  passport.authenticate("local", {
    session: false,
    scope: [],
  }),
  authMiddleware.generateToken,
  authMiddleware.respond
);

//test routes
// app.use('/', indexRouter);
app.use("/users", userRoutes);
app.use("/admins", adminRoutes);
app.use("/clients", clientRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
