
import React from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import "./editor.css";

const CodeEditor = ({
  language,
  theme,
  code,
  onCodeChange,
  version,
  onClear,
  onSave,
  readOnly = false,
  selectedActions,
}) => {
  const handleEditorDidMount = (editor, monaco) => {
    if (readOnly) {
      editor.updateOptions({ readOnly: true });
    }
  };

  return (
    <motion.div
      className={`editor-container ${
        theme === "vs-dark" ? "dark" : theme === "vs" ? "light" : "contrast"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`editor-header ${theme}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <h3>
          {language} {version}
        </h3>
        <div className="editor-actions">
          {selectedActions.includes("clear") && (
            <motion.button
              onClick={onClear}
              className="action-button clear-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Clear code"
            >
              {window.innerWidth > 768 && <span className="button-icon">🧹</span>}
              <span className="button-text">Clear</span>
            </motion.button>
          )}
          {selectedActions.includes("save") && (
            <motion.button
              onClick={onSave}
              className="action-button save-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Save code"
            >
              {window.innerWidth > 768 && <span className="button-icon">💾</span>}
              <span className="button-text">Save</span>
            </motion.button>
          )}
        </div>
      </motion.div>
      <motion.div
        className="editor-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={readOnly ? undefined : onCodeChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbersMinChars: 3,
            readOnly: readOnly,
            quickSuggestions: !readOnly,
            suggestOnTriggerCharacters: !readOnly,
            acceptSuggestionOnEnter: readOnly ? "off" : "on",
            snippetSuggestions: readOnly ? "none" : "inline",
            accessibilitySupport: "on",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default CodeEditor;
