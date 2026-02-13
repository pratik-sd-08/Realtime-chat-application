import { useEffect, useRef } from "react";

function ChatWindow({ messages, currentUser, typingUser, activeUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!activeUser) {
    return (
      <div className="chat-window">
        <p style={{ opacity: 0.6 }}>Select a user to start chatting</p>
      </div>
    );
  }

  const filteredMessages = messages.filter((m) => {
    const senderId =
      typeof m.sender === "object" ? m.sender._id : m.sender;

    const receiverId =
      typeof m.receiver === "object" ? m.receiver._id : m.receiver;

    return (
      (senderId === currentUser && receiverId === activeUser._id) ||
      (senderId === activeUser._id && receiverId === currentUser)
    );
  });

  return (
    <div className="chat-window">

      {filteredMessages.length === 0 && (
        <p style={{ opacity: 0.6 }}>Start a conversation</p>
      )}

      {filteredMessages.map((msg) => {
        const senderId =
          typeof msg.sender === "object" ? msg.sender._id : msg.sender;

        const isOwnMessage = senderId === currentUser;

        return (
          <div
            key={msg._id || Math.random()}
            className={`message-bubble ${isOwnMessage ? "own" : ""}`}
          >
            {msg.content}
          </div>
        );
      })}

      {typingUser === activeUser._id && (
        <div className="typing-indicator">
          Typing...
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatWindow;
