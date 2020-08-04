const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({

  name: { type: String, require: true },
  duration: { type: Number, require: true },
  ingredient: { type: Array, require: true },
  steps: { type: String },
});

module.exports = mongoose.model("Recipe", recipeSchema);
