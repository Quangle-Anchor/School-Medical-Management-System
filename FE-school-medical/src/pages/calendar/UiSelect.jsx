import React from "react";

export const Select = ({
  children,
  value,
  onChange,
  className = "",
  ...props
}) => (
  <select
    value={value}
    onChange={onChange}
    className={`border px-3 py-2 rounded text-sm w-full ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
