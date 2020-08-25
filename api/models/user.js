const mongoose = require("mongoose");
var timestamps = require("mongoose-timestamp");

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String },
});
userSchema.plugin(timestamps);
module.exports = mongoose.model("User", userSchema);
