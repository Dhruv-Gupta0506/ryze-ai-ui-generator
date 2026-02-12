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

      setHistory(prev => [...prev, currentCode]);
      setCurrentCode(res.data.code);
      setMessages([...newMessages, { role: 'ai', content: res.data.explanation }]);
    } catch (err) {
      console.error("Error:", err);
      setMessages([...newMessages, { 
        role: 'ai', 
        content: `Error: ${err.response?.data?.error || 'Failed to generate'}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = () => {
    if (history.length === 0) return;
    setCurrentCode(history[history.length - 1]);
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
        currentCode={currentCode}
        onRollback={handleRollback}
        canRollback={history.length > 0}
      />
    </div>
  );
}

export default App;