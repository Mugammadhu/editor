import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, theme, code, onCodeChange }) => {
  const handleEditorDidMount = (editor, monaco) => {
    // Disable paste functionality
    editor.onKeyDown((e) => {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyV) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Also prevent right-click paste
    editor.onContextMenu((e) => {
      const pasteAction = editor.getAction('editor.action.clipboardPasteAction');
      if (pasteAction) {
        pasteAction.disabled = true;
      }
    });
  };

  return (
    <Editor
      height="80vh"
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
        readOnly: false, // Keep editor editable but restrict paste
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: 'off',
        snippetSuggestions: 'none'
      }}
    />
  );
};

export default CodeEditor;