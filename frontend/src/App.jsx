import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Controls from './components/Controls';
import CodeEditor from './components/Editor';
import Output from './components/Output';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import './App.css';

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

  // Load boilerplate when language changes
  useEffect(() => {
    setCode(BOILERPLATES[language]);
    setOutput(''); // Clear output when language changes
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

  return (
    <div className="app">
      <Header />
      <Controls
        language={language}
        theme={theme}
        onLanguageChange={setLanguage}
        onThemeChange={setTheme}
        onRun={handleRunCode}
        isRunning={isRunning}
      />
      
      <PanelGroup direction="horizontal" className="editor-container">
        <Panel defaultSize={50} className="editor-panel" minSize={30}>
          <CodeEditor
            language={language}
            theme={theme}
            code={code}
            onCodeChange={setCode}
          />
        </Panel>
        
        <PanelResizeHandle className="resize-handle">
          <div className="resize-icon">↔</div>
        </PanelResizeHandle>
        
        <Panel defaultSize={50} className="output-panel" minSize={30}>
          <Output 
            output={output} 
            onClear={() => setOutput('')} 
          />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default App;