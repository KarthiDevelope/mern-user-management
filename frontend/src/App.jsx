import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ConfigProvider, App as AntApp } from 'antd';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/admin/UserPage';
import ProfilePage from './pages/user/ProfilePage';

const theme = {
  token: {
    colorPrimary: '#667eea',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Route>

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
