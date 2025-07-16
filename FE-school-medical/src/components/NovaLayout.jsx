import React from 'react';

const NovaLayout = ({ children, className = "" }) => {
  return (
    <div className={`site-wrap ${className}`}>
      {children}
    </div>
  );
};

export default NovaLayout;
