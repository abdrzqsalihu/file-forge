import React from "react";

// A connector line with a slow-moving dash pattern — a small nod to the
// "transformation" idea without resorting to literal flame imagery.
function FlowArrow({ className = "" }) {
  return (
    <svg
      width="40"
      height="16"
      viewBox="0 0 40 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <line
        x1="1"
        y1="8"
        x2="30"
        y2="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 5"
        className="motion-safe:animate-[flow_1.1s_linear_infinite]"
      />
      <path
        d="M26 2L34 8L26 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default FlowArrow;
