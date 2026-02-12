import React, { useState, useEffect } from 'react';
import * as ComponentLibrary from './library';

function WorkspacePanel({ currentCode, onRollback, canRollback }) {
  const [view, setView] = useState("preview");
  const [PreviewComponent, setPreviewComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentCode) {
      setPreviewComponent(null);
      setError(null);
      return;
    }

    try {
      // Strip import and export lines — components injected manually below
      let cleanCode = currentCode
        .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?\n?/g, '')
        .replace(/export\s+default\s+/g, '')
        .trim();

      if (!cleanCode.includes('GeneratedUI')) {
        throw new Error('Generated code must contain a function named GeneratedUI');
      }

      // Babel transpiles JSX → plain JS at runtime
      // Without this, new Function() throws SyntaxError on <Button /> etc.
      if (!window.Babel) {
        throw new Error('Babel not loaded — add Babel CDN script to index.html');
      }

      const transpiledCode = window.Babel.transform(cleanCode, {
        presets: ['react'],
      }).code;

      // Inject all library components as variables into the function scope
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
  }, [currentCode]);

  return (
    <div className="workspace-panel">
      <div className="workspace-header">
        <div className="view-toggle">
          <button
            onClick={() => setView("preview")}
            className={`toggle-btn ${view === 'preview' ? 'active' : ''}`}
          >
            Preview
          </button>
          <button
            onClick={() => setView("code")}
            className={`toggle-btn ${view === 'code' ? 'active' : ''}`}
          >
            Code
          </button>
        </div>

        <button
          onClick={onRollback}
          disabled={!canRollback}
          className="rollback-btn"
        >
          ← Rollback
        </button>
      </div>

      <div className="workspace-content">
        {view === "preview" ? (
          <div className="preview-area">
            {error ? (
              <div className="preview-error">
                <h3>⚠️ Render Error</h3>
                <p>{error}</p>
                <small>Check the Code tab for details</small>
              </div>
            ) : PreviewComponent ? (
              <PreviewComponent />
            ) : (
              <div className="preview-empty">
                <p>No UI generated yet...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="code-area">
            <div className="code-label">GENERATED_REACT.JSX</div>
            <pre className="code-display">
              {currentCode || '// No code generated'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkspacePanel;