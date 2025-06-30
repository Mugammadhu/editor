import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, theme, code, onCodeChange }) => {
  return (
    <Editor
      height="80vh"
      language={language}
      theme={theme}
      value={code}
      onChange={onCodeChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        lineNumbersMinChars: 3
      }}
    />
  );
};

export default CodeEditor;