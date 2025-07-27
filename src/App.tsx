import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Jobs from './pages/Jobs';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/candidates" element={<div className="p-6"><h1 className="text-2xl font-bold">Candidates - Coming Soon</h1></div>} />
        <Route path="/interviews" element={<div className="p-6"><h1 className="text-2xl font-bold">Interviews - Coming Soon</h1></div>} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;