const express = require("express");
const Node = require("../models/Node");

const router = express.Router();

/* Register node */
router.post("/register", async (req, res) => {
  const { name } = req.body;
  const node = await Node.create({ name });
  res.json(node);
});

/* Get all nodes */
router.get("/", async (req, res) => {
  const nodes = await Node.find();
  res.json(nodes);
});

module.exports = router;
