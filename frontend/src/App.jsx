import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Controls from './components/Controls';
import CodeEditor from './components/Editor';
import Output from './components/Output';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import CustomAlert from './components/CustomAlert';
import ConfirmSubmit from './components/ConfirmSubmit';
import './App.css';

// SVG imports
import verticalLight from './assets/resizers/vertical-light.svg';
import verticalDark from './assets/resizers/vertical-dark.svg';
import horizontalLight from './assets/resizers/horizontal-light.svg';
import horizontalDark from './assets/resizers/horizontal-dark.svg';

const BOILERPLATES = {
  python: 'print("Hello, World!")\n',
  javascript: 'console.log("Hello, World!");\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n',
  rust: 'fn main() {\n    println!("Hello, World!");\n}\n',
  typescript: 'console.log("Hello, World!");\n',
  ruby: 'puts "Hello, World!"',
  swift: 'print("Hello, World!")',
  php: '<?echo "Hello, World!";\n?>'
};

const LANGUAGE_VERSIONS = {
  python: '3.10.0',
  javascript: '18.15.0',
  java: '15.0.2',
  c: '10.2.0',
  cpp: '10.2.0',
  go: '1.16.2',
  rust: '1.68.2',
  typescript: '5.0.3',
  ruby: '3.0.1',
  swift: '5.3.3',
  php: '8.2.3'
};

const App = () => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'python');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'vs');
  const [code, setCode] = useState(() => {
    const lang = localStorage.getItem('language') || 'python';
    const savedCode = localStorage.getItem(`code-${lang}`);
    const unsavedCode = localStorage.getItem(`unsaved-${lang}`);
    return unsavedCode || savedCode || BOILERPLATES[lang] || '';
  });
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
const [alertMessages, setAlertMessages] = useState([]);
  const [layout, setLayout] = useState('vertical');
  const splitDirection = layout === 'vertical' ? 'horizontal' : 'vertical';
  const [showConfirm, setShowConfirm] = useState(false);
  const [receivedQuestion, setReceivedQuestion] = useState('Write a program');
  const [receivedLanguage, setReceivedLanguage] = useState('');
  const [isLanguageLocked, setIsLanguageLocked] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false); // New state to track initialization

  useEffect(() => {
    localStorage.setItem('language', language);
    // Load code when language changes
    const savedCode = localStorage.getItem(`code-${language}`);
    const unsavedCode = localStorage.getItem(`unsaved-${language}`);
    setCode(unsavedCode || savedCode || BOILERPLATES[language] || '');
  }, [language]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Initialize code only when language changes and not already set by parent
  useEffect(() => {
    if (isInitialized) {
      const savedCode = localStorage.getItem(`code-${language}`);
      const unsavedCode = localStorage.getItem(`unsaved-${language}`);
      setCode(unsavedCode || savedCode || BOILERPLATES[language] || '');
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
      if (!event.origin.includes("localhost")) return;

      if (event.data?.type === "INIT") {
        const { question, language: parentLanguage } = event.data.payload || {};

setReceivedQuestion(question || 'Write a program');
        setReceivedLanguage(parentLanguage);

        if (parentLanguage === "all") {
          setLanguage('python');
          setIsLanguageLocked(false);
          setIsEditable(true);
        } else {
          setLanguage(parentLanguage);
          setIsLanguageLocked(true);
          setIsEditable(true);

          // Only set code if not already initialized or if no user edits exist
          const existingCode = localStorage.getItem(`unsaved-${parentLanguage}`) ||
                             localStorage.getItem(`code-${parentLanguage}`);
          if (!isInitialized || !existingCode) {
            setCode(BOILERPLATES[parentLanguage] || '');
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
setAlertMessages((prev) => [{ text: 'Code saved!', type: 'success' }, ...prev]);
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
setAlertMessages((prev) => [{ text: 'Editor cleared!', type: 'info' }, ...prev]);
    }
  };


  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput('Error: Please enter some code');
setAlertMessages((prev) => [{ text: 'Error: Please enter some code', type: 'error' }, ...prev]);
      return;
    }

    setIsRunning(true);
    setOutput('Running...');

    try {
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language,
        version: LANGUAGE_VERSIONS[language] || 'latest',
        files: [{ content: code }]
      });

      setOutput(response.data.run.output || 'No output');
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.message || error.message}`);
setAlertMessages((prev) => [{ text: `Error: ${error.response?.data?.message || error.message}`, type: 'error' }, ...prev]);
    } finally {
      setIsRunning(false);
    }
  };


  const handleClearOutput = () => {
 setOutput('');
setAlertMessages((prev) => [{ text: 'Output cleared!', type: 'info' }, ...prev]);
  };

  const handleDownloadCode = () => {
    console.log('handleDownloadCode triggered');
    const extensionMap = {
      python: 'py',
      javascript: 'js',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      go: 'go',
      rust: 'rs',
      typescript: 'ts',
      ruby: 'rb',
      swift: 'swift',
      php: 'php'
    };

    const extension = extensionMap[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `code.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setAlertMessages((prev) => [{ text: 'Code downloaded!', type: 'success' }, ...prev]);
  };

//submit function
 const handleFinalSubmit = async () => {
  try {
    // Log data being sent
    console.log('Submitting data:', { question: receivedQuestion, language, code });

    // Validate data
    if (!receivedQuestion || !language || !code) {
setAlertMessages((prev) => [{ text: 'Error: Language and code are required', type: 'error' }, ...prev]);
      console.error('Validation failed:', {
        question: receivedQuestion,
        language,
        code,
      });
      return;
    }

    // Save submission to MongoDB
    const response = await axios.post('http://localhost:5000/api/submissions', {
      question: receivedQuestion,
      language,
      code,
    });

    // Download the code
    handleDownloadCode();

    // Send message to parent to redirect to preview page with submission ID
    window.parent.postMessage(
      {
        type: 'SUBMIT',
        payload: { submissionId: response.data.id },
      },
      'http://localhost:5174' // Ensure this matches parent app origin
    );

setAlertMessages((prev) => [{ text: 'Code submitted successfully!', type: 'success' }, ...prev]);
    setShowConfirm(false);
  } catch (error) {
setAlertMessages((prev) => [{ text: `Failed to submit code: ${error.response?.data?.error || error.message}`, type: 'error' }, ...prev]);
    console.error('Submission error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
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
        isRunning={isRunning}
        layout={layout}
        onLayoutChange={setLayout}
        setShowConfirm={setShowConfirm}
        isLanguageLocked={isLanguageLocked}
        lockedLanguage={receivedLanguage || language}
        isEditable={isEditable}
      />

      <PanelGroup direction={splitDirection} className={`main-container ${splitDirection}`}>
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
          />
        </Panel>

        <PanelResizeHandle className={`resize-handle ${theme}`}>
          <img
            src={
              layout === 'vertical'
                ? theme === 'vs' ? verticalLight : verticalDark
                : theme === 'vs' ? horizontalLight : horizontalDark
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