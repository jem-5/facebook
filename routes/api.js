const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const commentController = require("../controllers/commentController");
const verifyToken = require("../../blog/config/verifyToken");

// Post Routes
router.get("/", function (req, res, next) {
  res.redirect("/api/posts");
});

router.get("/posts", postController.get_feed_posts);

router.get("/posts/:postId", postController.get_single_post);

router.post("/posts", postController.create_post);

router.put("/posts/:postId", postController.update_post);

router.delete("/posts/:postId", postController.delete_post);

router.post(
  "/posts/:postId/reactions",

  postController.create_post_reaction
);

// User Routes

router.post("/signup", userController.sign_up);

router.post("/login", userController.log_in);

router.post("/logout", userController.log_out);

router.get("/user/:userId/requests", userController.get_friend_request);

router.post("/user/:userId/requests", userController.make_friend_request);

router.put(
  "/user/:userId/requests/:friendId",
  userController.accept_friend_request
);

router.delete(
  "/user/:userId/requests/:friendId",
  userController.reject_friend_request
);

router.get("/user/:userId", userController.get_user);

router.put("/user/:userId", userController.update_user);

// Comment Routes

router.post("/posts/:postId/comments", commentController.create_comment);

router.get("/posts/:postId/comments", commentController.get_comments);

router.get(
  "/posts/:postId/comments/:commentId",
  commentController.get_single_comment
);

router.put(
  "/posts/:postId/comments/:commentId",
  commentController.update_comment
);

router.delete(
  "/posts/:postId/comments/:commentId",
  commentController.delete_comment
);

module.exports = router;
