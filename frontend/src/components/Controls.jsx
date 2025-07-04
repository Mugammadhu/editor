import React from 'react';
import pythonIcon from '../assets/icons/python.svg';
import javascriptIcon from '../assets/icons/javascript.svg';
import javaIcon from '../assets/icons/java.svg';
import cIcon from '../assets/icons/c.svg';
import cppIcon from '../assets/icons/cpp.svg';
import goIcon from '../assets/icons/go.svg';
import rustIcon from '../assets/icons/rust.svg';
import typescriptIcon from '../assets/icons/typescript.svg';
import rubyIcon from '../assets/icons/ruby.svg';
import swiftIcon from '../assets/icons/swift.svg';
import phpIcon from '../assets/icons/php.svg';
import sunIcon from '../assets/icons/sun.svg';
import moonIcon from '../assets/icons/moon.svg';
import contrastIcon from '../assets/icons/contrast.svg';
import playIcon from '../assets/icons/play.svg';
import verticalLight from '../assets/resizers/vertical-light.svg';
import horizontalLight from '../assets/resizers/horizontal-light.svg';
import './controls.css';

const languageOptions = [
  { value: 'python', label: 'Python', icon: pythonIcon },
  { value: 'javascript', label: 'JavaScript', icon: javascriptIcon },
  { value: 'java', label: 'Java', icon: javaIcon },
  { value: 'c', label: 'C', icon: cIcon },
  { value: 'cpp', label: 'C++', icon: cppIcon },
  { value: 'go', label: 'Go', icon: goIcon },
  { value: 'rust', label: 'Rust', icon: rustIcon },
  { value: 'typescript', label: 'TypeScript', icon: typescriptIcon },
  { value: 'ruby', label: 'Ruby', icon: rubyIcon },
  { value: 'swift', label: 'Swift', icon: swiftIcon },
  { value: 'php', label: 'PHP', icon: phpIcon }
];

const themeOptions = [
  { value: 'vs', label: 'Light', icon: sunIcon },
  { value: 'vs-dark', label: 'Dark', icon: moonIcon },
  { value: 'hc-black', label: 'High Contrast', icon: contrastIcon }
];

const layoutOptions = [
  { value: 'horizontal', label: 'Horizontal', icon: verticalLight },
  { value: 'vertical', label: 'Vertical', icon: horizontalLight }
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
  isEditable = true
}) => {
  const currentLangIcon = languageOptions.find(l => l.value === language)?.icon;
  const currentThemeIcon = themeOptions.find(t => t.value === theme)?.icon;
  const currentLayoutIcon = layoutOptions.find(l => l.value === layout)?.icon;

  return (
    <div className={`controls ${theme === 'vs-dark' ? 'dark-mode' : ''}`}>
      <div className="control-group language-select">
        <div className="icon-wrapper">
          <img src={currentLangIcon} alt="Language" className="icon" />
          {isLanguageLocked ? (
            <div className="locked-language">
              <strong>{(lockedLanguage || language).toUpperCase()}</strong>
              <span className="lock-icon">🔒</span>
            </div>
          ) : (
            <select 
              value={language} 
              onChange={(e) => onLanguageChange(e.target.value)}
              disabled={!isEditable}
              className="styled-select"
            >
              {languageOptions.map(({ value, label }) => (
                <option key={`lang-${value}`} value={value}>
                  {label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="control-group theme-select">
        <div className="icon-wrapper">
          <img src={currentThemeIcon} alt="Theme" className="icon" />
          <select 
            value={theme} 
            onChange={e => onThemeChange(e.target.value)}
            className="styled-select"
          >
            {themeOptions.map(({ value, label }) => (
              <option key={`theme-${value}`} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

<div className="control-group layout-select">
<div className="icon-wrapper">
  <div className="icon-container">
    <img src={currentLayoutIcon} alt="Layout" className="icon" />
  </div>
  <select 
    value={layout} 
    onChange={e => onLayoutChange(e.target.value)}
    className="styled-select"
  >
    {layoutOptions.map(({ value, label }) => (
      <option key={`layout-${value}`} value={value}>
        {label}
      </option>
    ))}
  </select>
</div>

</div>


      <div className="action-buttons">
        <button 
          className={`run-button ${isRunning ? 'running' : ''}`} 
          onClick={onRun} 
          disabled={isRunning || !isEditable}
          aria-label={isRunning ? 'Code is running' : 'Run code'}
        >
          <span className="button-icon">▶️</span>
          <span className="button-text">
            {isRunning ? 'Running...' : 'Run Code'}
          </span>
        </button>

        <button 
          className="submit-button" 
          onClick={() => setShowConfirm(true)}
          disabled={!isEditable}
          aria-label="Submit code"
        >
          <span className="button-icon">🚀</span>
          <span className="button-text">Submit</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;