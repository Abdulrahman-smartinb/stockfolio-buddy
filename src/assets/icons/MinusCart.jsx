import * as React from "react";

export const MinusCart = ({ className }) => {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        xmlSpace="preserve"
      >
        <circle
          style={{
            fill: "none",
            stroke: "#9b8560",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          cx={22}
          cy={24}
          r={2}
        />
        <circle
          style={{
            fill: "none",
            stroke: "#9b8560",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          cx={13}
          cy={24}
          r={2}
        />
        <path
          d="m25.658 10-2.422 9H10.781L8.159 8.515A2 2 0 0 0 6.219 7H4a1 1 0 0 0 0 2h2.219L8.84 19.485A2 2 0 0 0 10.781 21h12.455c.902 0 1.692-.604 1.93-1.474L27.764 10z"
          style={{
            fill: "#9b8560",
          }}
        />
        <path
          style={{
            fill: "none",
            stroke: "#9b8560",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          d="M21 11h-8"
        />
      </svg>
    </div>
  );
};
