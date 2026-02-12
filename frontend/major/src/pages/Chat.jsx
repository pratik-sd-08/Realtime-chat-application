import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";

const socket = io("http://localhost:5000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const currentUser = localStorage.getItem("userId");

  useEffect(() => {
    socket.emit("join", currentUser);

    socket.on("receiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("typing", (userId) => {
      setTypingUser(userId);
      setTimeout(() => setTypingUser(null), 2000);
    });

  }, []);

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", height: "90vh" }}>
        <Sidebar
          setActiveUser={setActiveUser}
          onlineUsers={onlineUsers}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <ChatWindow
            messages={messages}
            currentUser={currentUser}
            typingUser={typingUser}
            activeUser={activeUser}
          />

          <MessageInput
            socket={socket}
            activeUser={activeUser}
            currentUser={currentUser}
          />
        </div>
      </div>
    </>
  );
}

export default Chat;
