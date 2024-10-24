import React from 'react';

const DashedLine = ({ strokeColor = 'currentColor', strokeWidth = 1.25, length = 100 }) => {
  return (
    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" class="" fill="none" 
    stroke-width="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g stroke-width="2">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12h2"></path><path d="M17 12h2">
        </path><path d="M11 12h2"></path></g></svg>
  );
};

export default DashedLine;


