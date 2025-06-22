import React from "react";

export const Card = ({ className = "", children, ...props }) => (
  <div className={`rounded-lg border bg-white ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ className = "", children }) => (
  <div className={`px-4 py-3 border-b ${className}`}>{children}</div>
);

export const CardContent = ({ className = "", children }) => (
  <div className={`px-4 py-3 ${className}`}>{children}</div>
);

export const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);