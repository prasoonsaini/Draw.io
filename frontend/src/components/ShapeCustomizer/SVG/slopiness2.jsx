import React from 'react';

const Slopiness2 = ({ strokeColor = 'currentColor', strokeWidth = 1.25, length = 100 }) => {
  return (
    <svg ariaHidden="true" focusable="false" role="img" viewBox="0 0 20 20" class="" fill="none" 
    stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 12.563c1.655-.886 5.9-3.293 8.568-4.355 2.668-1.062.101 2.822 1.32 3.105 1.218.283 5.112-1.814 5.112-1.814m-13.469 2.23c2.963-1.586 6.13-5.62 7.468-4.998 1.338.623-1.153 4.11-.132 5.595 1.02 1.487 6.133-1.43 6.133-1.43" 
    strokeWidth={strokeWidth}></path></svg>
  );
};

export default Slopiness2;
