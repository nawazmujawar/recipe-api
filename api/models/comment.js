const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    require: true,
  },
  comment: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Comment", commentSchema);
