const express = require("express");

const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");

const jwt = require("jsonwebtoken");
const path = require("path");
const bcryptjs = require("bcryptjs");
const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

require("dotenv").config();

// Import models
const User = require("./models/user");
const Post = require("./models/post");

// Connect to database
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoDb = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.3aclkq9.mongodb.net/codebook?retryWrites=true&w=majority`;
mongoose.set("strictQuery", true);
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// Import routes
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

// Initialize express instance
const app = express();

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cors());

// Set up user authentication
passport.use(
  "local",
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcryptjs.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    (jwtPayload, done) => {
      return done(null, jwtPayload);
    }
  )
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.serializeUser(function (user, done) {
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
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

// Handle routes
app.use("/", indexRouter);
app.use("/api", apiRouter);

module.exports = app;
