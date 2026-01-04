import React from 'react';
import PropTypes from 'prop-types';

const ResponseBox = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className="response-box">
        <p className="greeting">Hey there! What's on your mind?</p>
      </div>
    );
  }

  return (
    <div className="response-box">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender}`}>
          {msg.text}
        </div>
      ))}
    </div>
  );
};

ResponseBox.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      sender: PropTypes.oneOf(['user', 'llm']).isRequired,
    })
  ).isRequired,
};

export default ResponseBox;
