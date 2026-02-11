import React, { useState } from 'react';
import axios from 'axios';
import ChatPanel from './components/ChatPanel';
import WorkspacePanel from './components/WorkspacePanel';
import './App.css';

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
      const res = await axios.post('http://localhost:5000/api/generate', {
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