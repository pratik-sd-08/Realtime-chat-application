import { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

function Chat() {
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!currentUserId) return;

    
    socketRef.current = io(
      import.meta.env.VITE_API_URL ||
        "https://realtime-chat-applications.onrender.com",
      {
        transports: ["websocket"], 
      }
    );

    const socket = socketRef.current;

    socket.emit("join", currentUserId);

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", (userId) => {
      setTypingUser(userId);
      setTimeout(() => setTypingUser(null), 1500);
    });

    return () => {
      socket.disconnect(); 
    };
  }, [currentUserId]);

  useEffect(() => {
    if (!activeUser) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/private/${activeUser._id}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Message fetch error:", error);
      }
    };

    fetchMessages();
  }, [activeUser]);

  return (
    <>
      <Navbar />
      <div className="chat-layout">
        <Sidebar
          setActiveUser={setActiveUser}
          onlineUsers={onlineUsers}
        />
        <div style={{ flex: 1 }}>
          <ChatWindow
            messages={messages}
            currentUser={currentUserId}
            activeUser={activeUser}
            typingUser={typingUser}
          />
          {socketRef.current && (
            <MessageInput
              socket={socketRef.current}
              activeUser={activeUser}
              currentUser={currentUserId}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;
