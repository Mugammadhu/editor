import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./output.css";

const Output = ({ output, onClear, theme = "vs-dark", selectedActions = ["copy", "clearOutput"] }) => {
  const [copyStatus, setCopyStatus] = useState("Copy");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output || "");
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus("Copy"), 2000);
  };

  const containerThemeClass = 
    theme === "vs-dark" ? "dark-theme" : 
    theme === "hc-black" ? "contrast-theme" : 
    "light-theme";

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
        <h3>Output</h3>
        <div className="output-actions">
          {selectedActions.includes("copy") && (
            <motion.button
              onClick={handleCopyOutput}
              className={`action-button copy-button ${containerThemeClass}`}
              whileHover={{ scale: isMobile ? 1 : 1.05 }}
              whileTap={{ scale: isMobile ? 0.98 : 0.95 }}
              aria-label={isMobile ? "Copy output" : "Copy output"}
            >
              <span className="button-text">{copyStatus}</span>
            </motion.button>
          )}
          {selectedActions.includes("clearOutput") && (
            <motion.button
              onClick={onClear}
              className={`action-button clear-output-button ${containerThemeClass}`}
              whileHover={{ scale: isMobile ? 1 : 1.05 }}
              whileTap={{ scale: isMobile ? 0.98 : 0.95 }}
              aria-label={isMobile ? "Clear output" : "Clear output"}
            >
              <span className="button-text">Clear</span>
            </motion.button>
          )}
        </div>
      </motion.div>
      <motion.pre
        className={`output-content ${containerThemeClass}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {output || "Output will appear here..."}
      </motion.pre>
    </motion.div>
  );
};

export default Output;