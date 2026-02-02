const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  encryptedMessage: String,
  iv: String
});

module.exports = mongoose.model("Message", MessageSchema);
