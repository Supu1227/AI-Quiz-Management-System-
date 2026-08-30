import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Show a clean loading message while verifying token
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>
        Verifying authentication...
      </div>
    );
  }

  // 1. If not logged in, redirect to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If user role is not allowed on this page, redirect to their role home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/student" replace />;
  }

  // If authorized, render the requested page
  return children;
};

export default ProtectedRoute;