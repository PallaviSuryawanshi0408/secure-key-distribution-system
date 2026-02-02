const Message = require("../models/Message");
const crypto = require("crypto");

let sessionStore = {}; // TEMP in-memory session

exports.sendMessage = async (req, res) => {
  const { sender, receiver, message } = req.body;

  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");

  const sessionId = `${sender}_${receiver}`;

  sessionStore[sessionId] = { key, iv };

  await Message.create({
    sender,
    receiver,
    encryptedMessage: encrypted,
    iv: iv.toString("hex"),
    sessionId,
  });

  res.json({
    encryptedMessage: encrypted,
    iv: iv.toString("hex"),
    sessionId,
  });
};

exports.getIncomingMessages = async (req, res) => {
  const { receiver } = req.params;
  const messages = await Message.find({ receiver });
  res.json(messages);
};

exports.decryptMessage = async (req, res) => {
  const { encryptedMessage, iv, sender, receiver } = req.body;
  const sessionId = `${sender}_${receiver}`;

  const session = sessionStore[sessionId];
  if (!session) return res.status(400).json({ error: "Session expired" });

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    session.key,
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(encryptedMessage, "hex", "utf8");
  decrypted += decipher.final("utf8");

  res.json({ decryptedMessage: decrypted });
};
