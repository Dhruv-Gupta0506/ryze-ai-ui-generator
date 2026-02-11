import React, { useState } from 'react';
import axios from 'axios';
import UIRenderer from './components/UIRenderer';

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]); 
  const [currentUI, setCurrentUI] = useState([]); 
  const [history, setHistory] = useState([]); 
  const [view, setView] = useState("preview"); // "preview" or "code"
  const [explanation, setExplanation] = useState("");

  const handleSend = async () => {
    if (!prompt) return;

    const newMessages = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);

    try {
      const res = await axios.post('http://localhost:5000/api/generate', { prompt });
      
      // Save current state for Rollback
      setHistory([...history, currentUI]);
      
      setCurrentUI(res.data.ui);
      setExplanation(res.data.explanation);
      setMessages([...newMessages, { role: 'ai', content: res.data.explanation }]);
      setPrompt("");
    } catch (err) {
      console.error("Error calling agent", err);
    }
  };

  const rollback = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setCurrentUI(previous);
    setHistory(history.slice(0, -1));
  };

  const handleCodeChange = (e) => {
    try {
      const updatedJson = JSON.parse(e.target.value);
      setCurrentUI(updatedJson);
    } catch (err) {
      // Allow user to type; only update UI when JSON is valid
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans">
      {/* Left Panel: AI Chat */}
      <div className="w-1/3 border-r bg-white flex flex-col shadow-lg">
        <div className="p-4 border-b font-bold text-xl text-blue-600 flex items-center gap-2">
          <span>🧠 Ryze AI Agent</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((m, i) => (
            <div key={i} className={`p-3 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white ml-auto max-w-[80%]' : 'bg-white border text-gray-800 mr-auto max-w-[80%]'}`}>
              <p className="text-[10px] uppercase font-bold mb-1 opacity-70">{m.role === 'user' ? 'You' : 'Agent'}</p>
              <p className="text-sm leading-relaxed">{m.content}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t bg-white flex gap-2">
          <input 
            className="flex-1 border rounded-full px-4 py-2 outline-none focus:border-blue-500 transition-all" 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your UI..."
          />
          <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Panel: Preview & Code */}
      <div className="w-2/3 flex flex-col">
        <div className="p-4 bg-white border-b flex justify-between items-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setView("preview")}
              className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${view === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              Live Preview
            </button>
            <button 
              onClick={() => setView("code")}
              className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${view === 'code' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              View Code
            </button>
          </div>
          <button onClick={rollback} disabled={history.length === 0} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-red-500 disabled:opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Rollback
          </button>
        </div>

        <div className="flex-1 p-8 overflow-auto">
          {view === "preview" ? (
            <div className="max-w-2xl mx-auto">
               <UIRenderer layout={currentUI} />
            </div>
          ) : (
            <div className="h-full">
              <p className="text-xs text-gray-400 mb-2">// Edit the JSON below to update the UI in real-time</p>
              <textarea 
                className="w-full h-[90%] font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-xl shadow-inner outline-none border-none"
                value={JSON.stringify(currentUI, null, 2)}
                onChange={handleCodeChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;