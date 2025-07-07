// import React from "react";
// import Editor from "@monaco-editor/react";
// import "./editor.css";

// const CodeEditor = ({
//   language,
//   theme,
//   code,
//   onCodeChange,
//   version,
//   onClear,
//   onSave,
//   readOnly = false,
//   selectedActions,
// }) => {
//   const handleEditorDidMount = (editor, monaco) => {
//     if (readOnly) {
//       editor.updateOptions({ readOnly: true });
//     } else {
//       editor.onKeyDown((e) => {
//         if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyV) {
//           e.preventDefault();
//           e.stopPropagation();
//         }
//       });

//       editor.onContextMenu((e) => {
//         const pasteAction = editor.getAction(
//           "editor.action.clipboardPasteAction"
//         );
//         if (pasteAction) pasteAction.disabled = true;
//       });
//     }
//   };

//   return (
//     <div
//       className={`editor-container ${
//         theme === "vs-dark" ? "dark" : theme === "vs" ? "light" : "contrast"
//       }`}
//     >
//       <div className="editor-header">
//         <h3>
//           {language} {version}
//         </h3>
//                 <div className="editor-actions">
//           {selectedActions.includes('clear') && (
//             <button onClick={onClear} className="action-button">
//               🧹 Clear Code
//             </button>
//           )}
//           {selectedActions.includes('save') && (
//             <button onClick={onSave} className="action-button">
//               💾 Save Code
//             </button>
//           )}
//         </div>
//       </div>
//       <div className="editor-content">
//         <Editor
//           height="100%"
//           language={language}
//           theme={theme}
//           value={code}
//           onChange={readOnly ? undefined : onCodeChange}
//           onMount={handleEditorDidMount}
//           options={{
//             minimap: { enabled: false },
//             fontSize: 14,
//             wordWrap: "on",
//             automaticLayout: true,
//             scrollBeyondLastLine: false,
//             lineNumbersMinChars: 3,
//             readOnly: readOnly,
//             quickSuggestions: !readOnly,
//             suggestOnTriggerCharacters: !readOnly,
//             acceptSuggestionOnEnter: readOnly ? "off" : "on",
//             snippetSuggestions: readOnly ? "none" : "inline",
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default CodeEditor;


import React from "react";
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
    } else {
      editor.onKeyDown((e) => {
        if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyV) {
          e.preventDefault();
          e.stopPropagation();
        }
      });

      editor.onContextMenu((e) => {
        const pasteAction = editor.getAction(
          "editor.action.clipboardPasteAction"
        );
        if (pasteAction) pasteAction.disabled = true;
      });
    }
  };

  return (
    <div
      className={`editor-container ${
        theme === "vs-dark" ? "dark" : theme === "vs" ? "light" : "contrast"
      }`}
    >
      <div className={`editor-header ${theme}`}>
        <h3>
          {language} {version}
        </h3>
        <div className="editor-actions">
          {selectedActions.includes("clear") && (
            <button onClick={onClear} className="action-button clear-button">
              <span className="button-icon">🧹</span>
              <span className="button-text">Clear</span>
            </button>
          )}
          {selectedActions.includes("save") && (
            <button onClick={onSave} className="action-button save-button">
              <span className="button-icon">💾</span>
              <span className="button-text">Save</span>
            </button>
          )}
        </div>
      </div>
      <div className="editor-content">
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
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;