// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Controls from "./components/Controls";
// import CodeEditor from "./components/Editor";
// import Output from "./components/Output";
// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
// import CustomAlert from "./components/CustomAlert";
// import ConfirmSubmit from "./components/ConfirmSubmit";
// import "./App.css";
// import BOILERPLATES from "./boilerplate";

// // SVG imports
// import verticalLight from "./assets/resizers/vertical-light.svg";
// import verticalDark from "./assets/resizers/vertical-dark.svg";
// import horizontalLight from "./assets/resizers/horizontal-light.svg";
// import horizontalDark from "./assets/resizers/horizontal-dark.svg";


// const LANGUAGE_VERSIONS = {
//   python: "3.10.0",
//   javascript: "18.15.0",
//   java: "15.0.2",
//   c: "10.2.0",
//   cpp: "10.2.0",
//   go: "1.16.2",
//   rust: "1.68.2",
//   typescript: "5.0.3",
//   ruby: "3.0.1",
//   swift: "5.3.3",
//   php: "8.2.3",
//   ocaml: "4.12.0",
//   vb: "5.0.201",
//   lua: "5.4.4",
//   haskell: "9.0.1",
//   dart: "2.19.6",
//   elixir: "1.11.3",
//   julia: "1.8.5",
//   racket: "8.3.0",
//   powershell: "7.1.4",
//   bash: "5.2.0",
//   r: "4.1.1",
//   scala: "3.2.2",
//   perl: "5.36.0",
//   csharp: "6.12.0",
// };

// const App = () => {
//   const [language, setLanguage] = useState(
//     () => localStorage.getItem("language") || "python"
//   );
//   const [theme, setTheme] = useState(
//     () => localStorage.getItem("theme") || "vs"
//   );
//   const [code, setCode] = useState(() => {
//     const lang = localStorage.getItem("language") || "python";
//     const savedCode = localStorage.getItem(`code-${lang}`);
//     const unsavedCode = localStorage.getItem(`unsaved-${lang}`);
//     return unsavedCode || savedCode || BOILERPLATES[lang] || "";
//   });
//   const [output, setOutput] = useState("");
//   const [isRunning, setIsRunning] = useState(false);
//   const [alertMessages, setAlertMessages] = useState([]);
//   const [layout, setLayout] = useState("vertical");
//   const splitDirection = layout === "vertical" ? "horizontal" : "vertical";
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [receivedQuestion, setReceivedQuestion] = useState("Write a program");
//   const [receivedLanguage, setReceivedLanguage] = useState("");
//   const [receivedTestCases, setReceivedTestCases] = useState([]);
//   const [isLanguageLocked, setIsLanguageLocked] = useState(false);
//   const [isEditable, setIsEditable] = useState(true);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [selectedActions, setSelectedActions] = useState([]);
//   const [status, setStatus] = useState("idle");
//   const [testResults, setTestResults] = useState([]);
//   useEffect(() => {
//     localStorage.setItem("language", language);
//     // Load code when language changes
//     const savedCode = localStorage.getItem(`code-${language}`);
//     const unsavedCode = localStorage.getItem(`unsaved-${language}`);
//     setCode(unsavedCode || savedCode || BOILERPLATES[language] || "");
//   }, [language]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 425) {
//         setLayout("horizontal");
//       } else {
//         setLayout("vertical");
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   // Initialize code only when language changes and not already set by parent
//   useEffect(() => {
//     if (isInitialized) {
//       const savedCode = localStorage.getItem(`code-${language}`);
//       const unsavedCode = localStorage.getItem(`unsaved-${language}`);
//       setCode(unsavedCode || savedCode || BOILERPLATES[language] || "");
//     }
//   }, [language, isInitialized]);

//   // Auto-save unsaved changes (debounced)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (code && code !== BOILERPLATES[language]) {
//         localStorage.setItem(`unsaved-${language}`, code);
//       } else {
//         localStorage.removeItem(`unsaved-${language}`);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [code, language]);

//   // Handle messages from parent
//   useEffect(() => {
//     const handleMessage = (event) => {
//       const allowedOrigins = [
//         import.meta.env.VITE_PARENT_APP,
//         "http://localhost:5173", // For local development
//         "https://digi-exams.netlify.app",
//       ];

//       if (!allowedOrigins.includes(event.origin)) return;

//       if (event.data?.type === "INIT") {
//         const { question, language: parentLanguage,testCases } = event.data.payload || {};
       

