import React from "react";

export const Popover = ({ children }) => (
  <div className="relative">{children}</div>
);

export const PopoverTrigger = ({ children, ...props }) => (
  <div {...props} tabIndex={0} style={{ display: "inline-block" }}>
    {children}
  </div>
);

export const PopoverContent = ({ className = "", children }) => (
  <div
    className={`absolute z-10 mt-2 w-full bg-white border rounded shadow-md ${className}`}
    style={{ left: 0 }}
  >
    {children}
  </div>
);
