const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  pass: String,
  createdAt: String,
});

module.exports = mongoose.model("User", userSchema);
