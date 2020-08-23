const mongoose = require("mongoose");

const comments = [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
];

const recipeSchema = mongoose.Schema({
  name: { type: String, require: true },
  duration: { type: Number, require: true },
  ingredient: { type: String, require: true },
  steps: { type: String },
  comment: comments,
  image: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});
recipeSchema.index({ name: "text", steps: "text", ingredient: "text" });
module.exports = mongoose.model("Recipe", recipeSchema);
