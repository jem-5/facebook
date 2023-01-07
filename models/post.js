const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    body: { type: String, required: true },
    user: { type: Schema.ObjectId, ref: "User", required: true },
    comments: [{ type: Schema.ObjectId, ref: "Comment", required: false }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
