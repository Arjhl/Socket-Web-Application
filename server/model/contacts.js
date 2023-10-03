const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  contacts: [
    {
      receiverId: String,
      contactName: String,
      lastInteracted: String,
      lastMessage: Object,
      profile: String,
      msgId: ObjectId,
    },
  ],
});

module.exports = mongoose.model("Contacts", contactSchema);
