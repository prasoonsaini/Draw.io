import React from 'react';

const DottedLine = ({ strokeColor = 'currentColor', strokeWidth = 1.25, length = 100 }) => {
  return (
    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" className=""
      fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <g strokeWidth="2"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 12v.01">
      </path><path d="M8 12v.01">
        </path><path d="M12 12v.01"></path><path d="M16 12v.01"></path><path d="M20 12v.01"></path></g></svg>
  );
};

export default DottedLine;

