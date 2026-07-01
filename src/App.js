import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import LanguageSelector from './pages/LanguageSelector';
import Landing from './pages/Landing';
import PatientRegistration from './pages/PatientRegistration';
import DoctorRegistration from './pages/DoctorRegistration';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientWelcome from './pages/PatientWelcome';
import PatientLogin from './pages/PatientLogin';
import EmergencySOS from './pages/EmergencySOS';
import GovtSchemes from './pages/GovtSchemes';
import LoginPage from './pages/LoginPage';
import VideoCallRoom from './pages/VideoCallRoom';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LanguageSelector />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/emergency-sos" element={<EmergencySOS />} />
            <Route path="/govt-schemes" element={<GovtSchemes />} />
            <Route path="/patient-welcome" element={<PatientWelcome />} />
            <Route path="/patient-registration" element={<PatientRegistration />} />
            <Route path="/doctor-registration" element={<DoctorRegistration />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/patient-login" element={<PatientLogin />} />
            <Route path="/doctor-login" element={<LoginPage />} />
            <Route path="/video-call/:id" element={<VideoCallRoom />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;