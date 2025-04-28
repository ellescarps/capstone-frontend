import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
