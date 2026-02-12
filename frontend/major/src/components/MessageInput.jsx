import { useState } from "react";

function MessageInput({ socket, activeUser, currentUser }) {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim() || !activeUser) return;

    socket.emit("sendMessage", {
      sender: currentUser,
      receiver: activeUser._id,
      content: text
    });

    setText("");
  };

  const handleTyping = () => {
    socket.emit("typing", {
      sender: currentUser,
      receiver: activeUser?._id
    });
  };

  return (
    <div className="message-input">
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          handleTyping();
        }}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default MessageInput;
