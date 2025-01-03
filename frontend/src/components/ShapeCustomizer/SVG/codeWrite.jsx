import React from 'react';
import './style.css'
const CodeWrite = () => {
    return (
        <button type="button" title="Cross-hatch" data-testid="fill-cross-hatch" className="button">
            <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" class="" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g clip-path="url(#a)" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M5.833 6.667 2.5 10l3.333 3.333M14.167 6.667 17.5 10l-3.333 3.333M11.667 3.333 8.333 16.667"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs></svg>
        </button>
    );
};

export default CodeWrite;
