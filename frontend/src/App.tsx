import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Objects } from './pages/Objects';
import { MyObjects } from './pages/MyObjects';
import { Returns } from './pages/Returns';
import { Users } from './pages/Users';
import { Locations } from './pages/Locations';
import { Profile } from './pages/Profile';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/objetos" element={<Objects />} />
                <Route path="/meus-objetos" element={<MyObjects />} />
                <Route path="/perfil" element={<Profile />} />

                {/* Admin-only routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/devolucoes" element={<Returns />} />
                  <Route path="/usuarios" element={<Users />} />
                  <Route path="/locais" element={<Locations />} />
                </Route>
              </Route>
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
