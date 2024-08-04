import React from 'react';
import PropTypes from 'prop-types';
import './PopupOverlay.css';

const PopupOverlay = ({ children, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="popup">
        <button className="close" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
};

PopupOverlay.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PopupOverlay;
