import React from 'react';

const Output = ({ output, onClear }) => {
  return (
    <div className="output-container">
      <div className="output-header">
        <h3>Output</h3>
        <button onClick={onClear} className="clear-button">
          Clear
        </button>
      </div>
      <pre className="output-content">
        {output || 'Output will appear here...'}
      </pre>
    </div>
  );
};

export default Output;