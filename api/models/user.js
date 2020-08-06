const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String },
});

module.exports = mongoose.model("User", userSchema);
