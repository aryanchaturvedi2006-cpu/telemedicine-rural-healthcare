import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const PatientLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot PIN flow
  const [showForgotPin, setShowForgotPin] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetMobile, setResetMobile] = useState('');
  const [foundPatient, setFoundPatient] = useState(null);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (mobile.length !== 10) {
      setError('⚠️ Please enter a valid 10-digit mobile number.');
      return;
    }
    if (pin.length !== 4) {
      setError('⚠️ Please enter your 4-digit PIN.');
      return;
    }
    setIsLoading(true);
    try {
      const q = query(collection(db, 'patients'), where('mobile', '==', mobile));
      const snap = await getDocs(q);

      if (snap.empty) {
        setError("⚠️ No account found with this number. Please create an account.");
        setIsLoading(false);
        return;
      }

      const patientDoc = snap.docs[0];
      const patientData = { id: patientDoc.id, ...patientDoc.data() };

      if (patientData.pin !== pin) {
        setError("⚠️ Incorrect PIN. Please try again.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem('currentPatient', JSON.stringify(patientData));
      login(patientData);
      navigate('/patient-dashboard');
    } catch (e) {
      console.error(e);
      setError("⚠️ Something went wrong. Please try again.");
    }
    setIsLoading(false);
  };

  // Forgot PIN handlers
  const handleVerifyMobile = async () => {
    setError('');
    if (resetMobile.length !== 10) {
      setError('⚠️ Please enter a valid 10-digit mobile number.');
      return;
    }
    try {
      const q = query(collection(db, 'patients'), where('mobile', '==', resetMobile));
      const snap = await getDocs(q);
      if (snap.empty) {
        setError("⚠️ No account found with this mobile number.");
        return;
      }
      const patientDoc = snap.docs[0];
      setFoundPatient({ id: patientDoc.id, ...patientDoc.data() });
      setResetStep(2);
    } catch (e) {
      setError("⚠️ An error occurred. Please try again.");
    }
  };

  const handleResetPin = async () => {
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
      await updateDoc(doc(db, 'patients', foundPatient.id), { pin: newPin });
      setResetStep(3);
    } catch (e) {
      setError("⚠️ An error occurred while saving. Please try again.");
    }
  };

  const resetForgotPinFlow = () => {
    setShowForgotPin(false);
    setResetStep(1);
    setResetMobile('');
    setFoundPatient(null);
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

  const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
  );
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
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
        .dotted-bg {
          position: absolute; bottom: 0; left: 0; right: 0; height: 40vh;
          background-image: radial-gradient(#2E7D32 1px, transparent 1px);
          background-size: 24px 24px; opacity: 0.15; z-index: 0; pointer-events: none;
        }
      `}</style>

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

      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
        <div className="dotted-bg"></div>

        <div style={{
          width: '100%', maxWidth: '420px', backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)', padding: '32px 28px', zIndex: 5,
          animation: 'fadeIn 0.5s ease forwards'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌿</div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>JeevanJyoti Patient Login</h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0' }}>Access your secure health records and consults.</p>
          </div>

          {showForgotPin ? (
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
                      <input type="tel" maxLength={10} value={resetMobile} onChange={(e) => setResetMobile(e.target.value.replace(/\D/g, ''))} className="login-input" style={{ paddingLeft: '48px' }} />
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
                      <input type={showNewPin ? 'text' : 'password'} inputMode="numeric" maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))} className="login-input" style={{ paddingLeft: '44px', paddingRight: '48px', letterSpacing: showNewPin ? 'normal' : '4px', fontSize: showNewPin ? '15px' : '18px' }} />
                      <button type="button" onClick={() => setShowNewPin(!showNewPin)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#6B7280' }}>{showNewPin ? '🙈' : '👁️'}</button>
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label className="input-label">Confirm PIN</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><KeyIcon /></div>
                      <input type={showConfirmPin ? 'text' : 'password'} inputMode="numeric" maxLength={4} value={confirmNewPin} onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ''))} className="login-input" style={{ paddingLeft: '44px', paddingRight: '48px', letterSpacing: showConfirmPin ? 'normal' : '4px', fontSize: showConfirmPin ? '15px' : '18px' }} />
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
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label className="input-label">Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><UserIcon /></div>
                  <div style={{ position: 'absolute', left: '44px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontWeight: '600', fontSize: '15px' }}>+91</div>
                  <input type="tel" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} className="login-input" style={{ paddingLeft: '80px' }} placeholder="9876543210" />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="input-label">4-Digit PIN</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><KeyIcon /></div>
                  <input type={showPin ? 'text' : 'password'} inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} className="login-input" style={{ paddingLeft: '44px', paddingRight: '48px', letterSpacing: showPin ? 'normal' : '4px', fontSize: showPin ? '15px' : '18px' }} />
                  <button type="button" onClick={() => setShowPin(!showPin)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#6B7280' }} tabIndex={-1}>
                    {showPin ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
                <span onClick={() => { setShowForgotPin(true); setResetStep(1); setError(''); }} style={{ fontSize: '13px', color: '#2E7D32', cursor: 'pointer', fontWeight: '600' }}>
                  Forgot PIN?
                </span>
              </div>

              <button onClick={handleLogin} disabled={isLoading} style={{ width: '100%', height: '48px', backgroundColor: '#2E7D32', color: 'white', fontSize: '15px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isLoading ? 0.9 : 1, transition: 'all 0.2s', marginBottom: '12px' }}>
                {isLoading ? <><LoaderIcon /> Logging in...</> : 'Login'}
              </button>

              <button onClick={() => navigate('/patient-registration')} style={{ width: '100%', height: '48px', background: 'white', border: '1.5px solid #E5E7EB', borderRadius: '10px', color: '#4B5563', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.borderColor = '#2E7D32'; e.target.style.color = '#2E7D32'; }} onMouseOut={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.color = '#4B5563'; }}>
                Create Account
              </button>

              {error && <ErrorMessage msg={error} />}
            </div>
          )}
        </div>

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