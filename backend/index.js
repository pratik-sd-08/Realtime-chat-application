import express from "express";
import http from "http";
import cors from "cors"; // ✅ THIS WAS MISSING
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import { initSocket } from "./socket/socket.js";

dotenv.config();

await connectDB();

const app = express();
const server = http.createServer(app);

/* =============================
   CORS FIX (CLEAN VERSION)
============================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://chat-rosy-one-28.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
