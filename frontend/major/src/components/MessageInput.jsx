import { useState, useEffect, useRef } from "react";

function MessageInput({ socket, activeUser, currentUser }) {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);

  const sendMessage = () => {
    if (!text.trim() || !activeUser) return;

    socket.emit("sendMessage", {
      sender: currentUser,
      receiver: activeUser._id,
      content: text.trim()
    });

    setText("");
  };

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

  const handleKeyDown = (e) => {
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
        onKeyDown={handleKeyDown}
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
