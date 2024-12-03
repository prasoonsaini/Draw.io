import React from 'react';
import './style.css'
const Hachure = () => {
  return (
    <button type="button" title="Hachure (Option-Click)" data-testid="fill-hachure" className="button">
      <svg
        aria-hidden="true"
        focusable="false"
        role="img"
        viewBox="0 0 20 20"
        className=""
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Outer box path */}
        <path
          d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z"
          stroke="currentColor"
          strokeWidth="1.25"
        />

        {/* Mask for the hachure pattern */}
        <mask
          id="FillHachureIcon"
          maskUnits="userSpaceOnUse"
          x="2"
          y="2"
          width="16"
          height="16"
          style={{ maskType: 'alpha' }}
        >
          <path
            d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.25"
          />
        </mask>

        {/* Hachure lines inside the masked area */}
        <g mask="url(#FillHachureIcon)">
          <path
            d="M2.258 15.156L15.156 2.258M7.324 20.222L20.222 7.325M-0.222 12.675L12.675-0.222m-8.157 18.34L17.416 5.22"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </button>
  );
};

export default Hachure;