//         setReceivedQuestion(question || "Write a program");
//         setReceivedLanguage(parentLanguage);
//         setReceivedTestCases(testCases)

//         if (parentLanguage === "all") {
//           setLanguage("python");
//           setIsLanguageLocked(false);
//           setIsEditable(true);
//         } else {
//           setLanguage(parentLanguage);
//           setIsLanguageLocked(true);
//           setIsEditable(true);

//           // Only set code if not already initialized or if no user edits exist
//           const existingCode =
//             localStorage.getItem(`unsaved-${parentLanguage}`) ||
//             localStorage.getItem(`code-${parentLanguage}`);
//           if (!isInitialized || !existingCode) {
//             setCode(BOILERPLATES[parentLanguage] || "");
//           }
//         }

//         setIsInitialized(true); // Mark as initialized
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, []);

//   const handleSaveCode = () => {
//     localStorage.setItem(`code-${language}`, code);
//     localStorage.removeItem(`unsaved-${language}`);
//     setAlertMessages((prev) => [
//       { text: "Code saved!", type: "success" },
//       ...prev,
//     ]);
//   };

//   const handleCodeChange = (newCode) => {
//     if (isEditable) {
//       setCode(newCode);
//     }
//   };

//   const handleClearCode = () => {
//     if (isEditable) {
//       localStorage.removeItem(`unsaved-${language}`);
//       setCode(BOILERPLATES[language]);
//       setAlertMessages((prev) => [
//         { text: "Editor cleared!", type: "info" },
//         ...prev,
//       ]);
//     }
//   };

//   const handleRunCode = async () => {
//     if (!code.trim()) {
//       setOutput("Error: Please enter some code");
//       setAlertMessages((prev) => [
//         { text: "Error: Please enter some code", type: "error" },
//         ...prev,
//       ]);
//       return;
//     }

//     setIsRunning(true);
//     setOutput("Running...");

//     try {
//       const response = await axios.post(import.meta.env.VITE_PISTON_API, {
//         language,
//         version: LANGUAGE_VERSIONS[language] || "latest",
//         files: [{ content: code }],
//       });

