import React, { useState } from 'react';

function ChatPanel({ messages, loading, onGenerate }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onGenerate(input);
    setInput("");
  };

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <h1 className="chat-title">🧠 Ryze AI Agent</h1>
        <p className="chat-subtitle">Deterministic UI Generator</p>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>Try saying:</p>
            <p className="chat-example">"Create a dashboard with a sales chart"</p>
            <p className="chat-example">"Add a user table with 3 columns"</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.role === 'user' ? 'user' : 'ai'}`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="chat-loading">AI is thinking...</div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe the UI you want..."
          disabled={loading}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="chat-send-btn"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default ChatPanel;