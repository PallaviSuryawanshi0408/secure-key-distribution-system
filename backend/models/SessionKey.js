const mongoose = require("mongoose");

const SessionKeySchema = new mongoose.Schema({
  sessionId: String,
  key: String
});

module.exports = mongoose.model("SessionKey", SessionKeySchema);