//       setOutput(response.data.run.output || "No output");
//     } catch (error) {
//       setOutput(`Error: ${error.response?.data?.message || error.message}`);
//       setAlertMessages((prev) => [
//         {
//           text: `Error: ${error.response?.data?.message || error.message}`,
//           type: "error",
//         },
//         ...prev,
//       ]);
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const handleClearOutput = () => {
//     setOutput("");
//     setAlertMessages((prev) => [
//       { text: "Output cleared!", type: "info" },
//       ...prev,
//     ]);
//   };

//   const handleDownloadCode = () => {
//     console.log("handleDownloadCode triggered");
//     const extensionMap = {
//       python: "py",
//       javascript: "js",
//       java: "java",
//       c: "c",
//       cpp: "cpp",
//       go: "go",
//       rust: "rs",
//       typescript: "ts",
//       ruby: "rb",
//       swift: "swift",
//       php: "php",
//     };

//     const extension = extensionMap[language] || "txt";
//     const blob = new Blob([code], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `code.${extension}`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//     setAlertMessages((prev) => [
//       { text: "Code downloaded!", type: "success" },
//       ...prev,
//     ]);
//   };

//   // const handleFinalSubmit = async () => {
//   //   if (status === "pending") return; // prevent multiple submits
//   //   setShowConfirm(false);
//   //   setStatus("pending");

//   //   try {
//   //     const response = await axios.post(
//   //       `${import.meta.env.VITE_BACKEND_URL}/api/submissions`,
//   //       { question: receivedQuestion, language, code },
//   //       { timeout: 10000 }
//   //     );

//   //     const submissionId = response.data.id;

//   //     // Notify parent app
//   //     window.parent.postMessage(
//   //       {
//   //         type: "SUBMIT",
//   //         payload: { submissionId },
//   //       },
//   //       import.meta.env.VITE_PARENT_APP
//   //     );
//   //         setAlertMessages((prev) => [
//   //       { text: "Code Submitted", type: "success" },
//   //       ...prev,
//   //     ]);

//   //   } catch (error) {
//   //     setAlertMessages([
//   //       {
//   //         text: `Submission failed: ${error.message || "Network error"}`,
//   //         type: "error",
//   //       },
//   //     ]);
//   //   } finally {
//   //     setStatus("idle");
//   //   }
//   // };

// const handleFinalSubmit = async () => {
//   if (status === "pending") return;
  
//   // Clear output and test results but keep the code
//   setOutput("Running test cases...");
//   setTestResults([]);
//   setShowConfirm(false);
//   setStatus("pending");

//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/api/submissions`,
//       { question: receivedQuestion, language, code ,testCases:receivedTestCases}, // Send current code
//       { timeout: 30000 }
//     );

//     const submissionId = response.data.id;
//     const backendResults = response.data.testResults || [];

//     const formatted = backendResults.map((t) => ({
//       input: t.input,
//       expected: t.expected,
//       actual: t.output,
//       passed: t.passed,
//       executionTime: Math.floor(Math.random() * 100) + 1,
//     }));

//     setTestResults(formatted);
//     setOutput("Test cases completed!");

//     window.parent.postMessage(
//       { 
//         type: "SUBMIT", 
//         payload: { submissionId } 
//       },
//       import.meta.env.VITE_PARENT_APP
//     );



//     setAlertMessages((prev) => [
//       { text: "Code Submitted Successfully", type: "success" },
//       ...prev,
//     ]);
//   } catch (error) {
//     setOutput(`Error: ${error.message || "Submission failed"}`);
//     setAlertMessages([
//       { text: `Submission failed: ${error.message}`, type: "error" }
//     ]);
//   } finally {
//     setStatus("idle");
//   }
// };

//   return (
//     <div className="app">
//       <Controls
//         language={language}
//         theme={theme}
//         onLanguageChange={(newLang) => {
//           if (!isLanguageLocked) {
//             setLanguage(newLang);
//           }
//         }}
//         onThemeChange={setTheme}
//         onRun={handleRunCode}
//         onSaveCode={handleSaveCode}
//         onClearCode={handleClearCode}
//         onClearOutput={handleClearOutput}
//         output={output}
//         code={code}
//         isRunning={isRunning}
//         layout={layout}
//         onLayoutChange={setLayout}
//         setShowConfirm={setShowConfirm}
//         isLanguageLocked={isLanguageLocked}
//         lockedLanguage={receivedLanguage || language}
//         isEditable={isEditable}
//         handleDownloadCode={handleDownloadCode}
//         selectedActions={selectedActions}
//         setSelectedActions={setSelectedActions}
//       />

//       <PanelGroup
//         direction={splitDirection}
//         className={`main-container ${splitDirection}`}
//       >
//         <Panel defaultSize={60} minSize={30} className="editor-panel">
//           <CodeEditor
//             language={language}
//             theme={theme}
//             code={code}
//             onCodeChange={handleCodeChange}
//             version={LANGUAGE_VERSIONS[language]}
//             onSave={handleSaveCode}
//             onClear={handleClearCode}
//             readOnly={!isEditable}
//             selectedActions={selectedActions}
//           />
//         </Panel>

//         <PanelResizeHandle className={`resize-handle ${theme}`}>
//           <img
//             src={
//               layout === "vertical"
//                 ? theme === "vs"
//                   ? verticalLight
//                   : verticalDark
//                 : theme === "vs"
//                 ? horizontalLight
//                 : horizontalDark
//             }
//             alt="Resize Handle"
//             className="resize-icon"
//           />
//         </PanelResizeHandle>

//         <Panel defaultSize={40} minSize={30} className="output-panel">
//           <Output
//             output={output}
//             testResults={testResults}
//             onClear={handleClearOutput}
//             theme={theme}
//             selectedActions={selectedActions}
//           />
//         </Panel>
//       </PanelGroup>

//       <CustomAlert
//         messages={alertMessages}
//         duration={3000}
//         onClose={setAlertMessages}
//       />

//       <ConfirmSubmit
//         show={showConfirm}
//         onConfirm={handleFinalSubmit}
//         onCancel={() => setShowConfirm(false)}
//       />
//     </div>
//   );
// };

// export default App;



import React, { useState, useEffect } from "react";
import axios from "axios";
import Controls from "./components/Controls";
import CodeEditor from "./components/Editor";
import Output from "./components/Output";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CustomAlert from "./components/CustomAlert";
import ConfirmSubmit from "./components/ConfirmSubmit";
import "./App.css";
import BOILERPLATES from "./boilerplate";

// SVG imports
import verticalLight from "./assets/resizers/vertical-light.svg";
import verticalDark from "./assets/resizers/vertical-dark.svg";
import horizontalLight from "./assets/resizers/horizontal-light.svg";
import horizontalDark from "./assets/resizers/horizontal-dark.svg";

const LANGUAGE_VERSIONS = {
  python: "3.10.0",
  javascript: "18.15.0",
  java: "15.0.2",
  c: "10.2.0",
  cpp: "10.2.0",
  go: "1.16.2",
  rust: "1.68.2",
  typescript: "5.0.3",
  ruby: "3.0.1",
  swift: "5.3.3",
  php: "8.2.3",
  ocaml: "4.12.0",
  vb: "5.0.201",
  lua: "5.4.4",
  haskell: "9.0.1",
  dart: "2.19.6",
  elixir: "1.11.3",
  julia: "1.8.5",
  racket: "8.3.0",
  powershell: "7.1.4",
  bash: "5.2.0",
  r: "4.1.1",
  scala: "3.2.2",
  perl: "5.36.0",
  csharp: "6.12.0",
};

const App = () => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "python"
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "vs"
  );
  const [code, setCode] = useState(() => {
    const lang = localStorage.getItem("language") || "python";
    const savedCode = localStorage.getItem(`code-${lang}`);
    const unsavedCode = localStorage.getItem(`unsaved-${lang}`);
    return unsavedCode || savedCode || BOILERPLATES[lang] || "";
  });
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [alertMessages, setAlertMessages] = useState([]);
  const [layout, setLayout] = useState("vertical");
  const splitDirection = layout === "vertical" ? "horizontal" : "vertical";
  const [showConfirm, setShowConfirm] = useState(false);
  const [receivedQuestion, setReceivedQuestion] = useState("Write a program");
  const [receivedLanguage, setReceivedLanguage] = useState("");
  const [receivedTestCases, setReceivedTestCases] = useState([]);
  const [isLanguageLocked, setIsLanguageLocked] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedActions, setSelectedActions] = useState([]);
  const [status, setStatus] = useState("idle");
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    localStorage.setItem("language", language);
    const savedCode = localStorage.getItem(`code-${language}`);
    const unsavedCode = localStorage.getItem(`unsaved-${language}`);
    setCode(unsavedCode || savedCode || BOILERPLATES[language] || "");
  }, [language]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 425) {
        setLayout("horizontal");
      } else {
        setLayout("vertical");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isInitialized) {
      const savedCode = localStorage.getItem(`code-${language}`);
      const unsavedCode = localStorage.getItem(`unsaved-${language}`);
      setCode(unsavedCode || savedCode || BOILERPLATES[language] || "");
    }
  }, [language, isInitialized]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (code && code !== BOILERPLATES[language]) {
        localStorage.setItem(`unsaved-${language}`, code);
      } else {
        localStorage.removeItem(`unsaved-${language}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [code, language]);

  useEffect(() => {
    const handleMessage = (event) => {
      const allowedOrigins = [
        import.meta.env.VITE_PARENT_APP,
        "http://localhost:5173",
        "https://digi-exams.netlify.app",
      ];

      if (!allowedOrigins.includes(event.origin)) return;

      if (event.data?.type === "INIT") {
        const { question, language: parentLanguage, testCases } = event.data.payload || {};
        console.log(testCases)

        setReceivedQuestion(question || "Write a program");
        setReceivedLanguage(parentLanguage);
        setReceivedTestCases(testCases || []);

        if (parentLanguage === "all") {
          setLanguage("python");
          setIsLanguageLocked(false);
          setIsEditable(true);
        } else {
          setLanguage(parentLanguage);
          setIsLanguageLocked(true);
          setIsEditable(true);

          const existingCode =
            localStorage.getItem(`unsaved-${parentLanguage}`) ||
            localStorage.getItem(`code-${parentLanguage}`);
          if (!isInitialized || !existingCode) {
            setCode(BOILERPLATES[parentLanguage] || "");
          }
        }

        setIsInitialized(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSaveCode = () => {
    localStorage.setItem(`code-${language}`, code);
    localStorage.removeItem(`unsaved-${language}`);
    setAlertMessages((prev) => [
      { text: "Code saved!", type: "success" },
      ...prev,
    ]);
  };

  const handleCodeChange = (newCode) => {
    if (isEditable) {
      setCode(newCode);
    }
  };

  const handleClearCode = () => {
    if (isEditable) {
      localStorage.removeItem(`unsaved-${language}`);
      setCode(BOILERPLATES[language]);
      setAlertMessages((prev) => [
        { text: "Editor cleared!", type: "info" },
        ...prev,
      ]);
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput("Error: Please enter some code");
      setAlertMessages((prev) => [
        { text: "Error: Please enter some code", type: "error" },
        ...prev,
      ]);
      return;
    }

    setIsRunning(true);
    setOutput("Running...");

    try {
      const response = await axios.post(import.meta.env.VITE_PISTON_API, {
        language,
        version: LANGUAGE_VERSIONS[language] || "latest",
        files: [{ content: code }],
      });

      setOutput(response.data.run.output || "No output");
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.message || error.message}`);
      setAlertMessages((prev) => [
        {
          text: `Error: ${error.response?.data?.message || error.message}`,
          type: "error",
        },
        ...prev,
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearOutput = () => {
    setOutput("");
    setTestResults([]);
    setAlertMessages((prev) => [
      { text: "Output cleared!", type: "info" },
      ...prev,
    ]);
  };

  const handleDownloadCode = () => {
    const extensionMap = {
      python: "py",
      javascript: "js",
      java: "java",
      c: "c",
      cpp: "cpp",
      go: "go",
      rust: "rs",
      typescript: "ts",
      ruby: "rb",
      swift: "swift",
      php: "php",
    };

    const extension = extensionMap[language] || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `code.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setAlertMessages((prev) => [
      { text: "Code downloaded!", type: "success" },
      ...prev,
    ]);
  };

  const handleFinalSubmit = async () => {
    if (status === "pending") return;

    setOutput("Running test cases...");
    setTestResults([]);
    setShowConfirm(false);
    setStatus("pending");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/submissions`,
        { question: receivedQuestion, language, code, testCases: receivedTestCases },
        { timeout: 30000 }
      );

      const submissionId = response.data.id;
      const backendResults = response.data.testResults || [];

      const formatted = backendResults.map((t) => ({
        input: t.input,
        expected: t.expected,
        actual: t.output,
        passed: t.passed,
        executionTime: t.executionTime || Math.floor(Math.random() * 100) + 1,
      }));

      setTestResults(formatted);
      setOutput("Test cases completed!");

      window.parent.postMessage(
        { type: "SUBMIT", payload: { submissionId } },
        import.meta.env.VITE_PARENT_APP
      );

      setAlertMessages((prev) => [
        { text: "Code Submitted Successfully", type: "success" },
        ...prev,
      ]);
    } catch (error) {
      setOutput(`Error: ${error.message || "Submission failed"}`);
      setAlertMessages([
        { text: `Submission failed: ${error.message}`, type: "error" },
      ]);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="app">
      <Controls
        language={language}
        theme={theme}
        onLanguageChange={(newLang) => {
          if (!isLanguageLocked) {
            setLanguage(newLang);
          }
        }}
        onThemeChange={setTheme}
        onRun={handleRunCode}
        onSaveCode={handleSaveCode}
        onClearCode={handleClearCode}
        onClearOutput={handleClearOutput}
        output={output}
        code={code}
        isRunning={isRunning}
        layout={layout}
        onLayoutChange={setLayout}
        setShowConfirm={setShowConfirm}
        isLanguageLocked={isLanguageLocked}
        lockedLanguage={receivedLanguage || language}
        isEditable={isEditable}
        handleDownloadCode={handleDownloadCode}
        selectedActions={selectedActions}
        setSelectedActions={setSelectedActions}
      />

      <PanelGroup
        direction={splitDirection}
        className={`main-container ${splitDirection}`}
      >
        <Panel defaultSize={60} minSize={30} className="editor-panel">
          <CodeEditor
            language={language}
            theme={theme}
            code={code}
            onCodeChange={handleCodeChange}
            version={LANGUAGE_VERSIONS[language]}
            onSave={handleSaveCode}
            onClear={handleClearCode}
            readOnly={!isEditable}
            selectedActions={selectedActions}
          />
        </Panel>

        <PanelResizeHandle className={`resize-handle ${theme}`}>
          <img
            src={
              layout === "vertical"
                ? theme === "vs"
                  ? verticalLight
                  : verticalDark
                : theme === "vs"
                ? horizontalLight
                : horizontalDark
            }
            alt="Resize Handle"
            className="resize-icon"
          />
        </PanelResizeHandle>

        <Panel defaultSize={40} minSize={30} className="output-panel">
          <Output
            output={output}
            testResults={testResults}
            testCases={receivedTestCases}
            onClear={handleClearOutput}
            theme={theme}
            selectedActions={selectedActions}
          />
        </Panel>
      </PanelGroup>

      <CustomAlert
        messages={alertMessages}
        duration={3000}
        onClose={setAlertMessages}
      />

      <ConfirmSubmit
        show={showConfirm}
        onConfirm={handleFinalSubmit}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default App;