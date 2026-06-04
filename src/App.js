import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import LanguageSelector from './pages/LanguageSelector';
import Landing from './pages/Landing';
import PatientRegistration from './pages/PatientRegistration';
import DoctorRegistration from './pages/DoctorRegistration';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientLogin from './pages/PatientLogin';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LanguageSelector />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/patient-registration" element={<PatientRegistration />} />
          <Route path="/doctor-registration" element={<DoctorRegistration />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/patient-login" element={<PatientLogin />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
