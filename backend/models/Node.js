const mongoose = require("mongoose");

const NodeSchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

module.exports = mongoose.model("Node", NodeSchema);
