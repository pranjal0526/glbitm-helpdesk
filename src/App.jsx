import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages (we'll create these one by one)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import MyComplaints from './pages/MyComplaints';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';

// ── Route Guards ──────────────────────────────────────

// Blocks logged-out users from accessing protected pages
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <AppLoader />;
  return user ? children : <Navigate to="/login" replace />;
};

// Blocks non-admins from accessing admin pages
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <AppLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

// ── Loading Screen ────────────────────────────────────

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

// ── Routes ────────────────────────────────────────────

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <AppLoader />;

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Student routes */}
      <Route path="/dashboard" element={
        <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>
      }/>
      <Route path="/new-complaint" element={
        <PrivateRoute><Layout><NewComplaint /></Layout></PrivateRoute>
      }/>
      <Route path="/my-complaints" element={
        <PrivateRoute><Layout><MyComplaints /></Layout></PrivateRoute>
      }/>

      {/* Admin only */}
      <Route path="/admin" element={
        <AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>
      }/>

      {/* Default redirect */}
      <Route path="/" element={
        <Navigate to={user ? '/dashboard' : '/login'} replace />
      }/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ── App Root ──────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
            error:   { iconTheme: { primary: '#ef4444', secondary: 'white' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}