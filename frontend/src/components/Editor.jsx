
import React from 'react';
import Editor from '@monaco-editor/react';
import './editor.css';

const CodeEditor = ({ language, theme, code, onCodeChange, version, onClear, onSave }) => {
  const handleEditorDidMount = (editor, monaco) => {
    editor.onKeyDown((e) => {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyV) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    editor.onContextMenu((e) => {
      const pasteAction = editor.getAction('editor.action.clipboardPasteAction');
      if (pasteAction) pasteAction.disabled = true;
    });
  };

  return (
    <div className={`editor-container ${theme === 'vs-dark' ? 'dark' : theme=='vs' ? 'light' : 'contrast'}`}>
      <div className="editor-header">
        <h3>{language} {version}</h3>
        <div className="editor-actions">
          <button onClick={onClear} className="clear-btn">🧹 Clear</button>
          <button onClick={onSave}>💾 Save</button>
        </div>
      </div>
      <div className="editor-content">
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={onCodeChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbersMinChars: 3,
            readOnly: false,
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            acceptSuggestionOnEnter: 'off',
            snippetSuggestions: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
