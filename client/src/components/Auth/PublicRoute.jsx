import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // or a loader

  if (isAuthenticated) {
    return <Navigate to="/trending-spots" replace />;
  }

  return children;
};

export default PublicRoute;
