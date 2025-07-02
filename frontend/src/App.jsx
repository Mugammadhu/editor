

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Controls from './components/Controls';
import CodeEditor from './components/Editor';
import Output from './components/Output';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import CustomAlert from './components/CustomAlert';
import ConfirmSubmit from './components/ConfirmSubmit';
import './App.css';

//svg
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
  const [code, setCode] = useState(BOILERPLATES.python);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
const [layout, setLayout] = useState('vertical');
const splitDirection = layout === 'vertical' ? 'horizontal' : 'vertical';
const version=LANGUAGE_VERSIONS[language];
const [showConfirm, setShowConfirm] = useState(false);


useEffect(() => {
  localStorage.setItem('language', language);
}, [language]);

useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);

useEffect(() => {
    const savedCode = localStorage.getItem(`code-${language}`);
    const unsavedCode = localStorage.getItem(`unsaved-${language}`);
    
    // Priority: unsaved changes > saved code > boilerplate
    setCode(unsavedCode || savedCode || BOILERPLATES[language]);
  }, [language]);

  // Auto-save unsaved changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code !== BOILERPLATES[language]) {
        localStorage.setItem(`unsaved-${language}`, code);
      } else {
        localStorage.removeItem(`unsaved-${language}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [code, language]);

  const handleSaveCode = () => {
    localStorage.setItem(`code-${language}`, code);
    localStorage.removeItem(`unsaved-${language}`);
    setAlertMessage('Code saved!');
    setAlertVisible(true);
  };


  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput('Error: Please enter some code');
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
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearOutput = () => {
    setOutput('');
  };

  const handleDownloadCode = () => {
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
  };


  const handleFinalSubmit = () => {
  // Your submit logic
  handleDownloadCode()
  setAlertMessage('Code submitted successfully!');
  setAlertVisible(true);
  setShowConfirm(false);
};

  return (
    <div className="app">
   <Controls
  language={language}
  theme={theme}
  onLanguageChange={setLanguage}
  onThemeChange={setTheme}
  onRun={handleRunCode}
onSaveCode={handleSaveCode}
  isRunning={isRunning}
  layout={layout}
  onLayoutChange={setLayout}
  setShowConfirm={setShowConfirm}
/>

      <PanelGroup direction={splitDirection} className={`main-container ${splitDirection}`}>

        <Panel defaultSize={60} minSize={30} className="editor-panel">
<CodeEditor
  language={language}
  theme={theme}
  code={code}
  onCodeChange={setCode}
  version={version}
  onSave={handleSaveCode}
  onClear={() => {
    localStorage.removeItem(`unsaved-${language}`);
    setCode(BOILERPLATES[language]);
    setAlertMessage('Editor cleared!');
    setAlertVisible(true);
  }}
  onSubmit={handleFinalSubmit}
/>

        </Panel>

<PanelResizeHandle className={`resize-handle ${theme}`}>
  <img
    src={
      layout === 'vertical'
        ? theme === 'vs' ?  verticalDark : theme === 'vs-dark' ? verticalLight  : verticalDark
        : theme === 'vs' ?  horizontalDark : theme === 'vs-dark' ? horizontalLight :   horizontalDark
    }
    alt="Resize Handle"
    className="resize-icon"
  />
</PanelResizeHandle>


        <Panel defaultSize={40} minSize={20} className="output-panel">
<Output
  output={output}
  onClear={handleClearOutput}
  theme={theme}
/>
        </Panel>
      </PanelGroup>

      <CustomAlert
        message={alertMessage}
        show={alertVisible}
        onClose={() => setAlertVisible(false)}
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
