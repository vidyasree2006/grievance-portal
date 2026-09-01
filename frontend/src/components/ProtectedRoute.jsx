import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import api from '../api/axios';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Call /auth/me to verify token with server
        const res = await api.get('/auth/me');
        const serverRole = res.data.user.role;

        // If localStorage role doesn't match server role — logout immediately
        if (serverRole !== user?.role) {
          console.warn('Role mismatch detected — logging out');
          dispatch(logout());
          setVerified(false);
        } else {
          setVerified(true);
        }
      } catch (err) {
        // Token invalid or expired — logout
        dispatch(logout());
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 40%, #f0fdf4 100%)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-400 text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !verified) {
    return <Navigate to='/login' />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to='/' />;
  }

  return children;
}

export default ProtectedRoute;