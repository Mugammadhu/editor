
import React from 'react';
import { motion } from 'framer-motion';
import './confirmSubmit.css';

const ConfirmSubmit = ({ show, onConfirm, onCancel }) => {
  console.log("ConfirmSubmit show:", show); // Debug log
  return (
    <motion.div
      className={`confirm-container ${show ? 'show' : ''}`}
      onClick={show ? onCancel : undefined} // Only capture clicks when shown
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : -100 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <motion.div
        className="confirm-box"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: show ? 1 : 0.9, opacity: show ? 1 : 0 }}
        transition={{ duration: 0.3, delay: show ? 0.1 : 0 }}
      >
        <h4>Confirm Submission</h4>
        <p>Are you sure you want to submit the final version of your code?</p>
        <div className="confirm-buttons">
          <motion.button
            className="confirm"
            onClick={onConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Yes, Submit
          </motion.button>
          <motion.button
            className="cancel"
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmSubmit;