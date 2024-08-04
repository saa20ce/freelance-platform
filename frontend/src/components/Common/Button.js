import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({ type, onClick, children, className }) => (
  <button type={type} onClick={onClick} className={`button ${className}`}>
    {children}
  </button>
);

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Button.defaultProps = {
  type: 'button',
  onClick: null,
  className: '',
};

export default Button;
