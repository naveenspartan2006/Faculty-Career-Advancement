import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Publications from './pages/Publications';
import AddPublication from './pages/AddPublication';
import Achievements from './pages/Achievements';
import Certifications from './pages/Certifications';
import Conferences from './pages/Conferences';
import Projects from './pages/Projects';
import CareerSummary from './pages/CareerSummary';
import PublicationSummary from './pages/PublicationSummary';
import FacultyList from './pages/FacultyList';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Layout wrapper for authenticated pages
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content-wrapper">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-page-content">{children}</main>
      </div>
    </div>
  );
};

const App = () => {
  const { isAuthenticated, user, loading } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
          ) : (
            <Register />
          )
        }
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? user?.role === 'admin'
                  ? '/admin/dashboard'
                  : '/dashboard'
                : '/login'
            }
            replace
          />
        }
      />

      {/* Faculty Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/publications"
        element={
          <ProtectedRoute allowedRoles={['faculty', 'admin']}>
            <AppLayout>
              <Publications />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/publications/add"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <AppLayout>
              <AddPublication />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/publications/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <AppLayout>
              <AddPublication />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <AppLayout>
              <Achievements />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/certifications"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <AppLayout>
              <Certifications />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/conferences"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <AppLayout>
              <Conferences />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <AppLayout>
              <Projects />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/career-summary"
        element={
          <ProtectedRoute allowedRoles={['faculty', 'admin']}>
            <AppLayout>
              <CareerSummary />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/publication-summary"
        element={
          <ProtectedRoute allowedRoles={['faculty', 'admin']}>
            <AppLayout>
              <PublicationSummary />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faculty"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <FacultyList />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/statistics"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Settings (Shared) */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={['faculty', 'admin']}>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <AppLayout>
              <NotFound />
            </AppLayout>
          ) : (
            <NotFound />
          )
        }
      />
    </Routes>
  );
};

export default App;
