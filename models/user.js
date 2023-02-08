const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: false },
  // name: { type: String, required: false },
  photoPath: { type: String, required: false },
  friends: [{ type: Schema.ObjectId, ref: "User", required: false }],
  friendRequests: [{ type: Schema.ObjectId, ref: "User", required: false }],
  savedPosts: [{ type: Schema.ObjectId, ref: "Post", required: false }],
});

module.exports = mongoose.model("User", UserSchema);
