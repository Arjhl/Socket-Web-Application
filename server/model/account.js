const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountSchema = new Schema({
  image: String,
  username: String,
  age: String,
  mobile: String,
  user_id: String,
});

module.exports = mongoose.model("Account", accountSchema);
