import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getStates } from '../translations/translations';
import API_BASE_URL from '../config';
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
    const { fullName, email, mobileNumber, specializationIndex, hospital, area, state, password } = formData;

    if (!fullName || !email || !mobileNumber || specializationIndex === '' || !hospital || !area || !state || !password) {
      alert(t('fillAllFields') || 'Please fill all fields');
      return;
    }

    const englishSpec = ENGLISH_SPECIALIZATIONS[specializationIndex];

    try {
      const response = await fetch(`${API_BASE_URL}/api/doctors/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: email,
          mobile: mobileNumber,
          specialization: englishSpec,
          hospital_name: hospital,
          area: area,
          state: state,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(t('registrationSuccess') || 'Registration successful! Please login.');
        navigate('/doctor-login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error, please try again later.');
    }
  };

  const handleChangeLanguage = () => {
    setLanguage('');
    navigate('/');
  };

  const currentSpecs = SPECIALIZATIONS_TRANSLATED[language] || SPECIALIZATIONS_TRANSLATED['en'];

  return (
    <div className="form-container">
      <div className="top-bar">
        <button className="btn-text" style={{ marginRight: 'auto' }} onClick={() => navigate('/landing')}>
          ← {t('back')}
        </button>
        <button className="btn-secondary small" onClick={handleChangeLanguage}>
          {t('changeLanguage')}
        </button>
      </div>

      <div className="form-card">
        <div className="form-header">
          <h2>{t('doctorRegTitle')}</h2>
          <p>{t('doctorRegSub')}</p>
        </div>

        <form onSubmit={handleSubmit} className="form-body">

          <div className="input-group">
            <label>{t('fullName')}</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="text" name="fullName" value={formData.fullName}
                onChange={handleChange} placeholder={t('fullNamePH')} className="large-input" style={{ marginBottom: 0, flex: 1 }} />
              <VoiceInputButton language={language} onResult={(text) => handleVoiceInput('fullName', text)} />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="doctor@example.com" className="large-input" />
          </div>

          <div className="input-group">
            <label>{t('mobileNumber')}</label>
            <input type="tel" name="mobileNumber" value={formData.mobileNumber}
              onChange={handleChange} placeholder={t('mobileNumberPH')} className="large-input" />
          </div>

          <div className="input-group">
            <label>{t('specialization')}</label>
            <select name="specializationIndex" value={formData.specializationIndex}
              onChange={handleChange} className="large-input">
              <option value="">{t('selectSpec')}</option>
              {currentSpecs.map((spec, idx) => (
                <option key={idx} value={idx}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>{t('hospitalName')}</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="text" name="hospital" value={formData.hospital}
                onChange={handleChange} placeholder={t('hospitalNamePH')} className="large-input" style={{ marginBottom: 0, flex: 1 }} />
              <VoiceInputButton language={language} onResult={(text) => handleVoiceInput('hospital', text)} />
            </div>
          </div>

          <div className="input-group">
            <label>{t('area') || 'Area / District'}</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="text" name="area" value={formData.area}
                onChange={handleChange} placeholder="e.g. Vaishali Nagar" className="large-input" style={{ marginBottom: 0, flex: 1 }} />
              <VoiceInputButton language={language} onResult={(text) => handleVoiceInput('area', text)} />
            </div>
          </div>

          <div className="input-group">
            <label>{t('state')}</label>
            <select name="state" value={formData.state}
              onChange={handleChange} className="large-input">
              <option value="">{t('selectState')}</option>
              {getStates(language).map((st, idx) => (
                <option key={idx} value={getStates('en')[idx]}>{st}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>{t('password') || 'Password'}</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder={t('passwordPH') || 'Minimum 8 characters'} className="large-input" />
          </div>

          <button type="submit" className="btn-primary large mt-4"
            style={{ backgroundColor: 'var(--primary-blue)' }}>
            {t('createAccountBtn')}
          </button>

        </form>
      </div>
    </div>
  );
};

export default DoctorRegistration;