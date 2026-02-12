import { Server } from "socket.io";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "https://chat-rosy-one-28.vercel.app"
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {

    socket.on("join", (userId) => {
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("sendMessage", async (data) => {
      const { sender, receiver, content } = data;

      const message = await Message.create({
        sender,
        receiver,
        content
      });

      io.to(receiver).emit("receiveMessage", message);
      io.to(sender).emit("receiveMessage", message);
    });

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
