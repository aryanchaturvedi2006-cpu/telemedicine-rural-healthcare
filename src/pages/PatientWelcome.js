import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PatientWelcome = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

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

  const getUiText = () => {
    const translations = {
      hi: { b1: "✅ सत्यापित डॉक्टर", b2: "🔒 सुरक्षित और निजी", b3: "⚡ तुरंत सहायता", continue: "आप कैसे आगे बढ़ना चाहेंगे?", orWithout: "या बिना लॉगिन के सहायता लें", aiDesc: "तुरंत स्वास्थ्य प्रश्न पूछें", priv: "🔒 आपका डेटा निजी है और कभी साझा नहीं किया जाता" },
      mr: { b1: "✅ सत्यापित डॉक्टर", b2: "🔒 खाजगी आणि सुरक्षित", b3: "⚡ त्वरित मदत", continue: "तुम्हाला पुढे कसे जायचे आहे?", orWithout: "किंवा लॉगिनशिवाय मदत मिळवा", aiDesc: "आरोग्याविषयी त्वरित प्रश्न विचारा", priv: "🔒 तुमचा डेटा खाजगी आहे आणि कधीही शेअर केला जात नाही" },
      gu: { b1: "✅ ચકાસાયેલ ડૉક્ટરો", b2: "🔒 ખાનગી અને સુરક્ષિત", b3: "⚡ ત્વરિત મદદ", continue: "તમે કેવી રીતે આગળ વધવા માંગો છો?", orWithout: "અથવા લોગિન વગર મદદ મેળવો", aiDesc: "તાત્કાલિક સ્વાસ્થ્ય પ્રશ્નો પૂછો", priv: "🔒 તમારો ડેટા ખાનગી છે અને ક્યારેય શેર થતો નથી" },
      ta: { b1: "✅ சரிபார்க்கப்பட்ட மருத்துவர்கள்", b2: "🔒 தனிப்பட்ட & பாதுகாப்பான", b3: "⚡ உடனடி உதவி", continue: "நீங்கள் எப்படி தொடர விரும்புகிறீர்கள்?", orWithout: "அல்லது உள்நுழையாமல் உதவி பெறவும்", aiDesc: "உடனடியாக சுகாதார கேள்விகளை கேளுங்கள்", priv: "🔒 உங்கள் தரவு தனிப்பட்டது மற்றும் பகிரப்படாது" },
      te: { b1: "✅ ధృవీకరించబడిన వైద్యులు", b2: "🔒 ప్రైవేట్ & సురక్షితమైన", b3: "⚡ తక్షణ సహాయం", continue: "మీరు ఎలా కొనసాగాలనుకుంటున్నారు?", orWithout: "లేదా లాగిన్ లేకుండా సహాయం పొందండి", aiDesc: "ఆరోగ్య ప్రశ్నలను తక్షణమే అడగండి", priv: "🔒 మీ డేటా ప్రైవేట్ మరియు ఎప్పటికీ భాగస్వామ్యం చేయబడదు" },
      pa: { b1: "✅ ਪ੍ਰਮਾਣਿਤ ਡਾਕਟਰ", b2: "🔒 ਨਿੱਜੀ ਅਤੇ ਸੁਰੱਖਿਅਤ", b3: "⚡ ਤੁਰੰਤ ਮਦਦ", continue: "ਤੁਸੀਂ ਕਿਵੇਂ ਜਾਰੀ ਰੱਖਣਾ ਚਾਹੋਗੇ?", orWithout: "ਜਾਂ ਬਿਨਾਂ ਲੌਗਇਨ ਕੀਤੇ ਮਦਦ ਪ੍ਰਾਪਤ ਕਰੋ", aiDesc: "ਤੁਰੰਤ ਸਿਹਤ ਸਵਾਲ ਪੁੱਛੋ", priv: "🔒 ਤੁਹਾਡਾ ਡਾਟਾ ਨਿੱਜੀ ਹੈ ਅਤੇ ਕਦੇ ਸਾਂਝਾ ਨਹੀਂ ਕੀਤਾ ਜਾਂਦਾ" },
      bn: { b1: "✅ যাচাইকৃত ডাক্তার", b2: "🔒 ব্যক্তিগত এবং সুরক্ষিত", b3: "⚡ তাৎক্ষণিক সাহায্য", continue: "আপনি কীভাবে চালিয়ে যেতে চান?", orWithout: "বা লগইন ছাড়াই সাহায্য পান", aiDesc: "তাৎক্ষণিকভাবে স্বাস্থ্য সম্পর্কিত প্রশ্ন করুন", priv: "🔒 আপনার ডেটা ব্যক্তিগত এবং কখনও শেয়ার করা হয় না" },
      kn: { b1: "✅ ಪರಿಶೀಲಿಸಿದ ವೈದ್ಯರು", b2: "🔒 ಖಾಸಗಿ ಮತ್ತು ಸುರಕ್ಷಿತ", b3: "⚡ ತಕ್ಷಣದ ಸಹಾಯ", continue: "ನೀವು ಹೇಗೆ ಮುಂದುವರಿಯಲು ಬಯಸುತ್ತೀರಿ?", orWithout: "ಅಥವಾ ಲಾಗಿನ್ ಇಲ್ಲದೆ ಸಹಾಯ ಪಡೆಯಿರಿ", aiDesc: "ಆರೋಗ್ಯದ ಪ್ರಶ್ನೆಗಳನ್ನು ತಕ್ಷಣವೇ ಕೇಳಿ", priv: "🔒 ನಿಮ್ಮ ಡೇಟಾ ಖಾಸಗಿಯಾಗಿದೆ ಮತ್ತು ಎಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳುವುದಿಲ್ಲ" },
      ml: { b1: "✅ പരിശോധിച്ച ഡോക്ടർമാർ", b2: "🔒 സ്വകാര്യവും സുരക്ഷിതവുമായ", b3: "⚡ തൽക്ഷണ സഹായം", continue: "നിങ്ങൾ എങ്ങനെ തുടരാനാണ് ആഗ്രഹിക്കുന്നത്?", orWithout: "അല്ലെങ്കിൽ ലോഗിൻ ചെയ്യാതെ സഹായം നേടുക", aiDesc: "ആരോഗ്യ സംബന്ധിയായ ചോദ്യങ്ങൾ തൽക്ഷണം ചോദിക്കുക", priv: "🔒 നിങ്ങളുടെ ഡാറ്റ സ്വകാര്യമാണ്, ഒരിക്കലും പങ്കിടില്ല" },
      as: { b1: "✅ প্ৰমাণিত চিকিৎসক", b2: "🔒 ব্যক্তিগত আৰু সুৰক্ষিত", b3: "⚡ তাৎক্ষণিক সহায়", continue: "আপুনি কেনেকৈ আগবাঢ়িব বিচাৰে?", orWithout: "বা লগইন নোহোৱাকৈ সহায় লওক", aiDesc: "তাত্ক্ষণিকভাৱে স্বাস্থ্য সম্পৰ্কীয় প্ৰশ্ন সোধক", priv: "🔒 আপোনাৰ তথ্য ব্যক্তিগত আৰু কেতিয়াও শ্বেয়াৰ কৰা নহয়" },
      en: { b1: "✅ Verified Doctors", b2: "🔒 Private & Secure", b3: "⚡ Instant Help", continue: "How would you like to continue?", orWithout: "or get help without login", aiDesc: "Ask health questions instantly", priv: "🔒 Your data is private and never shared" }
    };
    return translations[language] || translations['en'];
  };

  const { greeting, tagline } = getGreeting();
  const uiText = getUiText();

  return (
    <div style={{ background: '#f8fdf8', minHeight: '100vh', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes btnGlow {
            0%   { box-shadow: 0 4px 16px rgba(46,125,50,0.30); }
            50%  { box-shadow: 0 4px 24px rgba(46,125,50,0.55); }
            100% { box-shadow: 0 4px 16px rgba(46,125,50,0.30); }
          }
        `}
      </style>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/landing')}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          color: 'white',
          background: 'none',
          border: 'none',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: 'pointer',
          padding: '8px',
          zIndex: 10
        }}
      >
        ← {t('back') || 'Back'}
      </button>

      {/* TOP SECTION */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a472a 0%, #2E7D32 50%, #43a047 100%)',
        padding: '48px 32px 56px 32px',
        textAlign: 'center',
        flex: '0 0 45vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Floating Decorative Circles */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', pointerEvents: 'none', zIndex: 0
        }}></div>
        <div style={{
          position: 'absolute', bottom: '20px', left: '-30px',
          width: '140px', height: '140px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0
        }}></div>
        <div style={{
          position: 'absolute', top: '40%', right: '20px',
          width: '70px', height: '70px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', pointerEvents: 'none', zIndex: 0
        }}></div>

        {/* Branding */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '32px', animation: 'fadeInDown 0.6s ease forwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '32px' }}>🌿</span>
            <span style={{ fontSize: '26px', fontWeight: 'bold', color: 'white' }}>JeevanJyoti</span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: 'rgba(255,255,255,0.75)', 
            letterSpacing: '2px', 
            textTransform: 'uppercase' 
          }}>
            Rural Healthcare
          </div>
        </div>

        {/* Greeting & Tagline */}
        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeInDown 0.6s ease 0.2s forwards', opacity: 0 }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>
            {greeting}
          </h1>
          <p style={{ 
            fontSize: '15px', 
            color: 'rgba(255,255,255,0.85)', 
            lineHeight: '1.5', 
            maxWidth: '280px', 
            margin: '0 auto' 
          }}>
            {tagline}
          </p>
        </div>

        {/* Badges */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
          {[uiText.b1, uiText.b2, uiText.b3].map((text, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '20px',
              padding: '6px 14px',
              color: 'white',
              fontSize: '12px',
              fontWeight: '500',
              animation: `fadeInUp 0.5s ease ${0.4 + i * 0.15}s forwards`,
              opacity: 0
            }}>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* SVG Wave */}
      <div style={{ marginTop: '-2px', lineHeight: 0, overflow: 'hidden' }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
          {/* I am using #43a047 to perfectly blend with the bottom of the gradient (#43a047 at 100%) */}
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#43a047" />
        </svg>
      </div>

      {/* BOTTOM SECTION */}
      <div style={{
        backgroundImage: 'radial-gradient(#2E7D32 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundColor: '#f8fdf8',
        padding: '20px 24px 40px 24px',
        flex: '1',
        boxSizing: 'border-box'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', animation: 'fadeInUp 0.6s ease 0.5s forwards', opacity: 0 }}>
          
          <div style={{ fontSize: '13px', color: '#555', textAlign: 'center', marginBottom: '20px', fontWeight: '500' }}>
            {uiText.continue}
          </div>

          {/* Login Button with "Most patients use this" label */}
          <div style={{
            fontSize: '11px',
            color: '#2E7D32',
            background: '#E8F5E9',
            borderRadius: '20px',
            padding: '3px 10px',
            width: 'fit-content',
            margin: '0 auto 8px auto',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {t('mostPatientsUseThis') || 'Most patients use this'}
          </div>

          <button
            onClick={() => navigate('/patient-login')}
            onMouseOver={(e) => { e.currentTarget.style.background = '#1B5E20'; e.currentTarget.style.transform = 'scale(1.01)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#2E7D32'; e.currentTarget.style.transform = 'scale(1)'; }}
            style={{
              width: '100%',
              height: '58px',
              background: '#2E7D32',
              color: 'white',
              borderRadius: '14px',
              border: 'none',
              fontSize: '17px',
              fontWeight: '700',
              boxShadow: '0 4px 16px rgba(46,125,50,0.30)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              transition: 'all 0.2s',
              marginBottom: '14px',
              animation: 'btnGlow 2.5s ease-in-out infinite'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🔐</span>
              <span>{t('welcomeLoginBtn') || 'Login'}</span>
            </div>
            <span style={{ opacity: 0.7, fontSize: '20px' }}>→</span>
          </button>

          <button
            onClick={() => navigate('/patient-registration')}
            onMouseOver={(e) => e.currentTarget.style.background = '#F1F8F1'}
            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            style={{
              width: '100%',
              height: '58px',
              background: 'white',
              color: '#2E7D32',
              border: '2px solid #2E7D32',
              borderRadius: '14px',
              fontSize: '17px',
              fontWeight: '700',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>👤</span>
              <span>{t('newUserRegisterWelcome') || 'New user? Register now'}</span>
            </div>
            <span style={{ opacity: 0.7, fontSize: '20px' }}>→</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: '28px' }}>
            <div style={{ flex: 1, height: '1px', background: '#E0E0E0' }}></div>
            <div style={{ fontSize: '13px', color: '#999', padding: '0 12px' }}>{uiText.orWithout}</div>
            <div style={{ flex: 1, height: '1px', background: '#E0E0E0' }}></div>
          </div>

          <div 
            onClick={() => navigate('/landing')}
            style={{
              marginTop: '16px',
              background: 'white',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid #C8E6C9',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span>🌿</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2E7D32' }}>Aarogya AI</span>
              </div>
              <div style={{ fontSize: '12px', color: '#555' }}>
                {uiText.aiDesc}
              </div>
            </div>
            <div style={{ fontSize: '20px', color: '#2E7D32' }}>→</div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: '#999' }}>
            {uiText.priv}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PatientWelcome;
