import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PatientLogin = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const [formData, setFormData] = useState({ name: '', mobile: '', pin: '' });
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Auto-fill Remembered Login
  const [staySignedIn, setStaySignedIn] = useState(true);
  
  // Forgot PIN Flow
  const [showForgotPin, setShowForgotPin] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetMobile, setResetMobile] = useState('');
  const [foundPatient, setFoundPatient] = useState(null);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  useEffect(() => {
    try {
      const remembered = JSON.parse(localStorage.getItem('rememberedLogin'));
      if (remembered) {
        setFormData(prev => ({ ...prev, name: remembered.name, mobile: remembered.mobile }));
      }
    } catch (e) { 
      // ignore, no saved login 
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    setError('');
    setIsLoggingIn(true);
    
    // Simulate network delay for realistic experience
    setTimeout(() => {
      try {
        const allPatients = JSON.parse(localStorage.getItem('patients') || '[]');
        const match = allPatients.find(p => 
          p.name && p.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
          p.mobile === formData.mobile &&
          p.pin === formData.pin
        );

        if (match) {
          if (staySignedIn) {
            localStorage.setItem('rememberedLogin', JSON.stringify({ 
              name: formData.name, mobile: formData.mobile 
            }));
          } else {
            localStorage.removeItem('rememberedLogin');
          }
          localStorage.setItem('currentPatient', JSON.stringify(match));
          navigate('/patient-dashboard');
        } else {
          setError(t('userNotFoundError') || "⚠️ Details don't match our records. Please check your name, mobile number and PIN, or create a new account.");
          setIsLoggingIn(false);
        }
      } catch (e) {
        console.error(e);
        setError(t('userNotFoundError') || "⚠️ Details don't match our records. Please check your name, mobile number and PIN, or create a new account.");
        setIsLoggingIn(false);
      }
    }, 800);
  };

  // Forgot PIN Handlers
  const handleVerifyMobile = () => {
    setError('');
    try {
      const allPatients = JSON.parse(localStorage.getItem('patients') || '[]');
      const found = allPatients.find(p => p.mobile === resetMobile);
      if (found) {
        setFoundPatient(found);
        setResetStep(2);
      } else {
        setError("⚠️ No account found with this mobile number.");
      }
    } catch (e) {
      setError("⚠️ An error occurred. Please try again.");
    }
  };

  const handleResetPin = () => {
    setError('');
    if (newPin.length !== 4) {
      setError("⚠️ PIN must be 4 digits");
      return;
    }
    if (newPin !== confirmNewPin) {
      setError("⚠️ PINs do not match");
      return;
    }
    try {
      const allPatients = JSON.parse(localStorage.getItem('patients') || '[]');
      const updated = allPatients.map(p => 
        p.mobile === foundPatient.mobile ? { ...p, pin: newPin } : p
      );
      localStorage.setItem('patients', JSON.stringify(updated));
      setResetStep(3);
    } catch (e) {
      setError("⚠️ An error occurred while saving. Please try again.");
    }
  };

  const resetForgotPinFlow = () => {
    setShowForgotPin(false);
    setResetStep(1);
    setResetMobile('');
    setNewPin('');
    setConfirmNewPin('');
    setError('');
  };

  const ErrorMessage = ({ msg }) => (
    <div style={{
      background: '#FEF2F2', borderLeft: '4px solid #EF4444', color: '#B91C1C',
      padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginTop: '12px',
      display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      {msg}
    </div>
  );

  // Icons
  const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
  );
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  );
  const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
  );
  const LoaderIcon = () => (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
  );

  return (
    <div style={{ background: '#F7FBF7', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .login-input {
          width: 100%; height: 48px; border-radius: 10px; border: 1.5px solid #D1D5DB;
          padding: 0 16px; font-size: 15px; outline: none; box-sizing: border-box;
          background: #F9FAFB; transition: all 0.2s ease;
        }
        .login-input:focus { border-color: #2E7D32; background: #FFFFFF; box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1); }
        .input-label { display: block; font-size: 13px; margin-bottom: 6px; color: #374151; font-weight: 600; }
        
        /* Dotted pattern only for lower section */
        .dotted-bg {
          position: absolute; bottom: 0; left: 0; right: 0; height: 40vh;
          background-image: radial-gradient(#2E7D32 1px, transparent 1px);
          background-size: 24px 24px; opacity: 0.15; z-index: 0; pointer-events: none;
        }
      `}</style>
      
      {/* 1. Small Green Header Strip */}
      <div style={{ background: '#2E7D32', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <button onClick={() => navigate('/patient-welcome')} style={{ color: 'white', background: 'none', border: 'none', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', padding: '8px 0' }}>
          ← {t('back') || 'Back'}
        </button>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', overflow: 'hidden' }}>
          <button onClick={() => setLanguage('en')} style={{ padding: '4px 10px', border: 'none', background: language === 'en' || !language ? 'white' : 'transparent', color: language === 'en' || !language ? '#2E7D32' : 'white', fontSize: '11px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <GlobeIcon /> EN
          </button>
          <button onClick={() => setLanguage('hi')} style={{ padding: '4px 10px', border: 'none', background: language === 'hi' ? 'white' : 'transparent', color: language === 'hi' ? '#2E7D32' : 'white', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
            हिन्दी
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
        <div className="dotted-bg"></div>

        {/* 2. Login Card */}
        <div style={{
          width: '100%', maxWidth: '420px', backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)', padding: '32px 28px', zIndex: 5,
          animation: 'fadeIn 0.5s ease forwards'
        }}>
          {/* Logo & Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌿</div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>JeevanJyoti Patient Login</h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0' }}>Access your secure health records and consults.</p>
          </div>

          {showForgotPin ? (
            /* Forgot PIN Flow */
            <div>
              <div onClick={resetForgotPinFlow} style={{ fontSize: '13px', color: '#4B5563', cursor: 'pointer', marginBottom: '20px', fontWeight: '600' }}>← Back to Login</div>
              
              {resetStep === 1 && (
                <>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>Reset PIN</h2>
                  <p style={{ fontSize: '13px', color: '#4B5563', margin: '0 0 20px 0' }}>Enter registered mobile number.</p>
                  <div style={{ marginBottom: '20px' }}>
                    <label className="input-label">Mobile Number</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontWeight: '600', fontSize: '15px' }}>+91</div>
                      <input type="tel" maxLength={10} value={resetMobile} onChange={(e) => setResetMobile(e.target.value)} className="login-input" style={{ paddingLeft: '48px' }} />
                    </div>
                  </div>
                  <button onClick={handleVerifyMobile} style={{ width: '100%', height: '48px', backgroundColor: '#2E7D32', color: 'white', fontSize: '15px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>Verify Mobile</button>
                  {error && <ErrorMessage msg={error} />}
                </>
              )}

              {resetStep === 2 && (
                <>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>New PIN</h2>
                  <p style={{ fontSize: '13px', color: '#4B5563', margin: '0 0 20px 0' }}>Hi {foundPatient?.name}, set a new 4-digit PIN.</p>
                  <div style={{ marginBottom: '16px' }}>
                    <label className="input-label">New PIN</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><KeyIcon /></div>
                      <input type={showNewPin ? 'text' : 'password'} inputMode="numeric" maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value)} className="login-input" style={{ paddingLeft: '44px', paddingRight: '48px', letterSpacing: showNewPin ? 'normal' : '4px', fontSize: showNewPin ? '15px' : '18px' }} />
                      <button type="button" onClick={() => setShowNewPin(!showNewPin)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#6B7280' }}>{showNewPin ? '🙈' : '👁️'}</button>
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label className="input-label">Confirm PIN</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><KeyIcon /></div>
                      <input type={showConfirmPin ? 'text' : 'password'} inputMode="numeric" maxLength={4} value={confirmNewPin} onChange={(e) => setConfirmNewPin(e.target.value)} className="login-input" style={{ paddingLeft: '44px', paddingRight: '48px', letterSpacing: showConfirmPin ? 'normal' : '4px', fontSize: showConfirmPin ? '15px' : '18px' }} />
                      <button type="button" onClick={() => setShowConfirmPin(!showConfirmPin)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#6B7280' }}>{showConfirmPin ? '🙈' : '👁️'}</button>
                    </div>
                  </div>
                  <button onClick={handleResetPin} style={{ width: '100%', height: '48px', backgroundColor: '#2E7D32', color: 'white', fontSize: '15px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>Save PIN</button>
                  {error && <ErrorMessage msg={error} />}
                </>
              )}

              {resetStep === 3 && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '32px', color: '#16A34A', marginBottom: '12px' }}>✅</div>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>Success!</h2>
                  <p style={{ fontSize: '13px', color: '#4B5563', margin: '0 0 24px 0' }}>Your PIN was reset securely.</p>
                  <button onClick={resetForgotPinFlow} style={{ width: '100%', height: '48px', backgroundColor: '#2E7D32', color: 'white', fontSize: '15px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>Login Now</button>
                </div>
              )}
            </div>
          ) : (
            /* Login Form */
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label className="input-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><UserIcon /></div>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="login-input" style={{ paddingLeft: '44px' }} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="input-label">Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontWeight: '600', fontSize: '15px' }}>+91</div>
                  <input type="tel" name="mobile" maxLength={10} value={formData.mobile} onChange={handleChange} className="login-input" style={{ paddingLeft: '48px' }} />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="input-label">4-Digit PIN</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><KeyIcon /></div>
                  <input type={showPin ? 'text' : 'password'} inputMode="numeric" name="pin" maxLength={4} value={formData.pin} onChange={handleChange} className="login-input" style={{ paddingLeft: '44px', paddingRight: '48px', letterSpacing: showPin ? 'normal' : '4px', fontSize: showPin ? '15px' : '18px' }} />
                  <button type="button" onClick={() => setShowPin(!showPin)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#6B7280' }} tabIndex={-1}>
                    {showPin ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}>
                  <input type="checkbox" checked={staySignedIn} onChange={() => setStaySignedIn(!staySignedIn)} style={{ width: '16px', height: '16px', accentColor: '#2E7D32' }} />
                  <span style={{ fontSize: '13px', color: '#4B5563', fontWeight: '500' }}>Stay Signed In</span>
                </label>
                <span onClick={() => { setShowForgotPin(true); setResetStep(1); setError(''); }} style={{ fontSize: '13px', color: '#2E7D32', cursor: 'pointer', fontWeight: '600' }}>
                  Forgot PIN?
                </span>
              </div>

              <button onClick={handleLogin} disabled={isLoggingIn} style={{ width: '100%', height: '48px', backgroundColor: '#2E7D32', color: 'white', fontSize: '15px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: isLoggingIn ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isLoggingIn ? 0.9 : 1, transition: 'all 0.2s', marginBottom: '12px' }}>
                {isLoggingIn ? <><LoaderIcon /> Securely signing in...</> : 'Login'}
              </button>
              
              <button onClick={() => navigate('/patient-registration')} style={{ width: '100%', height: '48px', background: 'white', border: '1.5px solid #E5E7EB', borderRadius: '10px', color: '#4B5563', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.borderColor = '#2E7D32'; e.target.style.color = '#2E7D32'; }} onMouseOut={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.color = '#4B5563'; }}>
                Create Account
              </button>

              {error && <ErrorMessage msg={error} />}
            </div>
          )}
        </div>

        {/* 3. Simple Contact Us Section */}
        <div style={{ marginTop: '24px', zIndex: 5, textAlign: 'center', color: '#6B7280', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px' }}>📞</span> <strong>Support:</strong> 1800-111-222 (Toll Free)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>🔒</span> 100% secure platform for rural healthcare.
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientLogin;
