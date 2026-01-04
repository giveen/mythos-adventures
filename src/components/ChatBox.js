import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ChatBox = ({ onSendMessage, onGameEnd }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-box">
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's up?"
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
      <button onClick={onGameEnd} className="end-game-btn">
        End Session
      </button>
    </div>
  );
};

ChatBox.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  onGameEnd: PropTypes.func.isRequired,
};

export default ChatBox;
