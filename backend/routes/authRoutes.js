import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Account created successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const expiresIn = "1h";

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.json({
      token,
      expiresIn,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/verify", protect, async (req, res) => {
  res.json({
    message: "Session active",
    userId: req.user.id
  });
});

router.get("/users", protect, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id }
    }).select("-password");

    res.json(users);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});


router.post("/logout", protect, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
