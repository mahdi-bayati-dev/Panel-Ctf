// components/icons/EyeIcon.jsx
import React from "react";

const EyeIcon = ({ className = "w-5 h-5", title = "نمایش رمز" }) => (
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
    <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
);

export default EyeIcon;
