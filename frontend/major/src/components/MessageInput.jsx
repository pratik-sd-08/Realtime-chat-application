import { useState, useEffect, useRef } from "react";

function MessageInput({ socket, activeUser, currentUser, addMessage }) {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);

  
  const handleTyping = () => {
    if (!activeUser) return;

    socket.emit("typing", {
      sender: currentUser,
      receiver: activeUser._id
    });

    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        sender: currentUser,
        receiver: activeUser._id
      });
    }, 2000);
  };

  const sendMessage = () => {
    if (!text.trim() || !activeUser) return;

    const messageData = {
      sender: currentUser,
      receiver: activeUser._id,
      content: text.trim(),
      createdAt: new Date().toISOString()
    };

    
    socket.emit("sendMessage", messageData);

  
    if (addMessage) {
      addMessage(messageData);
    }

    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="message-input">
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          handleTyping();
        }}
        onKeyDown={handleKeyPress}
        placeholder={
          activeUser
            ? `Message ${activeUser.name}`
            : "Select a user to start chatting"
        }
        disabled={!activeUser}
      />
      <button onClick={sendMessage} disabled={!activeUser}>
        Send
      </button>
    </div>
  );
}

export default MessageInput;
