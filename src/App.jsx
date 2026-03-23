import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { GOOGLE_CLIENT_ID } from './utils/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import MyComplaints from './pages/MyComplaints';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';
import AdminCodeAuth from './pages/AdminCodeAuth';
import Layout from './components/Layout';

const AppLoader = () => (
  <div style={{
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  }}>
    <div style={{
      width: 44, height: 44,
      borderRadius: 12,
      background: 'linear-gradient(135deg, var(--indigo), var(--violet))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, fontWeight: 700, color: 'white',
      fontFamily: 'var(--font-display)'
    }}>G</div>
    <div style={{
      width: 20, height: 20,
      border: '2px solid var(--border)',
      borderTopColor: 'var(--indigo)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <AppLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'student') return <Navigate to="/admin" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <AppLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PendingAdminRoute = ({ children }) => {
  const { user, pendingAdmin, loading } = useAuth();

  if (loading) return <AppLoader />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return pendingAdmin ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  const { user, pendingAdmin, loading } = useAuth();

  if (loading) return <AppLoader />;

  const defaultHome = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user
            ? <Navigate to={defaultHome} replace />
            : pendingAdmin
            ? <Navigate to="/admin-access" replace />
            : <Login />
        }
      />

      <Route
        path="/admin-access"
        element={
          <PendingAdminRoute>
            <AdminCodeAuth />
          </PendingAdminRoute>
        }
      />

      <Route
        path="/dashboard"
        element={<StudentRoute><Layout><Dashboard /></Layout></StudentRoute>}
      />
      <Route
        path="/new-complaint"
        element={<StudentRoute><Layout><NewComplaint /></Layout></StudentRoute>}
      />
      <Route
        path="/my-complaints"
        element={<StudentRoute><Layout><MyComplaints /></Layout></StudentRoute>}
      />

      <Route
        path="/admin"
        element={<AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>}
      />
      <Route
        path="/admin/complaints"
        element={<AdminRoute><Layout><AdminComplaints /></Layout></AdminRoute>}
      />

      <Route
        path="/"
        element={
          <Navigate
            to={
              user
                ? defaultHome
                : pendingAdmin
                ? '/admin-access'
                : '/login'
            }
            replace
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppProviders() {
  const content = (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            borderRadius: 10
          },
          success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
          error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
        }}
      />
      <AppRoutes />
    </>
  );

  if (!GOOGLE_CLIENT_ID) {
    return content;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {content}
    </GoogleOAuthProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProviders />
      </AuthProvider>
    </BrowserRouter>
  );
}
