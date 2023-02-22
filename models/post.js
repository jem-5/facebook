const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    body: { type: String, required: true },
    user: { type: Schema.ObjectId, ref: "User", required: true },
    photoPath: { type: String, required: false },
    comments: [{ type: Schema.ObjectId, ref: "Comment", required: false }],
    reactions: [{ type: Schema.ObjectId, ref: "Reaction", required: false }],
    shares: { type: Number, required: false },
    visibility: {
      type: String,
      enum: ["private", "public", "friends"],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
