import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import pythonIcon from "../assets/icons/python.svg";
import javascriptIcon from "../assets/icons/javascript.svg";
import javaIcon from "../assets/icons/java.svg";
import cIcon from "../assets/icons/c.svg";
import cppIcon from "../assets/icons/cpp.svg";
import goIcon from "../assets/icons/go.svg";
import rustIcon from "../assets/icons/rust.svg";
import typescriptIcon from "../assets/icons/typescript.svg";
import rubyIcon from "../assets/icons/ruby.svg";
import swiftIcon from "../assets/icons/swift.svg";
import phpIcon from "../assets/icons/php.svg";
import ocaml from "../assets/icons/ocaml.svg";
import vb from "../assets/icons/vb.svg";
import fsharp from "../assets/icons/fsharp.svg";
import lua from "../assets/icons/lua.svg";
import haskell from "../assets/icons/haskell.svg";
import dart from "../assets/icons/dart.svg";
import elixir from "../assets/icons/elixir.svg";
import julia from "../assets/icons/julia.svg";
import racket from "../assets/icons/racket.svg";
import powershell from "../assets/icons/powershell.svg";
import bash from "../assets/icons/bash.svg";
import r from "../assets/icons/r.svg";
import scala from "../assets/icons/scala.svg";
import perl from "../assets/icons/perl.svg";
import kotlin from "../assets/icons/kotlin.svg";
import csharp from "../assets/icons/csharp.svg";
import sunIcon from "../assets/icons/sun.svg";
import moonIcon from "../assets/icons/moon.svg";
import contrastIcon from "../assets/icons/contrast.svg";
import verticalLight from "../assets/resizers/vertical-light.svg";
import horizontalLight from "../assets/resizers/horizontal-light.svg";
import "./controls.css";

const languageOptions = [
  { value: "python", label: "Python", icon: pythonIcon },
  { value: "javascript", label: "JavaScript", icon: javascriptIcon },
  { value: "java", label: "Java", icon: javaIcon },
  { value: "c", label: "C", icon: cIcon },
  { value: "cpp", label: "C++", icon: cppIcon },
  { value: "go", label: "Go", icon: goIcon },
  { value: "rust", label: "Rust", icon: rustIcon },
  { value: "typescript", label: "TypeScript", icon: typescriptIcon },
  { value: "ruby", label: "Ruby", icon: rubyIcon },
  { value: "swift", label: "Swift", icon: swiftIcon },
  { value: "php", label: "PHP", icon: phpIcon },
  { value: "ocaml", label: "OCaml", icon: ocaml },
  { value: "vb", label: "Visual Basic", icon: vb },
  { value: "fsharp", label: "F#", icon: fsharp },
  { value: "lua", label: "Lua", icon: lua },
  { value: "haskell", label: "Haskell", icon: haskell },
  { value: "dart", label: "Dart", icon: dart },
  { value: "elixir", label: "Elixir", icon: elixir },
  { value: "julia", label: "Julia", icon: julia },
  { value: "racket", label: "Racket", icon: racket },
  { value: "powershell", label: "PowerShell", icon: powershell },
  { value: "bash", label: "Bash", icon: bash },
  { value: "r", label: "R", icon: r },
  { value: "scala", label: "Scala", icon: scala },
  { value: "perl", label: "Perl", icon: perl },
  { value: "kotlin", label: "Kotlin", icon: kotlin },
  { value: "csharp", label: "C#", icon: csharp },
];

const themeOptions = [
  { value: "vs", label: "Light", icon: sunIcon },
  { value: "vs-dark", label: "Dark", icon: moonIcon },
  { value: "hc-black", label: "High Contrast", icon: contrastIcon },
];

const layoutOptions = [
  { value: "horizontal", label: "Horizontal", icon: verticalLight },
  { value: "vertical", label: "Vertical", icon: horizontalLight },
];

const actionOptions = [
  { value: "save", label: "Save Code", icon: "💾", bgcolor: "#4caf50" },
  { value: "clear", label: "Clear Code", icon: "🧹", bgcolor: "#ef4444" },
  { value: "clearOutput", label: "Clear Output", icon: "🚮", bgcolor: "#ef4444" },
  { value: "copy", label: "Copy Output", icon: "📋", bgcolor: "#007acc" },
  { value: "download", label: "Download Code", icon: "⤵️", bgcolor: "#007acc" },
];

