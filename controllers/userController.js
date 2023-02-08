const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");

exports.get_users = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) return res.json({ message: "No users found." });
    res.status(200).json({ users });
  } catch (err) {
    return next(err);
  }
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

exports.update_user = async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
    username: req.body.username,
    // password: hashedPassword,
    email: req.body.email,
    name: req.body.name,
    photoPath: req.body.photoPath,
  });
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) return res.json({ errors: errors.array() });
  try {
    // bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
    //   if (err) {
    //     return next(err);
    //   }

    if (!updatedUser) return res.json({ message: "User not found." });
    res.json({
      message: "User successfully updated.",
      updatedUser,
    });
  } catch (err) {
    return next(err);
  }
};

exports.get_user = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ message: "No user found." });
    }
    console.log(user);
    res.json({ user });
  } catch (err) {
    return next(err);
  }
};
