import { Server } from "socket.io";
import Message from "../models/Message.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://chat-rosy-one-28.vercel.app"
      ],
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    }
    
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      if (!userId) return;

      socket.join(userId);
      onlineUsers.set(userId, socket.id);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log("User joined room:", userId);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { sender, receiver, content } = data;

        if (!sender || !receiver || !content) return;

        const message = await Message.create({
          sender,
          receiver,
          content
        });

        io.to(receiver).emit("receiveMessage", message);
        io.to(sender).emit("receiveMessage", message);

      } catch (error) {
        console.error("Message error:", error);
      }
    });

    socket.on("sendGroupMessage", async (data) => {
      try {
        const { sender, groupId, content } = data;

        if (!sender || !groupId || !content) return;

        const message = await Message.create({
          sender,
          group: groupId,
          content
        });

        io.to(groupId).emit("receiveGroupMessage", message);

      } catch (error) {
        console.error("Group message error:", error);
      }
    });

    socket.on("joinGroup", (groupId) => {
      if (!groupId) return;
      socket.join(groupId);
    });

    socket.on("typing", ({ sender, receiver }) => {
      socket.to(receiver).emit("typing", sender);
    });

    socket.on("disconnect", () => {
      for (let [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          onlineUsers.delete(key);
          break;
        }
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log("User disconnected:", socket.id);
    });
  });
};
