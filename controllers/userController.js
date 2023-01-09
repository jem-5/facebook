const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

exports.get_users = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) return res.json({ message: "No users found." });
    res.status(200).json({ users });
  } catch (err) {
    return next(err);
  }
};

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
        res, json({ message: "User already exists. Please log in." });
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

exports.log_in = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      res.status(401).json({
        message: "Incorrect username or password.",
        user,
      });
    }
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
  })(req, res, next);
};

exports.log_out = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logging out..." });
  });
};

exports.get_friend_request = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(err);
    console.log(user.friendRequests);
    res.json({ friendRequests: user.friendRequests });
  } catch (err) {
    return next(err);
  }
};

exports.make_friend_request = async (req, res, next) => {
  const newFriend = req.params.userId;
  const user = req.body.userId;
  try {
    const friendConnection = await User.findByIdAndUpdate(newFriend, {
      $push: { friendRequests: user },
    });
    if (!friendConnection) {
      return res.json({ message: "No such user exists." });
    }
    res.json({
      message: "Friend request initiated.",
    });
  } catch (err) {
    return next(err);
  }
};

exports.accept_friend_request = async (req, res, next) => {
  const user = req.params.userId;
  const friend = req.params.friendId;
  console.log(user, friend);
  try {
    if (!user || !friend) {
      return res.json({ message: "No such friend request exists." });
    }
    await User.findByIdAndUpdate(user, {
      $push: { friends: friend },
      $pull: { friendRequests: friend },
    });
    await User.findByIdAndUpdate(friend, {
      $push: { friends: user },
    });
    if (err) return next(err);
    res.json({ message: "Friend accepted" });
  } catch (err) {
    return next(err);
  }
};

exports.reject_friend_request = async (req, res, next) => {
  const user = req.params.userId;
  const friend = req.params.friendId;
  try {
    await User.findByIdAndUpdate(user, {
      $pull: { friendRequests: friend },
    });
    res.json({ message: "Friend request declined." });
  } catch (err) {
    return next(err);
  }
};

exports.update_user = [
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
  async (req, res, next) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        name: req.body.name,
        photoPath: req.body.photoPath,
      });
      if (!updatedUser) return res.json({ message: "User not found." });
      res.json({
        message: "User successfully updated.",
        updatedUser,
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.get_user = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ message: "No user found." });
    }
    console.log(user);
    res.json({ message: user });
  } catch (err) {
    return next(err);
  }
};
