const Comment = require("../models/comment");
const { body, validationResult, check } = require("express-validator");

exports.get_comments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId });
    if (!comments) return res.json({ message: "No comments found." });
    res.json({
      comments,
    });
  } catch (err) {
    return next(err);
  }
};

exports.get_single_comment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.json({ message: "No comment found." });
    res.json({ comment });
  } catch (err) {
    return next(err);
  }
};

exports.create_comment = [
  body("user", "User must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("message")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Comment must be between 1-200 characters.")
    .escape(),
  body("post", "Post must not be empty.").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array() });
    try {
      const newComment = new Comment({
        user: req.body.user,
        message: req.body.message,
        post: req.body.post,
      });
      newComment.save((err) => {
        if (err) return next(err);
      });
      res.json({ message: "Comment created successfully." });
    } catch (err) {
      return next(err);
    }
  },
];

exports.update_comment = [
  body("message")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Comment must be between 1-200 characters.")
    .escape(),
  body("post", "Post must not be empty.").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array() });
    try {
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
          user: req.body.user,
          message: req.body.message,
          post: req.body.post,
        }
      );
      if (!updatedComment)
        return res.json({ message: "No such comment exists." });
      res.json({ message: "Comment updated successfully.", updatedComment });
    } catch (err) {
      return next(err);
    }
  },
];

exports.delete_comment = async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: "Comment successfully deleted." });
  } catch (err) {
    return next(err);
  }
};
