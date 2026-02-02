const Node = require("../models/Node");

// REGISTER NODE
exports.registerNode = async (req, res) => {
  try {
    const { nodeName } = req.body;

    if (!nodeName) {
      return res.status(400).json({ message: "Node name is required" });
    }

    const exists = await Node.findOne({ nodeName });
    if (exists) {
      return res.status(200).json({ message: "Node already registered" });
    }

    const node = await Node.create({ nodeName });

    res.status(201).json({
      message: "Node registered successfully",
      node,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL NODES (THIS POWERS DROPDOWN)
exports.getNodes = async (req, res) => {
  try {
    const nodes = await Node.find({}, { _id: 0, nodeName: 1 });
    res.json(nodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
