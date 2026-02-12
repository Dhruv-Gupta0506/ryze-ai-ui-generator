import React, { useState } from 'react';
import axios from 'axios';
import ChatPanel from './components/ChatPanel';
import WorkspacePanel from './components/WorkspacePanel';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentCode, setCurrentCode] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (prompt) => {
    const newMessages = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/generate`, {
        prompt,
        currentUI: currentCode
      });

      // Only save to history if there was actual code before this generation
      if (currentCode.trim()) {
        setHistory(prev => [...prev, currentCode]);
      }

      setCurrentCode(res.data.code);
      setMessages([...newMessages, { role: 'ai', content: res.data.explanation }]);

    } catch (err) {
      console.error("Error:", err);
      const errorMsg = err.response?.data?.error || 'Something went wrong. Please try again.';
      // Show error in chat but DO NOT touch currentCode — keep the last working UI
      setMessages([...newMessages, {
        role: 'ai',
        content: `⚠️ ${errorMsg}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setCurrentCode(previous);
    setHistory(prev => prev.slice(0, -1));
    setMessages(prev => [...prev, {
      role: 'ai',
      content: '↩️ Rolled back to the previous version.'
    }]);
  };

  return (
    <div className="app-container">
      <ChatPanel
        messages={messages}
        loading={loading}
        onGenerate={handleGenerate}
      />
      <WorkspacePanel
        currentCode={currentCode}
        onRollback={handleRollback}
        canRollback={history.length > 0}
      />
    </div>
  );
}

export default App;