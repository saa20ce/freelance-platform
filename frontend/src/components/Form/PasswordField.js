import React, { useState } from 'react';
import PropTypes from 'prop-types';
import hidePasswordIcon from '../../assets/icons/password-hide-eye.svg';
import showPasswordIcon from '../../assets/icons/password-show-eye.svg';

const PasswordField = ({ name, placeholder, value, onChange }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleMouseEnter = () => setPasswordVisible(true);
  const handleMouseLeave = () => setPasswordVisible(false);

  return (
    <div className="password-container">
      <input
        type={passwordVisible ? 'text' : 'password'}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="password-field input-field"
      />
      <button
        type="button"
        className="password-toggle"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={passwordVisible ? showPasswordIcon : hidePasswordIcon}
          alt={passwordVisible ? 'Hide Password' : 'Show Password'}
        />
      </button>
    </div>
  );
};

PasswordField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PasswordField;
