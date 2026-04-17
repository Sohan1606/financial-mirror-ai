import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnalysisProvider } from './context/AnalysisContext';
import { ToastProvider } from './components/ui/Toast';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetPage from './pages/BudgetPage';
import GoalsPage from './pages/GoalsPage';
import ReportsPage from './pages/ReportsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import SupportPage from './pages/SupportPage';
import NewDashboardPage from './pages/NewDashboardPage';
import RealityCheckPage from './pages/RealityCheckPage';
import MicroMacroPage from './pages/MicroMacroPage';
import DelayCostPage from './pages/DelayCostPage';
import ShockModePage from './pages/ShockModePage';
import ScenarioBuilderPage from './pages/ScenarioBuilderPage';
import LeakDetectionPage from './pages/LeakDetectionPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <NewDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/simulators/reality-check"
        element={
          <ProtectedRoute>
            <RealityCheckPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/simulators/micro-macro"
        element={
          <ProtectedRoute>
            <MicroMacroPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/simulators/delay-cost"
        element={
          <ProtectedRoute>
            <DelayCostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/simulators/shock-mode"
        element={
          <ProtectedRoute>
            <ShockModePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/simulators/scenario-builder"
        element={
          <ProtectedRoute>
            <ScenarioBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaks"
        element={
          <ProtectedRoute>
            <LeakDetectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/budget"
        element={
          <ProtectedRoute>
            <BudgetPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <GoalsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AnalysisProvider>
          <ToastProvider>
            <div className="min-h-screen bg-gray-50">
              <AppRoutes />
            </div>
          </ToastProvider>
        </AnalysisProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
