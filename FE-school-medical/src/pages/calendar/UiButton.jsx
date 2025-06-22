import React from "react";

const Button = ({ className = "", children, ...props }) => {
  return (
    <button
      className={`inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;