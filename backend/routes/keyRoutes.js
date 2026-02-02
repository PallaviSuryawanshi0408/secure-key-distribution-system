const express = require("express");
const router = express.Router();

const { generateSessionKey } = require("../controllers/keyController");

// POST /api/keys/generate
router.post("/generate", generateSessionKey);

module.exports = router;
