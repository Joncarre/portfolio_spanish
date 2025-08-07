import React from 'react';
import PropTypes from 'prop-types';
import '../styles/GradientText.css';

const GradientText = ({
  children,
  className = '',
  colors = [],
  animationSpeed = 5,
  showBorder = false,
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div className={`animated-gradient-text ${className}`}>
      {showBorder && <div className="gradient-overlay" style={gradientStyle}></div>}
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </div>
  );
};

GradientText.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  colors: PropTypes.array,
  animationSpeed: PropTypes.number,
  showBorder: PropTypes.bool,
};

export default GradientText;
