import React, { useState } from 'react';
import UIRenderer from './UIRenderer';

function WorkspacePanel({ currentUI, onRollback, canRollback }) {
  const [view, setView] = useState("preview");

  return (
    <div className="workspace-panel">
      {/* Top Bar */}
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

      {/* Content */}
      <div className="workspace-content">
        {view === "preview" ? (
          <div className="preview-area">
            <UIRenderer layout={currentUI} />
          </div>
        ) : (
          <div className="code-area">
            <div className="code-label">DETERMINISTIC_SCHEMA.JSON</div>
            <pre className="code-display">
              {JSON.stringify(currentUI, null, 2) || '[]'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkspacePanel;