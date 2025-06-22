import React from "react";

export const Dialog = ({ open, onOpenChange, children }) => {
  return open ? (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={() => onOpenChange && onOpenChange(false)}
    >
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  ) : null;
};

export const DialogContent = ({ className = "", children }) => (
  <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

export const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children, className = "" }) => (
  <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
);