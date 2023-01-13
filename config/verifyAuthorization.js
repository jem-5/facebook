const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const Comment = require("../models/comment");

const mongoose = require("mongoose");

const verifyAuthorization = async (req, res, next) => {
  const post = await Post.find({ _id: req.params.postId });
  const comment = await Comment.find({ _id: req.params.commentId });

  const userId = req.params.userId
    ? req.params.userId
    : post
    ? post[0].user._id.toHexString()
    : comment
    ? comment[0].user._id.toHexString()
    : "";

  const authorized = req.authData && userId && userId === req.authData._id;

  if (!authorized) {
    return res
      .status("403")
      .json({ error: "User is not authorized to visit this page." });
  }
  next();
};

module.exports = verifyAuthorization;
