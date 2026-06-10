import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useIdleTimeout } from './hooks/useIdleTimeout';
import RoleGuard from './components/RoleGuard';

import DashboardPage from './pages/DashboardPage.jsx';
import NewRecordPage from './pages/NewRecordPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

// Protected Route wrapper
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  useIdleTimeout(); // Activate auto-logout on protected routes
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

// Admin Route wrapper
const AdminRoute = () => {
  return (
    <RoleGuard action="view_admin_panel" fallback={<Navigate to="/dashboard" replace />}>
      <Outlet />
    </RoleGuard>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/nuevo" element={<NewRecordPage />} />
          
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
