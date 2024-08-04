import React from 'react';
import PropTypes from 'prop-types';
import './ValidationError.css';

const ValidationError = ({ message }) => (
  <p className="validation-error">{message}</p>
);

ValidationError.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ValidationError;
