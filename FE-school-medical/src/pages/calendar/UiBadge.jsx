import React from "react";

const Badge = ({ className = "", children, ...props }) => {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
