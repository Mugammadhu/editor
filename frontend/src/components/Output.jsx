import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./output.css";

const Output = ({ output, testResults = [], onClear, theme = "vs" }) => {
  const [copyStatus, setCopyStatus] = useState("Copy");
  const [isMobile, setIsMobile] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (output === "Running test cases..." || output === "Checking test cases...") {
      setIsTesting(true);
    } else if (testResults.length > 0 || output.includes("completed") || output.includes("Error")) {
      setIsTesting(false);
    }
  }, [output, testResults]);

  const handleCopyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output || "");
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy"), 2000);
    } catch (error) {
      setCopyStatus("Copy failed!");
      setTimeout(() => setCopyStatus("Copy"), 2000);
      console.error("Clipboard error:", error);
    }
  };

  const containerThemeClass =
    theme === "vs-dark" ? "dark-theme" :
    theme === "hc-black" ? "contrast-theme" :
    "light-theme";

  const validTestResults = Array.isArray(testResults)
    ? testResults.filter(
        (test) =>
          typeof test === "object" &&
          "passed" in test &&
          "executionTime" in test &&
          "input" in test &&
          "expected" in test &&
          "actual" in test
      )
    : [];

  return (
    <motion.div
      className={`output-container ${containerThemeClass}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`output-header ${containerThemeClass}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
            <h3>Console Output</h3>
        <div className="output-actions">
          <motion.button
            onClick={handleCopyOutput}
            className={`action-button copy-button ${containerThemeClass}`}
            whileHover={{ scale: isMobile ? 1 : 1.05 }}
            whileTap={{ scale: isMobile ? 0.98 : 0.95 }}
          >
            <span className="button-text">{copyStatus}</span>
          </motion.button>
          <motion.button
            onClick={onClear}
            className={`action-button clear-output-button ${containerThemeClass}`}
            whileHover={{ scale: isMobile ? 1 : 1.05 }}
            whileTap={{ scale: isMobile ? 0.98 : 0.95 }}
          >
            <span className="button-text">Clear</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="output-split-container">
        <div className="output-section">
          <div className="section-header">
          </div>
          <pre className={`output-content ${containerThemeClass}`}>
            {output === "Running test cases..." || output === "Checking test cases..." ? (
              <div className="loading-test-cases">
                <div className="loading-spinner"></div>
                <span>{output}</span>
              </div>
            ) : (
              output || "No output generated"
            )}
          </pre>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h4>Test Cases</h4>
            {isTesting ? (
              <span className="test-summary">Running tests...</span>
            ) : validTestResults.length > 0 ? (
              <span className="test-summary">
                {validTestResults.filter(t => t.passed).length}/{validTestResults.length} passed
              </span>
            ) : null}
          </div>
          <div className="test-results-container">
            {isTesting ? (
              <div className="test-case-loading">
                <div className="loading-spinner"></div>
                <span>Executing test cases...</span>
              </div>
            ) : validTestResults.length > 0 ? (
              validTestResults.map((test, i) => (
                <div key={i} className={`test-case ${test.passed ? 'passed' : 'failed'}`}>
                  <div className="test-case-header">
                    <span className="test-status">
                      {test.passed ? '✓' : '✗'} Test Case {i + 1}
                    </span>
                    <span className="execution-time">{test.executionTime}ms</span>
                  </div>
                  <div className="test-case-content">
                    {test.input && (
                      <div className="test-io">
                        <span className="io-label">Input:</span>
                        <code>{test.input}</code>
                      </div>
                    )}
                    <div className="test-io">
                      <span className="io-label">Expected:</span>
                      <code>{test.expected}</code>
                    </div>
                    <div className="test-io">
                      <span className="io-label">Actual:</span>
                      <code>{test.actual}</code>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-tests-message">
                {output === "No output generated" 
                  ? "No test cases were executed" 
                  : "Test results will appear here"}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Output;