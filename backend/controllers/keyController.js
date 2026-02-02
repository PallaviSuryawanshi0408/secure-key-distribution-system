const SessionKey = require("../models/SessionKey");
const crypto = require("crypto");

exports.generateKey = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const sessionId = `${sender}_${receiver}`;

    // 🔐 Generate session key
    const sessionKey = crypto.randomBytes(32);

    // 🔐 Encrypt message
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", sessionKey, iv);
    let encryptedMessage = cipher.update(message, "utf8", "hex");
    encryptedMessage += cipher.final("hex");

    // ✅ SAVE TO MONGODB (THIS WAS MISSING)
    const keyDoc = new SessionKey({
      sessionId,
      sender,
      receiver,
      sessionKey: sessionKey.toString("hex"),
      iv: iv.toString("hex"),
      createdAt: new Date()
    });

    await keyDoc.save(); // 🔥 THIS LINE FIXES EVERYTHING

    res.json({
      sessionId,
      encryptedMessage,
      iv: iv.toString("hex")
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Key generation failed" });
  }
};
