const Post = require("../models/post");
const User = require("../models/user");
const Reaction = require("../models/reaction");
const { body, validationResult } = require("express-validator");

exports.get_feed_posts = async (req, res, next) => {
  const userId = req.body.userId;
  const thisUser = await User.findById(userId);
  let posts;
  try {
    if (userId) {
      // const userPosts = await Post.find({ user: userId });
      // const friendPosts = await Post.find({ user: { $in: thisUser.friends } });
      // const publicPosts = await Post.find({ visibility: "public" });
      // const returnedPosts = [...userPosts, ...friendPosts, ...publicPosts];
      // const ids = returnedPosts.map((o) => o.id);
      // posts = returnedPosts.filter(
      //   ({ id }, index) => !ids.includes(id, index + 1)
      // );
      posts = await Post.find({
        $or: [
          { user: userId },
          { user: { $in: thisUser.friends } },
          { visibility: "public" },
        ],
      });
    } else {
      posts = await Post.find({ visibility: "public" });
    }
    if (!posts) return res.json({ message: "No posts found." });
    res.json({ posts });
  } catch (err) {
    return next(err);
  }
};

exports.get_single_post = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.json({ message: "No such post found." });
    res.json({ post });
  } catch (err) {
    return next(err);
  }
};

exports.create_post = [
  body("user")
    .trim()
    .isLength({ min: 1 })
    .withMessage("User field must not be empty.")
    .escape(),
  body("body")
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage("Post body must be between 5-2000 characters.")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array() });
    try {
      const newPost = new Post({
        body: req.body.body,
        user: req.body.user,
        visibility: req.body.visibility,
      });
      newPost.save((err) => {
        if (err) return next(err);
        res.json({ message: "Post created successfully." });
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.update_post = [
  body("body")
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage("Post body must be between 5-2000 characters.")
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array() });
    try {
      const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
        body: req.body.body,
        user: req.body.user,
      });
      if (!updatedPost) return res.json({ message: "No such post exists." });
      res.json({ message: "Post updated successfully.", updatedPost });
    } catch (err) {
      return next(err);
    }
  },
];

exports.delete_post = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.json({ message: "Post successfully deleted." });
  } catch (err) {
    return next(err);
  }
};

exports.create_post_reaction = async (req, res, next) => {
  try {
    const newReaction = new Reaction({
      post: req.body.postId,
      user: req.body.userId,
      type: req.body.type,
    });
    newReaction.save((err) => {
      if (err) return next(err);
      res.json({ message: "Reaction created successfully." });
    });
  } catch (err) {
    return next(err);
  }
};

exports.get_post_reactions = async (req, res, next) => {
  try {
    const reactions = await Reaction.find({ post: req.params.postId });
    if (!reactions)
      return res.status(400).json({ message: "No post reactions found." });
    res.json({ reactions });
  } catch (err) {
    return next(err);
  }
};

// exports.save_post = async (req, res, next) => {
//   try {
//     const post = req.params.postId;
//     const user = req.body.userId;
//     const savedPost = await User.findByIdAndUpdate(user, {
//       $push: { savedPosts: post },
//     });
//     if (!savedPost) return res.json({ message: "Error saving post." });
//     res.json({ message: "Post successfully saved." });
//   } catch (err) {
//     return next(err);
//   }
// };

// exports.unsave_post = async (req, res, next) => {
//   try {
//     const post = req.params.postId;
//     const user = req.body.userId;
//     const unsavedPost = await User.findByIdAndUpdate(user, {
//       $pull: { savedPosts: post },
//     });
//     if (!unsavedPost) return res.json({ message: "Error unsaving post." });
//     res.json({ message: "Post successfully unsaved." });
//   } catch (err) {
//     return next(err);
//   }
// };
