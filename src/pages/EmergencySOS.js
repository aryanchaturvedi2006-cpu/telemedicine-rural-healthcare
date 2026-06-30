import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const EmergencySOS = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [showFamilyInput, setShowFamilyInput] = useState(false);
  const [familyNumber, setFamilyNumber] = useState('');

  const getTranslation = (key) => {
    const translations = {
      en: {
        pageTitle: "Emergency Help",
        btnTitle: "Call Ambulance — 108",
        btnSub: "Tap to call now",
        cardATitle: "Nearest Hospital",
        cardASub: "Find hospitals near you",
        cardBTitle: "Notify Family",
        cardBSub: "Quickly call a saved contact",
        cardCTitle: "Quick Symptom Help",
        cardCSub: "Talk to Aarogya AI now",
        tipsTitle: "While You Wait",
        tip1: "Stay calm and keep the person still",
        tip2: "Apply pressure to any bleeding with clean cloth",
        tip3: "Ensure the person can breathe — loosen tight clothing",
        tip4: "Note your exact location for the ambulance"
      },
      hi: {
        pageTitle: "आपातकालीन सहायता",
        btnTitle: "एम्बुलेंस बुलाएं — 108",
        btnSub: "कॉल करने के लिए टैप करें",
        cardATitle: "निकटतम अस्पताल",
        cardASub: "अपने पास के अस्पताल खोजें",
        cardBTitle: "परिवार को सूचित करें",
        cardBSub: "किसी संपर्क को तुरंत कॉल करें",
        cardCTitle: "त्वरित लक्षण सहायता",
        cardCSub: "आरोग्य AI से बात करें",
        tipsTitle: "प्रतीक्षा करते समय",
        tip1: "शांत रहें और व्यक्ति को स्थिर रखें",
        tip2: "साफ कपड़े से रक्तस्राव पर दबाव डालें",
        tip3: "सुनिश्चित करें कि व्यक्ति सांस ले सके — तंग कपड़े ढीले करें",
        tip4: "एम्बुलेंस के लिए अपना सटीक स्थान नोट करें"
      },
      mrw: {
        pageTitle: "एमरजेंसी मदद",
        btnTitle: "एंबुलेंस बुलाओ — 108",
        btnSub: "कॉल करण वास्ते अठे दबाओ",
        cardATitle: "नेड़े रो अस्पताल",
        cardASub: "आसपास रा अस्पताल देखो",
        cardBTitle: "परिवार ने बताओ",
        cardBSub: "अपणा लोगां ने तुरंत कॉल करो",
        cardCTitle: "लक्षण री मदद",
        cardCSub: "आरोग्य AI सू बात करो",
        tipsTitle: "इंतजार करणा रे टेम",
        tip1: "शांत रो और बीमार ने स्थिर राखो",
        tip2: "साफ कपड़ा सू खून रोकण री कोशिश करो",
        tip3: "सांस लेवण दो — कसा होड़ा कपड़ा ढीला करो",
        tip4: "एंबुलेंस वास्ते अपणी पक्की जगा बताओ"
      },
      gu: {
        pageTitle: "ઇમરજન્સી મદદ",
        btnTitle: "એમ્બ્યુલન્સ બોલાવો — 108",
        btnSub: "કૉલ કરવા માટે ટેપ કરો",
        cardATitle: "નજીકની હોસ્પિટલ",
        cardASub: "તમારી નજીકની હોસ્પિટલ શોધો",
        cardBTitle: "પરિવારને જાણ કરો",
        cardBSub: "સાચવેલ સંપર્કને કૉલ કરો",
        cardCTitle: "લક્ષણો માટે મદદ",
        cardCSub: "આરોગ્ય AI સાથે વાત કરો",
        tipsTitle: "તમે રાહ જુઓ ત્યાં સુધી",
        tip1: "શાંત રહો અને વ્યક્તિને સ્થિર રાખો",
        tip2: "સ્વચ્છ કપડાથી રક્તસ્રાવ પર દબાણ કરો",
        tip3: "ખાતરી કરો કે વ્યક્તિ શ્વાસ લઈ શકે — ચુસ્ત કપડાં ઢીલા કરો",
        tip4: "એમ્બ્યુલન્સ માટે તમારું ચોક્કસ સ્થાન નોંધો"
      },
      mr: {
        pageTitle: "आपत्कालीन मदत",
        btnTitle: "रुग्णवाहिका बोलावा — 108",
        btnSub: "कॉल करण्यासाठी टॅप करा",
        cardATitle: "जवळचे रुग्णालय",
        cardASub: "तुमच्या जवळची रुग्णालये शोधा",
        cardBTitle: "कुटुंबाला कळवा",
        cardBSub: "सेव्ह केलेल्या संपर्काला त्वरित कॉल करा",
        cardCTitle: "लक्षणानुसार मदत",
        cardCSub: "आरोग्य AI शी आताच बोला",
        tipsTitle: "प्रतीक्षा करत असताना",
        tip1: "शांत राहा आणि व्यक्तीला स्थिर ठेवा",
        tip2: "रक्तस्राव होत असल्यास स्वच्छ कापडाने दाबा",
        tip3: "व्यक्तीला श्वास घेता येत असल्याची खात्री करा — घट्ट कपडे सैल करा",
        tip4: "रुग्णवाहिकेसाठी तुमचे अचूक ठिकाण नोंदवा"
      },
      ta: {
        pageTitle: "அவசர உதவி",
        btnTitle: "ஆம்புலன்ஸை அழைக்கவும் — 108",
        btnSub: "அழைக்க தட்டவும்",
        cardATitle: "அருகிலுள்ள மருத்துவமனை",
        cardASub: "அருகிலுள்ள மருத்துவமனைகளைக் கண்டறியவும்",
        cardBTitle: "குடும்பத்திற்குத் தெரிவி",
        cardBSub: "சேமிக்கப்பட்ட தொடர்பை அழைக்கவும்",
        cardCTitle: "அறிகுறி உதவி",
        cardCSub: "ஆரோக்யா AI உடன் பேசவும்",
        tipsTitle: "காத்திருக்கும்போது",
        tip1: "அமைதியாக இருங்கள், நபரை அசையாமல் வைத்திருக்கவும்",
        tip2: "இரத்தம் வடிந்தால் சுத்தமான துணியால் அழுத்தவும்",
        tip3: "நபர் சுவாசிக்க முடிகிறதா என உறுதிப்படுத்தவும் — இறுக்கமான ஆடைகளைத் தளர்த்தவும்",
        tip4: "ஆம்புலன்ஸிற்கான உங்கள் சரியான இருப்பிடத்தைக் குறித்துக்கொள்ளவும்"
      },
      te: {
        pageTitle: "అత్యవసర సహాయం",
        btnTitle: "అంబులెన్స్‌కు కాల్ చేయండి — 108",
        btnSub: "కాల్ చేయడానికి నొక్కండి",
        cardATitle: "సమీప ఆసుపత్రి",
        cardASub: "మీ సమీప ఆసుపత్రులను కనుగొనండి",
        cardBTitle: "కుటుంబానికి తెలియజేయండి",
        cardBSub: "సేవ్ చేసిన కాంటాక్ట్‌కు కాల్ చేయండి",
        cardCTitle: "లక్షణాల సహాయం",
        cardCSub: "ఆరోగ్య AI తో మాట్లాడండి",
        tipsTitle: "వేచి ఉన్న సమయంలో",
        tip1: "ప్రశాంతంగా ఉండండి మరియు వ్యక్తిని కదలకుండా ఉంచండి",
        tip2: "రక్తస్రావం ఉంటే శుభ్రమైన వస్త్రంతో వత్తండి",
        tip3: "వ్యక్తి శ్వాస తీసుకోగలరో లేదో నిర్ధారించండి — బిగుతుగా ఉన్న దుస్తులను సడలించండి",
        tip4: "అంబులెన్స్ కోసం మీ ఖచ్చితమైన స్థానాన్ని గమనించండి"
      },
      pa: {
        pageTitle: "ਐਮਰਜੈਂਸੀ ਮਦਦ",
        btnTitle: "ਐਂਬੂਲੈਂਸ ਬੁਲਾਓ — 108",
        btnSub: "ਕਾਲ ਕਰਨ ਲਈ ਟੈਪ ਕਰੋ",
        cardATitle: "ਨੇੜਲਾ ਹਸਪਤਾਲ",
        cardASub: "ਆਪਣੇ ਨੇੜੇ ਦੇ ਹਸਪਤਾਲ ਲੱਭੋ",
        cardBTitle: "ਪਰਿਵਾਰ ਨੂੰ ਸੂਚਿਤ ਕਰੋ",
        cardBSub: "ਸੇਵ ਕੀਤੇ ਸੰਪਰਕ ਨੂੰ ਤੁਰੰਤ ਕਾਲ ਕਰੋ",
        cardCTitle: "ਲੱਛਣ ਸਹਾਇਤਾ",
        cardCSub: "ਆਰੋਗਿਆ AI ਨਾਲ ਗੱਲ ਕਰੋ",
        tipsTitle: "ਉਡੀਕ ਕਰਦੇ ਸਮੇਂ",
        tip1: "ਸ਼ਾਂਤ ਰਹੋ ਅਤੇ ਵਿਅਕਤੀ ਨੂੰ ਸਥਿਰ ਰੱਖੋ",
        tip2: "ਸਾਫ਼ ਕੱਪੜੇ ਨਾਲ ਖੂਨ ਵਗਣ ਵਾਲੀ ਜਗ੍ਹਾ 'ਤੇ ਦਬਾਅ ਪਾਓ",
        tip3: "ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਵਿਅਕਤੀ ਸਾਹ ਲੈ ਸਕੇ — ਤੰਗ ਕੱਪੜੇ ਢਿੱਲੇ ਕਰੋ",
        tip4: "ਐਂਬੂਲੈਂਸ ਲਈ ਆਪਣਾ ਸਹੀ ਸਥਾਨ ਨੋਟ ਕਰੋ"
      },
      bn: {
        pageTitle: "জরুরি সাহায্য",
        btnTitle: "অ্যাম্বুলেন্স কল করুন — 108",
        btnSub: "কল করতে আলতো চাপুন",
        cardATitle: "নিকটবর্তী হাসপাতাল",
        cardASub: "আপনার কাছের হাসপাতাল খুঁজুন",
        cardBTitle: "পরিবারকে জানান",
        cardBSub: "সেভ করা নম্বরে কল করুন",
        cardCTitle: "লক্ষণ সহায়তা",
        cardCSub: "আরোগ্য AI এর সাথে কথা বলুন",
        tipsTitle: "অপেক্ষা করার সময়",
        tip1: "শান্ত থাকুন এবং ব্যক্তিকে স্থির রাখুন",
        tip2: "পরিষ্কার কাপড় দিয়ে রক্তপাত স্থানে চাপ দিন",
        tip3: "ব্যক্তিটি যেন শ্বাস নিতে পারে তা নিশ্চিত করুন — টাইট পোশাক ঢিলা করুন",
        tip4: "অ্যাম্বুলেন্সের জন্য আপনার সঠিক অবস্থান লক্ষ্য করুন"
      },
      kn: {
        pageTitle: "ತುರ್ತು ಸಹಾಯ",
        btnTitle: "ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ — 108",
        btnSub: "ಕರೆ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
        cardATitle: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ",
        cardASub: "ನಿಮ್ಮ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ",
        cardBTitle: "ಕುಟುಂಬಕ್ಕೆ ತಿಳಿಸಿ",
        cardBSub: "ಉಳಿಸಿದ ಸಂಪರ್ಕಕ್ಕೆ ಕರೆ ಮಾಡಿ",
        cardCTitle: "ಲಕ್ಷಣ ಸಹಾಯ",
        cardCSub: "ಆರೋಗ್ಯ AI ಜೊತೆ ಮಾತನಾಡಿ",
        tipsTitle: "ಕಾಯುತ್ತಿರುವಾಗ",
        tip1: "ಶಾಂತವಾಗಿರಿ ಮತ್ತು ವ್ಯಕ್ತಿಯನ್ನು ಸ್ಥಿರವಾಗಿಡಿ",
        tip2: "ರಕ್ತಸ್ರಾವವಿದ್ದರೆ ಶುದ್ಧ ಬಟ್ಟೆಯಿಂದ ಒತ್ತಿರಿ",
        tip3: "ವ್ಯಕ್ತಿಗೆ ಉಸಿರಾಡಲು ಸಾಧ್ಯವೇ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ — ಬಿಗಿಯಾದ ಬಟ್ಟೆ ಸಡಿಲಗೊಳಿಸಿ",
        tip4: "ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗಾಗಿ ನಿಮ್ಮ ನಿಖರವಾದ ಸ್ಥಳವನ್ನು ಗುರುತಿಸಿ"
      },
      ml: {
        pageTitle: "അടിയന്തിര സഹായം",
        btnTitle: "ആംബുലൻസ് വിളിക്കുക — 108",
        btnSub: "വിളിക്കാൻ ടാപ്പ് ചെയ്യുക",
        cardATitle: "അടുത്തുള്ള ആശുപത്രി",
        cardASub: "അടുത്തുള്ള ആശുപത്രികൾ കണ്ടെത്തുക",
        cardBTitle: "കുടുംബത്തെ അറിയിക്കുക",
        cardBSub: "സേവ് ചെയ്ത നമ്പറിലേക്ക് വിളിക്കുക",
        cardCTitle: "രോഗലക്ഷണ സഹായം",
        cardCSub: "ആരോഗ്യ AI-യോട് സംസാരിക്കുക",
        tipsTitle: "കാത്തിരിക്കുമ്പോൾ",
        tip1: "ശാന്തമായിരിക്കുക, രോഗിയെ അനക്കാതിരിക്കുക",
        tip2: "രക്തസ്രാവമുണ്ടെങ്കിൽ വൃത്തിയുള്ള തുണികൊണ്ട് അമർത്തി പിടിക്കുക",
        tip3: "രോഗിക്ക് ശ്വസിക്കാൻ കഴിയുന്നുണ്ടെന്ന് ഉറപ്പാക്കുക — ഇറുകിയ വസ്ത്രങ്ങൾ അയക്കുക",
        tip4: "ആംബുലൻസിനായി നിങ്ങളുടെ കൃത്യമായ സ്ഥലം മനസ്സിലാക്കുക"
      },
      as: {
        pageTitle: "জৰুৰীকালীন সহায়",
        btnTitle: "এম্বুলেন্স মাতিব — 108",
        btnSub: "কল কৰিবলৈ টিপক",
        cardATitle: "নিকটৱৰ্তী চিকিৎসালয়",
        cardASub: "ওচৰৰ চিকিৎসালয় বিচাৰক",
        cardBTitle: "পৰিয়ালক জনাওক",
        cardBSub: "ছেভ কৰা নম্বৰত কল কৰক",
        cardCTitle: "লক্ষণৰ সহায়",
        cardCSub: "আৰোগ্য AI ৰ সৈতে কথা পাতক",
        tipsTitle: "অপেক্ষা কৰাৰ সময়ত",
        tip1: "শান্ত থাকক আৰু ব্যক্তিজনক সুস্থিৰ ৰাখক",
        tip2: "পৰিষ্কাৰ কাপোৰেৰে ৰক্তপাত হোৱা অংশত হেঁচা দিয়ক",
        tip3: "ব্যক্তিজনে শ্বাস ল'ব পাৰেনে নাই নিশ্চিত কৰক — টান কাপোৰ ঢিলা কৰক",
        tip4: "এম্বুলেন্সৰ বাবে আপোনাৰ সঠিক অৱস্থান মনত ৰাখক"
      }
    };
    const t = translations[language] || translations.en;
    return t[key];
  };

  return (
    <div style={{ background: '#FFF5F5', minHeight: '100vh', padding: '20px', fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif" }}>
      <button 
        onClick={() => navigate('/landing')}
        style={{
          color: '#C62828',
          background: 'none',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          padding: '10px 0',
          marginBottom: '8px'
        }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', margin: '0 0 24px 0' }}>
        {getTranslation('pageTitle')}
      </h1>

      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        {/* SECTION 1: BIG CALL AMBULANCE BUTTON */}
        <button
          onClick={() => window.location.href = 'tel:108'}
          style={{
            width: '100%',
            height: '88px',
            background: '#C62828',
            borderRadius: '20px',
            border: 'none',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginBottom: '24px',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '2px' }}>🚑</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{getTranslation('btnTitle')}</div>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>{getTranslation('btnSub')}</div>
        </button>

        <style>{`
          @keyframes pulse {
            0% { box-shadow: 0 4px 20px rgba(198,40,40,0.35); }
            50% { box-shadow: 0 4px 28px rgba(198,40,40,0.55); }
            100% { box-shadow: 0 4px 20px rgba(198,40,40,0.35); }
          }
        `}</style>

        {/* SECTION 2: QUICK ACTION GRID */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {/* Card A */}
          <div 
            onClick={() => window.open('https://www.google.com/maps/search/hospital+near+me', '_blank')}
            style={{
              background: 'white',
              border: '1.5px solid #FFCDD2',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{ fontSize: '28px' }}>🏥</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1A1A1A' }}>{getTranslation('cardATitle')}</div>
              <div style={{ fontSize: '13px', color: '#555' }}>{getTranslation('cardASub')}</div>
            </div>
          </div>

          {/* Card B */}
          <div 
            style={{
              background: 'white',
              border: '1.5px solid #FFCDD2',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
              onClick={() => setShowFamilyInput(!showFamilyInput)}
            >
              <div style={{ fontSize: '28px' }}>👨‍👩‍👧</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1A1A1A' }}>{getTranslation('cardBTitle')}</div>
                <div style={{ fontSize: '13px', color: '#555' }}>{getTranslation('cardBSub')}</div>
              </div>
            </div>
            {showFamilyInput && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="tel"
                  placeholder="Enter family member's number"
                  value={familyNumber}
                  onChange={(e) => setFamilyNumber(e.target.value)}
                  style={{
                    flex: 1,
                    height: '44px',
                    borderRadius: '8px',
                    border: '1px solid #E0E0E0',
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => window.location.href = `tel:${familyNumber}`}
                  disabled={!familyNumber}
                  style={{
                    height: '44px',
                    padding: '0 20px',
                    backgroundColor: familyNumber ? '#2E7D32' : '#A5D6A7',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: familyNumber ? 'pointer' : 'not-allowed'
                  }}
                >
                  Call
                </button>
              </div>
            )}
          </div>

          {/* Card C */}
          <div 
            onClick={() => navigate('/landing')}
            style={{
              background: 'white',
              border: '1.5px solid #FFCDD2',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{ fontSize: '28px' }}>🌿</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1A1A1A' }}>{getTranslation('cardCTitle')}</div>
              <div style={{ fontSize: '13px', color: '#555' }}>{getTranslation('cardCSub')}</div>
            </div>
          </div>
        </div>

        {/* SECTION 3: EMERGENCY TIPS */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1A1A1A', marginTop: 0, marginBottom: '16px' }}>
            {getTranslation('tipsTitle')}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '16px' }}>🧍</span>
            <span style={{ fontSize: '14px', color: '#1A1A1A' }}>{getTranslation('tip1')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '16px' }}>🩹</span>
            <span style={{ fontSize: '14px', color: '#1A1A1A' }}>{getTranslation('tip2')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '16px' }}>🌬️</span>
            <span style={{ fontSize: '14px', color: '#1A1A1A' }}>{getTranslation('tip3')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '16px' }}>📍</span>
            <span style={{ fontSize: '14px', color: '#1A1A1A' }}>{getTranslation('tip4')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencySOS;
