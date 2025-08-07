import React from 'react';
import PropTypes from 'prop-types'; // Añadimos la importación de PropTypes
import '../styles/ShinyText.css';

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{ animationDuration }}>
      {text}
    </span>
  );
};

// Añadimos la validación de PropTypes
ShinyText.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  speed: PropTypes.number,
  className: PropTypes.string,
};

export default ShinyText;
