


import React, { useState } from 'react';
import pythonIcon from '../assets/icons/python.svg';
import javascriptIcon from '../assets/icons/javascript.svg';
import javaIcon from '../assets/icons/java.svg';
import cIcon from '../assets/icons/c.svg';
import cppIcon from '../assets/icons/cpp.svg';
import goIcon from '../assets/icons/go.svg';
import rustIcon from '../assets/icons/rust.svg';
import sunIcon from '../assets/icons/sun.svg';
import moonIcon from '../assets/icons/moon.svg';
import contrastIcon from '../assets/icons/contrast.svg';
import playIcon from '../assets/icons/play.svg';
import typescriptIcon from '../assets/icons/typescript.svg';
import rubyIcon from '../assets/icons/ruby.svg';
import swiftIcon from '../assets/icons/swift.svg';
import phpIcon from '../assets/icons/php.svg';
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
  { value: 'horizontal', label: 'Horizontal',icon: verticalLight},
  { value: 'vertical', label: 'Vertical',icon: horizontalLight }
];


const Controls = ({ language,theme,onLanguageChange, onThemeChange, onRun, onSaveCode, isRunning, onDownloadCode, layout, onLayoutChange }) => {


  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    onLanguageChange(newLang);
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    onThemeChange(newTheme);
  };

    const handleLayoutChange = (e) => {
    const newLayout = e.target.value;
    onLayoutChange(newLayout);
  };

  const currentLangIcon = languageOptions.find(lang => lang.value === language)?.icon;
  const currentThemeIcon = themeOptions.find(th => th.value === theme)?.icon;
  const currentLayoutIcon = layoutOptions.find(lay => lay.value === layout)?.icon;

  return (
    <div className="controls">

      <div className="control-group language-select">
        <div className="icon-wrapper">
          <img src={currentLangIcon} alt="Lang" className="icon" />
          <select value={language} onChange={handleLanguageChange}>
            {languageOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="control-group theme-select">
        <div className="icon-wrapper">
          <img src={currentThemeIcon} alt="Theme" className="icon" />
          <select value={theme} onChange={handleThemeChange}>
            {themeOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="control-group layout-select">
        <div className="icon-wrapper">
          <img src={currentLayoutIcon} alt="Theme" className="icon" />
        <select value={layout} onChange={handleLayoutChange}>
          {layoutOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        </div>
      </div>

      <button className="run-button" onClick={onRun} disabled={isRunning}>
        <img src={playIcon} alt="Run" className="icon" /> {isRunning ? 'Running...' : 'Run Code'}
      </button>

      <button className="save-button" onClick={onSaveCode}>
        💾 Save Code
      </button>

      <button onClick={onDownloadCode} className='download-button'>
        Download Code
      </button>
    </div>
  );
};


export default Controls;