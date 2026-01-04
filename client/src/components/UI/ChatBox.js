import React, { useState } from "react";

export function ChatBox({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="chatbox-container">
      <textarea
        className="chatbox-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Speak your intent, adventurer..."
      />

      <button className="chatbox-send" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}
