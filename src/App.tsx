import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PatientManagement from './components/PatientManagement';
import PatientFile from './components/PatientFile';
import WoundCaseManagement from './components/WoundCaseManagement';
import ReferralTracking from './components/ReferralTracking';
import BusinessDevelopment from './components/BusinessDevelopment';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import Reporting from './components/Reporting';
import ReferralCoordinatorKanban from './components/ReferralCoordinatorKanban';
import NewPatientIntake from './components/NewPatientIntake';

function App() {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <Login />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/patients/:id" element={<PatientFile />} />
          <Route path="/wound-cases" element={<WoundCaseManagement />} />
          <Route path="/referrals" element={
            userRole === 'Coordinator' ? <ReferralCoordinatorKanban /> : <ReferralTracking />
          } />
          <Route path="/referrals/new" element={<NewPatientIntake />} />
          <Route path="/business-development" element={<BusinessDevelopment />} />
          <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;