const Controls = ({
  language,
  theme,
  onLanguageChange,
  onThemeChange,
  onRun,
  isRunning,
  layout,
  onLayoutChange,
  setShowConfirm,
  isLanguageLocked,
  lockedLanguage,
  isEditable = true,
  handleDownloadCode,
  selectedActions,
  setSelectedActions,
}) => {
  const [showActionPopup, setShowActionPopup] = useState(false);
  const currentLangIcon = languageOptions.find(
    (l) => l.value === language
  )?.icon;
  const currentThemeIcon = themeOptions.find((t) => t.value === theme)?.icon;
  const currentLayoutIcon = layoutOptions.find((l) => l.value === layout)?.icon;
  const [tempSelectedActions, setTempSelectedActions] = useState(selectedActions);

  const toggleAction = (action) => {
    if (tempSelectedActions.includes(action)) {
      setTempSelectedActions(tempSelectedActions.filter((a) => a !== action));
    } else {
      setTempSelectedActions([...tempSelectedActions, action]);
    }
  };

  const handleApply = () => {
    setSelectedActions(tempSelectedActions);
    setShowActionPopup(false);
  };

  return (
    <motion.div
      className={`controls ${theme === "vs-dark" ? "dark-mode" : ""}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="control-group language-select">
        <div className="icon-wrapper">
          <img src={currentLangIcon} alt="Language" className="icon" />
          {isLanguageLocked ? (
            <div className="locked-language">
              <strong>{(lockedLanguage || language).toUpperCase()}</strong>
              <span className="lock-icon">🔒</span>
            </div>
          ) : (
            <motion.select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              disabled={!isEditable}
              className="styled-select"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {languageOptions.map(({ value, label }) => (
                <option key={`lang-${value}`} value={value}>
                  {label}
                </option>
              ))}
            </motion.select>
          )}
        </div>
      </div>

      <div className="control-group theme-select">
        <div className="icon-wrapper">
          <img src={currentThemeIcon} alt="Theme" className="icon" />
          <motion.select
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="styled-select"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {themeOptions.map(({ value, label }) => (
              <option key={`theme-${value}`} value={value}>
                {label}
              </option>
            ))}
          </motion.select>
        </div>
      </div>

      <div className="control-group layout-select layout">
        <div className="icon-wrapper">
          <div className="icon-container">
            <img src={currentLayoutIcon} alt="Layout" className="icon" />
          </div>
          <motion.select
            value={layout}
            onChange={(e) => onLayoutChange(e.target.value)}
            className="styled-select"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {layoutOptions.map(({ value, label }) => (
              <option key={`layout-${value}`} value={value}>
                {label}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="action-select-container options">
          <motion.button
            className="action-select-button"
            onClick={() => setShowActionPopup(!showActionPopup)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙️ Select Actions
          </motion.button>

          <AnimatePresence>
            {showActionPopup && (
              <motion.div
                className={`action-popup ${theme === "vs-dark" ? "dark" : ""}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="action-popup-header">
                  <h4>Select Actions to Show</h4>
                  <motion.button
                    className="close-popup"
                    onClick={() => setShowActionPopup(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>
                <div className="action-options">
                  {actionOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      className={`action-option ${tempSelectedActions.includes(option.value) ? 'selected' : ''}`}
                      onClick={() => toggleAction(option.value)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="radio-toggle">
                        <input
                          type="checkbox"
                          checked={tempSelectedActions.includes(option.value)}
                          onChange={() => toggleAction(option.value)}
                        />
                        <span className="radio-slider"></span>
                      </div>
                      <span className="action-option-content">
                        <span className="action-icon" style={{ color: option.bgcolor }}>{option.icon}</span>
                        <span className="action-label">{option.label}</span>
                      </span>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  className="apply-actions-button"
                  onClick={handleApply}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="action-buttons">
        <motion.button
          className={`run-button ${isRunning ? "running" : ""}`}
          onClick={onRun}
          disabled={isRunning || !isEditable}
          aria-label={isRunning ? "Code is running" : "Run code"}
          whileHover={{ scale: isRunning || !isEditable ? 1 : 1.05 }}
          whileTap={{ scale: isRunning || !isEditable ? 1 : 0.95 }}
        >
          <span className="button-icon">▶️</span>
          <span className="button-text">
            {isRunning ? "Running..." : "Run Code"}
          </span>
        </motion.button>
        {selectedActions.includes("download") && (
          <motion.button
            onClick={handleDownloadCode}
            className="action-button download-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="button-icon">⤵️</span>
            <span className="button-text">Download</span>
          </motion.button>
        )}
        <motion.button
          className="submit-button"
          onClick={() => setShowConfirm(true)}
          disabled={!isEditable}
          aria-label="Submit code"
          whileHover={{ scale: isEditable ? 1.05 : 1 }}
          whileTap={{ scale: isEditable ? 0.95 : 1 }}
        >
          <span className="button-icon">🚀</span>
          <span className="button-text">Submit</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Controls;