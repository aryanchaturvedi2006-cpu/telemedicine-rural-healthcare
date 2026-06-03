import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import LanguageSelector from './pages/LanguageSelector';
import PatientRegistration from './pages/PatientRegistration';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LanguageSelector />} />
          <Route path="/patient-registration" element={<PatientRegistration />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
