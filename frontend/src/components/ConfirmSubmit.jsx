import React from 'react';
import './confirmSubmit.css';

const ConfirmSubmit = ({ show, onConfirm, onCancel }) => {
  return (
    <div className={`confirm-container ${show ? 'show' : ''}`}>
      <div className="confirm-box">
        <h4>Confirm Submission</h4>
        <p>Are you sure you want to submit the final version of your code?</p>
        <div className="confirm-buttons">
          <button className="confirm" onClick={onConfirm}>Yes, Submit</button>
          <button className="cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSubmit;
