const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    require: true,
  },
  content: { type: String },
});

module.exports = mongoose.model("Comment", commentSchema);
