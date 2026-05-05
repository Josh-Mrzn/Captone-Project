import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/landing/LoginPage.jsx';
import RegisterPage from './pages/landing/RegisterPage.jsx';
import ForgotPasswordPage from './pages/landing/ForgotPasswordPage.jsx';

import AdminPage from './pages/admin/AdminPage.jsx';
import SuperAdminPage from './pages/superadmin/SuperAdminPage.jsx';

const getAuth = () => {
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');
  return { token, user };
};

// 🔐 Protected Route
function ProtectedRoute({ children, role }) {
  const { token, user } = getAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && (user.role || '').toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// 🔓 Public only route
function PublicOnlyRoute({ children }) {
  const { token, user } = getAuth();

  if (token && user) {
    const role = (user.role || '').toLowerCase();
    return <Navigate to={role === 'superadmin' ? '/superadmin' : '/admin'} replace />;
  }
  return children;
}

export default function App() {

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* LANDING */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTH */}
        <Route path="/login" element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        } />

        <Route path="/register" element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        } />

        <Route path="/forgot-password" element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        } />

        {/* ADMIN */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminPage onLogout={handleLogout} />
          </ProtectedRoute>
        } />

        {/* SUPERADMIN */}
        <Route path="/superadmin" element={
          <ProtectedRoute role="superadmin">
            <SuperAdminPage onLogout={handleLogout} />
          </ProtectedRoute>
        } />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}