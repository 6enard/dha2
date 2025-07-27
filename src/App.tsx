import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import RoleSelector from './components/Auth/RoleSelector';
import JobBoard from './components/Public/JobBoard';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Jobs from './pages/Jobs';

const AppRoutes: React.FC = () => {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<'hr' | 'applicant' | null>(null);

  // If no user is logged in and no role is selected, show role selector
  if (!currentUser && !userRole) {
    return <RoleSelector onRoleSelect={setUserRole} />;
  }

  // If applicant role is selected, show job board
  if (userRole === 'applicant') {
    return <JobBoard />;
  }

  // If HR role is selected but not logged in, show login
  if (userRole === 'hr' && !currentUser) {
    return <Login />;
  }

  // If HR user is logged in, show HR dashboard
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/candidates" element={<div className="p-6"><h1 className="text-2xl font-bold">Candidates - Coming Soon</h1></div>} />
        <Route path="/interviews" element={<div className="p-6"><h1 className="text-2xl font-bold">Interviews - Coming Soon</h1></div>} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
        <Route path="/public" element={<Navigate to="/" />} />
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