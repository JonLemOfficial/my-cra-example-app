import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks'

const Redirecter = () => {
  
  const { authData } = useAuth();
  const location = useLocation();

  return authData?.isAuthenticated
    ? <Navigate to="/chat" state={{ from: location }} replace />
    : <Outlet/>;
};

export default Redirecter;
