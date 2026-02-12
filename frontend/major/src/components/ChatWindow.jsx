import { useEffect, useRef } from "react";

function ChatWindow({ messages, currentUser, typingUser, activeUser }) {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredMessages = messages.filter((m) => {
    const senderId =
      typeof m.sender === "object" ? m.sender._id : m.sender;

    const receiverId =
      typeof m.receiver === "object" ? m.receiver._id : m.receiver;

    return (
      (senderId === currentUser && receiverId === activeUser?._id) ||
      (senderId === activeUser?._id && receiverId === currentUser)
    );
  });

  return (
    <div className="chat-window">
      {filteredMessages.length === 0 && activeUser && (
        <p style={{ opacity: 0.6 }}>Start a conversation</p>
      )}

      {filteredMessages.map((msg, index) => {
        const senderId =
          typeof msg.sender === "object" ? msg.sender._id : msg.sender;

        return (
          <div
            key={index}
            className={`message-bubble ${
              senderId === currentUser ? "own" : ""
            }`}
          >
            {msg.content}
          </div>
        );
      })}

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
