
import React from 'react';
import { Route, Navigate,Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    // 
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;
