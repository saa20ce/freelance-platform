import React from 'react';
import PropTypes from 'prop-types';
import './Title.css';

const Title = ({ children }) => (
  <h2 className="title">{children}</h2>
);

Title.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Title;
