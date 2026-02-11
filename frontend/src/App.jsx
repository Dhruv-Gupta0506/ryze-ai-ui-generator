import React, { useState } from 'react';
import axios from 'axios';
import ChatPanel from './components/ChatPanel';
import WorkspacePanel from './components/WorkspacePanel';
import './App.css';

// ✅ Define the API URL using the environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentUI, setCurrentUI] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (prompt) => {
    const newMessages = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // ✅ Updated to use the dynamic API_BASE_URL
      const res = await axios.post(`${API_BASE_URL}/api/generate`, {
        prompt,
        currentUI: currentUI
      });

      setHistory(prev => [...prev, currentUI]);
      setCurrentUI(res.data.ui);
      setMessages([...newMessages, { role: 'ai', content: res.data.explanation }]);
    } catch (err) {
      console.error("Error:", err);
      const errorMsg = err.response?.data?.error || "Failed to generate UI";
      setMessages([...newMessages, { role: 'ai', content: `Error: ${errorMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setCurrentUI(previous);
    setHistory(history.slice(0, -1));
  };

  return (
    <div className="app-container">
      <ChatPanel
        messages={messages}
        loading={loading}
        onGenerate={handleGenerate}
      />
      <WorkspacePanel
        currentUI={currentUI}
        onRollback={handleRollback}
        canRollback={history.length > 0}
      />
    </div>
  );
}

export default App;