// components/icons/EyeOffIcon.jsx
import React from "react";

const EyeOffIcon = ({ className = "w-5 h-5", title = "مخفی کردن رمز" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="false"
    role="img"
    className={className}
  >
    <title>{title}</title>
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19.5C5.5 19.5 2.5 12 2.5 12a15.3 15.3 0 0 1 4.11-4.73" />
    <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" />
    <path d="M1 1l22 22" />
  </svg>
);

export default EyeOffIcon;
