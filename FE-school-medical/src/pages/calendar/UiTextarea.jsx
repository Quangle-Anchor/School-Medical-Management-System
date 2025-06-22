import React from "react";

const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`w-full px-3 py-2 border rounded text-sm shadow-sm ${className}`}
      {...props}
    />
  );
};

export default Textarea;