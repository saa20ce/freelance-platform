import React from 'react';
import PropTypes from 'prop-types';
import './TextAreaField.css';

const TextAreaField = ({ name, value, onChange }) => (
  <textarea name={name} value={value} onChange={onChange} className="text-area-field" rows="4" />
);

TextAreaField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TextAreaField;
