import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PatientWelcome = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const getGreeting = () => {
    switch (language) {
      case 'hi': return { greeting: "नमस्ते 🙏", tagline: "कभी भी, कहीं भी डॉक्टर से जुड़ें" };
      case 'mrw': return { greeting: "राम राम 🙏", tagline: "कदी भी, कठी भी डॉक्टर सूं जुड़ो" };
      case 'gu': return { greeting: "નમસ્તે 🙏", tagline: "ગમે ત્યારે, ગમે ત્યાં ડૉક્ટર સાથે જોડાઓ" };
      case 'mr': return { greeting: "नमस्कार 🙏", tagline: "कधीही, कुठेही डॉक्टरांशी संपर्क साधा" };
      case 'ta': return { greeting: "வணக்கம் 🙏", tagline: "எப்போது வேண்டுமானாலும், எங்கு வேண்டுமானாலும் மருத்துவரை அணுகுங்கள்" };
      case 'te': return { greeting: "నమస్కారం 🙏", tagline: "ఎప్పుడైనా, ఎక్కడైనా వైద్యులను సంప్రదించండి" };
      case 'pa': return { greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ 🙏", tagline: "ਕਿਸੇ ਵੀ ਸਮੇਂ, ਕਿਤੇ ਵੀ ਡਾਕਟਰ ਨਾਲ ਜੁੜੋ" };
      case 'bn': return { greeting: "নমস্কার 🙏", tagline: "যেকোনো সময়, যেকোনো জায়গা থেকে ডাক্তারের সাথে যোগাযোগ করুন" };
      case 'kn': return { greeting: "ನಮಸ್ಕಾರ 🙏", tagline: "ಯಾವಾಗ ಬೇಕಾದರೂ, ಎಲ್ಲಿ ಬೇಕಾದರೂ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ" };
      case 'ml': return { greeting: "നമസ്കാരം 🙏", tagline: "എപ്പോൾ വേണമെങ്കിലും, എവിടെ വേണമെങ്കിലും ഡോക്ടറുമായി ബന്ധപ്പെടുക" };
      case 'as': return { greeting: "নমস্কাৰ 🙏", tagline: "যিকোনো সময়ত, যিকোনো ঠাইৰ পৰা চিকিৎসকৰ সৈতে সংযোগ কৰক" };
      default: return { greeting: "Welcome 🙏", tagline: "Connect with verified doctors anytime, anywhere" };
    }
  };

  const { greeting, tagline } = getGreeting();

  return (
    <div style={{ background: '#F1F8F1', minHeight: '100vh', padding: '20px' }}>
      <button 
        onClick={() => navigate('/')}
        style={{
          color: '#2E7D32',
          background: 'none',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          padding: '10px',
          marginBottom: '20px'
        }}
      >
        ← Back
      </button>

      <div style={{
        maxWidth: '440px',
        margin: '0 auto',
        padding: '32px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E7D32', textAlign: 'center', margin: '0 0 8px 0' }}>
          {greeting}
        </h1>
        <p style={{ fontSize: '14px', color: '#555', textAlign: 'center', margin: '0 0 24px 0' }}>
          {tagline}
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #E0E0E0', marginBottom: '24px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => navigate('/patient-login')}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: '#2E7D32',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/patient-registration')}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: 'white',
              color: '#2E7D32',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '10px',
              border: '1.5px solid #2E7D32',
              cursor: 'pointer'
            }}
          >
            New user? Register now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientWelcome;
