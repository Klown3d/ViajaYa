import React from 'react';
import '../styles/SuccessModal.css';

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="success-modal-backdrop">
      <div className="success-modal">
        <button className="success-modal-close-icon" onClick={onClose}>
          <i className="bx bx-x"></i>
        </button>
        <div className="success-modal-icon">
          <i className="bx bx-check-circle"></i>
        </div>
        <p className="success-modal-message">{message}</p>
      </div>
    </div>
  );
};

export default SuccessModal;
