const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    message: { type: String, required: true },
    user: { type: Schema.ObjectId, ref: "User" },
    post: { type: Schema.ObjectId, ref: "Post" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", CommentSchema);
