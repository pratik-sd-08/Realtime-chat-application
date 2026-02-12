import express from "express";
import Message from "../models/Message.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/private/:userId", protect, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user.id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user.id }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});


router.get("/group/:groupId", protect, async (req, res) => {
  const messages = await Message.find({
    group: req.params.groupId
  }).sort({ createdAt: 1 });

  res.json(messages);
});

export default router;
