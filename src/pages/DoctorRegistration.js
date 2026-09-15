
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getStates } from '../translations/translations';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import VoiceInputButton from '../components/common/VoiceInputButton';

const SPECIALIZATIONS_TRANSLATED = {
  en: ["General Medicine","Paediatrics (Children)","Gynaecology (Women)","Cardiology (Heart)","Orthopaedics (Bones)","Dermatology (Skin)","ENT (Ear Nose Throat)","Ophthalmology (Eyes)","Psychiatry (Mental Health)","Dentistry","Surgery","Neurology (Brain)","Ayurveda","Homoeopathy","Physiotherapy"],
  hi: ["सामान्य चिकित्सा","बाल रोग","स्त्री रोग","हृदय रोग","हड्डी रोग","त्वचा रोग","कान नाक गला","नेत्र रोग","मानसिक स्वास्थ्य","दंत चिकित्सा","शल्य चिकित्सा","मस्तिष्क रोग","आयुर्वेद","होम्योपैथी","फिजियोथेरेपी"],
  mw: ["सामान्य चिकित्सा","बाल रोग","स्त्री रोग","हृदय रोग","हाड्डी रोग","चमड़ी रोग","कान नाक गला","आँख रोग","मानसिक स्वास्थ्य","दाँत चिकित्सा","शल्य चिकित्सा","दिमाग रोग","आयुर्वेद","होम्योपैथी","फिजियोथेरेपी"],
  gu: ["સામાન્ય દવા","બાળ રોગ","સ્ત્રી રોગ","હૃદય રોગ","હાડકા રોગ","ચામડી રોગ","કાન નાક ગળું","આંખ રોગ","માનસિક સ્વાસ્થ્ય","દાંત ચિકિત્સા","શસ્ત્રક્રિયા","મગજ રોગ","આયુર્વેદ","હોમિયોપેથી","ફિઝિયોથેરાપી"],
  mr: ["सामान्य औषध","बालरोग","स्त्रीरोग","हृदयरोग","अस्थिरोग","त्वचारोग","कान नाक घसा","नेत्ररोग","मानसिक आरोग्य","दंतचिकित्सा","शस्त्रक्रिया","मेंदू रोग","आयुर्वेद","होमिओपॅथी","फिजिओथेरपी"],
  ta: ["பொது மருத்துவம்","குழந்தை மருத்துவம்","மகப்பேறு மருத்துவம்","இதய மருத்துவம்","எலும்பு மருத்துவம்","தோல் மருத்துவம்","காது மூக்கு தொண்டை","கண் மருத்துவம்","மனநல மருத்துவம்","பல் மருத்துவம்","அறுவை சிகிச்சை","நரம்பியல்","ஆயுர்வேதம்","ஹோமியோபதி","இயற்பியல் சிகிச்சை"],
  te: ["సాధారణ వైద్యం","శిశు వైద్యం","స్త్రీ వైద్యం","హృదయ వైద్యం","ఎముకల వైద్యం","చర్మ వైద్యం","చెవి ముక్కు గొంతు","కంటి వైద్యం","మానసిక ఆరోగ్యం","దంత వైద్యం","శస్త్రచికిత్స","నాడీ వైద్యం","ఆయుర్వేదం","హోమియోపతి","భౌతిక చికిత్స"],
  pa: ["ਆਮ ਦਵਾਈ","ਬੱਚਿਆਂ ਦੇ ਰੋਗ","ਔਰਤਾਂ ਦੇ ਰੋਗ","ਦਿਲ ਦੇ ਰੋਗ","ਹੱਡੀਆਂ ਦੇ ਰੋਗ","ਚਮੜੀ ਦੇ ਰੋਗ","ਕੰਨ ਨੱਕ ਗਲਾ","ਅੱਖਾਂ ਦੇ ਰੋਗ","ਮਾਨਸਿਕ ਸਿਹਤ","ਦੰਦਾਂ ਦੀ ਦਵਾਈ","ਸਰਜਰੀ","ਦਿਮਾਗ਼ ਦੇ ਰੋਗ","ਆਯੁਰਵੇਦ","ਹੋਮਿਓਪੈਥੀ","ਫਿਜ਼ੀਓਥੈਰੇਪੀ"],
  bn: ["সাধারণ চিকিৎসা","শিশু রোগ","স্ত্রী রোগ","হৃদরোগ","হাড়ের রোগ","চর্মরোগ","কান নাক গলা","চোখের রোগ","মানসিক স্বাস্থ্য","দন্ত চিকিৎসা","শল্য চিকিৎসা","স্নায়ু রোগ","আয়ুর্বেদ","হোমিওপ্যাথি","ফিজিওথেরাপি"],
  kn: ["ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ","ಮಕ್ಕಳ ರೋಗ","ಮಹಿಳಾ ರೋಗ","ಹೃದಯ ರೋಗ","ಮೂಳೆ ರೋಗ","ಚರ್ಮ ರೋಗ","ಕಿವಿ ಮೂಗು ಗಂಟಲು","ಕಣ್ಣಿನ ರೋಗ","ಮಾನಸಿಕ ಆರೋಗ್ಯ","ದಂತ ಚಿಕಿತ್ಸೆ","ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ","ನರ ರೋಗ","ಆಯುರ್ವೇದ","ಹೋಮಿಯೋಪತಿ","ಫಿಜಿಯೋಥೆರಪಿ"],
  ml: ["പൊതു വൈദ്യം","ശിശുരോഗം","സ്ത്രീരോഗം","ഹൃദ്രോഗം","അസ്ഥിരോഗം","ചർമ്മരോഗം","ചെവി മൂക്ക് തൊണ്ട","നേത്രരോഗം","മാനസികാരോഗ്യം","ദന്ത ചികിത്സ","ശസ്ത്രക്രിയ","നാഡീരോഗം","ആയുർവേദം","ഹോമിയോപ്പതി","ഫിസിയോതെറാപ്പി"],
  as: ["সাধাৰণ চিকিৎসা","শিশু ৰোগ","মহিলা ৰোগ","হৃদৰোগ","হাড়ৰ ৰোগ","ছালৰ ৰোগ","কাণ নাক ডিঙি","চকুৰ ৰোগ","মানসিক স্বাস্থ্য","দাঁতৰ চিকিৎসা","শল্য চিকিৎসা","স্নায়ু ৰোগ","আয়ুৰ্বেদ","হোমিওপেথি","ফিজিঅ'থেৰাপি"],
  or: ["ସାଧାରଣ ଚିକିତ୍ସା","ଶିଶୁ ରୋଗ","ସ୍ତ୍ରୀ ରୋଗ","ହୃଦ୍ ରୋଗ","ହାଡ଼ ରୋଗ","ଚର୍ମ ରୋଗ","କାନ ନାକ ଗଳା","ଆଖି ରୋଗ","ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ","ଦାନ୍ତ ଚିକିତ୍ସା","ଶଲ୍ୟ ଚିକିତ୍ସା","ସ୍ନାୟୁ ରୋଗ","ଆୟୁର୍ବେଦ","ହୋମିଓପାଥି","ଫିଜିଓଥେରାପି"],
  nm: ["General Medicine","Paediatrics","Gynaecology","Cardiology","Orthopaedics","Dermatology","ENT","Ophthalmology","Psychiatry","Dentistry","Surgery","Neurology","Ayurveda","Homoeopathy","Physiotherapy"],
};

