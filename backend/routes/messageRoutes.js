const express = require("express");
const cryptoUtil = require("../utils/cryptoUtil");
const SessionKey = require("../models/SessionKey");
const Message = require("../models/Message");

const router = express.Router();

/* Encrypt & Send */
router.post("/send", async (req, res) => {
  const { sender, receiver, message } = req.body;

  const sessionId = `${sender}_${receiver}`;

  let session = await SessionKey.findOne({ sessionId });
  if (!session) {
    session = await SessionKey.create({
      sessionId,
      key: cryptoUtil.generateKey()
    });
  }

  const encrypted = cryptoUtil.encrypt(message, session.key);

  await Message.create({
    sender,
    receiver,
    encryptedMessage: encrypted.encryptedMessage,
    iv: encrypted.iv
  });

  res.json(encrypted);
});

/* Decrypt */
router.post("/decrypt", async (req, res) => {
  const { encryptedMessage, iv, sender, receiver } = req.body;

  const sessionId = `${sender}_${receiver}`;
  const session = await SessionKey.findOne({ sessionId });

  const decrypted = cryptoUtil.decrypt(
    encryptedMessage,
    session.key,
    iv
  );

  res.json({ decryptedMessage: decrypted });
});

module.exports = router;
