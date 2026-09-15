import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db, auth } from '../firebase';
import API_BASE_URL from '../config';

// -------------------------------------------------------------
// SVG Icons (Replacing Emojis)
// -------------------------------------------------------------
const Icons = {
  Home: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Calendar: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  ),
  Users: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Stethoscope: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
  ),
  Pill: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
  ),
  Clipboard: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
  ),
  Location: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Settings: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  Logout: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
  ),
  Bell: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  ChevronDown: ({ className }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
  ),
  Video: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>
  ),
  Clock: ({ className }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  User: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Shield: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Menu: ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  ),
  X: ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
  )
};

// -------------------------------------------------------------
// Healthcare Ambient Background
// -------------------------------------------------------------
const HealthcareAmbientBackground = () => {
  // 24 elements total for dense but clean distribution
  const elements = [
    { type: 'stethoscope', left: '5%', duration: 25, delay: 0, scale: 1.1, depth: 'foreground', opacity: 0.18 },
    { type: 'cross', left: '15%', duration: 32, delay: 5, scale: 0.9, depth: 'midground', opacity: 0.12 },
    { type: 'clipboard', left: '25%', duration: 28, delay: 2, scale: 1, depth: 'foreground', opacity: 0.16 },
    { type: 'capsule', left: '35%', duration: 35, delay: 12, scale: 0.85, depth: 'background', opacity: 0.09 },
    { type: 'heartbeat', left: '45%', duration: 22, delay: 8, scale: 1.1, depth: 'midground', opacity: 0.14 },
    { type: 'bag', left: '55%', duration: 30, delay: 3, scale: 1, depth: 'foreground', opacity: 0.17 },
    { type: 'flask', left: '65%', duration: 27, delay: 15, scale: 0.9, depth: 'midground', opacity: 0.11 },
    { type: 'cross', left: '75%', duration: 38, delay: 7, scale: 0.8, depth: 'background', opacity: 0.08 },
    { type: 'stethoscope', left: '85%', duration: 24, delay: 20, scale: 0.95, depth: 'midground', opacity: 0.13 },
    { type: 'kit', left: '95%', duration: 29, delay: 10, scale: 1.1, depth: 'foreground', opacity: 0.15 },
    { type: 'scanner', left: '10%', duration: 31, delay: 18, scale: 0.85, depth: 'background', opacity: 0.1 },
    { type: 'cross', left: '20%', duration: 26, delay: 4, scale: 1.05, depth: 'midground', opacity: 0.14 },
    { type: 'clipboard', left: '30%', duration: 33, delay: 14, scale: 0.9, depth: 'background', opacity: 0.09 },
    { type: 'capsule', left: '40%', duration: 23, delay: 22, scale: 1.1, depth: 'foreground', opacity: 0.18 },
    { type: 'stethoscope', left: '50%', duration: 28, delay: 1, scale: 0.95, depth: 'midground', opacity: 0.12 },
    { type: 'heartbeat', left: '60%', duration: 36, delay: 11, scale: 0.8, depth: 'background', opacity: 0.08 },
    { type: 'cross', left: '70%', duration: 21, delay: 25, scale: 1.2, depth: 'foreground', opacity: 0.19 },
    { type: 'bag', left: '80%', duration: 34, delay: 6, scale: 0.9, depth: 'midground', opacity: 0.13 },
    { type: 'flask', left: '90%', duration: 27, delay: 19, scale: 1, depth: 'foreground', opacity: 0.15 },
    { type: 'scanner', left: '12%', duration: 39, delay: 13, scale: 0.85, depth: 'background', opacity: 0.09 },
    { type: 'stethoscope', left: '33%', duration: 25, delay: 24, scale: 1.1, depth: 'foreground', opacity: 0.17 },
    { type: 'cross', left: '53%', duration: 30, delay: 9, scale: 0.95, depth: 'midground', opacity: 0.14 },
    { type: 'clipboard', left: '73%', duration: 35, delay: 21, scale: 0.85, depth: 'background', opacity: 0.1 },
    { type: 'capsule', left: '93%', duration: 22, delay: 16, scale: 1.15, depth: 'foreground', opacity: 0.20 },
  ];

  const renderMedicalObject = (type) => {
    switch (type) {
      case 'stethoscope':
        return (
          <svg width="44" height="44" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C12 5.5 14 3.5 16.5 3.5H20C22.5 3.5 24.5 5.5 24.5 8V14C24.5 17.5 21.5 20 18.25 20C15 20 12 17.5 12 14V8Z" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M18.25 20V32" stroke="#2563EB" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="18.25" cy="35" r="3" fill="#2FA6A0" stroke="#43A047" strokeWidth="1.5"/>
            <path d="M14 8C14 6.5 15 5.5 16.5 5.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
      case 'cross':
        return (
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="4" width="12" height="32" rx="4" fill="#3B82F6" fillOpacity="0.85"/>
            <rect x="4" y="14" width="32" height="12" rx="4" fill="#2FA6A0" fillOpacity="0.9"/>
            <rect x="15" y="6" width="4" height="12" rx="2" fill="rgba(255,255,255,0.5)"/>
          </svg>
        );
      case 'clipboard':
        return (
          <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="28" height="36" rx="3" fill="#BAE6FD" fillOpacity="0.8" stroke="#3B82F6" strokeWidth="2"/>
            <rect x="12" y="2" width="12" height="8" rx="2" fill="#2FA6A0"/>
            <line x1="10" y1="20" x2="26" y2="20" stroke="#43A047" strokeWidth="2" strokeLinecap="round"/>
            <line x1="10" y1="26" x2="20" y2="26" stroke="#43A047" strokeWidth="2" strokeLinecap="round"/>
            <line x1="10" y1="32" x2="24" y2="32" stroke="#43A047" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'capsule':
        return (
          <svg width="26" height="42" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12V20H4V12Z" fill="#3B82F6"/>
            <path d="M4 20H20V28C20 32.4183 16.4183 36 12 36C7.58172 36 4 32.4183 4 28V20Z" fill="#2FA6A0"/>
            <path d="M7 10C7 8 9 6 11 6" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'heartbeat':
        return (
          <svg width="44" height="34" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 15L10 15L14 5L22 25L26 15L37 15" stroke="#2FA6A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="37" cy="15" r="3" fill="#43A047"/>
          </svg>
        );
      case 'bag':
      case 'kit':
        return (
          <svg width="40" height="34" viewBox="0 0 42 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="10" width="34" height="24" rx="4" fill="#3B82F6" fillOpacity="0.85"/>
            <path d="M14 10V6C14 4.89543 14.8954 4 16 4H26C27.1046 4 28 4.89543 28 6V10" stroke="#2FA6A0" strokeWidth="3" strokeLinecap="round"/>
            <rect x="18" y="16" width="6" height="12" rx="1" fill="#FFFFFF" fillOpacity="0.95"/>
            <rect x="15" y="19" width="12" height="6" rx="1" fill="#FFFFFF" fillOpacity="0.95"/>
          </svg>
        );
      case 'flask':
        return (
          <svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H23" stroke="#2FA6A0" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 4V16L5 32H29L17 16" fill="#BAE6FD" fillOpacity="0.5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 26H25" stroke="#2FA6A0" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="17" cy="29" r="2" fill="#43A047"/>
            <circle cx="13" cy="30" r="1" fill="#43A047"/>
          </svg>
        );
      case 'scanner':
        return (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="14" fill="#BAE6FD" fillOpacity="0.4" stroke="#3B82F6" strokeWidth="2"/>
            <circle cx="18" cy="18" r="8" fill="none" stroke="#2FA6A0" strokeWidth="2" strokeDasharray="4 4"/>
            <line x1="18" y1="18" x2="26" y2="10" stroke="#43A047" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="26" cy="10" r="2" fill="#3B82F6"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="medical-ambient-bg">
      <div className="ambient-atmosphere"></div>
      
      {/* ECG Layers - Seamless Scrolling */}
      <div className="ecg-track ecg-1" style={{ top: '15%' }}>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,50 L300,50 L310,35 L320,65 L335,25 L350,85 L360,50 L1000,50" className="ecg-line ecg-color-blue" strokeWidth="2"/></svg>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,50 L300,50 L310,35 L320,65 L335,25 L350,85 L360,50 L1000,50" className="ecg-line ecg-color-blue" strokeWidth="2"/></svg>
      </div>
      
      <div className="ecg-track ecg-2" style={{ top: '30%' }}>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,50 L600,50 L610,35 L620,65 L635,25 L650,85 L660,50 L1000,50" className="ecg-line ecg-color-teal" strokeWidth="2.5"/></svg>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,50 L600,50 L610,35 L620,65 L635,25 L650,85 L660,50 L1000,50" className="ecg-line ecg-color-teal" strokeWidth="2.5"/></svg>
      </div>
      
      <div className="ecg-track ecg-3" style={{ top: '45%' }}>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,50 L200,50 L210,35 L220,65 L235,25 L250,85 L260,50 L1000,50" className="ecg-line ecg-color-green" strokeWidth="2"/></svg>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,50 L200,50 L210,35 L220,65 L235,25 L250,85 L260,50 L1000,50" className="ecg-line ecg-color-green" strokeWidth="2"/></svg>
      </div>

      <div className="ecg-track ecg-4" style={{ top: '65%' }}>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,50 L800,50 L810,35 L820,65 L835,25 L850,85 L860,50 L1000,50" className="ecg-line ecg-color-blue" strokeWidth="2"/></svg>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,50 L800,50 L810,35 L820,65 L835,25 L850,85 L860,50 L1000,50" className="ecg-line ecg-color-blue" strokeWidth="2"/></svg>
      </div>

      <div className="ecg-track ecg-5" style={{ top: '80%' }}>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,50 L400,50 L410,35 L420,65 L435,25 L450,85 L460,50 L1000,50" className="ecg-line ecg-color-teal" strokeWidth="1.5"/></svg>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,50 L400,50 L410,35 L420,65 L435,25 L450,85 L460,50 L1000,50" className="ecg-line ecg-color-teal" strokeWidth="1.5"/></svg>
      </div>

      <div className="ecg-track ecg-6" style={{ top: '90%' }}>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,50 L700,50 L710,35 L720,65 L735,25 L750,85 L760,50 L1000,50" className="ecg-line ecg-color-green" strokeWidth="1.5"/></svg>
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path d="M0,50 L700,50 L710,35 L720,65 L735,25 L750,85 L760,50 L1000,50" className="ecg-line ecg-color-green" strokeWidth="1.5"/></svg>
      </div>
      
      {/* Colored Medical Objects */}
      {elements.map((el, i) => (
        <div 
          key={i} 
          className={`falling-wrapper depth-${el.depth}`}
          style={{ 
            left: el.left, 
            animationDuration: `${el.duration}s`, 
            animationDelay: `${el.delay}s`,
            opacity: el.opacity,
            transform: `scale(${el.scale})`
          }}
        >
          <div className="falling-inner" style={{ animationDuration: `${el.duration}s`, animationDelay: `${el.delay}s` }}>
            {renderMedicalObject(el.type)}
          </div>
        </div>
      ))}
    </div>
  );
};

const DoctorDashboard = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // Data & State (STRICTLY PRESERVED)
  // -------------------------------------------------------------
  const { user: doctorData, logout } = useAuth();
  const doctorId = doctorData?.uid || null;
  const doctorName = doctorData?.name || 'Doctor';
  const doctorSpecialization = doctorData?.specialization || 'General Practitioner';
  const doctorHospital = doctorData?.hospital || 'JeevanJyoti Network';
  
  const [appointments, setAppointments] = useState([]);
  const prevApptIdsRef = useRef(new Set());
  const [apptLoading, setApptLoading] = useState(true);
  const [apptError, setApptError] = useState('');
  const [isAvailable, setIsAvailable] = useState(
    doctorData?.is_available !== undefined ? Boolean(doctorData.is_available) : true
  );
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [showLocationBanner, setShowLocationBanner] = useState(!doctorData?.latitude && localStorage.getItem('hide_location_banner') !== 'true');

  // Change Password modal state
  const [showChangePw, setShowChangePw] = useState(false);
  const [changePwForm, setChangePwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePwError, setChangePwError] = useState('');
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Schedule Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');
  
  // Prescription Modal State
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [activeApptIdForPrescription, setActiveApptIdForPrescription] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({ medicines: '', notes: '', image: '' });
  const [submittingPrescription, setSubmittingPrescription] = useState(false);

  // Geo-location state
  const [doctorCoords, setDoctorCoords] = useState(null);

  // Live Clock State
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Workspace specific states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const LOCATION_BANNER_LABEL = {
    en: "Complete your profile: Add your location to help patients discover you."
  };

  // -------------------------------------------------------------
  // Handlers (STRICTLY PRESERVED)
  // -------------------------------------------------------------
  useEffect(() => {
    if (doctorData?.latitude && doctorData?.longitude) {
      setDoctorCoords({ latitude: doctorData.latitude, longitude: doctorData.longitude });
    }
  }, []);

  const handleLocationUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setDoctorCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          try {
            await updateDoc(doc(db, 'users', doctorId), {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setShowLocationBanner(false);
          } catch (e) {
            console.error("Location update failed", e);
          }
        },
        (error) => {
          console.error("Location error:", error);
        }
      );
    }
  };

  const dismissLocationBanner = () => {
    localStorage.setItem('hide_location_banner', 'true');
    setShowLocationBanner(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('currentDoctor');
    localStorage.removeItem('tele_user');
    setLanguage('');
    navigate('/');
  };

  useEffect(() => {
    if (!doctorId) { setApptLoading(false); return; }
    const q = query(collection(db, 'appointments'), where('doctorId', '==', doctorId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newAppointments = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const currentIds = new Set(newAppointments.map(a => a.id));
      const newPendingAppts = newAppointments.filter(a => a.status === 'pending' && !prevApptIdsRef.current.has(a.id));
      if (newPendingAppts.length > 0 && prevApptIdsRef.current.size > 0) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
      prevApptIdsRef.current = currentIds;
      setAppointments(newAppointments);
      setApptLoading(false);
    }, (err) => {
      console.error('Error fetching appointments:', err);
      setApptError(err.message || 'Error fetching appointments');
      setApptLoading(false);
    });
    return () => unsubscribe();
  }, [doctorId]);

  const handleToggleAvailability = async () => {
    if (!doctorId) return;
    setTogglingAvailability(true);
    const newValue = !isAvailable;
    try {
      await updateDoc(doc(db, 'users', doctorId), { is_available: newValue });
      setIsAvailable(newValue);
    } catch (err) {
      console.error('Error updating availability:', err);
    } finally {
      setTogglingAvailability(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, status, schedTime = null) => {
    try {
      const payload = { status };
      if (schedTime) payload.scheduledTime = schedTime;
      await updateDoc(doc(db, 'appointments', appointmentId), payload);
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      if (showScheduleModal) {
        setShowScheduleModal(false);
        setSelectedApptId(null);
        setScheduledTime('');
      }
    }
  };

  const handleOpenScheduleModal = (appointmentId) => {
    setSelectedApptId(appointmentId);
    setShowScheduleModal(true);
  };

  const handleStartCall = async (appointmentId) => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), { callStarted: true });
      navigate(`/video-call/appointment-${appointmentId}`);
    } catch (err) {
      console.error('Error starting call:', err);
    }
  };

  const handleOpenPrescriptionModal = (apptId) => {
    setActiveApptIdForPrescription(apptId);
    setPrescriptionForm({ medicines: '', notes: '' });
    setShowPrescriptionModal(true);
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    if (!activeApptIdForPrescription) return;
    
    setSubmittingPrescription(true);
    try {
      await updateDoc(doc(db, 'appointments', activeApptIdForPrescription), {
        prescriptionText: prescriptionForm.notes,
        medicines: prescriptionForm.medicines,
        prescriptionImage: prescriptionForm.image,
        status: 'completed'
      });
      setShowPrescriptionModal(false);
      setActiveApptIdForPrescription(null);
      setPrescriptionForm({ medicines: '', notes: '', image: '' });
      alert('Prescription saved and appointment completed!');
    } catch (err) {
      console.error('Error saving prescription:', err);
      alert('An error occurred while saving prescription.');
    } finally {
      setSubmittingPrescription(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePwError('');
    const { currentPassword, newPassword, confirmPassword } = changePwForm;

    if (newPassword !== confirmPassword) {
      setChangePwError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setChangePwError('New password must be at least 6 characters');
      return;
    }

    const firebaseUser = auth.currentUser;
    if (!firebaseUser || !firebaseUser.email) {
      setChangePwError('Session expired. Please log out and log in again.');
      return;
    }

    setChangePwLoading(true);
    try {
      // Firebase requires re-authentication before a sensitive action
      // like changing a password.
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);

      setShowChangePw(false);
      setChangePwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } catch (err) {
      console.error('Change password error:', err);
      const messages = {
        'auth/wrong-password': 'Current password is incorrect.',
        'auth/invalid-credential': 'Current password is incorrect.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/weak-password': 'New password should be at least 6 characters.',
        'auth/requires-recent-login': 'Please log out and log in again, then retry.',
      };
      setChangePwError(messages[err.code] || 'Failed to change password. Please try again.');
    } finally {
      setChangePwLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Derived Data
  // -------------------------------------------------------------
  const pendingAppts = appointments.filter(a => a.status === 'pending');
  const confirmedAppts = appointments.filter(a => a.status === 'confirmed');
  const completedAppts = appointments.filter(a => a.status === 'completed');

  const uniquePatientsMap = new Map();
  [...confirmedAppts, ...completedAppts].forEach(appt => {
      if (appt.patientName && !uniquePatientsMap.has(appt.patientName)) {
          uniquePatientsMap.set(appt.patientName, {
              name: appt.patientName,
              lastConsultation: appt.scheduledTime || 'Recent',
              mode: appt.mode,
              id: appt.patientId || appt.id
          });
      }
  });
  const myPatients = Array.from(uniquePatientsMap.values());

  // -------------------------------------------------------------
  // CSS Architecture
  // -------------------------------------------------------------
  useEffect(() => {
    const styleId = "doctor-workspace-premium-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        :root {
          --color-brand: #1565C0;
          --color-brand-hover: #0D47A1;
          --color-bg: #EEF3FC;
          --color-surface: #FFFFFF;
          --color-text-main: #111827;
          --color-text-muted: #4B5563;
          --color-text-light: #9CA3AF;
          --color-border: #E5E7EB;
          --color-danger: #DC2626;
          --color-danger-hover: #B91C1C;
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          --shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
          --radius-md: 12px;
          --radius-lg: 16px;
        }

        .workspace-layout {
          display: flex;
          height: 100vh;
          background-color: var(--color-bg);
          background-image: radial-gradient(#1565C0 0.6px, transparent 0.6px);
          background-size: 26px 26px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: var(--color-text-main);
          overflow: hidden;
        }

        /* Typography */
        h1, h2, h3, h4, p { margin: 0; }
        .text-main { color: var(--color-text-main); }
        .text-muted { color: var(--color-text-muted); }
        .text-sm { font-size: 13px; }
        .text-base { font-size: 15px; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }

        /* Sidebar */
        .sidebar-container {
          width: 270px;
          background-color: var(--color-surface);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          z-index: 50;
          box-shadow: 4px 0 24px rgba(21,101,192,0.04);
        }
        .brand-header {
          padding: 24px;
          border-bottom: 1px solid var(--color-border);
        }
        .brand-logo {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-brand);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand-sub {
          font-size: 11px;
          color: var(--color-text-light);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 4px;
        }
        .doctor-identity {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--color-border);
        }
        .avatar-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1565C0, #42A5F5);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          flex-shrink: 0;
          box-shadow: 0 6px 16px rgba(21,101,192,0.28);
          animation: avatarFloat 3.5s ease-in-out infinite;
        }
        
        .nav-section { padding: 20px 16px; }
        .nav-heading {
          font-size: 11px;
          color: var(--color-text-light);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          padding-left: 12px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          margin-bottom: 4px;
        }
        .nav-item:hover:not(.disabled) {
          background-color: #F3F4F6;
          color: var(--color-text-main);
        }
        .nav-item.active {
          background-color: #EFF6FF;
          color: var(--color-brand);
          font-weight: 700;
          box-shadow: inset 3px 0 0 var(--color-brand);
        }
        .nav-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .nav-item.disabled::after {
          content: 'Soon';
          font-size: 10px;
          background: var(--color-bg);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: auto;
          color: var(--color-text-muted);
        }

        /* Main Area */
        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          position: relative;
          background-color: var(--color-bg);
          background-image: radial-gradient(circle, rgba(21,128,61,0.07) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .topbar,
        .content-wrapper {
          position: relative;
          z-index: 1;
        }
        .topbar {
          height: 80px;
          background-color: #FFFFFF;
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 40;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }
        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .icon-button {
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          padding: 10px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-button:hover {
          color: var(--color-text-main);
          background-color: #F1F5F9;
        }

        /* Dropdown */
        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 4px 6px 4px 16px;
          border-radius: 24px;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .profile-trigger:hover {
          background-color: #F8FAFC;
          transform: scale(1.02);
        }
        .profile-trigger:hover { background: #F3F4F6; }
        .dropdown-menu {
          position: absolute;
          top: 64px;
          right: 32px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          width: 220px;
          padding: 8px 0;
          animation: dropdownFade 0.2s ease-out;
          transform-origin: top right;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          color: var(--color-text-muted);
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .dropdown-item:hover { background: #F9FAFB; color: var(--color-text-main); }
        .dropdown-divider { height: 1px; background: var(--color-border); margin: 4px 0; }

        /* Medical Ambient Background */
        .medical-ambient-bg {
          position: fixed;
          top: 0;
          left: 270px;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        
        .ambient-atmosphere {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.04) 0%, transparent 60%);
        }

        .ecg-track {
          position: absolute;
          width: 200%;
          left: 0;
          height: 80px;
          display: flex;
          opacity: 0.12;
          animation: panEcg 15s linear infinite;
          will-change: transform;
        }
        .ecg-track svg {
          flex: 1;
          height: 100%;
          width: 100%;
        }
        .ecg-line { fill: none; }
        .ecg-color-blue { stroke: #3B82F6; }
        .ecg-color-teal { stroke: #2FA6A0; }
        .ecg-color-green { stroke: #43A047; }

        .ecg-1 { animation-duration: 16s; }
        .ecg-2 { animation-name: panEcgReverse; animation-duration: 22s; opacity: 0.08; }
        .ecg-3 { animation-duration: 14s; }
        .ecg-4 { animation-duration: 20s; }
        .ecg-5 { animation-duration: 25s; opacity: 0.06; }
        .ecg-6 { animation-name: panEcgReverse; animation-duration: 28s; opacity: 0.05; }

        .falling-wrapper {
          position: absolute;
          top: -100px;
          animation-name: fallTransform;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .falling-inner {
          animation-name: fallOpacity;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: opacity;
        }

        /* Workspace Content */
        .content-wrapper {
          padding: 32px;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          animation: fadeSlideUp 0.4s ease-out;
          position: relative;
          z-index: 1;
        }

        /* Hero */
        .hero-banner {
          background: linear-gradient(125deg, #0B1E3D 0%, #0D47A1 55%, #1565C0 100%);
          background-size: 130% 130%;
          animation: heroGradient 20s ease-in-out infinite alternate;
          border-radius: var(--radius-lg);
          padding: 32px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          box-shadow: 0 10px 30px rgba(13, 71, 161, 0.25);
          position: relative;
          overflow: hidden;
        }
        .hero-banner::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          pointer-events: none;
          animation: floatShape1 24s ease-in-out infinite alternate;
        }
        .hero-banner::after {
          content: '';
          position: absolute;
          bottom: -50px;
          left: 30%;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          pointer-events: none;
          animation: floatShape2 28s ease-in-out infinite alternate;
        }
        .hero-illustration {
          position: absolute;
          right: -20px;
          top: -20px;
          opacity: 0.1;
          width: 200px;
          height: 200px;
          pointer-events: none;
          animation: floatStethoscope 8s ease-in-out infinite alternate;
        }
        .hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .hero-glow-1 {
          width: 300px;
          height: 300px;
          background: rgba(66, 165, 245, 0.15);
          top: -100px;
          left: -50px;
          animation: driftGlow1 16s ease-in-out infinite alternate;
        }
        .hero-glow-2 {
          width: 400px;
          height: 400px;
          background: rgba(21, 101, 192, 0.15);
          bottom: -150px;
          right: 10%;
          animation: driftGlow2 20s ease-in-out infinite alternate;
        }

        /* Stats */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          padding: 24px;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(21,101,192,0.1);
        }
        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Unified Card Style */
        .premium-card {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          margin-bottom: 16px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: cardStagger 0.4s ease forwards;
        }
        .premium-card.interactive:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 32px rgba(21,101,192,0.12);
          border-color: #BFDBFE;
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .btn-primary { background: linear-gradient(135deg, #1565C0, #1976D2); color: white; box-shadow: 0 6px 16px rgba(21,101,192,0.22); }
        .btn-primary:hover:not(:disabled) { background: linear-gradient(135deg, #0D47A1, #1565C0); box-shadow: 0 8px 20px rgba(21,101,192,0.32); transform: translateY(-1px); }
        .btn-secondary { background: transparent; color: var(--color-text-muted); border: 1px solid #D1D5DB; }
        .btn-secondary:hover:not(:disabled) { background: #F3F4F6; color: var(--color-text-main); }
        .btn-danger { background: transparent; color: var(--color-danger); border: 1px solid #FCA5A5; }
        .btn-danger:hover:not(:disabled) { background: #FEF2F2; border-color: var(--color-danger); }
        .btn-accent { background: linear-gradient(135deg, #1565C0, #0D47A1); color: white; box-shadow: 0 6px 16px rgba(21,101,192,0.25); }
        .btn-accent:hover:not(:disabled) { background: linear-gradient(135deg, #0D47A1, #0A1628); box-shadow: 0 8px 20px rgba(21,101,192,0.35); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Availability Pulse */
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }
        .status-dot.active {
          background-color: #22C55E;
          box-shadow: 0 0 0 rgba(34, 197, 94, 0.4);
          animation: pulseGreen 2s infinite;
        }
        .status-dot.inactive { background-color: #EF4444; }

        /* Status Badge */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .badge-pending { background: #FEF3C7; color: #B45309; }
        .badge-confirmed { background: #EFF6FF; color: #1565C0; }

        /* Empty States */
        .empty-container {
          text-align: center;
          padding: 40px 24px;
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          border: 1px dashed #D1D5DB;
        }
        .empty-icon { color: #9CA3AF; margin-bottom: 12px; display: flex; justify-content: center; }

        /* Modals */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17, 24, 39, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 16px;
          animation: fade 0.2s ease-out;
        }
        .modal-box {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          padding: 32px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          animation: modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .form-label { display: block; font-size: 13px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px; }
        .form-input {
          width: 100%;
          height: 44px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          padding: 0 16px;
          font-size: 14px;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .form-input:focus { outline: none; border-color: var(--color-brand); box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.1); }

        /* Animations */
        @keyframes pulseGreen {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        @keyframes avatarFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes cardStagger {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropdownFade { from { opacity: 0; transform: translateY(-4px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalScale { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        .mobile-menu-btn { display: none; }

        @media (max-width: 768px) {
          .sidebar-container { position: fixed; left: 0; top: 0; bottom: 0; transform: translateX(-100%); }
          .sidebar-container.open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,0.1); }
          .mobile-menu-btn { display: block; background: none; border: none; color: var(--color-text-muted); }
          .topbar { padding: 0 20px; }
          .content-wrapper { padding: 20px; }
          .stats-container { grid-template-columns: 1fr; }
          .hero-banner { padding: 24px; text-align: left; }
          .hide-mobile { display: none !important; }
        }
        
        @keyframes heroGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes floatShape1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-30px, 20px) scale(1.05); }
        }
        @keyframes floatShape2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, -20px) scale(1.1); }
        }
        @keyframes floatStethoscope {
          0% { transform: translateY(-4px); }
          100% { transform: translateY(4px); }
        }
        @keyframes driftGlow1 {
          0% { transform: translateX(0) scale(1); }
          100% { transform: translateX(120px) scale(1.1); }
        }
        @keyframes driftGlow2 {
          0% { transform: translateX(0) scale(1); }
          100% { transform: translateX(-100px) scale(1.05); }
        }
        @keyframes panEcg {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes panEcgReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes fallTransform {
          0% { transform: translate3d(0, -60px, 0) rotate(0deg); }
          30% { transform: translate3d(25px, 30vh, 0) rotate(8deg); }
          70% { transform: translate3d(-15px, 75vh, 0) rotate(-6deg); }
          100% { transform: translate3d(10px, 115vh, 0) rotate(4deg); }
        }
        @keyframes fallOpacity {
          0% { opacity: 0; }
          10% { opacity: 0.8; }
          50% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        
        .depth-foreground { z-index: 3; }
        .depth-midground { z-index: 2; }
        .depth-background { z-index: 1; }

        @media (max-width: 768px) {
          .medical-ambient-bg { left: 0; }
          .ecg-track { opacity: 0.05; }
          .falling-wrapper:nth-child(even) { display: none; }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .hero-banner, .hero-banner::before, .hero-banner::after, .hero-illustration, .hero-glow-1, .hero-glow-2, .ecg-track, .falling-wrapper, .falling-inner, .ambient-atmosphere {
            animation: none !important;
          }

        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // -------------------------------------------------------------
  // Render: Workspace Main Dashboard
  // -------------------------------------------------------------
  const renderDashboard = () => (
    <div className="content-wrapper">
      
      {/* Hero */}
      <div className="hero-banner">
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
        <svg className="hero-illustration" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>👋 Good morning, Dr. {doctorName}</h1>
          <p style={{ fontSize: '15px', color: '#EAF2FF', fontWeight: '500', maxWidth: '400px', lineHeight: '1.4', marginBottom: '16px' }}>
            Manage your consultations, patients and availability from one professional workspace.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
            <span className={`status-dot ${isAvailable ? 'active' : 'inactive'}`}></span>
            {isAvailable ? 'You are available for consultations' : 'You are currently unavailable'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#EFF6FF', color: '#1565C0' }}>
            <Icons.Calendar className="" />
          </div>
          <div>
            <div className="text-muted text-sm font-semibold mb-1">Confirmed Appointments</div>
            <div className="text-main font-bold" style={{ fontSize: '24px' }}>
              {String(confirmedAppts.length).padStart(2, '0')}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <Icons.Clock className="" />
          </div>
          <div>
            <div className="text-muted text-sm font-semibold mb-1">Pending Requests</div>
            <div className="text-main font-bold" style={{ fontSize: '24px' }}>
              {String(pendingAppts.length).padStart(2, '0')}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#F3F4F6', color: '#4B5563' }}>
            <Icons.Users className="" />
          </div>
          <div>
            <div className="text-muted text-sm font-semibold mb-1">Total Patients</div>
            <div className="text-main font-bold" style={{ fontSize: '24px' }}>
              {String(myPatients.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Location Banner */}
      {showLocationBanner && (
        <div className="premium-card" style={{ background: '#EFF6FF', borderColor: '#BFDBFE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ color: '#1D4ED8' }}><Icons.Location /></div>
            <div>
              <h3 className="text-main font-semibold text-base mb-1" style={{ color: '#1E3A8A' }}>Practice Location</h3>
              <p className="text-sm" style={{ color: '#1E40AF' }}>{LOCATION_BANNER_LABEL.en}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={handleLocationUpdate}>Set Location</button>
            <button className="icon-button" onClick={dismissLocationBanner}><Icons.X /></button>
          </div>
        </div>
      )}

      {/* Patient Requests */}
      <div style={{ marginTop: '40px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 className="text-main font-bold" style={{ fontSize: '18px', marginBottom: '4px' }}>📋 Patient Requests</h2>
          <p className="text-muted text-sm">Review and respond to new consultation requests.</p>
        </div>
      </div>
      
      {apptError && <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid #FECACA' }}>{apptError}</div>}

      {apptLoading ? (
        <div className="text-muted text-center" style={{ padding: '24px' }}>Loading requests...</div>
      ) : pendingAppts.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {pendingAppts.map(appt => (
            <div key={appt.id} className="premium-card interactive" style={{ borderLeft: '4px solid #F59E0B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="avatar-circle" style={{ width: '40px', height: '40px', background: '#F3F4F6', color: '#4B5563' }}>
                    <Icons.User />
                  </div>
                  <div>
                    <h3 className="text-main font-bold text-base mb-1">{appt.patientName}</h3>
                    <div className="text-muted text-sm" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {appt.mode === 'Video Call' || appt.mode === 'video' ? <Icons.Video className="" width="14" height="14" /> : <Icons.Clock width="14" height="14" />} 
                        {appt.mode}
                      </span>
                      <span className="badge badge-pending">⏳ Pending</span>
                    </div>
                  </div>
                </div>
              </div>

              {(appt.symptoms || appt.symptomAudio || appt.injuryPhoto) && (
                <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                  {appt.symptoms && (
                    <div style={{ marginBottom: appt.symptomAudio || appt.injuryPhoto ? '12px' : '0' }}>
                      <div className="text-muted" style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Notes</div>
                      <div className="text-main text-sm">{appt.symptoms}</div>
                    </div>
                  )}
                  {appt.symptomAudio && (
                    <div style={{ marginBottom: appt.injuryPhoto ? '12px' : '0' }}>
                      <div className="text-muted" style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Voice Note</div>
                      <audio controls src={appt.symptomAudio} style={{ width: '100%', height: '32px' }} />
                    </div>
                  )}
                  {appt.injuryPhoto && (
                    <div>
                      <div className="text-muted" style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Photo</div>
                      <img src={appt.injuryPhoto} alt="Patient injury" style={{ maxHeight: '160px', borderRadius: '8px', border: '1px solid #E5E7EB', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                <button className="btn btn-primary" onClick={() => handleOpenScheduleModal(appt.id)}>✅ Accept Request</button>
                <button className="btn btn-danger" onClick={() => handleStatusUpdate(appt.id, 'cancelled')}>❌ Decline</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-container">
          <div className="empty-icon"><Icons.Clipboard className="" width="32" height="32" /></div>
          <div className="text-main font-semibold mb-1">No new patient requests</div>
          <div className="text-muted text-sm">New consultation requests will appear here.</div>
        </div>
      )}

      {/* Confirmed Appointments */}
      <div style={{ marginTop: '48px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 className="text-main font-bold" style={{ fontSize: '18px', marginBottom: '4px' }}>📅 Today's Appointments</h2>
          <p className="text-muted text-sm">Your upcoming confirmed consultations.</p>
        </div>
      </div>

      {apptLoading ? (
        <div className="text-muted text-center" style={{ padding: '24px' }}>Loading appointments...</div>
      ) : confirmedAppts.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {confirmedAppts.map(appt => (
            <div key={appt.id} className="premium-card interactive" style={{ borderLeft: '4px solid var(--color-brand)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="avatar-circle" style={{ width: '40px', height: '40px', background: '#F0FDF4', color: 'var(--color-brand)' }}>
                    <Icons.User />
                  </div>
                  <div>
                    <h3 className="text-main font-bold text-base mb-1">{appt.patientName}</h3>
                    <div className="text-muted text-sm" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {appt.mode === 'Video Call' || appt.mode === 'video' ? <Icons.Video width="14" height="14" /> : <Icons.Clock width="14" height="14" />} 
                        {appt.mode}
                      </span>
                      {appt.scheduledTime && (
                        <span style={{ color: 'var(--color-text-main)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Icons.Clock width="14" height="14" /> {appt.scheduledTime}
                        </span>
                      )}
                      <span className="badge badge-confirmed">✅ Confirmed</span>
                    </div>
                  </div>
                </div>
              </div>

              {appt.patientMessageAudio && (
                <div style={{ background: '#FEF2F2', padding: '12px 16px', borderRadius: '8px', border: '1px solid #FECACA', marginBottom: '20px' }}>
                  <div className="text-danger font-semibold text-sm mb-2" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⚠️ Urgent Patient Message
                  </div>
                  <audio controls src={appt.patientMessageAudio} style={{ width: '100%', height: '32px' }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                {(appt.mode === 'Video Call' || appt.mode === 'video') && (
                  <button className="btn btn-accent" onClick={() => handleStartCall(appt.id)}>
                    <Icons.Video width="16" height="16" /> Start Video Call
                  </button>
                )}
                <button className="btn btn-primary" onClick={() => handleOpenPrescriptionModal(appt.id)}>
                  <Icons.Pill width="16" height="16" /> Write Prescription
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-container">
          <div className="empty-icon"><Icons.Calendar width="32" height="32" /></div>
          <div className="text-main font-semibold mb-1">No appointments scheduled</div>
          <div className="text-muted text-sm">Your upcoming confirmed consultations will appear here.</div>
        </div>
      )}

      {/* My Patients Summary */}
      <div style={{ marginTop: '48px', marginBottom: '20px' }}>
        <h2 className="text-main font-bold" style={{ fontSize: '18px', marginBottom: '4px' }}>👥 My Patients</h2>
      </div>
      
      {myPatients.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {myPatients.map((patient, idx) => (
            <div key={idx} className="premium-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 0 }}>
               <div className="avatar-circle" style={{ width: '40px', height: '40px', background: '#F3F4F6', color: '#4B5563' }}>
                 <Icons.User />
               </div>
               <div>
                 <h4 className="text-main font-bold text-sm mb-1">{patient.name}</h4>
                 <div className="text-muted" style={{ fontSize: '12px' }}>Last consult: {patient.lastConsultation}</div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-container">
          <div className="empty-icon"><Icons.Users width="32" height="32" /></div>
          <div className="text-main font-semibold mb-1">No patients yet</div>
          <div className="text-muted text-sm">Patients you consult will appear here.</div>
        </div>
      )}

    </div>
  );

  // -------------------------------------------------------------
  // Render: Settings View
  // -------------------------------------------------------------
  const renderSettings = () => (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 className="text-main font-bold" style={{ fontSize: '24px', marginBottom: '4px' }}>Profile & Settings</h2>
          <p className="text-muted text-sm">Manage your professional identity and security.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => setActiveTab('dashboard')}>← Back to Dashboard</button>
      </div>

      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        
        {/* Professional Profile */}
        <div className="premium-card">
          <h3 className="font-semibold text-base" style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.User /> Professional Profile
          </h3>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
            <div className="avatar-circle" style={{ width: '80px', height: '80px', fontSize: '28px' }}>
              {doctorName.charAt(0)}
            </div>
            <div>
              <h4 className="text-main font-bold" style={{ fontSize: '18px', marginBottom: '4px' }}>Dr. {doctorName}</h4>
              <p className="text-muted text-sm mb-1">{doctorSpecialization}</p>
              <p className="text-muted text-sm">{doctorHospital}</p>
            </div>
          </div>
          <div className="text-muted text-sm" style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px', border: '1px dashed var(--color-border)' }}>
            Profile editing functionality is coming soon.
          </div>
        </div>

        {/* Security & Password */}
        <div className="premium-card">
          <h3 className="font-semibold text-base" style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.Shield /> Security
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h4 className="text-main font-semibold text-sm mb-1">Account Password</h4>
              <p className="text-muted text-sm">Update your login password securely.</p>
            </div>
            <button className="btn btn-secondary" onClick={() => { setShowChangePw(true); setChangePwError(''); }}>
              Change Password
            </button>
          </div>
        </div>

        {/* Location Preferences */}
        <div className="premium-card">
          <h3 className="font-semibold text-base" style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.Location /> Location Settings
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 className="text-main font-semibold text-sm mb-1">Practice Location</h4>
              <p className="text-muted text-sm">
                {doctorCoords ? `Active (${doctorCoords.latitude.toFixed(4)}, ${doctorCoords.longitude.toFixed(4)})` : 'Not set'}
              </p>
            </div>
            <button className="btn btn-secondary" onClick={handleLocationUpdate}>
              {doctorCoords ? 'Update Location' : 'Set Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="workspace-layout">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(2px)', zIndex: 40 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        <div className="brand-header">
          <div className="brand-logo"><Icons.Stethoscope /> JeevanJyoti</div>
          <div className="brand-sub">Rural Healthcare</div>
        </div>

        <div className="doctor-identity">
          <div className="avatar-circle">{doctorName.charAt(0)}</div>
          <div style={{ overflow: 'hidden' }}>
            <div className="text-main font-bold text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dr. {doctorName}</div>
            <div className="text-muted" style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doctorSpecialization}</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '24px' }}>
          <div className="nav-section">
            <div className="nav-heading">Main</div>
            <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}>
              <Icons.Home /> Dashboard
            </button>
            <button className="nav-item disabled" title="Coming soon">
              <Icons.Calendar /> Appointments
            </button>
            <button className="nav-item disabled" title="Coming soon">
              <Icons.Users /> My Patients
            </button>
          </div>

          <div className="nav-section">
            <div className="nav-heading">Clinical</div>
            <button className="nav-item disabled" title="Coming soon">
              <Icons.Stethoscope /> Consultations
            </button>
            <button className="nav-item disabled" title="Coming soon">
              <Icons.Pill /> Prescriptions
            </button>
            <button className="nav-item disabled" title="Coming soon">
              <Icons.Clipboard /> Medical Records
            </button>
          </div>
          
          <div className="nav-section">
            <div className="nav-heading">Workspace</div>
            <div className="nav-item" style={{ cursor: 'default' }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span className={`status-dot ${isAvailable ? 'active' : 'inactive'}`}></span> Availability</span>
                 <button onClick={handleToggleAvailability} disabled={togglingAvailability} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-brand)', fontWeight: '600', fontSize: '12px' }}>
                   {isAvailable ? 'Toggle' : 'Toggle'}
                 </button>
               </div>
            </div>
            <div className="nav-item" style={{ cursor: 'default' }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icons.Location /> Location</span>
                 <button onClick={handleLocationUpdate} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-brand)', fontWeight: '600', fontSize: '12px' }}>
                   {doctorCoords ? 'Update' : 'Set'}
                 </button>
               </div>
            </div>
          </div>
        </div>

        <div className="nav-section" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
          <div className="nav-heading">Account</div>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}>
            <Icons.Settings /> Profile & Settings
          </button>
          <button className="nav-item" onClick={handleLogout} style={{ color: 'var(--color-danger)' }}>
            <Icons.Logout /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-area">
        
        {/* Medical Ambient Background */}
        <HealthcareAmbientBackground />

        {/* Top Header */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Icons.Menu />
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
                {activeTab === 'settings' ? <Icons.Settings /> : <Icons.Stethoscope />}
                <h1 style={{ color: '#0F172A', fontSize: '19px', fontWeight: '700', margin: 0, lineHeight: '1.2' }}>
                  {activeTab === 'settings' ? 'Settings' : 'Doctor Dashboard'}
                </h1>
              </div>
              <p style={{ color: '#64748B', fontSize: '13px', margin: 0, marginTop: '4px', lineHeight: '1.2' }}>
                Your healthcare workspace
              </p>
            </div>
          </div>
          
          <div className="topbar-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button className="icon-button hide-mobile" title="Notifications (Coming Soon)">
                <div style={{ color: '#64748B' }}><Icons.Bell /></div>
              </button>

              <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'right' }}>
                <div style={{ color: '#0F172A', fontSize: '15px', fontWeight: '700', lineHeight: '1.2' }}>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ color: '#64748B', fontSize: '11px', lineHeight: '1.2', marginTop: '2px' }}>
                  {currentTime.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>
            
            <div className="hide-mobile" style={{ width: '1px', height: '32px', backgroundColor: '#E5E7EB', marginLeft: '4px', marginRight: '4px' }}></div>
            
            <div style={{ position: 'relative' }}>
              <div className="profile-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="hide-mobile" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: '4px' }}>
                  <div style={{ color: '#0F172A', fontSize: '14px', fontWeight: '700', lineHeight: '1.2' }}>Dr. {doctorName}</div>
                  <div style={{ color: '#64748B', fontSize: '12px', lineHeight: '1.2' }}>{doctorSpecialization}</div>
                </div>
                <div className="avatar-circle" style={{ width: '40px', height: '40px', fontSize: '15px' }}>
                  {doctorName.charAt(0)}
                </div>
                <div style={{ color: '#94A3B8', display: 'flex', alignItems: 'center' }}><Icons.ChevronDown /></div>
              </div>
              
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div style={{ padding: '8px 16px', marginBottom: '4px' }} className="hide-desktop">
                    <div className="text-main font-bold text-sm">Dr. {doctorName}</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>{doctorSpecialization}</div>
                  </div>
                  <div className="dropdown-divider hide-desktop"></div>
                  <div className="dropdown-item" onClick={() => { setActiveTab('settings'); setIsDropdownOpen(false); }}>
                    <Icons.User /> View Profile
                  </div>
                  <div className="dropdown-item" onClick={() => { setActiveTab('settings'); setIsDropdownOpen(false); }}>
                    <Icons.Settings /> Profile & Settings
                  </div>
                  <div className="dropdown-item" onClick={() => { setShowChangePw(true); setIsDropdownOpen(false); }}>
                    <Icons.Shield /> Change Password
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={handleLogout} style={{ color: 'var(--color-danger)' }}>
                    <Icons.Logout /> Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        {activeTab === 'dashboard' ? renderDashboard() : renderSettings()}

      </main>

      {/* -------------------------------------------------------------
          Modals
          ------------------------------------------------------------- */}
      
      {/* Change Password Modal */}
      {showChangePw && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="text-main font-bold" style={{ fontSize: '20px' }}>🔐 Change Password</h2>
              <button className="icon-button" onClick={() => setShowChangePw(false)}><Icons.X /></button>
            </div>
            
            {changePwError && (
              <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #FECACA' }}>
                {changePwError}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              {[{ label: 'Current Password', field: 'currentPassword', show: showCurrent, toggle: () => setShowCurrent(v => !v) },
                { label: 'New Password', field: 'newPassword', show: showNew, toggle: () => setShowNew(v => !v) },
                { label: 'Confirm New Password', field: 'confirmPassword', show: showConfirm, toggle: () => setShowConfirm(v => !v) }]
                .map(({ label, field, show, toggle }) => (
                  <div key={field} style={{ marginBottom: '20px' }}>
                    <label className="form-label">{label}</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={show ? 'text' : 'password'}
                        value={changePwForm[field]}
                        onChange={(e) => setChangePwForm(prev => ({ ...prev, [field]: e.target.value }))}
                        required
                        className="form-input"
                      />
                      <button type="button" onClick={toggle} tabIndex={-1} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                        {show ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                ))}
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="submit" className="btn btn-primary" disabled={changePwLoading} style={{ flex: 1, height: '48px' }}>
                  {changePwLoading ? 'Saving...' : 'Update Password'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowChangePw(false)} style={{ flex: 1, height: '48px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="text-main font-bold" style={{ fontSize: '20px', marginBottom: '24px' }}>📅 Schedule Consultation</h2>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Select Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="form-input"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => handleStatusUpdate(selectedApptId, 'confirmed', scheduledTime)} 
                disabled={!scheduledTime} 
                style={{ flex: 1, height: '48px' }}
              >
                Confirm Time
              </button>
              <button className="btn btn-secondary" onClick={() => { setShowScheduleModal(false); setSelectedApptId(null); setScheduledTime(''); }} style={{ flex: 1, height: '48px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '600px' }}>
            <h2 className="text-main font-bold" style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icons.Pill /> Write Prescription
            </h2>
            <form onSubmit={handleSubmitPrescription}>
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Medicines</label>
                <textarea
                  value={prescriptionForm.medicines}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicines: e.target.value })}
                  placeholder="E.g., Paracetamol 500mg, twice a day..."
                  required
                  className="form-input"
                  style={{ minHeight: '100px', padding: '12px 16px', resize: 'vertical' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Doctor Notes / Advice</label>
                <textarea
                  value={prescriptionForm.notes}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                  placeholder="E.g., Drink plenty of water, rest for 2 days..."
                  className="form-input"
                  style={{ minHeight: '100px', padding: '12px 16px', resize: 'vertical' }}
                />
              </div>
              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px', border: '1px dashed var(--color-border)', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                  <Icons.Clipboard /> <span>Upload Handwritten Prescription (Optional)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setPrescriptionForm({ ...prescriptionForm, image: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {prescriptionForm.image && (
                  <div style={{ marginTop: '16px', position: 'relative', display: 'inline-block' }}>
                    <img src={prescriptionForm.image} alt="Prescription" style={{ height: '100px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                    <button type="button" onClick={() => setPrescriptionForm({ ...prescriptionForm, image: '' })} style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--color-danger)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.X width="14" height="14" /></button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="submit" className="btn btn-primary" disabled={submittingPrescription} style={{ flex: 1, height: '48px' }}>
                  {submittingPrescription ? 'Saving...' : 'Save Prescription'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPrescriptionModal(false)} style={{ flex: 1, height: '48px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard;
