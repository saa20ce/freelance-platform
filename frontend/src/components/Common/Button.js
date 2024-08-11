import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({ type, onClick, children, className, to }) => {
  if (to) {
    return (
      <Link to={to} className={`button ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`button ${className}`}>
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  to: PropTypes.string,
};

Button.defaultProps = {
  type: 'button',
  onClick: null,
  className: '',
  to: null,
};

export default Button;
