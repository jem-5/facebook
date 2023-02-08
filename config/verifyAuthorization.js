const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const Comment = require("../models/comment");
const mongoose = require("mongoose");

const verifyAuthorization = async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  const comment = await Comment.findById(req.params.commentId);

  console.log(post, comment, req.params.userId);

  const userId = req.params.userId
    ? req.params.userId
    : comment
    ? comment.user._id.toHexString()
    : post
    ? post.user._id.toHexString()
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
