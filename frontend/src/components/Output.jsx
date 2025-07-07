// import React, { useState } from 'react';
// import './output.css'; // Create this if not already

// const Output = ({ output, onClear, theme,selectedActions }) => {
//   const [copy, setCopy] = useState('copy');

//   const handleCopyOutput = () => {
//     navigator.clipboard.writeText(output || '');
//   };
//   return (
//     <div className={`output-container ${theme === 'vs-dark' ? 'dark-output' : theme=='vs' ? 'light-output' : 'contrast-output'}`}>
//       <div className={`output-header ${theme}`}>
//         <h3>Output</h3>
//         <div className="output-actions">
//           {selectedActions.includes('copy') && (
//             <button onClick={handleCopyOutput} className="action-button">
//               📋 Copy Output
//             </button>
//           )}
//           {selectedActions.includes('clearOutput') && (
//             <button onClick={onClear} className="action-button">
//               🚮 Clear Output
//             </button>
//           )}
//         </div>
//       </div>

//       <pre className={`output-content ${theme === 'vs-dark' ? 'dark' : 'light'}`}>
//         {output || 'Output will appear here...'}
//       </pre>
//     </div>
//   );
// };

// export default Output;


import React, { useState } from 'react';
import './output.css';

const Output = ({ output, onClear, theme, selectedActions }) => {
  const [copy, setCopy] = useState('copy');

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output || '');
    setCopy('Copied!');
    setTimeout(() => setCopy('copy'), 2000);
  };

  return (
    <div className={`output-container ${theme === 'vs-dark' ? 'dark-output' : theme=='vs' ? 'light-output' : 'contrast-output'}`}>
      <div className={`output-header ${theme}`}>
        <h3>Output</h3>
        <div className="output-actions">
          {selectedActions.includes('copy') && (
            <button onClick={handleCopyOutput} className="action-button copy-button">
              <span className="button-icon">📋</span>
              <span className="button-text">{copy}</span>
            </button>
          )}
          {selectedActions.includes('clearOutput') && (
            <button onClick={onClear} className="action-button clear-output-button">
              <span className="button-icon">🚮</span>
              <span className="button-text">Clear Output</span>
            </button>
          )}
        </div>
      </div>

      <pre className={`output-content ${theme === 'vs-dark' ? 'dark' : 'light'}`}>
        {output || 'Output will appear here...'}
      </pre>
    </div>
  );
};

export default Output;