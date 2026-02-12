import React, { useState, useEffect } from 'react';
import * as ComponentLibrary from './library';

const ALLOWED_COMPONENTS = [
  'Card','Button','Input','Table','Navbar','Sidebar','Modal',
  'Chart','Badge','Alert','React','useState','useEffect',
  'div','p','h1','h2','h3','h4','span','ul','li','a',
  'section','main','header','nav','footer'
];

function WorkspacePanel({ currentCode, onRollback, canRollback }) {
  const [view, setView] = useState("preview");
  const [PreviewComponent, setPreviewComponent] = useState(null);
  const [error, setError] = useState(null);
  const [editableCode, setEditableCode] = useState("");

  useEffect(() => {
    setEditableCode(currentCode || "");
  }, [currentCode]);

  useEffect(() => {
    if (!editableCode) {
      setPreviewComponent(null);
      setError(null);
      return;
    }

    try {
      let cleanCode = editableCode
        .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?\n?/g, '')
        .replace(/export\s+default\s+/g, '')
        .trim();

      if (!cleanCode.includes('GeneratedUI')) {
        throw new Error('Generated code must contain a function named GeneratedUI');
      }

      // Security: block non-whitelisted JSX components
      const jsxComponents = [...cleanCode.matchAll(/<([A-Z][a-zA-Z]*)/g)].map(m => m[1]);
      const unauthorized = jsxComponents.filter(c => !ALLOWED_COMPONENTS.includes(c));
      if (unauthorized.length > 0) {
        throw new Error(`Unauthorized components blocked: ${unauthorized.join(', ')}`);
      }

      if (!window.Babel) {
        throw new Error('Babel not loaded — add Babel CDN script to index.html');
      }

      const transpiledCode = window.Babel.transform(cleanCode, {
        presets: ['react'],
      }).code;

      const componentFn = new Function(
        'React',
        'useState',
        'useEffect',
        ...Object.keys(ComponentLibrary),
        `${transpiledCode}\nreturn GeneratedUI;`
      );

      const Component = componentFn(
        React,
        useState,
        useEffect,
        ...Object.values(ComponentLibrary)
      );

      if (typeof Component !== 'function') {
        throw new Error('GeneratedUI is not a valid React component');
      }

      setPreviewComponent(() => Component);
      setError(null);
    } catch (err) {
      console.error('Preview error:', err);
      setError(err.message);
      setPreviewComponent(null);
    }
  }, [editableCode]);

  return (
    <div className="workspace-panel">
      <div className="workspace-header">
        <div className="view-toggle">
          <button onClick={() => setView("preview")} className={`toggle-btn ${view === 'preview' ? 'active' : ''}`}>
            Preview
          </button>
          <button onClick={() => setView("code")} className={`toggle-btn ${view === 'code' ? 'active' : ''}`}>
            Code
          </button>
        </div>
        <button onClick={onRollback} disabled={!canRollback} className="rollback-btn">
          ↩ Rollback
        </button>
      </div>

      <div className="workspace-content">
        {view === "preview" ? (
          <div className="preview-area">
            {error ? (
              <div className="preview-error">
                <h3>⚠️ Render Error</h3>
                <p>{error}</p>
                <small>Switch to Code tab to fix and edit</small>
              </div>
            ) : PreviewComponent ? (
              <PreviewComponent />
            ) : (
              <div className="preview-empty">
                <p>Describe a UI in the chat to get started...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="code-area">
            <div className="code-label">GENERATED_REACT.JSX — editable</div>
            <textarea
              className="code-editor"
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkspacePanel;