import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks'

const HomePage = () => {
  
  const { authData } = useAuth();
  const location = useLocation();

  return authData?.isAuthenticated
    ? <Navigate to="/chat" state={{ from: location }} replace />
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default HomePage;
