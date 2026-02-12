import express from "express";
import Group from "../models/Group.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE GROUP
router.post("/", protect, async (req, res) => {
  const { name, members } = req.body;

  const group = await Group.create({
    name,
    members
  });

  res.json(group);
});

// GET USER GROUPS
router.get("/", protect, async (req, res) => {
  const groups = await Group.find({
    members: req.user.id
  });

  res.json(groups);
});

export default router;
