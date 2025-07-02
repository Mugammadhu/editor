import React, { useState } from 'react';
import './output.css'; // Create this if not already

const Output = ({ output, onClear, theme }) => {
  const [copy, setCopy] = useState('copy');

  const handleCopy = () => {
    navigator.clipboard.writeText(output || '');
    setCopy('copied');
    setTimeout(() => setCopy('copy'), 1500);
  };

  return (
    <div className={`output-container ${theme === 'vs-dark' ? 'dark-output' : theme=='vs' ? 'light-output' : 'contrast-output'}`}>
      <div className={`output-header ${theme}`}>
        <h3>Output</h3>
        <div className="output-actions">
          <button onClick={handleCopy} className="copy-button">{copy}</button>
          <button onClick={onClear} className="clear-button">Clear</button>
        </div>
      </div>

      <pre className={`output-content ${theme === 'vs-dark' ? 'dark' : 'light'}`}>
        {output || 'Output will appear here...'}
      </pre>
    </div>
  );
};

export default Output;
