const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
require("dotenv").config();

// const JWTstrategy = require("passport-jwt").Strategy;
// const ExtractJWT = require("passport-jwt").ExtractJwt;

// passport.use(
//   new JWTstrategy(
//     {
//       secretOrKey: process.env.SECRET,
//       jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
//     },
//     async (token, done) => {
//       try {
//         return done(null, token.user);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

exports.sign_up = [
  body("username")
    .trim()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Username can only contain letters.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must contain between 3-20 characters.")
    .escape(),
  body("password")
    .trim()
    .isAlphanumeric()
    .withMessage("Password can only contain letters & numbers.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Password must be between 3-20 characters.")
    .escape(),
  body("password2", "Passwords must match.").custom(
    (value, { req }) => value === req.body.password
  ),
  async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.json({ message: errors.array() });
    }
    try {
      const isExistingUser = User.countDocuments({
        username: req.body.username,
      });
      if (isExistingUser > 0) {
        res.json({ message: "User already exists. Please log in." });
      }
      bcryptjs.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        newUser.save((err) => {
          if (err) {
            return next(err);
          } else {
            return res.status(200).json({
              message: "Success",
              newUser,
            });
          }
        });
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.log_in = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("Username: Must contain 3 to 15 characters")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("Password: Must contain 3 to 15 characters")
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: { username: { msg: "Username not found" } } });
    }

    const correct = await bcryptjs.compare(req.body.password, user.password);

    if (!correct) {
      return res
        .status(400)
        .json({ error: { password: { msg: "Incorrect password" } } });
    }
    try {
      jwt.sign(
        { _id: user._id, username: user.username },
        process.env.SECRET,
        { expiresIn: "30m" },
        (err, token) => {
          if (err) return res.status(400).json(err);
          res.json({
            token: token,
            user: { _id: user._id, username: user.username },
          });
        }
      );
    } catch (err) {
      return next(err);
    }
  },
];

exports.log_out = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logging out..." });
  });
};
