import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';
import SymptomChecker from '../components/SymptomChecker';
import VoiceInputButton from '../components/common/VoiceInputButton';
import './TeleMedGlobal.css';

const PatientDashboard = () => {
  const { t, setLanguage, language } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const localPatient = JSON.parse(localStorage.getItem('patientData') || '{}');
  const sessionPatient = JSON.parse(localStorage.getItem('currentPatient') || '{}');
  const patientData = sessionPatient.name ? sessionPatient : localPatient;
  const name = patientData.name || 'Patient';
  const patientId = patientData.id;

  const handleLogout = () => {
    logout();
    localStorage.clear();
    setLanguage('');
    navigate('/');
  };

  // Nearby doctors
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  // Appointments
  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(true);

  // Booking modal
  const [showModal, setShowModal] = useState(false);
  const [bookForm, setBookForm] = useState({
    doctor_id: '', mode: 'video',
    symptoms: '', symptom_audio: '', injury_photo: '',
  });
  const [bookError, setBookError] = useState('');
  const [bookSuccess, setBookSuccess] = useState('');
  const [booking, setBooking] = useState(false);

  // Voice Assistant state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const originalSymptomsRef = useRef('');

  // AI Free Text Voice Input State
  const [isFreeTextListening, setIsFreeTextListening] = useState(false);
  const freeTextRecognitionRef = useRef(null);
  const originalFreeTextRef = useRef('');

  // Audio Recording state
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Webcam state
  const [showWebcam, setShowWebcam] = useState(false);
  const videoRef = useRef(null);
  const [videoStream, setVideoStream] = useState(null);

  // Geolocation state
  const [patientCoords, setPatientCoords] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);

  // Symptom Checker modal state
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [symptomQuery, setSymptomQuery] = useState('');
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [freeTextQuery, setFreeTextQuery] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch Symptoms
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/symptoms/list?language=${language || 'hi'}`);
        if (res.ok) {
          const data = await res.json();
          setAvailableSymptoms(data.symptoms || []);
        }
      } catch (e) {
        console.error('AI service not reachable', e);
      }
    };
    fetchSymptoms();
  }, [language]);

  // Filter Symptoms
  useEffect(() => {
    if (!symptomQuery) { setFilteredSymptoms([]); return; }
    const q = symptomQuery.toLowerCase();
    const filtered = availableSymptoms.filter(s =>
      s.translated.toLowerCase().includes(q) || s.english.toLowerCase().includes(q)
    );
    setFilteredSymptoms(filtered.slice(0, 10));
  }, [symptomQuery, availableSymptoms]);

  const handleExtractFromText = async () => {
    if (!freeTextQuery.trim()) return;
    setIsExtracting(true);
    try {
      const res = await fetch(`http://localhost:5001/api/symptoms/from-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: freeTextQuery, language: language || 'hi' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.symptoms && data.symptoms.length > 0) {
          const newSelected = [...selectedSymptoms];
          data.symptoms.forEach(sym => {
            if (!newSelected.some(s => s.english === sym)) {
              const matched = availableSymptoms.find(a => a.english === sym);
              if (matched) newSelected.push(matched);
            }
          });
          setSelectedSymptoms(newSelected);
          setFreeTextQuery('');
        } else {
          alert('No symptoms found / कोई लक्षण नहीं मिला');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await fetch(`http://localhost:5001/api/symptoms/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms.map(s => s.english),
          language: language || 'hi'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data);
      }
    } catch (e) {
      console.error(e);
      alert('Error analyzing symptoms');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const SPEAK_TO_TYPE_LABEL = {
    hi: '🎤 बोलकर लिखें', en: '🎤 Speak to type', gu: '🎤 બોલીને લખો',
    mr: '🎤 बोलून लिहा', ta: '🎤 பேசி தட்டச்சு', te: '🎤 మాట్లాడి టైప్',
    pa: '🎤 ਬੋਲ ਕੇ ਲਿਖੋ', bn: '🎤 বলে লিখুন', kn: '🎤 ಮಾತಾಡಿ ಬರೆಯಿರಿ',
    ml: '🎤 പറഞ്ഞ് ടൈപ്പ്', mw: '🎤 बोलकर लिखो', as: '🎤 কৈ লিখক',
    or: '🎤 କହି ଲିଖନ୍ତୁ', nm: '🎤 Bolke likho'
  };

  const LISTENING_POPUP_LABEL = {
    hi: '🎤 सुन रहा हूँ... बोलिए', en: '🎤 Listening... speak now', gu: '🎤 સાંભળી રહ્યો છું... બોલો',
    mr: '🎤 ऐकत आहे... बोला', ta: '🎤 கேட்கிறேன்... பேசுங்கள்', te: '🎤 వింటున్నాను... మాట్లాడండి',
    pa: '🎤 ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ', bn: '🎤 শুনছি... বলুন', kn: '🎤 ಕೇಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡಿ',
    ml: '🎤 കേൾക്കുന്നു... സംസാരിക്കൂ', mw: '🎤 सुण रियो हूँ... बोलो', as: '🎤 শুনি আছোঁ... কওক',
    or: '🎤 ଶୁଣୁଛି... କୁହନ୍ତୁ', nm: '🎤 Suni ase... kotha kow'
  };

  const VOICE_RECORD_LABEL = {
    hi: '🎙️ अपनी तकलीफ बोलकर सेव करें — डॉक्टर सुन लेगा',
    en: '🎙️ Record your problem — Doctor will listen',
    gu: '🎙️ તકલીફ બોલીને સેવ કરો — ડૉક્ટર સાંભળશે',
    mr: '🎙️ तक्रार बोलून सेव्ह करा — डॉक्टर ऐकतील',
    ta: '🎙️ பிரச்சனை பதிவு செய்யுங்கள் — மருத்துவர் கேட்பார்',
    te: '🎙️ సమస్య రికార్డ్ చేయండి — డాక్టర్ వింటారు',
    pa: '🎙️ ਤਕਲੀਫ਼ ਬੋਲ ਕੇ ਸੇਵ ਕਰੋ — ਡਾਕਟਰ ਸੁਣੇਗਾ',
    bn: '🎙️ সমস্যা বলে সেভ করুন — ডাক্তার শুনবেন',
    kn: '🎙️ ತೊಂದರೆ ಹೇಳಿ ಸೇವ್ ಮಾಡಿ — ಡಾಕ್ಟರ್ ಕೇಳುತ್ತಾರೆ',
    ml: '🎙️ പ്രശ്നം പറഞ്ഞ് സേവ് ചെയ്യൂ — ഡോക്ടർ കേൾക്കും',
    mw: '🎙️ तकलीफ बोलकर सेव करो — डॉक्टर सुण लेगो',
    as: '🎙️ সমস্যা কৈ সংৰক্ষণ কৰক — ডাক্তাৰে শুনিব',
    or: '🎙️ ସମସ୍ୟା କହି ସେଭ୍ କରନ୍ତୁ — ଡାକ୍ତର ଶୁଣିବେ',
    nm: '🎙️ Takleef bolke save karo — Doctor sun lega'
  };

  const RECORDING_BANNER = {
    hi: '🔴 Recording... bolte rahiye', en: '🔴 Recording... keep speaking',
    gu: '🔴 Recording... બોલતા રહો', mr: '🔴 Recording... बोलत राहा',
    ta: '🔴 Recording... தொடர்ந்து பேசுங்கள்', te: '🔴 Recording... మాట్లాడుతూ ఉండండి',
    pa: '🔴 Recording... ਬੋਲਦੇ ਰਹੋ', bn: '🔴 Recording... বলতে থাকুন',
    kn: '🔴 Recording... ಮಾತನಾಡುತ್ತಿರಿ', ml: '🔴 Recording... സംസാരിച്ചുകൊണ്ടിരിക്കുക',
    mw: '🔴 Recording... बोलता रो', as: '🔴 Recording... কৈ থাকক',
    or: '🔴 Recording... କହିବା ଜାରି ରଖନ୍ତୁ', nm: '🔴 Recording... bolte thako'
  };

  const PHOTO_UPLOAD_LABEL = {
    hi: '📷 चोट या दाने की फोटो डालें — डॉक्टर देख लेगा',
    en: '📷 Upload photo of injury or rash — Doctor will see it',
    gu: '📷 ઈજા કે ફોલ્લીઓની ફોટો નાખો — ડૉક્ટર જોઈ લેશે',
    mr: '📷 दुखापत किंवा पुरळाचा फोटो टाका — डॉक्टर पाहतील',
    ta: '📷 காயம் அல்லது தடிப்பின் புகைப்படம் — மருத்துவர் பார்ப்பார்',
    te: '📷 గాయం లేదా దద్దుర్ల ఫోటో — డాక్టర్ చూస్తారు',
    pa: '📷 ਸੱਟ ਜਾਂ ਧੱਫੜ ਦੀ ਫੋਟੋ ਪਾਓ — ਡਾਕਟਰ ਦੇਖ ਲਵੇਗਾ',
    bn: '📷 আঘাত বা ফুসকুড়ির ছবি দিন — ডাক্তার দেখবেন',
    kn: '📷 ಗಾಯ ಅಥವಾ ದದ್ದಿನ ಫೋಟೋ ಹಾಕಿ — ಡಾಕ್ಟರ್ ನೋಡುತ್ತಾರೆ',
    ml: '📷 പരിക്കിന്റെ ഫോട്ടോ ഇടൂ — ഡോക്ടർ കാണും',
    mw: '📷 चोट रे दाने री फोटो डालो — डॉक्टर देख लेगो',
    as: '📷 আঘাতৰ ফটো দিয়ক — ডাক্তাৰে চাব',
    or: '📷 ଆଘାତର ଫଟୋ ଦିଅନ୍ତୁ — ଡାକ୍ତର ଦେଖିବେ',
    nm: '📷 Chot ki photo dalo — Doctor dekh lega'
  };

  const PHOTO_SAVED_BANNER = {
    hi: '✅ Photo save ho gayi', en: '✅ Photo saved successfully',
    gu: '✅ Photo સેવ થઈ ગઈ', mr: '✅ Photo सेव्ह झाला',
    ta: '✅ Photo சேமிக்கப்பட்டது', te: '✅ Photo సేవ్ చేయబడింది',
    pa: '✅ Photo ਸੇਵ ਹੋ ਗਈ', bn: '✅ Photo সেভ হয়েছে',
    kn: '✅ Photo ಸೇವ್ ಆಗಿದೆ', ml: '✅ Photo സേവ് ചെയ്തു',
    mw: '✅ Photo सेव हो गी', as: '✅ Photo সংৰক্ষণ কৰা হ\'ল',
    or: '✅ Photo ସେଭ୍ ହୋଇଗଲା', nm: '✅ Photo save hoise'
  };

  const SCHEME_BANNER_LABEL = {
    hi: '💰 इस बीमारी का मुफ्त इलाज सरकारी योजना से हो सकता है — देखें',
    en: '💰 This illness may be treated free under govt schemes — Check',
    gu: '💰 આ બીમારીની મફત સારવાર સરકારી યોજનાથી થઈ શકે છે — જુઓ',
    mr: '💰 या आजाराचा मोफत उपचार सरकारी योजनेतून होऊ शकतो — पहा',
    ta: '💰 இந்த நோய்க்கு அரசு திட்டத்தில் இலவச சிகிச்சை கிடைக்கலாம் — பார்க்க',
    te: '💰 ఈ వ్యాధికి ప్రభుత్వ పథకంలో ఉచిత చికిత్స దొరకవచ్చు — చూడండి',
    pa: '💰 ਇਸ ਬਿਮਾਰੀ ਦਾ ਮੁਫ਼ਤ ਇਲਾਜ ਸਰਕਾਰੀ ਯੋਜਨਾ ਤੋਂ ਹੋ ਸਕਦਾ ਹੈ — ਦੇਖੋ',
    bn: '💰 এই রোগের বিনামূল্যে চিকিৎসা সরকারি প্রকল্পে হতে পারে — দেখুন',
    kn: '💰 ಈ ಕಾಯಿಲೆಗೆ ಸರ್ಕಾರಿ ಯೋಜನೆಯಡಿ ಉಚಿತ ಚಿಕಿತ್ಸೆ ಸಿಗಬಹುದು — ನೋಡಿ',
    ml: '💰 ഈ രോഗത്തിന് സർക്കാർ പദ്ധതിയിൽ സൗജന്യ ചികിത്സ ലഭിച്ചേക്കാം — കാണുക',
    mw: '💰 इण बीमारी रो मुफ्त इलाज सरकारी योजना सूं हो सके — देखो',
    as: '💰 এই ৰোগৰ বিনামূলীয়া চিকিৎসা চৰকাৰী আঁচনিৰ অধীনত হ\'ব পাৰে — চাওক',
    or: '💰 ଏହି ରୋଗର ମାଗଣା ଚିକିତ୍ସା ସରକାରୀ ଯୋଜନାରେ ହୋଇପାରେ — ଦେଖନ୍ତୁ',
    nm: '💰 Iyaar bemari laagi free ilaaj sarkari scheme te hobo pare — Sun'
  };

  const LOCATION_LABEL = {
    hi: 'सटीक नजदीकी डॉक्टर के लिए लोकेशन चालू करें',
    en: 'Turn on location for exact nearby doctors',
    gu: 'ચોક્કસ નજીકના ડૉક્ટર માટે લોકેશન ચાલુ કરો',
    mr: 'अचूक जवळचे डॉक्टर शोधण्यासाठी लोकेशन सुरू करा',
    ta: 'துல்லியமான அருகிலுள்ள மருத்துவருக்கு இருப்பிடத்தை இயக்கவும்',
    te: 'ఖచ్చితమైన సమీప వైద్యుల కోసం లొకేషన్ ఆన్ చేయండి',
    pa: 'ਸਹੀ ਨੇੜਲੇ ਡਾਕਟਰ ਲਈ ਟਿਕਾਣਾ ਚਾਲੂ ਕਰੋ',
    bn: 'সঠিক কাছাকাছি ডাক্তারের জন্য অবস্থান চালু করুন',
    kn: 'ನಿಖರ ಹತ್ತಿರದ ವೈದ್ಯರಿಗಾಗಿ ಸ್ಥಳ ಆನ್ ಮಾಡಿ',
    ml: 'കൃത്യമായ അടുത്തുള്ള ഡോക്ടർക്ക് ലൊക്കേഷൻ ഓൺ ചെയ്യൂ',
    mw: 'सटीक नेड़े रा डॉक्टर वास्ते लोकेशन चालू करो',
    as: 'নিখুঁত ওচৰৰ ডাক্তাৰৰ বাবে অৱস্থান অন কৰক',
    or: 'ସଠିକ୍ ନିକଟସ୍ଥ ଡାକ୍ତର ପାଇଁ ଲୋକେସନ୍ ଅନ୍ କରନ୍ତୁ',
    nm: 'Thik najdik doctor laagi location on koro'
  };

  const SCHEDULED_TIME_MSG = {
    hi: 'डॉक्टर ने वीडियो कॉल का समय तय किया है: ',
    en: 'Doctor has scheduled a video call at: ',
    gu: 'ડૉક્ટરે વીડિયો કૉલનો સમય નક્કી કર્યો છે: ',
    mr: 'डॉक्टरांनी व्हिडिओ कॉलची वेळ ठरवली आहे: ',
    ta: 'மருத்துவர் வீடியோ அழைப்பை திட்டமிட்டுள்ளார்: ',
    te: 'డాక్టర్ వీడియో కాల్ సమయం నిర్ణయించారు: ',
    pa: 'ਡਾਕਟਰ ਨੇ ਵੀਡੀਓ ਕਾਲ ਦਾ ਸਮਾਂ ਤੈਅ ਕੀਤਾ ਹੈ: ',
    bn: 'ডাক্তার ভিডিও কলের সময় নির্ধারণ করেছেন: ',
    kn: 'ವೈದ್ಯರು ವೀಡಿಯೊ ಕರೆ ಸಮಯವನ್ನು ನಿಗದಿಪಡಿಸಿದ್ದಾರೆ: ',
    ml: 'ഡോക്ടർ വീഡിയോ കോൾ സമയം നിശ്ചയിച്ചു: ',
    mw: 'डॉक्टर वीडियो कॉल रो टेम राख्यो है: ',
    as: 'ডাক্তাৰে ভিডিঅ\' কলৰ সময় নিৰ্ধাৰণ কৰিছে: ',
    or: 'ଡାକ୍ତର ଭିଡିଓ କଲ୍ ସମୟ ସ୍ଥିର କରିଛନ୍ତି: ',
    nm: 'Doctor video call scheduled korise: '
  };

  const INCOMING_CALL_MSG = {
    hi: 'वीडियो कॉल आ रही है...',
    en: 'Incoming Video Call...',
    gu: 'વીડિયો કૉલ આવી રહ્યો છે...',
    mr: 'व्हिडिओ कॉल येत आहे...',
    ta: 'வீடியோ அழைப்பு வருகிறது...',
    te: 'వీడియో కాల్ వస్తోంది...',
    pa: 'ਵੀਡੀਓ ਕਾਲ ਆ ਰਹੀ ਹੈ...',
    bn: 'ভিডিও কল আসছে...',
    kn: 'ವೀಡಿಯೊ ಕರೆ ಬರುತ್ತಿದೆ...',
    ml: 'വീഡിയോ കോൾ വരുന്നു...',
    mw: 'वीडियो कॉल आवे है...',
    as: 'ভিডিঅ\' কল আহি আছে...',
    or: 'ଭିଡିଓ କଲ୍ ଆସୁଛି...',
    nm: 'Video call ahise...'
  };

  const [incomingCall, setIncomingCall] = useState(null);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Aapka browser voice input support nahi karta. Chrome use karein.');
      return;
    }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    originalSymptomsRef.current = bookForm.symptoms || '';
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const langMap = { hi:'hi-IN',en:'en-IN',mw:'hi-IN',gu:'gu-IN',mr:'mr-IN',ta:'ta-IN',te:'te-IN',pa:'pa-IN',bn:'bn-IN',kn:'kn-IN',ml:'ml-IN',as:'hi-IN',or:'or-IN',nm:'en-IN' };
    recognition.lang = langMap[language] || 'hi-IN';
    recognition.continuous = false; recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
      const sep = originalSymptomsRef.current && originalSymptomsRef.current.trim() !== '' ? ' ' : '';
      setBookForm(prev => ({ ...prev, symptoms: originalSymptomsRef.current + sep + transcript }));
    };
    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') alert('Microphone permission allow karein');
      else if (event.error === 'no-speech') alert('Kuch sunai nahi diya, dobara try karein');
      else alert('Voice input mein samasya hui');
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(prev => { if (prev && recognitionRef.current) { try { recognitionRef.current.start(); } catch(e){} return true; } return false; });
    recognitionRef.current = recognition; recognition.start(); setIsListening(true);
  };

  const toggleFreeTextListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Aapka browser voice input support nahi karta. Chrome use karein.'); return;
    }
    if (isFreeTextListening) { freeTextRecognitionRef.current?.stop(); setIsFreeTextListening(false); return; }
    originalFreeTextRef.current = freeTextQuery || '';
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const langMap = { hi:'hi-IN',en:'en-IN',mw:'hi-IN',gu:'gu-IN',mr:'mr-IN',ta:'ta-IN',te:'te-IN',pa:'pa-IN',bn:'bn-IN',kn:'kn-IN',ml:'ml-IN',as:'hi-IN',or:'or-IN',nm:'en-IN' };
    recognition.lang = langMap[language] || 'hi-IN';
    recognition.continuous = false; recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
      const sep = originalFreeTextRef.current && originalFreeTextRef.current.trim() !== '' ? ' ' : '';
      setFreeTextQuery(originalFreeTextRef.current + sep + transcript);
    };
    recognition.onerror = () => setIsFreeTextListening(false);
    recognition.onend = () => setIsFreeTextListening(prev => { if (prev && freeTextRecognitionRef.current) { try { freeTextRecognitionRef.current.start(); } catch(e){} return true; } return false; });
    freeTextRecognitionRef.current = recognition; recognition.start(); setIsFreeTextListening(true);
  };

  useEffect(() => {
    if (!showModal && !showSymptomModal) {
      recognitionRef.current?.stop(); setIsListening(false);
      if (isRecordingAudio) { mediaRecorderRef.current?.stop(); setIsRecordingAudio(false); }
      if (videoStream) { videoStream.getTracks().forEach(track => track.stop()); setVideoStream(null); setShowWebcam(false); }
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showModal, showSymptomModal, isRecordingAudio, videoStream]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop(); freeTextRecognitionRef.current?.stop(); mediaRecorderRef.current?.stop();
      if (videoStream) videoStream.getTracks().forEach(track => track.stop());
    };
  }, [videoStream]);

  const toggleAudioRecording = async () => {
    if (isRecordingAudio) { mediaRecorderRef.current?.stop(); setIsRecordingAudio(false); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder; audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader(); reader.readAsDataURL(audioBlob);
        reader.onloadend = () => setBookForm(prev => ({ ...prev, symptom_audio: reader.result }));
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start(); setIsRecordingAudio(true);
    } catch (err) { alert('Microphone access denied or unavailable.'); }
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setPatientCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationDenied(false); },
        (err) => { console.error('Location error:', err); setLocationDenied(true); }
      );
    }
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream); setShowWebcam(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch (err) { console.error('Webcam error:', err); alert('Camera access denied or unavailable.'); }
  };

  const stopWebcam = () => {
    if (videoStream) videoStream.getTracks().forEach(track => track.stop());
    setVideoStream(null); setShowWebcam(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      setBookForm(prev => ({ ...prev, injury_photo: canvas.toDataURL('image/jpeg') }));
      stopWebcam();
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setDoctorsLoading(true);
        const state = patientData.state || '';
        if (!state) { setDoctorsLoading(false); return; }
        let url = `${API_BASE_URL}/api/doctors/nearby?state=${encodeURIComponent(state)}`;
        if (patientCoords) url += `&patientLat=${patientCoords.lat}&patientLng=${patientCoords.lng}`;
        const res = await fetch(url);
        if (res.ok) { const data = await res.json(); setDoctors(data.data || []); } else { setDoctors([]); }
      } catch (err) { console.error('Error fetching doctors:', err); setDoctors([]); }
      finally { setDoctorsLoading(false); }
    };
    fetchDoctors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientData.state, patientCoords]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientId || patientId === 'local-temp-id') { setApptLoading(false); return; }
      try {
        const res = await fetch(`${API_BASE_URL}/api/appointments/patient/${patientId}`);
        if (res.ok) { 
          const data = await res.json(); 
          setAppointments(data.data || []); 
          const ringingAppt = (data.data || []).find(a => a.status === 'confirmed' && a.call_started && (a.mode === 'Video Call' || a.mode === 'video') && !sessionStorage.getItem(`call_answered_${a.id}`));
          if (ringingAppt) {
            setIncomingCall(ringingAppt);
          } else {
            setIncomingCall(null);
          }
        } else { setAppointments([]); }
      } catch (err) { console.error('Error fetching appointments:', err); setAppointments([]); }
      finally { setApptLoading(false); }
    };
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000);
    return () => clearInterval(interval);
  }, [patientId]);

  const handleBookChange = (e) => { setBookForm(prev => ({ ...prev, [e.target.name]: e.target.value })); setBookError(''); };

  const handleBookVoiceInput = (transcript) => {
    setBookForm(prev => ({
      ...prev,
      symptoms: prev.symptoms ? `${prev.symptoms} ${transcript}` : transcript
    }));
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault(); setBookError(''); setBookSuccess('');
    if (!bookForm.doctor_id || (!bookForm.symptoms && !bookForm.symptom_audio)) {
      setBookError(t('fillAllFields') || 'Please fill all fields'); return;
    }
    setBooking(true);
    try {
      const now = new Date();
      const autoDate = now.toISOString().split('T')[0];
      const autoTime = now.toTimeString().split(' ')[0].slice(0,5);
      const res = await fetch(`${API_BASE_URL}/api/appointments/book`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId, doctor_id: bookForm.doctor_id, date: autoDate, time: autoTime, mode: bookForm.mode, symptoms: bookForm.symptoms, symptom_audio: bookForm.symptom_audio, injury_photo: bookForm.injury_photo }),
      });
      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error(`Server Error (${res.status}): ${res.statusText || 'Response is not valid JSON'}`);
      }

      if (res.ok) {
        setBookSuccess(t('consultationRequestSent') || 'Appointment booked successfully!');
        setBookForm({ doctor_id:'',mode:'video',symptoms:'',symptom_audio:'',injury_photo:'' });
        const apptRes = await fetch(`${API_BASE_URL}/api/appointments/patient/${patientId}`);
        if (apptRes.ok) { 
          const apptData = await apptRes.json(); 
          setAppointments(apptData.data || []); 
        }
        
        setTimeout(() => {
          setShowModal(false);
          setBookSuccess('');
        }, 3000);
      } else { setBookError(data.message || 'Booking failed. Please try again.'); }
    } catch (err) { console.error('Error booking appointment:', err); setBookError(err.message || 'An error occurred. Please try again.'); }
    finally { setBooking(false); }
  };

  const modalOverlayStyle = { position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000 };
  const modalStyle = { background:'#fff',borderRadius:'16px',padding:'24px',width:'100%',maxWidth:'480px',boxShadow:'0 8px 32px rgba(0,0,0,0.18)',maxHeight:'90vh',overflowY:'auto' };
  const inputStyle = { width:'100%',padding:'12px 16px',border:'1.5px solid #E0E0E0',borderRadius:'10px',fontSize:'15px',marginTop:'4px',boxSizing:'border-box' };
  const labelStyle = { fontSize:'13px',fontWeight:600,color:'#555',display:'block' };

  // Symptom checker label lookups
  const sympTitle = t('symptomChecker') || 'Symptom Checker';
  const sympSearch = t('searchSymptoms') || 'Search symptoms...';
  const sympOrDescribe = t('orDescribe') || 'Or describe in your own words';
  const sympAnalyze = t('analyze') || 'Analyze';
  const sympSelected = { hi:'चुने गए लक्षण:', en:'Selected symptoms:', default:'Selected symptoms:' };
  const sympNoSymptoms = { hi:'कोई लक्षण नहीं चुना गया', en:'No symptoms selected', default:'No symptoms selected' };
  const sympRecommendedDoc = { hi:'सलाह के लिए डॉक्टर:', en:'Recommended Doctor:', default:'Recommended Doctor:' };
  const sympHomeRemedies = { hi:'घरेलू नुस्खे:', en:'Home Remedies:', default:'Home Remedies:' };
  const sympWhenToSee = { hi:'डॉक्टर से कब मिलें:', en:'When to see Doctor:', default:'When to see Doctor:' };
  const sympEmergency = { hi:'तुरंत 108 पर कॉल करें', en:'CALL 108 IMMEDIATELY', default:'CALL 108 IMMEDIATELY' };
  const sympBookBtn = { hi:'यह डॉक्टर बुक करें', en:'Book this Doctor', default:'Book this Doctor' };
  const getL = (obj) => obj[language] || obj['en'] || obj['default'] || '';

  return (
    <div className="tm-page-container">
      <button className="tm-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="tm-dashboard-content">
        <div className="tm-card tm-header-card">
          <div className="tm-header-info">
            <h1 className="tm-greeting">Hello, {name} 👋</h1>
            <p className="tm-header-sub">Your Health Centre</p>
          </div>
          <button className="tm-logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        <div className="tm-book-consultation-card" onClick={() => { setShowModal(true); setBookError(''); setBookSuccess(''); }}>
          <h2 className="tm-book-title">🩺 {t('bookConsult')}</h2>
          <p className="tm-book-sub">{t('bookConsultSub')}</p>
          <div className="tm-book-arrow">→</div>
        </div>

        <style>{`
          @keyframes aarogyaPulse {
            0% { box-shadow: 0 4px 20px rgba(46, 125, 50, 0.35); }
            50% { box-shadow: 0 4px 28px rgba(46, 125, 50, 0.55); }
            100% { box-shadow: 0 4px 20px rgba(46, 125, 50, 0.35); }
          }
        `}</style>
        <div style={{
          width: '100%',
          boxSizing: 'border-box',
          marginTop: '20px',
          marginBottom: '20px',
          background: 'white',
          borderRadius: '16px',
          border: '1.5px solid #C8E6C9',
          padding: '24px',
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
              {t('aiServiceBadge')}
            </span>
            
            <button
              onClick={() => setShowSymptomModal(true)}
              onMouseOver={(e) => (e.currentTarget.style.background = '#1B5E20')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#2E7D32')}
              style={{
                background: '#2E7D32',
                color: 'white',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              {t('symptomCheckNow')}
            </button>
          </div>

          {/* Row 2 — Headline */}
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#1A1A1A',
            marginTop: '16px',
            marginBottom: '6px'
          }}>
            {t('symptomCheckerHeading')}
          </h3>

          {/* Row 3 — Sub text */}
          <p style={{
            fontSize: '13px',
            color: '#555555',
            marginBottom: '16px',
            marginTop: '0'
          }}>
            {t('symptomCheckerSubtitle')}
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
              {t('symptomChip1')}
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
              {t('symptomChip2')}
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
              {t('symptomChip3')}
            </span>
          </div>
        </div>

        <div className="tm-section">
          <h2 className="tm-section-heading">📅 Upcoming Consultations</h2>
          {apptLoading ? (
            <p>Loading...</p>
          ) : appointments.length > 0 ? (
            appointments.map((appt) => (
              <div key={appt.id} className="tm-card tm-appt-card">
                <p><strong>Doctor:</strong> {appt.doctor_name} ({appt.specialization})</p>
                <p><strong>Hospital:</strong> {appt.hospital_name}</p>
                <p><strong>Date:</strong> {appt.date} at {appt.time}</p>
                <p><strong>Mode:</strong> {appt.mode}</p>
                <p><strong>Symptoms:</strong> {appt.symptoms}</p>
                <p><strong>Status:</strong> <span style={{ textTransform:'capitalize', fontWeight:600 }}>{appt.status}</span></p>
                {appt.scheduled_time && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#E3F2FD', borderRadius: '8px', border: '1px solid #90CAF9' }}>
                    <p style={{ margin: 0, color: '#1565C0', fontWeight: 'bold' }}>
                      <span style={{ fontSize: '18px', marginRight: '8px' }}>⏰</span>
                      {SCHEDULED_TIME_MSG[language] || SCHEDULED_TIME_MSG.en} {appt.scheduled_time}
                    </p>
                  </div>
                )}
                {appt.status === 'confirmed' && (appt.mode === 'Video Call' || appt.mode === 'video') && (
                  <div style={{ marginTop: '12px' }}>
                    <button 
                      onClick={() => {
                        sessionStorage.setItem(`call_answered_${appt.id}`, 'true');
                        navigate(`/video-call/appointment-${appt.id}`);
                      }}
                      disabled={!appt.call_started}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: appt.call_started ? '#16a34a' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: appt.call_started ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold',
                        width: '100%'
                      }}
                    >
                      {appt.call_started ? (t('joinVideoCall') || 'Join Video Call') : (t('waitingForDoctor') || 'Waiting for doctor to start the call...')}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="tm-empty-state">
              <div className="tm-empty-icon">📋</div>
              <div className="tm-empty-text">No consultations yet</div>
              <div className="tm-empty-sub">Book your first consultation above</div>
            </div>
          )}
        </div>

        <div className="tm-section">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <h2 className="tm-section-heading" style={{ margin:0 }}>📍 Nearby Doctors</h2>
          </div>

          {patientData.state && !patientCoords && !locationDenied && (
            <div style={{ marginBottom:'16px', backgroundColor:'#e0f2fe', padding:'12px', borderRadius:'12px', border:'1px solid #bae6fd', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:'13px', color:'#0369a1', fontWeight:'bold' }}>
                {LOCATION_LABEL[language] || LOCATION_LABEL.en}
              </div>
              <button onClick={requestLocation} style={{ background:'#0284c7', color:'#fff', border:'none', padding:'8px 16px', borderRadius:'20px', cursor:'pointer', fontWeight:'bold', fontSize:'12px', whiteSpace:'nowrap', marginLeft:'12px' }}>
                Turn On
              </button>
            </div>
          )}

          {doctorsLoading ? (
            <p>Loading...</p>
          ) : doctors.length > 0 ? (
            doctors.map((doc) => (
              <div key={doc.id} className="tm-card tm-doctor-card" style={{ position:'relative' }}>
                {doc.distance !== undefined && (
                  <div style={{ position:'absolute', top:'16px', right:'16px', backgroundColor:'#dcfce7', color:'#166534', padding:'4px 10px', borderRadius:'12px', fontSize:'12px', fontWeight:'bold' }}>
                    {doc.distance} km away
                  </div>
                )}
                <div className="tm-doc-info">
                  <h3 style={{ paddingRight: doc.distance !== undefined ? '80px' : '0' }}>{doc.name}</h3>
                  <p><strong>{t('specialization')}:</strong> {doc.specialization}</p>
                  <p><strong>{t('hospital')}:</strong> {doc.hospital_name}</p>
                </div>
                <button className="tm-btn-primary" onClick={() => { setShowModal(true); setBookForm(prev => ({ ...prev, doctor_id: doc.id })); }} style={{ width:'100%', marginTop:'16px' }}>
                  {t('requestConsult')}
                </button>
              </div>
            ))
          ) : (
            <div className="tm-empty-state">
              <div className="tm-empty-icon">🏥</div>
              <div className="tm-empty-text">No doctors found nearby</div>
              <div className="tm-empty-sub">We're adding more doctors in your area</div>
            </div>
          )}
        </div>

        <div className="tm-card tm-records-card" onClick={() => alert('Feature coming soon!')} style={{ cursor:'pointer' }}>
          <div className="tm-records-left">
            <div className="tm-records-icon">📁</div>
            <h2 className="tm-records-title">My Health Records</h2>
            <div className="tm-badge-coming-soon">Coming Soon</div>
          </div>
          <p className="tm-records-sub" style={{ marginTop:'8px' }}>Your prescriptions and test reports will appear here</p>
        </div>
      </div>

      {/* ── FLOATING SYMPTOM CHECKER BUTTON REMOVED (now a banner) ── */}

      {/* ── INCOMING CALL MODAL ── */}
      {incomingCall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px 32px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', animation: 'pulse-recording-banner 2s infinite' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'aarogyaPulse 1.5s infinite' }}>📞</div>
            <h2 style={{ fontSize: '24px', color: '#1A1A1A', marginBottom: '8px', fontWeight: 'bold' }}>Dr. {incomingCall.doctor_name}</h2>
            <p style={{ fontSize: '18px', color: '#16a34a', fontWeight: 'bold', marginBottom: '32px' }}>
              {INCOMING_CALL_MSG[language] || INCOMING_CALL_MSG.en}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={() => {
                  sessionStorage.setItem(`call_answered_${incomingCall.id}`, 'true');
                  setIncomingCall(null);
                }}
                style={{ flex: 1, backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '32px', height: '56px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Decline
              </button>
              <button 
                onClick={() => {
                  sessionStorage.setItem(`call_answered_${incomingCall.id}`, 'true');
                  navigate(`/video-call/appointment-${incomingCall.id}`);
                }}
                style={{ flex: 1, backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '32px', height: '56px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 16px rgba(34, 197, 94, 0.4)' }}
              >
                Answer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SYMPTOM CHECKER FULL-SCREEN MODAL ── */}
      {showSymptomModal && (
        <SymptomChecker 
          onClose={() => setShowSymptomModal(false)}
          onBookConsultation={(symptomsString) => {
            setBookForm(prev => ({ ...prev, symptoms: symptomsString }));
            setShowSymptomModal(false);
            setShowModal(true);
          }}
        />
      )}

      {/* ── BOOKING CONSULTATION MODAL ── */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', position:'sticky', top:'-24px', backgroundColor:'#fff', zIndex:10, paddingTop:'24px', paddingBottom:'16px', margin:'-24px -24px 20px -24px', paddingLeft:'24px', paddingRight:'24px', borderBottom:'1px solid #E0E0E0' }}>
              <h2 style={{ margin:0, fontSize:'20px' }}>{t('bookConsult')}</h2>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', fontSize:'22px', cursor:'pointer', color:'#6b7280' }}>&times;</button>
            </div>
            {bookError && <p style={{ color:'red', marginBottom:'12px', fontSize:'14px' }}>{bookError}</p>}
            {bookSuccess && <p style={{ color:'green', marginBottom:'12px', fontSize:'14px' }}>{bookSuccess}</p>}
            <form onSubmit={handleBookSubmit}>
              <div style={{ marginBottom:'14px' }}>
                <label style={labelStyle}>Doctor</label>
                <select name="doctor_id" value={bookForm.doctor_id} onChange={handleBookChange} style={inputStyle} required>
                  <option value="">Select a doctor</option>
                  {doctors.map(doc => (<option key={doc.id} value={doc.id}>{doc.name} — {doc.specialization}</option>))}
                </select>
              </div>
              <div style={{ marginBottom:'14px' }}>
                <label style={labelStyle}>Mode</label>
                <select name="mode" value={bookForm.mode} onChange={handleBookChange} style={inputStyle}>
                  <option value="video">Video Call</option>
                  <option value="audio">Audio Call</option>
                  <option value="in-person">In Person</option>
                </select>
              </div>
              <div style={{ marginBottom:'20px' }}>
                <label style={labelStyle}>Symptoms / Reason</label>
                <div style={{ position:'relative', marginTop:'4px' }}>
                  <textarea name="symptoms" value={bookForm.symptoms} onChange={handleBookChange} rows={4}
                    style={{ ...inputStyle, resize:'vertical', marginTop:0, minHeight:'100px' }}
                    placeholder="Describe your symptoms..." />
                  <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'6px' }}>
                    <VoiceInputButton language={language} onResult={(text) => handleBookVoiceInput(text)} />
                  </div>
                </div>

                {/* Voice Recorder */}
                <div style={{ marginTop:'20px', padding:'16px', backgroundColor:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'16px', textAlign:'center', position:'relative' }}>
                  <div style={{ fontSize:'16px', fontWeight:'bold', color:'#166534', marginBottom:'16px' }}>
                    {VOICE_RECORD_LABEL[language] || VOICE_RECORD_LABEL['hi']}
                  </div>
                  {isRecordingAudio && (
                    <div style={{ position:'absolute', top:'-24px', left:'50%', transform:'translateX(-50%)', backgroundColor:'#dc2626', color:'#fff', padding:'8px 20px', borderRadius:'24px', fontSize:'14px', fontWeight:'bold', boxShadow:'0 4px 12px rgba(220,38,38,0.3)', zIndex:10, whiteSpace:'nowrap' }}>
                      {RECORDING_BANNER[language] || RECORDING_BANNER['hi']}
                    </div>
                  )}
                  <button type="button" onClick={toggleAudioRecording} style={{ background: isRecordingAudio ? '#dc2626' : '#16a34a', color:'#fff', border:'none', borderRadius:'28px', height:'56px', padding:'0 32px', cursor:'pointer', fontSize:'20px', fontWeight:'bold', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'all 0.2s', width:'100%', maxWidth:'300px' }}>
                    {isRecordingAudio ? '⏹ Stop' : '🎙️ Record'}
                  </button>
                  {bookForm.symptom_audio && !isRecordingAudio && (
                    <div style={{ marginTop:'16px', backgroundColor:'#fff', padding:'12px', borderRadius:'12px', border:'1px solid #dcfce7' }}>
                      <audio controls src={bookForm.symptom_audio} style={{ width:'100%', height:'40px' }} />
                      <button type="button" onClick={() => setBookForm(prev => ({ ...prev, symptom_audio:'' }))} style={{ background:'none', border:'none', color:'#dc2626', fontSize:'13px', cursor:'pointer', marginTop:'8px', fontWeight:'bold' }}>✖ Remove Recording</button>
                    </div>
                  )}
                </div>

                <style>{`
                  @keyframes pulse { 0%{opacity:0.3}50%{opacity:1}100%{opacity:0.3} }
                  @keyframes pulse-recording-banner { 0%{box-shadow:0 0 0 0 rgba(220,38,38,0.5)}70%{box-shadow:0 0 0 12px rgba(220,38,38,0)}100%{box-shadow:0 0 0 0 rgba(220,38,38,0)} }
                  @keyframes slide-up-photo { from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)} }
                `}</style>
              </div>

              {/* Photo Upload */}
              <div style={{ marginTop:'20px', padding:'16px', backgroundColor:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:'16px', textAlign:'center', position:'relative', marginBottom:'20px' }}>
                <div style={{ fontSize:'16px', fontWeight:'bold', color:'#1E3A8A', marginBottom:'16px' }}>
                  {PHOTO_UPLOAD_LABEL[language] || PHOTO_UPLOAD_LABEL['hi']}
                </div>
                {bookForm.injury_photo && (
                  <div style={{ position:'absolute', top:'-24px', left:'50%', transform:'translateX(-50%)', backgroundColor:'#16a34a', color:'#fff', padding:'8px 20px', borderRadius:'24px', fontSize:'14px', fontWeight:'bold', boxShadow:'0 4px 12px rgba(22,163,74,0.3)', zIndex:10, whiteSpace:'nowrap' }}>
                    {PHOTO_SAVED_BANNER[language] || PHOTO_SAVED_BANNER['hi']}
                  </div>
                )}
                {showWebcam ? (
                  <div style={{ marginBottom:'10px' }}>
                    <video ref={videoRef} autoPlay playsInline style={{ width:'100%', borderRadius:'8px', backgroundColor:'#000' }} />
                    <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
                      <button type="button" onClick={capturePhoto} className="tm-btn-primary" style={{ flex:1, backgroundColor:'#1A6FDB', borderColor:'#1A6FDB', height:'56px', fontSize:'18px', borderRadius:'28px' }}>📸 Capture</button>
                      <button type="button" onClick={stopWebcam} className="tm-btn-secondary" style={{ flex:1, height:'56px', fontSize:'18px', borderRadius:'28px' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setBookForm(prev => ({ ...prev, injury_photo: reader.result })); reader.readAsDataURL(file); } }} style={{ display:'none' }} id="galleryInput" />
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', justifyContent:'center', marginBottom:'10px' }}>
                      <button type="button" onClick={startWebcam} style={{ flex:1, minWidth:'200px', padding:'0 20px', borderRadius:'28px', border:'none', background:'#1A6FDB', color:'#fff', cursor:'pointer', fontSize:'18px', fontWeight:'bold', height:'56px', display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>📷 Take Photo</button>
                      <button type="button" onClick={() => document.getElementById('galleryInput').click()} style={{ flex:1, minWidth:'200px', padding:'0 20px', borderRadius:'28px', border:'none', background:'#1A6FDB', color:'#fff', cursor:'pointer', fontSize:'18px', fontWeight:'bold', height:'56px', display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>📁 Upload Gallery</button>
                    </div>
                    {bookForm.injury_photo && (
                      <div style={{ position:'relative', marginTop:'16px', border:'3px solid #16a34a', borderRadius:'12px', padding:'4px', backgroundColor:'#fff' }}>
                        <div style={{ position:'absolute', top:'8px', left:'8px', backgroundColor:'#16a34a', color:'#fff', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'bold', zIndex:2 }}>✓</div>
                        <img src={bookForm.injury_photo} alt="Preview" style={{ maxHeight:'200px', borderRadius:'8px', width:'100%', objectFit:'cover' }} />
                        <button type="button" onClick={() => setBookForm(prev => ({ ...prev, injury_photo:'' }))} style={{ position:'absolute', top:'8px', right:'8px', background:'rgba(0,0,0,0.6)', color:'#fff', border:'none', borderRadius:'50%', width:'32px', height:'32px', cursor:'pointer', fontSize:'20px', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2 }}>&times;</button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div style={{ display:'flex', gap:'12px' }}>
                <button type="submit" disabled={booking} className="tm-btn-primary" style={{ flex:1 }}>{booking ? 'Booking...' : (t('requestNow') || 'Request Consultation Now')}</button>
                <button type="button" onClick={() => setShowModal(false)} className="tm-btn-secondary" style={{ flex:1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
