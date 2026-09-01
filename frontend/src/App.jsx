import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student pages
import Dashboard from './pages/student/Dashboard';
import NewGrievance from './pages/student/NewGrievance';
import GrievanceDetail from './pages/student/GrievanceDetail';

// HOD pages
import HodDashboard from './pages/hod/HodDashboard';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public routes */}
      <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to='/dashboard' />} />
      <Route path='/register' element={!isAuthenticated ? <Register /> : <Navigate to='/dashboard' />} />

      {/* Student routes */}
      <Route path='/dashboard' element={
        <ProtectedRoute allowedRoles={['student']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path='/grievance/new' element={
        <ProtectedRoute allowedRoles={['student']}>
          <NewGrievance />
        </ProtectedRoute>
      } />
      <Route path='/grievance/:id' element={
        <ProtectedRoute allowedRoles={['student', 'hod', 'admin']}>
          <GrievanceDetail />
        </ProtectedRoute>
      } />

      {/* HOD routes */}
      <Route path='/hod/dashboard' element={
        <ProtectedRoute allowedRoles={['hod']}>
          <HodDashboard />
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path='/admin/dashboard' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path='/admin/users' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserManagement />
        </ProtectedRoute>
      } />

      {/* Default redirect */}
<Route path='/' element={
  !isAuthenticated ? <Navigate to='/login' /> :
  user?.role === 'admin' ? <Navigate to='/admin/dashboard' /> :
  user?.role === 'hod' ? <Navigate to='/hod/dashboard' /> :
  <Navigate to='/dashboard' />
} />
<Route path='*' element={
  !isAuthenticated ? <Navigate to='/login' /> :
  user?.role === 'admin' ? <Navigate to='/admin/dashboard' /> :
  user?.role === 'hod' ? <Navigate to='/hod/dashboard' /> :
  <Navigate to='/dashboard' />
} />
    </Routes>
  );
}

export default App;