

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Controls from './components/Controls';
import CodeEditor from './components/Editor';
import Output from './components/Output';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import CustomAlert from './components/CustomAlert';
import './App.css';

//svg
import verticalLight from './assets/resizers/vertical-light.svg';
import verticalDark from './assets/resizers/vertical-dark.svg';


import horizontalLight from './assets/resizers/horizontal-light.svg';
import horizontalDark from './assets/resizers/horizontal-dark.svg';



const BOILERPLATES = {
  python: '# Python 3\nprint("Hello, World!")\n',
  javascript: '// JavaScript\nconsole.log("Hello, World!");\n',
  java: '// Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
  c: '// C\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n',
  cpp: '// C++\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n',
  go: '// Go\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n',
  rust: '// Rust\nfn main() {\n    println!("Hello, World!");\n}\n',
  typescript: '// TypeScript\nconsole.log("Hello, World!");\n',
  ruby: '# Ruby\nputs "Hello, World!"',
  swift: '// Swift\nprint("Hello, World!")',
  php: '<?php\necho "Hello, World!";\n?>'
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
  const [language, setLanguage] = useState('python');
  const [theme, setTheme] = useState('vs');
  const [code, setCode] = useState(BOILERPLATES.python);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
const [layout, setLayout] = useState('vertical');
const splitDirection = layout === 'vertical' ? 'horizontal' : 'vertical';


  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${language}`);
    setCode(savedCode || BOILERPLATES[language]);
    setOutput('');
  }, [language]);

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

  return (
    <div className="app">
   <Controls
  language={language}
  theme={theme}
  onLanguageChange={setLanguage}
  onThemeChange={setTheme}
  onRun={handleRunCode}
  onSaveCode={() => {
    localStorage.setItem(`code-${language}`, code);
    setAlertMessage('Code saved!');
    setAlertVisible(true);
  }}
  isRunning={isRunning}
  onDownloadCode={handleDownloadCode}
  layout={layout}
  onLayoutChange={setLayout}
/>

      <PanelGroup direction={splitDirection} className={`main-container ${splitDirection}`}>

        <Panel defaultSize={60} minSize={30} className="editor-panel">
          <CodeEditor
            language={language}
            theme={theme}
            code={code}
            onCodeChange={setCode}
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
    </div>
  );
};

export default App;
