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
  ingredient: { type: Array, require: true },
  steps: { type: String },
  comment: comments,
  image: { type: String },
});

module.exports = mongoose.model("Recipe", recipeSchema);
