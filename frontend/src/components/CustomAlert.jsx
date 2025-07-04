
import React, { useEffect, useState } from 'react';
import './customAlert.css';

const CustomAlert = ({ messages, duration = 3000, onClose }) => {
  const [alerts, setAlerts] = useState(messages || []);

  useEffect(() => {
    setAlerts(messages || []);

    // Set timers for auto-dismissal of each alert
    const timers = messages.map((_, index) =>
      setTimeout(() => {
        setAlerts((prev) => {
          const newAlerts = [...prev];
          newAlerts.splice(index, 1); // Remove alert at index
          onClose?.(newAlerts); // Notify parent of updated alerts
          return newAlerts;
        });
      }, duration + index * 200) // Stagger dismissal to avoid overlap
    );

    return () => timers.forEach(clearTimeout);
  }, [messages, duration, onClose]);

  const handleClose = (index) => {
    setAlerts((prev) => {
      const newAlerts = [...prev];
      newAlerts.splice(index, 1); // Remove alert at index
      onClose?.(newAlerts); // Notify parent of updated alerts
      return newAlerts;
    });
  };

  return (
    <div className="alert-container">
      {alerts.map((message, index) => (
        <div
          key={index}
          className={`custom-alert show alert-${message.type || 'info'}`}
          style={{ top: `${20 + index * 60}px` }} // Stack alerts vertically
        >
          <span className="alert-message">{message.text}</span>
          <button className="close-button" onClick={() => handleClose(index)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default CustomAlert;
