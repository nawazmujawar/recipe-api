const mongoose = require("mongoose");
var timestamps = require("mongoose-timestamp");


const commentSchema = mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    require: true,
  },
  comment: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

commentSchema.plugin(timestamps)
module.exports = mongoose.model("Comment", commentSchema);
