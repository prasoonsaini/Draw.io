import React from 'react';

const Link = ({ strokeColor = 'currentColor', strokeWidth = 16, length = 100 }) => {
  return (
    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" class="" fill="none"
      stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="1.25">
        <path d="M8.333 11.667a2.917 2.917 0 0 0 4.167 0l3.333-3.334a2.946 2.946 0 1 0-4.166-4.166l-.417.416">
        </path><path d="M11.667 8.333a2.917 2.917 0 0 0-4.167 0l-3.333 3.334a2.946 2.946 0 0 0 4.166 4.166l.417-.416">
        </path></g></svg>
  );
};

export default Link;
