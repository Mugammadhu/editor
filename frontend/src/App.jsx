import React, { useState, useEffect } from "react";
import axios from "axios";
import Controls from "./components/Controls";
import CodeEditor from "./components/Editor";
import Output from "./components/Output";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CustomAlert from "./components/CustomAlert";
import ConfirmSubmit from "./components/ConfirmSubmit";
import "./App.css";

// SVG imports
import verticalLight from "./assets/resizers/vertical-light.svg";
import verticalDark from "./assets/resizers/vertical-dark.svg";
import horizontalLight from "./assets/resizers/horizontal-light.svg";
import horizontalDark from "./assets/resizers/horizontal-dark.svg";

const BOILERPLATES = {
  python: 'print("Hello, World!")\n',
  javascript: 'console.log("Hello, World!");\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return ;\n}\n',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n',
  rust: 'fn main() {\n    println!("Hello, World!");\n}\n',
  typescript: 'console.log("Hello, World!");\n',
  ruby: 'puts "Hello, World!"',
  swift: 'print("Hello, World!")',
  php: '<?php echo "Hello, World!"; ?>\n',
  ocaml: 'print_endline "Hello, World!";;\n',
  vb: 'Module HelloWorld\n    Sub Main()\n        Console.WriteLine("Hello, World!")\n    End Sub\nEnd Module\n',
  fsharp: 'printfn "Hello, World!"\n',
  lua: 'print("Hello, World!")\n',
  haskell: 'main = putStrLn "Hello, World!"\n',
  dart: 'void main() {\n  print("Hello, World!");\n}\n',
  elixir: 'IO.puts("Hello, World!")\n',
  julia: 'println("Hello, World!")\n',
  racket: '#lang racket\n(displayln "Hello, World!")\n',
  powershell: 'Write-Output "Hello, World!"\n',
  bash: 'echo "Hello, World!"\n',
  r: 'cat("Hello, World!\\n")\n',
  scala: 'object Main extends App {\n  println("Hello, World!")\n}\n',
  perl: 'print "Hello, World!\\n";\n',
  kotlin: 'fun main() {\n    println("Hello, World!")\n}\n',
  csharp:
    'using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}\n',
};

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
  fsharp: "5.0.201",
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
  kotlin: "1.8.20",
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
  const [isLanguageLocked, setIsLanguageLocked] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedActions, setSelectedActions] = useState([]);
  useEffect(() => {
    localStorage.setItem("language", language);
    // Load code when language changes
    const savedCode = localStorage.getItem(`code-${language}`);
    const unsavedCode = localStorage.getItem(`unsaved-${language}`);
    setCode(unsavedCode || savedCode || BOILERPLATES[language] || "");
  }, [language]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Initialize code only when language changes and not already set by parent
  useEffect(() => {
    if (isInitialized) {
      const savedCode = localStorage.getItem(`code-${language}`);
      const unsavedCode = localStorage.getItem(`unsaved-${language}`);
      setCode(unsavedCode || savedCode || BOILERPLATES[language] || "");
    }
  }, [language, isInitialized]);

  // Auto-save unsaved changes (debounced)
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


  // Handle messages from parent
  useEffect(() => {
    const handleMessage = (event) => {
      const expectedOrigin = import.meta.env.VITE_PARENT_APP;

      if (event.origin !== expectedOrigin) return;

      if (event.data?.type === "INIT") {
        const { question, language: parentLanguage } = event.data.payload || {};

        setReceivedQuestion(question || "Write a program");
        setReceivedLanguage(parentLanguage);

        if (parentLanguage === "all") {
          setLanguage("python");
          setIsLanguageLocked(false);
          setIsEditable(true);
        } else {
          setLanguage(parentLanguage);
          setIsLanguageLocked(true);
          setIsEditable(true);

          // Only set code if not already initialized or if no user edits exist
          const existingCode =
            localStorage.getItem(`unsaved-${parentLanguage}`) ||
            localStorage.getItem(`code-${parentLanguage}`);
          if (!isInitialized || !existingCode) {
            setCode(BOILERPLATES[parentLanguage] || "");
          }
        }

        setIsInitialized(true); // Mark as initialized
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
    setAlertMessages((prev) => [
      { text: "Output cleared!", type: "info" },
      ...prev,
    ]);
  };

  const handleDownloadCode = () => {
    console.log("handleDownloadCode triggered");
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

  //submit function
const handleFinalSubmit = async () => {
  try {
    // Debug: Log submission data
    console.log("Submitting data:", {
      question: receivedQuestion,
      language,
      code: code.length > 100 ? `${code.substring(0, 100)}...` : code, // Show preview of code
    });

    // Validate data more thoroughly
    if (!receivedQuestion?.trim()) {
      throw new Error("Question is required");
    }
    if (!language) {
      throw new Error("Language is required");
    }
    if (!code?.trim()) {
      throw new Error("Code cannot be empty");
    }

    // Debug: Log backend URL being used
    console.log("Using backend URL:", import.meta.env.VITE_BACKEND_URL);

    // Save submission to MongoDB
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/submissions`,
      {
        question: receivedQuestion.trim(),
        language,
        code: code.trim(),
      },
      {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    // Debug: Log the response
    console.log("Submission response:", response.data);

    if (!response.data?.id) {
      throw new Error("Invalid response from server - missing submission ID");
    }

    // Determine parent origin with fallbacks
    let parentOrigin;
    try {
      parentOrigin = new URL(import.meta.env.VITE_PARENT_APP).origin;
      console.log("Using configured parent origin:", parentOrigin);
    } catch (e) {
      console.warn("Invalid VITE_PARENT_APP, falling back to referrer");
      parentOrigin = document.referrer 
        ? new URL(document.referrer).origin 
        : window.location.origin;
    }

    // Debug: Log where we're sending the message
    console.log("Attempting to postMessage to:", parentOrigin);

    // Send message to parent
    window.parent.postMessage(
      {
        type: "SUBMIT",
        payload: { 
          submissionId: response.data.id,
          timestamp: new Date().toISOString(),
        }
      },
      parentOrigin
    );

    // Fallback for same-origin scenario
    if (window.location.origin === parentOrigin) {
      console.log("Same origin detected, navigating directly");
      window.location.href = `/preview/${response.data.id}`;
    }

    // Success handling
    setAlertMessages((prev) => [
      { 
        text: "Code submitted successfully! Redirecting...", 
        type: "success",
        persist: true // Optional: keep this message visible longer
      },
      ...prev,
    ]);
    
    setShowConfirm(false);

  } catch (error) {
    // Enhanced error handling
    const errorMessage = error.response?.data?.error || 
                        error.message || 
                        "Unknown submission error";
    
    console.error("Submission failed:", {
      error: errorMessage,
      stack: error.stack,
      response: error.response?.data,
    });

    setAlertMessages((prev) => [
      {
        text: `Submission failed: ${errorMessage}`,
        type: "error",
        persist: true
      },
      ...prev,
    ]);

    // Optional: Send error message to parent for unified error handling
    try {
      window.parent.postMessage(
        {
          type: "SUBMIT_ERROR",
          payload: { error: errorMessage }
        },
        parentOrigin || "*" // Fallback to any origin if parentOrigin not set
      );
    } catch (postError) {
      console.error("Failed to send error to parent:", postError);
    }
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
