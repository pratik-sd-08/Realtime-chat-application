import { Server } from "socket.io";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {

    // User joins their private room
    socket.on("join", (userId) => {
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // Private message
    socket.on("sendMessage", async (data) => {
      const { sender, receiver, content } = data;

      const message = await Message.create({
        sender,
        receiver,
        content
      });

      // Send only to receiver
      io.to(receiver).emit("receiveMessage", message);

      // Send back to sender
      io.to(sender).emit("receiveMessage", message);
    });

    // Typing indicator
    socket.on("typing", ({ sender, receiver }) => {
      socket.to(receiver).emit("typing", sender);
    });

    socket.on("disconnect", () => {
      for (let [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          onlineUsers.delete(key);
        }
      }
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

  });
};
