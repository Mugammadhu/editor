import React, { useEffect, useState } from 'react';
import './customAlert.css';

const CustomAlert = ({ message, show, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);

    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <div className={`custom-alert ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
};

export default CustomAlert;