const ENGLISH_SPECIALIZATIONS = SPECIALIZATIONS_TRANSLATED['en'];

const DoctorRegistration = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    specializationIndex: '',
    hospital: '',
    area: '',
    state: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVoiceInput = (fieldName, transcript) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName] ? `${prev[fieldName]} ${transcript}` : transcript
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const { fullName, email, mobileNumber, specializationIndex, hospital, area, state, password } = formData;

    if (!fullName || !email || !mobileNumber || specializationIndex === '' || !hospital || !area || !state || !password) {
      setFormError(t('fillAllFields') || 'Please fill all fields');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    const englishSpec = ENGLISH_SPECIALIZATIONS[specializationIndex];
    setIsSubmitting(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      await setDoc(doc(db, 'users', uid), {
        role: 'doctor',
        name: fullName,
        email: email,
        mobile: mobileNumber,
        specialization: englishSpec,
        hospital_name: hospital,
        area: area,
        state: state,
        createdAt: serverTimestamp(),
      });

      alert(t('registrationSuccess') || 'Registration successful! Please login.');
      navigate('/doctor-login');
    } catch (error) {
      console.error('Registration error:', error);
      const messages = {
        'auth/email-already-in-use': 'This email is already registered. Please login instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password is too weak. Use at least 8 characters.',
      };
      setFormError(messages[error.code] || 'Registration failed. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleChangeLanguage = () => {
    setLanguage('');
    navigate('/');
  };

  const currentSpecs = SPECIALIZATIONS_TRANSLATED[language] || SPECIALIZATIONS_TRANSLATED['en'];

  useEffect(() => {
    const styleId = "doctor-reg-animations";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px) }
          to { opacity: 1; transform: translateY(0) }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px) }
          to { opacity: 1; transform: translateY(0) }
        }
        @keyframes btnGlow {
          0% { box-shadow: 0 4px 16px rgba(21,101,192,0.30) }
          50% { box-shadow: 0 4px 24px rgba(21,101,192,0.50) }
          100% { box-shadow: 0 4px 16px rgba(21,101,192,0.30) }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const voiceBtnStyle = {
    background: 'rgba(21,101,192,0.08)',
    border: '1px solid rgba(21,101,192,0.2)',
    color: '#1565C0',
    fontSize: '14px',
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    margin: 0,
    padding: 0
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F0F4FF',
      fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif",
      margin: 0,
      padding: 0
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #0D47A1 45%, #1565C0 100%)',
        padding: '28px 24px 64px 24px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '10px', left: '-40px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: '30%', right: '20px', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeInDown 0.5s ease forwards' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={() => navigate('/landing')}
              style={{
                color: 'white', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '20px', padding: '6px 14px', fontSize: '14px', cursor: 'pointer', outline: 'none'
              }}
            >
              ← {t('back') || 'Back'}
            </button>
            <button 
              onClick={handleChangeLanguage}
              style={{
                color: 'white', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '20px', padding: '6px 14px', fontSize: '14px', cursor: 'pointer', outline: 'none'
              }}
            >
              {t('changeLanguage') || 'Change Language'}
            </button>
          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>🌿 JeevanJyoti</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', letterSpacing: '2.5px' }}>RURAL HEALTHCARE</div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '36px' }}>👨‍⚕️</div>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: 'white', margin: '8px 0 4px 0' }}>{t('doctorRegTitle') || 'Join as a Doctor'}</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: '0' }}>{t('doctorRegSub') || 'Help rural patients get quality care'}</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '-2px', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#0D47A1"/>
        </svg>
      </div>

      <div style={{
        background: '#F0F4FF',
        backgroundImage: 'radial-gradient(#1565C0 0.8px, transparent 0.8px)',
        backgroundSize: '22px 22px',
        padding: '0 16px 40px 16px',
        marginTop: '-2px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: 'white', borderRadius: '20px', padding: '28px 24px',
          boxShadow: '0 4px 24px rgba(21,101,192,0.10)', border: '1px solid #E3EAF8',
          maxWidth: '500px', margin: '24px auto 0 auto',
          animation: 'fadeInUp 0.6s ease 0.2s forwards', opacity: 0
        }}>
          <div style={{
            height: '4px',
            background: 'linear-gradient(90deg, #1565C0, #42A5F5, #1565C0)',
            borderRadius: '4px 4px 0 0',
            margin: '-28px -24px 20px -24px'
          }}></div>

          <div style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px',
            background: '#EFF4FF', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px'
          }}>
            <div style={{ fontSize: '22px' }}>🏥</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1565C0' }}>Create your doctor profile</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Fill in your details to join JeevanJyoti</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#1565C0', marginBottom: '6px' }}>{t('fullName')}</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName}
                  onChange={handleChange} 
                  placeholder={t('fullNamePH')} 
                  style={{
                    width: '100%', height: '48px', border: '1.5px solid #E0E0E0', borderRadius: '12px',
                    padding: '0 48px 0 16px', fontSize: '14px', background: 'white', color: '#1A1A1A',
                    marginBottom: '14px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#1565C0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.08)'; e.target.style.borderLeftWidth = '3px'; e.target.style.borderLeftColor = '#1565C0'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; e.target.style.borderLeftWidth = '1.5px'; }}
                />
                <VoiceInputButton language={language} onResult={(text) => handleVoiceInput('fullName', text)} customStyle={voiceBtnStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#1565C0', marginBottom: '6px' }}>{t('email') || 'Email'}</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange} 
                placeholder="doctor@example.com" 
                style={{
                  width: '100%', height: '48px', border: '1.5px solid #E0E0E0', borderRadius: '12px',
                  padding: '0 16px', fontSize: '14px', background: 'white', color: '#1A1A1A',
                  marginBottom: '14px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#1565C0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.08)'; e.target.style.borderLeftWidth = '3px'; e.target.style.borderLeftColor = '#1565C0'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; e.target.style.borderLeftWidth = '1.5px'; }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#1565C0', marginBottom: '6px' }}>{t('mobileNumber')}</label>
              <input 
                type="tel" 
                name="mobileNumber" 
                value={formData.mobileNumber}
                onChange={handleChange} 
                placeholder={t('mobileNumberPH')} 
                style={{
                  width: '100%', height: '48px', border: '1.5px solid #E0E0E0', borderRadius: '12px',
                  padding: '0 16px', fontSize: '14px', background: 'white', color: '#1A1A1A',
                  marginBottom: '14px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#1565C0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.08)'; e.target.style.borderLeftWidth = '3px'; e.target.style.borderLeftColor = '#1565C0'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; e.target.style.borderLeftWidth = '1.5px'; }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#1565C0', marginBottom: '6px' }}>{t('specialization')}</label>
              <select 
                name="specializationIndex" 
                value={formData.specializationIndex}
                onChange={handleChange} 
                style={{
                  width: '100%', height: '48px', border: '1.5px solid #E0E0E0', borderRadius: '12px',
                  padding: '0 16px', fontSize: '14px', background: 'white', color: '#1A1A1A',
                  marginBottom: '14px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#1565C0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.08)'; e.target.style.borderLeftWidth = '3px'; e.target.style.borderLeftColor = '#1565C0'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; e.target.style.borderLeftWidth = '1.5px'; }}
              >
                <option value="">{t('selectSpec')}</option>
                {currentSpecs.map((spec, idx) => (
                  <option key={idx} value={idx}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#1565C0', marginBottom: '6px' }}>{t('hospitalName')}</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  name="hospital" 
                  value={formData.hospital}
                  onChange={handleChange} 
                  placeholder={t('hospitalNamePH')} 
                  style={{
                    width: '100%', height: '48px', border: '1.5px solid #E0E0E0', borderRadius: '12px',
                    padding: '0 48px 0 16px', fontSize: '14px', background: 'white', color: '#1A1A1A',
                    marginBottom: '14px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#1565C0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.08)'; e.target.style.borderLeftWidth = '3px'; e.target.style.borderLeftColor = '#1565C0'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; e.target.style.borderLeftWidth = '1.5px'; }}
                />
                <VoiceInputButton language={language} onResult={(text) => handleVoiceInput('hospital', text)} customStyle={voiceBtnStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#1565C0', marginBottom: '6px' }}>{t('area') || 'Area / District'}</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  name="area" 
                  value={formData.area}
                  onChange={handleChange} 
                  placeholder={t('area') || "e.g. Vaishali Nagar"} 
                  style={{
                    width: '100%', height: '48px', border: '1.5px solid #E0E0E0', borderRadius: '12px',
                    padding: '0 48px 0 16px', fontSize: '14px', background: 'white', color: '#1A1A1A',
                    marginBottom: '14px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#1565C0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.08)'; e.target.style.borderLeftWidth = '3px'; e.target.style.borderLeftColor = '#1565C0'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; e.target.style.borderLeftWidth = '1.5px'; }}
                />
                <VoiceInputButton language={language} onResult={(text) => handleVoiceInput('area', text)} customStyle={voiceBtnStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#1565C0', marginBottom: '6px' }}>{t('state')}</label>
              <select 
                name="state" 
                value={formData.state}
                onChange={handleChange} 
                style={{
                  width: '100%', height: '48px', border: '1.5px solid #E0E0E0', borderRadius: '12px',
                  padding: '0 16px', fontSize: '14px', background: 'white', color: '#1A1A1A',
                  marginBottom: '14px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#1565C0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.08)'; e.target.style.borderLeftWidth = '3px'; e.target.style.borderLeftColor = '#1565C0'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; e.target.style.borderLeftWidth = '1.5px'; }}
              >
                <option value="">{t('selectState')}</option>
                {getStates(language).map((st, idx) => (
                  <option key={idx} value={getStates('en')[idx]}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#1565C0', marginBottom: '6px' }}>{t('password') || 'Password'}</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange} 
                  placeholder={t('passwordPH') || 'Minimum 8 characters'} 
                  style={{
                    width: '100%', height: '48px', border: '1.5px solid #E0E0E0', borderRadius: '12px',
                    padding: '0 48px 0 16px', fontSize: '14px', background: 'white', color: '#1A1A1A',
                    marginBottom: '14px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#1565C0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.08)'; e.target.style.borderLeftWidth = '3px'; e.target.style.borderLeftColor = '#1565C0'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; e.target.style.borderLeftWidth = '1.5px'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'rgba(21,101,192,0.08)', border: '1px solid rgba(21,101,192,0.2)', color: '#1565C0',
                    fontSize: '14px', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} style={{
              width: '100%', height: '52px', background: 'linear-gradient(135deg, #1565C0, #1976D2)',
              color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: isSubmitting ? 0.85 : 1,
              animation: 'btnGlow 2.5s ease-in-out infinite'
            }}>
              {isSubmitting ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>🔐</span>
                  <span>{t('createAccountBtn') || 'Create My Doctor Account'}</span>
                  <span>→</span>
                </>
              )}
            </button>

            {formError && (
              <div style={{
                background: '#FEF2F2', borderLeft: '4px solid #EF4444', color: '#B91C1C',
                padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginTop: '14px'
              }}>
                {formError}
              </div>
            )}

            <div 
              onClick={() => navigate('/doctor-login')} 
              style={{ textAlign: 'center', display: 'block', marginTop: '16px', color: '#1565C0', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}
            >
              {t('alreadyHaveAccountDoctor') || 'Already have an account? Login here'}
            </div>

            <div style={{ marginTop: '18px', borderTop: '1px solid #E8EEF8', paddingTop: '14px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', color: '#999' }}>✓ Verified by JKLU</span>
              <span style={{ fontSize: '10px', color: '#999' }}>✓ Secure & Encrypted</span>
              <span style={{ fontSize: '10px', color: '#999' }}>✓ Free to Join</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;