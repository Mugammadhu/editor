import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <AnimatePresence>
        {alerts.map((message, index) => (
          <motion.div
            key={index}
            className={`custom-alert alert-${message.type || 'info'}`}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ top: `${20 + index * 60}px` }} // Stack alerts vertically
          >
            <span className="alert-message">{message.text}</span>
            <motion.button
              className="close-button"
              onClick={() => handleClose(index)}
              whileHover={{ scale: 1.1, color: '#e0e0e0' }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CustomAlert;