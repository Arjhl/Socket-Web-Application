const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  msgs: Array,
});

module.exports = mongoose.model("Message", messageSchema);
