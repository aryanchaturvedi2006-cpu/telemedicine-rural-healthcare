import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AarogyaModal from '../components/common/AarogyaModal';
import './Landing.css';
import logo from '../assets/logo.png';

const Landing = () => {
  const { t, setLanguage, language } = useLanguage();
  const [isAarogyaModalOpen, setIsAarogyaModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    setLanguage('');
    navigate('/');
  };

  const getSosTranslation = () => {
    const sosTranslations = {
      en: { title: "Emergency SOS", desc: "Get urgent help — one tap away" },
      hi: { title: "आपातकालीन सहायता", desc: "तुरंत मदद पाएं — एक टैप में" },
      mrw: { title: "एमरजेंसी मदद", desc: "तुरत मदद लेओ — एक टैप में" },
      gu: { title: "ઇમરજન્સી SOS", desc: "તાત્કાલિક મદદ મેળવો — એક ટેપમાં" },
      mr: { title: "आपत्कालीन मदत", desc: "त्वरित मदत मिळवा — एका टॅपमध्ये" },
      ta: { title: "அவசர உதவி", desc: "உடனடி உதவி பெறுங்கள் — ஒரு தட்டலில்" },
      te: { title: "అత్యవసర సహాయం", desc: "తక్షణ సహాయం పొందండి — ఒక్క నొక్కుతో" },
      pa: { title: "ਐਮਰਜੈਂਸੀ ਮਦਦ", desc: "ਤੁਰੰਤ ਮਦਦ ਲਓ — ਇੱਕ ਟੈਪ ਵਿੱਚ" },
      bn: { title: "জরুরি সাহায্য", desc: "তাৎক্ষণিক সাহায্য নিন — এক ট্যাপে" },
      kn: { title: "ತುರ್ತು ಸಹಾಯ", desc: "ತಕ್ಷಣ ಸಹಾಯ ಪಡೆಯಿರಿ — ಒಂದು ಟ್ಯಾಪ್ನಲ್ಲಿ" },
      ml: { title: "അടിയന്തിര സഹായം", desc: "ഉടനടി സഹായം നേടൂ — ഒറ്റ ടാപ്പിൽ" },
      as: { title: "জৰুৰীকালীন সহায়", desc: "তৎক্ষণাত সহায় লওক — এক টেপতে" }
    };
    return sosTranslations[language] || sosTranslations.en;
  };
  const sosData = getSosTranslation();

  const getGovtSchemesTranslation = () => {
    const schemeTranslations = {
      en: { title: "Govt Health Schemes", desc: "Free treatment up to ₹5 lakh — check eligibility" },
      hi: { title: "सरकारी स्वास्थ्य योजनाएं", desc: "₹5 लाख तक मुफ्त इलाज — पात्रता जांचें" },
      mrw: { title: "सरकारी सेहत योजना", desc: "₹5 लाख तक मुफत इलाज — पात्रता देखो" },
      gu: { title: "સરકારી આરોગ્ય યોજનાઓ", desc: "₹5 લાખ સુધી મફત સારવાર — પાત્રતા તપાસો" },
      mr: { title: "सरकारी आरोग्य योजना", desc: "₹5 लाख पर्यंत मोफत उपचार — पात्रता तपासा" },
      ta: { title: "அரசு சுகாதார திட்டங்கள்", desc: "₹5 லட்சம் வரை இலவச சிகிச்சை — தகுதியை சரிபார்க்கவும்" },
      te: { title: "ప్రభుత్వ ఆరోగ్య పథకాలు", desc: "₹5 లక్షల వరకు ఉచిత చికిత్స — అర్హత తనిఖీ చేయండి" },
      pa: { title: "ਸਰਕਾਰੀ ਸਿਹਤ ਯੋਜਨਾਵਾਂ", desc: "₹5 ਲੱਖ ਤੱਕ ਮੁਫ਼ਤ ਇਲਾਜ — ਯੋਗਤਾ ਜਾਂਚੋ" },
      bn: { title: "সরকারি স্বাস্থ্য প্রকল্প", desc: "₹৫ লক্ষ পর্যন্ত বিনামূল্যে চিকিৎসা — যোগ্যতা যাচাই করুন" },
      kn: { title: "ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಯೋಜನೆಗಳು", desc: "₹5 ಲಕ್ಷದವರೆಗೆ ಉಚಿತ ಚಿಕಿತ್ಸೆ — ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ" },
      ml: { title: "സർക്കാർ ആരോഗ്യ പദ്ധതികൾ", desc: "₹5 ലക്ഷം വരെ സൗജന്യ ചികിത്സ — യോഗ്യത പരിശോധിക്കുക" },
      as: { title: "চৰকাৰী স্বাস্থ্য আঁচনি", desc: "₹৫ লাখলৈকে বিনামূলীয়া চিকিৎসা — যোগ্যতা পৰীক্ষা কৰক" }
    };
    return schemeTranslations[language] || schemeTranslations.en;
  };
  const schemeData = getGovtSchemesTranslation();

  return (
    <div className="landing-container">
      <div className="landing-header-top">
        <button className="btn-change-language" onClick={handleBack}>
          ← {t('changeLanguage')}
        </button>
      </div>

      <div className="landing-header-main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          display: 'inline-block',
          marginBottom: '8px',
          lineHeight: 0
        }}>
          <img src={logo} alt="JeevanJyoti Logo" style={{
            height: '100px',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            mixBlendMode: 'multiply'
          }} />
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '6px' }}>
          <h1 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '36px',
            fontWeight: 700,
            color: '#1B5E20',
            margin: '0 0 4px 0',
            letterSpacing: '0.5px',
            lineHeight: 1.1
          }}>
            JeevanJyoti
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '4px'
          }}>
            <span style={{
              display: 'inline-block',
              width: '28px',
              height: '1.5px',
              background: '#F59E0B'
            }}></span>
            <span style={{
              fontSize: '11px',
              color: '#F59E0B',
              letterSpacing: '3px',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontFamily: 'system-ui, Arial, sans-serif'
            }}>RURAL HEALTHCARE</span>
            <span style={{
              display: 'inline-block',
              width: '28px',
              height: '1.5px',
              background: '#F59E0B'
            }}></span>
          </div>
          <p style={{
            fontSize: '14px',
            color: '#555',
            marginTop: '10px',
            fontFamily: 'system-ui, Arial, sans-serif'
          }}>Quality Healthcare, Anywhere in India</p>
        </div>
      </div>

      <div className="landing-grid">
        <button 
          className="landing-card primary-card" 
          onClick={() => navigate('/patient-welcome')}
        >
          <div className="card-icon">🩺</div>
          <h2 className="card-title">{t('talkToDoctor')}</h2>
          <p className="card-desc">Get instant medical advice from verified doctors</p>
        </button>

        <button 
          className="landing-card doctor-card" 
          onClick={() => navigate('/doctor-login')}
        >
          <div className="card-icon">👨‍⚕️</div>
          <h2 className="card-title">{t('iAmDoctor')}</h2>
          <p className="card-desc">Join our network and help rural patients</p>
        </button>

        <button 
          className="landing-card secondary-card" 
          onClick={() => navigate('/emergency-sos')}
        >
          <div className="card-icon" style={{ color: '#C62828' }}>🚨</div>
          <h2 className="card-title" style={{ color: '#C62828' }}>{sosData.title}</h2>
          <p className="card-desc">{sosData.desc}</p>
        </button>

        <button 
          className="landing-card secondary-card" 
          onClick={() => navigate('/govt-schemes')}
        >
          <div className="card-icon" style={{ color: '#00695C' }}>🏥</div>
          <h2 className="card-title" style={{ color: '#00695C' }}>{schemeData.title}</h2>
          <p className="card-desc">{schemeData.desc}</p>
        </button>
      </div>

      {/* Aarogya AI Chat Section */}
      <style>{`
        @keyframes aarogyaPulse {
          0% { box-shadow: 0 4px 20px rgba(46, 125, 50, 0.35); }
          50% { box-shadow: 0 4px 28px rgba(46, 125, 50, 0.55); }
          100% { box-shadow: 0 4px 20px rgba(46, 125, 50, 0.35); }
        }
      `}</style>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        boxSizing: 'border-box',
        marginTop: '40px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1.5px solid #C8E6C9',
        padding: '28px 28px',
        animation: 'aarogyaPulse 2s ease-in-out infinite'
      }}>
        {/* Row 1 — Badge + Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            background: '#E8F5E9',
            color: '#2E7D32',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            borderRadius: '20px',
            padding: '4px 14px',
            textTransform: 'uppercase'
          }}>
            {t('freeService')}
          </span>
          
          <button
            onClick={() => setIsAarogyaModalOpen(true)}
            onMouseOver={(e) => (e.currentTarget.style.background = '#1B5E20')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#2E7D32')}
            style={{
              background: '#2E7D32',
              color: 'white',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            {t('chatNow')} &rarr;
          </button>
        </div>

        {/* Row 2 — Headline */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#1A1A1A',
          marginTop: '14px',
          marginBottom: '6px'
        }}>
          {t('aarogyaBannerTitle')}
        </h3>

        {/* Row 3 — Sub text */}
        <p style={{
          fontSize: '13px',
          color: '#555555',
          marginBottom: '16px',
          marginTop: '0'
        }}>
          {t('aarogyaBannerSubtitle')}
        </p>

        {/* Row 4 — 3 chips in a row */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            background: '#F1F8F1',
            color: '#2E7D32',
            border: '1px solid #C8E6C9',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 500
          }}>
            🌿 Aarogya AI
          </span>
          <span style={{
            background: '#F1F8F1',
            color: '#2E7D32',
            border: '1px solid #C8E6C9',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 500
          }}>
            ⚡ Instant Reply
          </span>
          <span style={{
            background: '#F1F8F1',
            color: '#2E7D32',
            border: '1px solid #C8E6C9',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 500
          }}>
            🔒 Confidential
          </span>
        </div>
      </div>

      {isAarogyaModalOpen && <AarogyaModal onClose={() => setIsAarogyaModalOpen(false)} />}
    </div>
  );
};

export default Landing;
