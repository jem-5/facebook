const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReactionSchema = new Schema({
  post: { type: Schema.ObjectId, ref: "Post", required: true },
  user: { type: Schema.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["like", "love", "cry", "angry", "clap"],
    required: true,
    default: "like",
  },
});

module.exports = mongoose.model("Reaction", ReactionSchema);
