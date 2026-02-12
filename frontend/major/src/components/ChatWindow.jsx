import { useEffect, useRef } from "react";

function ChatWindow({ messages, currentUser, typingUser, activeUser }) {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages
        .filter(m =>
          (m.sender === currentUser && m.receiver === activeUser?._id) ||
          (m.sender === activeUser?._id && m.receiver === currentUser)
        )
        .map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${
              msg.sender === currentUser ? "own" : ""
            }`}
          >
            {msg.content}
          </div>
        ))}

      {typingUser === activeUser?._id && (
        <div className="typing-indicator">
          Typing...
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatWindow;
