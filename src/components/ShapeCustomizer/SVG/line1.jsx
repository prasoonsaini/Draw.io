import React from 'react';

const ThinLine = ({ strokeColor = 'currentColor', strokeWidth = 6, length = 100 }) => {
  return (
    <svg 
      aria-hidden="true" 
      focusable="false" 
      role="img" 
      viewBox={`0 0 ${length} 20`} 
      width={length} 
      height="20"
      className="straight-line-icon"
    >
      <line 
        x1="0" 
        y1="10" 
        x2={length} 
        y2="10" 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default ThinLine;
