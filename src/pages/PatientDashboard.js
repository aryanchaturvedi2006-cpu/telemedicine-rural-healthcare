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

  // Patient Message state
  const [activeRecordApptId, setActiveRecordApptId] = useState(null);
  const messageMediaRecorderRef = useRef(null);
  const messageAudioChunksRef = useRef([]);
  const [sendingMessageApptId, setSendingMessageApptId] = useState(null);
  const [messageSuccessApptId, setMessageSuccessApptId] = useState(null);

  const RECORD_MESSAGE_LBL = {
    hi: '🎤 डॉक्टर को वॉइस मैसेज भेजें (अगर डॉक्टर लेट है)',
    en: '🎤 Send Voice Message to Doctor (if doctor is late)'
  };
  const STOP_RECORDING_LBL = {
    hi: '⏹️ रिकॉर्डिंग रोकें और भेजें',
    en: '⏹️ Stop Recording & Send'
  };
  const SENDING_LBL = {
    hi: '⏳ भेजा जा रहा है...',
    en: '⏳ Sending...'
  };
  const SENT_LBL = {
    hi: '✅ मैसेज भेज दिया गया',
    en: '✅ Message Sent'
  };

  const CountdownTimer = ({ dateStr, timeStr, language }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
      if (!dateStr || !timeStr) return;

      const updateTimer = () => {
        try {
          const [hours, minutes] = timeStr.split(':').map(Number);
          const apptDate = new Date(dateStr);
          apptDate.setHours(hours, minutes, 0, 0);
          
          const now = new Date();
          const diffMs = apptDate - now;
          
          if (diffMs <= 0) {
            setTimeLeft(language === 'hi' ? '— समय हो चुका है' : '— Time has passed');
            return;
          }
          
          const diffSeconds = Math.floor(diffMs / 1000);
          const hrs = Math.floor(diffSeconds / 3600);
          const mins = Math.floor((diffSeconds % 3600) / 60);
          const secs = diffSeconds % 60;
          
          const pad = (num) => String(num).padStart(2, '0');
          
          if (language === 'hi') {
            setTimeLeft(`— ${hrs > 0 ? `${hrs} घंटे ` : ''}${pad(mins)}:${pad(secs)} बाद`);
          } else {
            setTimeLeft(`— in ${hrs > 0 ? `${hrs}h ` : ''}${pad(mins)}m ${pad(secs)}s`);
          }
        } catch (e) {
          setTimeLeft('');
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }, [dateStr, timeStr, language]);

    return <span>{timeLeft}</span>;
  };

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

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/patient/${patientId}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.data || []);
      }
    } catch (e) {
      console.error('Error fetching appointments:', e);
    } finally {
      setApptLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000);
    return () => clearInterval(interval);
  }, [patientId]);

  // Handle Recording Voice Message for Doctor
  const startRecordingMessage = async (apptId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      messageMediaRecorderRef.current = mediaRecorder;
      messageAudioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          messageAudioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(messageAudioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64AudioMessage = reader.result;
          setSendingMessageApptId(apptId);
          try {
            await fetch(`${API_BASE_URL}/api/appointments/${apptId}/patient-message`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ patient_message_audio: base64AudioMessage })
            });
            setMessageSuccessApptId(apptId);
            setTimeout(() => setMessageSuccessApptId(null), 3000);
          } catch (e) {
            console.error('Error sending message:', e);
          } finally {
            setSendingMessageApptId(null);
            setActiveRecordApptId(null);
          }
        };
      };

      mediaRecorder.start();
      setActiveRecordApptId(apptId);
    } catch (err) {
      console.error('Error accessing microphone', err);
      alert('Microphone access is required to record a message.');
    }
  };

  const stopRecordingMessage = () => {
    if (messageMediaRecorderRef.current && activeRecordApptId) {
      messageMediaRecorderRef.current.stop();
      messageMediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

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
        
        // Play notification sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
        
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
    <div style={{ background: '#F7FBF7', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#1F2937', paddingBottom: '60px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .dashboard-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        /* Top Navigation */
        .top-nav { background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.05); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 50; }
        .nav-logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 20px; color: #2E7D32; }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .nav-btn-secondary { background: #fff; color: #2E7D32; border: 1.5px solid #2E7D32; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }
        .nav-btn-secondary:hover { background: #F0FDF4; }
        .nav-logout { background: transparent; color: #6B7280; border: none; font-size: 14px; font-weight: 600; cursor: pointer; }
        .nav-logout:hover { color: #DC2626; }
        
        /* Hero Section */
        .hero-banner { background: #2E7D32; border-radius: 20px; padding: 28px 32px; color: white; display: flex; justify-content: space-between; align-items: center; margin-top: 24px; box-shadow: 0 8px 25px rgba(46, 125, 50, 0.15); position: relative; overflow: hidden; }
        .hero-banner::after { content: ''; position: absolute; right: 0; bottom: 0; width: 250px; height: 250px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; pointer-events: none; }
        .hero-content { position: relative; z-index: 2; max-width: 500px; }
        .hero-greeting { font-size: 16px; font-weight: 600; color: #C8E6C9; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .hero-title { font-size: 28px; font-weight: 700; margin-bottom: 12px; line-height: 1.2; }
        .hero-subtitle { font-size: 16px; color: #E8F5E9; margin-bottom: 24px; line-height: 1.5; }
        .btn-primary-large { background: #fff; color: #2E7D32; border: none; padding: 12px 24px; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .btn-primary-large:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
        
        /* Quick Access Section */
        .quick-access-section { margin-top: -20px; position: relative; z-index: 10; padding: 0 16px; }
        .qa-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .qa-card { background: #fff; border-radius: 16px; padding: 24px 20px; text-align: center; cursor: pointer; border: 1px solid #E5E7EB; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .qa-card:hover { transform: translateY(-4px); border-color: #2E7D32; box-shadow: 0 10px 25px rgba(46,125,50,0.08); }
        .qa-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; background: #F0FDF4; }
        .qa-title { font-weight: 600; font-size: 15px; color: #1F2937; }
        
        /* Section Headers */
        .section-header { font-size: 22px; font-weight: 700; color: #111827; margin: 36px 0 20px 0; display: flex; align-items: center; gap: 10px; }
        
        /* Upcoming Consultations */
        .appt-timeline { display: flex; flex-direction: column; gap: 16px; }
        .appt-card { background: #fff; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px; border: 1px solid #E5E7EB; position: relative; overflow: hidden; transition: box-shadow 0.2s; }
        .appt-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
        .appt-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: #F59E0B; }
        .appt-card.confirmed::before { background: #2E7D32; }
        .appt-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .appt-doc-name { font-size: 18px; font-weight: 700; color: #1F2937; margin: 0 0 4px 0; }
        .appt-doc-spec { font-size: 14px; color: #6B7280; margin: 0; }
        .appt-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
        .appt-badge.pending { background: #FEF3C7; color: #B45309; }
        .appt-badge.confirmed { background: #DCFCE7; color: #166534; }
        .appt-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #F9FAFB; padding: 16px; border-radius: 12px; }
        .appt-detail-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #374151; }
        .appt-detail-icon { color: #6B7280; font-size: 16px; }
        
        /* Action Boxes within Appointments */
        .appt-action-box { padding: 16px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
        .action-box-timer { background: #E0F2FE; border: 1px solid #BAE6FD; color: #0369A1; }
        .action-box-record { background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; }
        
        /* Doctor Grid */
        .doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .doc-card { background: #fff; border-radius: 20px; padding: 24px; border: 1px solid #E5E7EB; display: flex; flex-direction: column; transition: all 0.2s; }
        .doc-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); border-color: #2E7D32; }
        .doc-header-row { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; }
        .doc-avatar { width: 72px; height: 72px; background: #F0FDF4; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #2E7D32; flex-shrink: 0; }
        .doc-name { font-size: 18px; font-weight: 700; color: #1F2937; margin: 0 0 4px 0; }
        .doc-spec { font-size: 14px; color: #2E7D32; font-weight: 600; margin: 0; }
        .doc-info-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .doc-info-item { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #4B5563; }
        .doc-btn { width: 100%; background: #F3F4F6; color: #374151; border: none; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .doc-btn:hover { background: #2E7D32; color: #fff; }
        
        /* AI Assistant */
        .ai-assistant-card { background: #fff; border: 1.5px solid #C8E6C9; border-radius: 20px; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; }
        .ai-assistant-card::before { content: ''; position: absolute; top: 0; right: 0; width: 300px; height: 100%; background: linear-gradient(90deg, transparent, #F0FDF4); pointer-events: none; }
        
        /* Empty States */
        .empty-state { text-align: center; padding: 48px 24px; background: #fff; border-radius: 20px; border: 1px dashed #D1D5DB; }
        .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
        .empty-title { font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 8px; }
        .empty-subtitle { font-size: 14px; color: #6B7280; }
        
        /* Modals & Utilities */
        .modal-overlay { position: fixed; inset: 0; background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
        .modal-content { background: #fff; border-radius: 24px; padding: 32px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .input-field { width: 100%; padding: 14px 16px; border: 1.5px solid #D1D5DB; border-radius: 12px; font-size: 15px; margin-top: 6px; font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .input-field:focus { outline: none; border-color: #2E7D32; box-shadow: 0 0 0 3px rgba(46,125,50,0.1); }
        .input-label { font-size: 14px; font-weight: 600; color: #374151; display: block; }
        
        .pulse-anim { animation: aarogyaPulse 2s ease-in-out infinite; }
        @keyframes aarogyaPulse { 0% { box-shadow: 0 0 0 0 rgba(46,125,50,0.4); } 70% { box-shadow: 0 0 0 10px rgba(46,125,50,0); } 100% { box-shadow: 0 0 0 0 rgba(46,125,50,0); } }
      `}</style>

      {/* TOP NAVIGATION */}
      <nav className="top-nav">
        <div className="nav-logo">
          <span style={{ fontSize: '24px' }}>🌿</span> JeevanJyoti
        </div>
        <div className="nav-right">
          <button className="nav-btn-secondary" onClick={() => navigate('/patient-history')}>
            <span style={{ marginRight: '8px' }}>📁</span>
            {t('myHealthRecords') || 'My Health Records'}
          </button>
          <button className="nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* HERO SECTION */}
        <div className="hero-banner">
          <div className="hero-content">
            <div className="hero-greeting">Welcome back, {name}</div>
            <h1 className="hero-title">Your health is our <br/>top priority.</h1>
            <p className="hero-subtitle">Get instant consultations and expert care from top doctors, right from your home.</p>
            <button className="btn-primary-large" onClick={() => { setShowModal(true); setBookError(''); setBookSuccess(''); }}>
              🩺 {t('bookConsult') || 'Book Consultation'}
            </button>
          </div>
          {/* Beautiful SVG Healthcare Illustration */}
          <svg className="hero-illustration" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '140px', height: '140px', flexShrink: 0 }}>
            <circle cx="100" cy="100" r="90" fill="#43A047" opacity="0.2"/>
            <circle cx="100" cy="100" r="70" fill="#43A047" opacity="0.4"/>
            <path d="M100 30 C120 30, 140 45, 140 70 C140 100, 100 130, 100 130 C100 130, 60 100, 60 70 C60 45, 80 30, 100 30 Z" fill="#fff" opacity="0.9"/>
            <rect x="90" y="65" width="20" height="6" rx="3" fill="#2E7D32"/>
            <rect x="97" y="58" width="6" height="20" rx="3" fill="#2E7D32"/>
            <circle cx="140" cy="130" r="15" fill="#F59E0B"/>
            <circle cx="50" cy="110" r="10" fill="#F59E0B"/>
          </svg>
        </div>

        {/* QUICK ACCESS GRID */}
        <div className="quick-access-section">
          <div className="qa-grid">
            <div className="qa-card" onClick={() => { setShowModal(true); setBookError(''); setBookSuccess(''); }}>
              <div className="qa-icon" style={{ color: '#2563EB', background: '#EFF6FF' }}>🩺</div>
              <div className="qa-title">Book Consult</div>
            </div>
            <div className="qa-card" onClick={() => { localStorage.setItem('openAarogya', 'true'); navigate('/landing'); }}>
              <div className="qa-icon" style={{ color: '#059669', background: '#ECFDF5' }}>✨</div>
              <div className="qa-title">AI Assistant</div>
            </div>
            <div className="qa-card" onClick={() => document.getElementById('nearby-doctors').scrollIntoView({ behavior: 'smooth' })}>
              <div className="qa-icon" style={{ color: '#D97706', background: '#FFFBEB' }}>📍</div>
              <div className="qa-title">Find Doctors</div>
            </div>
            <div className="qa-card" onClick={() => navigate('/patient-history')}>
              <div className="qa-icon" style={{ color: '#7C3AED', background: '#F5F3FF' }}>📄</div>
              <div className="qa-title">Health Records</div>
            </div>
          </div>
        </div>

        {/* UPCOMING CONSULTATIONS */}
        <h2 className="section-header">📅 Upcoming Consultations</h2>
        <div className="appt-timeline">
          {apptLoading ? (
            <div className="empty-state"><div className="empty-title">Loading appointments...</div></div>
          ) : appointments.length > 0 ? (
            appointments.map((appt) => (
              <div key={appt.id} className={`appt-card ${appt.status === 'confirmed' ? 'confirmed' : ''}`}>
                <div className="appt-header">
                  <div>
                    <h3 className="appt-doc-name">Dr. {appt.doctor_name}</h3>
                    <p className="appt-doc-spec">{appt.specialization} • {appt.hospital_name}</p>
                  </div>
                  <span className={`appt-badge ${appt.status}`}>
                    {appt.status}
                  </span>
                </div>

                <div className="appt-details-grid">
                  <div className="appt-detail-item">
                    <span className="appt-detail-icon">🗓️</span> {appt.date}
                  </div>
                  <div className="appt-detail-item">
                    <span className="appt-detail-icon">⏰</span> {appt.time}
                  </div>
                  <div className="appt-detail-item">
                    <span className="appt-detail-icon">🎥</span> {appt.mode}
                  </div>
                  <div className="appt-detail-item">
                    <span className="appt-detail-icon">📝</span> {appt.symptoms || 'No symptoms provided'}
                  </div>
                </div>

                {appt.scheduled_time && (
                  <div className="appt-action-box action-box-timer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                      <span style={{ fontSize: '20px' }}>⌛</span>
                      {SCHEDULED_TIME_MSG[language] || SCHEDULED_TIME_MSG.en} {appt.scheduled_time}
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '16px' }}>
                      <CountdownTimer dateStr={appt.date} timeStr={appt.scheduled_time} language={language} />
                    </div>
                  </div>
                )}

                {appt.status === 'confirmed' && (
                  <div className="appt-action-box action-box-record">
                    <div style={{ fontWeight: '600' }}>
                      {RECORD_MESSAGE_LBL[language] || RECORD_MESSAGE_LBL.en}
                    </div>
                    {activeRecordApptId === appt.id ? (
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '12px', height: '12px', background: '#DC2626', borderRadius: '50%', animation: 'aarogyaPulse 1s infinite' }}></div>
                        <button onClick={stopRecordingMessage} style={{ background: '#DC2626', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                          {STOP_RECORDING_LBL[language] || STOP_RECORDING_LBL.en}
                        </button>
                      </div>
                    ) : sendingMessageApptId === appt.id ? (
                      <div style={{ color: '#0369A1', fontWeight: 'bold' }}>{SENDING_LBL[language] || SENDING_LBL.en}</div>
                    ) : messageSuccessApptId === appt.id ? (
                      <div style={{ color: '#16A34A', fontWeight: 'bold' }}>{SENT_LBL[language] || SENT_LBL.en}</div>
                    ) : (
                      <button onClick={() => startRecordingMessage(appt.id)} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🎤 Record Voice Note
                      </button>
                    )}
                  </div>
                )}

                {appt.status === 'confirmed' && (appt.mode === 'Video Call' || appt.mode === 'video') && (
                  <button 
                    onClick={() => {
                      sessionStorage.setItem(`call_answered_${appt.id}`, 'true');
                      navigate(`/video-call/appointment-${appt.id}`);
                    }}
                    disabled={!appt.call_started}
                    style={{
                      padding: '16px',
                      backgroundColor: appt.call_started ? '#16A34A' : '#F3F4F6',
                      color: appt.call_started ? 'white' : '#9CA3AF',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: appt.call_started ? 'pointer' : 'not-allowed',
                      fontWeight: '700',
                      fontSize: '16px',
                      width: '100%',
                      marginTop: '8px',
                      boxShadow: appt.call_started ? '0 4px 15px rgba(22,163,74,0.3)' : 'none',
                      transition: 'all 0.2s'
                    }}
                    className={appt.call_started ? 'pulse-anim' : ''}
                  >
                    {appt.call_started ? (t('joinVideoCall') || '🎥 Join Video Call Now') : (t('waitingForDoctor') || 'Waiting for doctor to start the call...')}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏥</div>
              <div className="empty-title">No consultations scheduled</div>
              <div className="empty-subtitle">Book your first consultation to get started.</div>
            </div>
          )}
        </div>

        {/* AI HEALTH ASSISTANT */}
        <h2 className="section-header">✨ Healthcare Guidance</h2>
        <div className="ai-assistant-card">
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '0 0 8px 0' }}>
              {t('symptomCheckerHeading') || 'Check your symptoms instantly'}
            </h3>
            <p style={{ fontSize: '15px', color: '#4B5563', margin: '0 0 24px 0', maxWidth: '400px', lineHeight: '1.5' }}>
              {t('symptomCheckerSubtitle') || 'Get instant health guidance and find the right specialist before booking your consultation.'}
            </p>
            <button 
              onClick={() => setShowSymptomModal(true)}
              style={{ background: '#2E7D32', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(46,125,50,0.2)' }}
            >
              {t('symptomCheckNow') || 'Start Health Check'}
            </button>
          </div>
          <div style={{ position: 'relative', zIndex: 2, fontSize: '80px', opacity: 0.8 }}>
            ⚕️
          </div>
        </div>

        {/* GOVERNMENT SCHEMES BANNER */}
        <div style={{ marginTop: '36px', background: 'linear-gradient(to right, #FFFBEB, #FEF3C7)', borderRadius: '20px', padding: '20px 28px', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '32px', background: '#fff', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', flexShrink: 0 }}>🏛️</div>
          <div>
            <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#92400E', margin: '0 0 6px 0' }}>Government Health Schemes</h3>
            <p style={{ margin: 0, color: '#B45309', fontWeight: '500', fontSize: '15px' }}>
              {SCHEME_BANNER_LABEL[language] || SCHEME_BANNER_LABEL.en}
            </p>
          </div>
        </div>

        {/* NEARBY DOCTORS */}
        <div id="nearby-doctors" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px', marginBottom: '20px' }}>
          <h2 className="section-header" style={{ margin: 0 }}>📍 Nearby Doctors</h2>
          
          {patientData.state && !patientCoords && !locationDenied && (
            <button onClick={requestLocation} style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🧭</span> Turn on Location
            </button>
          )}
        </div>

        {doctorsLoading ? (
          <div className="empty-state"><div className="empty-title">Finding doctors near you...</div></div>
        ) : doctors.length > 0 ? (
          <div className="doc-grid">
            {doctors.map((doc) => (
              <div key={doc.id} className="doc-card">
                <div className="doc-header-row">
                  <div className="doc-avatar">
                    {doc.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="doc-name">Dr. {doc.name}</h3>
                    <p className="doc-spec">{doc.specialization}</p>
                  </div>
                </div>
                
                <div className="doc-info-list">
                  <div className="doc-info-item">
                    <span style={{ fontSize: '16px' }}>🏥</span>
                    <span style={{ fontWeight: '500' }}>{doc.hospital_name}</span>
                  </div>
                  <div className="doc-info-item">
                    <span style={{ fontSize: '16px' }}>⭐</span>
                    <span>10+ Years Experience</span>
                  </div>
                  <div className="doc-info-item">
                    <span style={{ fontSize: '16px' }}>🗣️</span>
                    <span>Hindi, English, Regional</span>
                  </div>
                  {doc.distance !== undefined && (
                    <div className="doc-info-item" style={{ color: '#059669', fontWeight: '600', background: '#ECFDF5', padding: '6px 12px', borderRadius: '8px', width: 'fit-content' }}>
                      <span>📍</span> {doc.distance} km away
                    </div>
                  )}
                </div>
                
                <div style={{ marginTop: 'auto' }}>
                  <button className="doc-btn" onClick={() => { setShowModal(true); setBookForm(prev => ({ ...prev, doctor_id: doc.id })); }}>
                    {t('requestConsult') || 'Request Consultation'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🩺</div>
            <div className="empty-title">No doctors found nearby</div>
            <div className="empty-subtitle">We're adding more doctors in your area.</div>
          </div>
        )}

      </div>

      {/* ── INCOMING CALL MODAL ── */}
      {incomingCall && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', animation: 'pulse-recording-banner 2s infinite' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'aarogyaPulse 1.5s infinite' }}>📞</div>
            <h2 style={{ fontSize: '28px', color: '#111827', marginBottom: '8px', fontWeight: '700' }}>Dr. {incomingCall.doctor_name}</h2>
            <p style={{ fontSize: '18px', color: '#16A34A', fontWeight: '600', marginBottom: '32px' }}>
              {INCOMING_CALL_MSG[language] || INCOMING_CALL_MSG.en}
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={() => {
                  sessionStorage.setItem(`call_answered_${incomingCall.id}`, 'true');
                  setIncomingCall(null);
                }}
                style={{ flex: 1, backgroundColor: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '16px', height: '56px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}
              >
                Decline
              </button>
              <button 
                onClick={() => {
                  sessionStorage.setItem(`call_answered_${incomingCall.id}`, 'true');
                  navigate(`/video-call/appointment-${incomingCall.id}`);
                }}
                style={{ flex: 1, backgroundColor: '#22C55E', color: '#fff', border: 'none', borderRadius: '16px', height: '56px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(34, 197, 94, 0.4)' }}
              >
                Answer Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SYMPTOM CHECKER MODAL ── */}
      {showSymptomModal && (
        <SymptomChecker 
          onClose={() => setShowSymptomModal(false)}
          onBookConsultation={async (symptomsString, specialization) => {
            setBookForm(prev => ({ ...prev, symptoms: symptomsString }));
            setShowSymptomModal(false);
            
            if (specialization) {
              try {
                const res = await fetch(`${API_BASE_URL}/api/doctors/optimal?specialization=${encodeURIComponent(specialization)}`);
                const result = await res.json();
                if (result.success && result.data) {
                  setBookForm(prev => ({ ...prev, doctor_id: result.data.id }));
                  let msgTemplate = t('aiAssignedMsg') || "✨ AI has automatically assigned you to Dr. {name} ({specialist}) for the shortest waiting time.";
                  let finalMsg = msgTemplate.replace('{name}', result.data.name).replace('{specialist}', result.data.specialization);
                  setBookSuccess(finalMsg);
                }
              } catch (err) {
                console.error("Failed to fetch optimal doctor", err);
              }
            } else {
              setBookSuccess('');
              setBookError('');
            }
            setShowModal(true);
          }}
        />
      )}

      {/* ── BOOKING CONSULTATION MODAL ── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: '#111827' }}>{t('bookConsult')}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#9CA3AF', lineHeight: 1 }}>&times;</button>
            </div>
            
            {bookError && <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>{bookError}</div>}
            
            {bookSuccess && (
              <div style={{
                background: bookSuccess.includes('✨') ? '#F0FDF4' : '#ECFDF5',
                color: bookSuccess.includes('✨') ? '#16A34A' : '#059669',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '20px',
                fontSize: '15px',
                border: bookSuccess.includes('✨') ? '1px solid #BBF7D0' : 'none',
                fontWeight: bookSuccess.includes('✨') ? '600' : '500'
              }}>
                {bookSuccess}
              </div>
            )}
            
            <form onSubmit={handleBookSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Select Doctor</label>
                <select name="doctor_id" value={bookForm.doctor_id} onChange={handleBookChange} className="input-field" required>
                  <option value="">Select a doctor</option>
                  {doctors.map(doc => (<option key={doc.id} value={doc.id}>Dr. {doc.name} — {doc.specialization}</option>))}
                </select>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Consultation Mode</label>
                <select name="mode" value={bookForm.mode} onChange={handleBookChange} className="input-field">
                  <option value="video">🎥 Video Call</option>
                  <option value="audio">📞 Audio Call</option>
                  <option value="in-person">🏥 In Person</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label className="input-label">Symptoms / Reason for Visit</label>
                <div style={{ position: 'relative', marginTop: '6px' }}>
                  <textarea name="symptoms" value={bookForm.symptoms} onChange={handleBookChange} rows={4}
                    className="input-field" style={{ resize: 'vertical', minHeight: '100px', marginTop: 0 }}
                    placeholder="Briefly describe what you are feeling..." />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <VoiceInputButton language={language} onResult={(text) => handleBookVoiceInput(text)} />
                  </div>
                </div>

                {/* Voice Recorder */}
                <div style={{ marginTop: '24px', padding: '24px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#334155', marginBottom: '16px' }}>
                    {VOICE_RECORD_LABEL[language] || VOICE_RECORD_LABEL['hi']}
                  </div>
                  {isRecordingAudio && (
                    <div style={{ background: '#EF4444', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', display: 'inline-block', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>
                      {RECORDING_BANNER[language] || RECORDING_BANNER['hi']}
                    </div>
                  )}
                  <button type="button" onClick={toggleAudioRecording} style={{ background: isRecordingAudio ? '#EF4444' : '#2E7D32', color: '#fff', border: 'none', borderRadius: '12px', height: '48px', padding: '0 32px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 auto', transition: 'background 0.2s' }}>
                    {isRecordingAudio ? '⏹ Stop Recording' : '🎙️ Record Voice Note'}
                  </button>
                  {bookForm.symptom_audio && !isRecordingAudio && (
                    <div style={{ marginTop: '16px', background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #D1D5DB' }}>
                      <audio controls src={bookForm.symptom_audio} style={{ width: '100%', height: '40px' }} />
                      <button type="button" onClick={() => setBookForm(prev => ({ ...prev, symptom_audio: '' }))} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '13px', cursor: 'pointer', marginTop: '8px', fontWeight: '600' }}>Remove Recording</button>
                    </div>
                  )}
                </div>

                {/* Photo Upload */}
                <div style={{ marginTop: '20px', padding: '24px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#334155', marginBottom: '16px' }}>
                    {PHOTO_UPLOAD_LABEL[language] || PHOTO_UPLOAD_LABEL['hi']}
                  </div>
                  {bookForm.injury_photo && (
                    <div style={{ background: '#16A34A', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', display: 'inline-block', marginBottom: '16px' }}>
                      {PHOTO_SAVED_BANNER[language] || PHOTO_SAVED_BANNER['hi']}
                    </div>
                  )}
                  {showWebcam ? (
                    <div>
                      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '12px', background: '#000', marginBottom: '12px' }} />
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" onClick={capturePhoto} style={{ flex: 1, background: '#2563EB', color: 'white', border: 'none', height: '48px', borderRadius: '12px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}>📸 Capture</button>
                        <button type="button" onClick={stopWebcam} style={{ flex: 1, background: '#F3F4F6', color: '#4B5563', border: 'none', height: '48px', borderRadius: '12px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setBookForm(prev => ({ ...prev, injury_photo: reader.result })); reader.readAsDataURL(file); } }} style={{ display: 'none' }} id="galleryInput" />
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button type="button" onClick={startWebcam} style={{ flex: 1, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', borderRadius: '12px', height: '48px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>📷 Take Photo</button>
                        <button type="button" onClick={() => document.getElementById('galleryInput').click()} style={{ flex: 1, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', borderRadius: '12px', height: '48px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>📁 Upload</button>
                      </div>
                      {bookForm.injury_photo && (
                        <div style={{ position: 'relative', marginTop: '20px', display: 'inline-block' }}>
                          <img src={bookForm.injury_photo} alt="Preview" style={{ maxHeight: '200px', borderRadius: '12px', border: '4px solid #16A34A' }} />
                          <button type="button" onClick={() => setBookForm(prev => ({ ...prev, injury_photo: '' }))} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#EF4444', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                <button type="submit" disabled={booking} style={{ flex: 2, background: booking ? '#9CA3AF' : '#2E7D32', color: 'white', border: 'none', height: '52px', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: booking ? 'not-allowed' : 'pointer' }}>
                  {booking ? 'Booking...' : (t('requestNow') || 'Confirm Booking')}
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: '#F3F4F6', color: '#4B5563', border: 'none', height: '52px', borderRadius: '12px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
