import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Check if user is authenticated
  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role (if specified)
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
