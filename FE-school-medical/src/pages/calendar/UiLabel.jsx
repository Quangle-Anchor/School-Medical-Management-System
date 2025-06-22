import React from "react";

export const Label = ({ className = "", children, ...props }) => {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

// 🟢 pages/calendar/UiTextarea.jsx
export const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`w-full px-3 py-2 border rounded text-sm shadow-sm ${className}`}
      {...props}
    />
    );
}