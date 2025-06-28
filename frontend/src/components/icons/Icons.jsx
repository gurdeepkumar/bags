import React from "react";

export const Edit = ({ size = 20, color = "#fff" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
  </svg>
);

export const TrendingUp = ({ size = 20, color = "#fff" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7" />
    <path d="M15 7h6v6" />
  </svg>
);

export const BarChart4 = ({ size = 20, color = "#fff" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20v-6M6 20V10M18 20V4" />
  </svg>
);
