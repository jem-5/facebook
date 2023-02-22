const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const commentController = require("../controllers/commentController");
const verifyToken = require("../config/verifyToken");
const verifyAuthorization = require("../config/verifyAuthorization");

// Post Routes
router.get("/", function (req, res, next) {
  res.redirect("/api/posts");
});

router.put("/posts", postController.get_feed_posts);

router.get("/posts/:postId", postController.get_single_post);

router.post("/posts", verifyToken, postController.create_post);

router.put(
  "/posts/:postId",
  verifyToken,
  verifyAuthorization,
  postController.update_post
);

router.delete(
  "/posts/:postId",
  verifyToken,
  verifyAuthorization,
  postController.delete_post
);

router.post(
  "/posts/:postId/reactions",
  verifyToken,
  postController.create_post_reaction
);

router.get("/posts/:postId/reactions", postController.get_post_reactions);

router.post("/posts/:postId/save", verifyToken, postController.save_post);

router.post("/posts/:postId/unsave", verifyToken, postController.unsave_post);

// User Routes

router.get("/user/:userId/requests", userController.get_friend_request);

router.post(
  "/user/:userId/requests",
  verifyToken,
  userController.make_friend_request
);

router.put(
  "/user/:userId/requests/:friendId",
  verifyToken,
  verifyAuthorization,
  userController.accept_friend_request
);

router.delete(
  "/user/:userId/requests/:friendId",
  verifyToken,
  verifyAuthorization,
  userController.reject_friend_request
);

router.get("/user/:userId", userController.get_user);

router.get("/users", userController.get_users);

router.put(
  "/user/:userId",
  verifyToken,
  verifyAuthorization,
  userController.update_user
);

// Comment Routes

router.post(
  "/posts/:postId/comments",
  verifyToken,
  commentController.create_comment
);

router.get("/posts/:postId/comments", commentController.get_comments);

router.get(
  "/posts/:postId/comments/:commentId",
  commentController.get_single_comment
);

router.put(
  "/posts/:postId/comments/:commentId",
  verifyToken,
  verifyAuthorization,
  commentController.update_comment
);

router.delete(
  "/posts/:postId/comments/:commentId",
  verifyToken,
  verifyAuthorization,
  commentController.delete_comment
);

module.exports = router;
