import React from 'react';

const PlaneLine = ({ strokeColor = 'currentColor', strokeWidth = 6, length = 100 }) => {
  return (
    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" class="" fill="none" 
    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4.167 10h11.666" 
    stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  );
};

export default PlaneLine;
