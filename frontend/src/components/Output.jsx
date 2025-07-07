import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './output.css';

const Output = ({ output, onClear, theme, selectedActions }) => {
  const [copy, setCopy] = useState('copy');

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output || '');
    setCopy('Copied!');
    setTimeout(() => setCopy('copy'), 2000);
  };

  return (
    <motion.div
      className={`output-container ${theme === 'vs-dark' ? 'dark-output' : theme === 'vs' ? 'light-output' : 'contrast-output'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`output-header ${theme}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <h3>Output</h3>
        <div className="output-actions">
          {selectedActions.includes('copy') && (
            <motion.button
              onClick={handleCopyOutput}
              className="action-button copy-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="button-icon">📋</span>
              <span className="button-text">{copy}</span>
            </motion.button>
          )}
          {selectedActions.includes('clearOutput') && (
            <motion.button
              onClick={onClear}
              className="action-button clear-output-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="button-icon">🚮</span>
              <span className="button-text">Clear Output</span>
            </motion.button>
          )}
        </div>
      </motion.div>
      <motion.pre
        className={`output-content ${theme === 'vs-dark' ? 'dark' : 'light'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {output || 'Output will appear here...'}
      </motion.pre>
    </motion.div>
  );
};

export default Output;