import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';
import './TeleMedGlobal.css';

const PatientDashboard = () => {
  const { t, setLanguage, language } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Read from local storage fallback
  const localPatient = JSON.parse(localStorage.getItem('patientData') || '{}');
  const sessionPatient = JSON.parse(localStorage.getItem('currentPatient') || '{}');
  
  // Prefer sessionPatient, fallback to localPatient
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
    doctor_id: '',
    date: '',
    time: '',
    mode: 'video',
    symptoms: '',
    symptom_audio: '',
    injury_photo: '',
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

  // AI Symptom Checker State
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
        console.error("AI service not reachable", e);
      }
    };
    fetchSymptoms();
  }, [language]);

  // Filter Symptoms
  useEffect(() => {
    if (!symptomQuery) {
      setFilteredSymptoms([]);
      return;
    }
    const q = symptomQuery.toLowerCase();
    const filtered = availableSymptoms.filter(s => 
      s.translated.toLowerCase().includes(q) || s.english.toLowerCase().includes(q)
    );
    setFilteredSymptoms(filtered.slice(0, 10)); // Top 10
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
      alert(getUI('selectOne'));
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

  const UI_TEXT = {
    en: {
      searchPlaceholder: "Search symptoms...",
      selected: "Selected symptoms:",
      analyze: "Analyze",
      orDescribe: "Or describe in your own words",
      understand: "Understand",
      recommendedDoc: "Recommended Doctor:",
      homeRemedies: "Home Remedies:",
      whenToSee: "When to see Doctor:",
      emergency: "CALL 108 IMMEDIATELY",
      bookBtn: "Book this Doctor",
      noSymptoms: "No symptoms selected",
      selectOne: "Please select at least one symptom",
      directTextLabel: "Ya seedha likho aapki takleef",
      lakshanTitle: "🩺 Lakshan Batao (AI Symptom Checker)",
      lakshanSub: "Tell us your symptoms, we'll guide you"
    },
    hi: {
      searchPlaceholder: "लक्षण खोजें...",
      selected: "चुने गए लक्षण:",
      analyze: "जांच करें",
      orDescribe: "या अपने शब्दों में तकलीफ बताएं",
      understand: "समझें",
      recommendedDoc: "सलाह के लिए डॉक्टर:",
      homeRemedies: "घरेलू नुस्खे:",
      whenToSee: "डॉक्टर से कब मिलें:",
      emergency: "तुरंत 108 पर कॉल करें",
      bookBtn: "यह डॉक्टर बुक करें",
      noSymptoms: "कोई लक्षण नहीं चुना गया",
      selectOne: "कृपया कम से कम एक लक्षण चुनें",
      directTextLabel: "या सीधा लिखो आपकी तकलीफ",
      lakshanTitle: "🩺 लक्षण बताओ (AI Symptom Checker)",
      lakshanSub: "हमें अपनी तकलीफ बताएं, हम मदद करेंगे"
    }
  };
  const getUI = (key) => {
    const l = UI_TEXT[language] ? language : (language === 'en' ? 'en' : 'hi');
    return UI_TEXT[l][key] || UI_TEXT['en'][key];
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Aapka browser voice input support nahi karta. Chrome use karein.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    originalSymptomsRef.current = bookForm.symptoms || '';
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const langMap = {
      hi: 'hi-IN', en: 'en-IN', mw: 'hi-IN', gu: 'gu-IN', mr: 'mr-IN',
      ta: 'ta-IN', te: 'te-IN', pa: 'pa-IN', bn: 'bn-IN', kn: 'kn-IN',
      ml: 'ml-IN', as: 'hi-IN', or: 'or-IN', nm: 'en-IN'
    };
    recognition.lang = langMap[language] || 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript).join('');
      const sep = originalSymptomsRef.current && originalSymptomsRef.current.trim() !== '' ? ' ' : '';
      setBookForm(prev => ({ ...prev, symptoms: originalSymptomsRef.current + sep + transcript }));
    };
    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        alert('Microphone permission allow karein');
      } else if (event.error === 'no-speech') {
        alert('Kuch sunai nahi diya, dobara try karein');
      } else {
        alert('Voice input mein samasya hui');
      }
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(prev => {
        if (prev && recognitionRef.current) {
          try { recognitionRef.current.start(); } catch(e) {}
          return true;
        }
        return false;
      });
    };
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const toggleFreeTextListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Aapka browser voice input support nahi karta. Chrome use karein.');
      return;
    }
    if (isFreeTextListening) {
      freeTextRecognitionRef.current?.stop();
      setIsFreeTextListening(false);
      return;
    }
    originalFreeTextRef.current = freeTextQuery || '';
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const langMap = {
      hi: 'hi-IN', en: 'en-IN', mw: 'hi-IN', gu: 'gu-IN', mr: 'mr-IN',
      ta: 'ta-IN', te: 'te-IN', pa: 'pa-IN', bn: 'bn-IN', kn: 'kn-IN',
      ml: 'ml-IN', as: 'hi-IN', or: 'or-IN', nm: 'en-IN'
    };
    recognition.lang = langMap[language] || 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
      const sep = originalFreeTextRef.current && originalFreeTextRef.current.trim() !== '' ? ' ' : '';
      setFreeTextQuery(originalFreeTextRef.current + sep + transcript);
    };
    recognition.onerror = (event) => {
      setIsFreeTextListening(false);
    };
    recognition.onend = () => {
      setIsFreeTextListening(prev => {
        if (prev && freeTextRecognitionRef.current) {
          try { freeTextRecognitionRef.current.start(); } catch(e) {}
          return true;
        }
        return false;
      });
    };
    freeTextRecognitionRef.current = recognition;
    recognition.start();
    setIsFreeTextListening(true);
  };

  useEffect(() => {
    if (!showModal) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (isRecordingAudio) {
        mediaRecorderRef.current?.stop();
        setIsRecordingAudio(false);
      }
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
        setShowWebcam(false);
      }
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      freeTextRecognitionRef.current?.stop();
      mediaRecorderRef.current?.stop();
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleAudioRecording = async () => {
    if (isRecordingAudio) {
      mediaRecorderRef.current?.stop();
      setIsRecordingAudio(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            setBookForm(prev => ({ ...prev, symptom_audio: reader.result }));
          };
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecordingAudio(true);
      } catch (err) {
        alert("Microphone access denied or unavailable.");
      }
    }
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setShowWebcam(true);
      // Timeout to allow video element to render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Webcam error:", err);
      alert("Camera access denied or unavailable.");
    }
  };

  const stopWebcam = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
    setVideoStream(null);
    setShowWebcam(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setBookForm(prev => ({ ...prev, injury_photo: dataUrl }));
      stopWebcam();
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const state = patientData.state || '';
        if (!state) { setDoctorsLoading(false); return; }
        const res = await fetch(`${API_BASE_URL}/api/doctors/nearby?state=${encodeURIComponent(state)}`);
        if (res.ok) {
          const data = await res.json();
          setDoctors(data.data || []);
        } else {
          setDoctors([]);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setDoctors([]);
      } finally {
        setDoctorsLoading(false);
      }
    };
    fetchDoctors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientData.state]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientId || patientId === 'local-temp-id') { setApptLoading(false); return; }
      try {
        const res = await fetch(`${API_BASE_URL}/api/appointments/patient/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          setAppointments(data.data || []);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setAppointments([]);
      } finally {
        setApptLoading(false);
      }
    };
    fetchAppointments();
  }, [patientId]);

  const handleBookChange = (e) => {
    setBookForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setBookError('');
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setBookError('');
    setBookSuccess('');

    if (!bookForm.doctor_id || !bookForm.date || !bookForm.time || (!bookForm.symptoms && !bookForm.symptom_audio)) {
      setBookError('Please fill in all fields (Symptoms text or audio is required).');
      return;
    }

    setBooking(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          doctor_id: bookForm.doctor_id,
          date: bookForm.date,
          time: bookForm.time,
          mode: bookForm.mode,
          symptoms: bookForm.symptoms,
          symptom_audio: bookForm.symptom_audio,
          injury_photo: bookForm.injury_photo,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookSuccess('Appointment booked successfully!');
        setBookForm({ doctor_id: '', date: '', time: '', mode: 'video', symptoms: '', symptom_audio: '', injury_photo: '' });
        const apptRes = await fetch(`${API_BASE_URL}/api/appointments/patient/${patientId}`);
        if (apptRes.ok) {
          const apptData = await apptRes.json();
          setAppointments(apptData.data || []);
        }
      } else {
        setBookError(data.message || 'Booking failed. Please try again.');
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      setBookError('An error occurred. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const modalOverlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };
  const modalStyle = {
    background: '#fff', borderRadius: '16px', padding: '24px', width: '100%',
    maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    maxHeight: '90vh', overflowY: 'auto'
  };
  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1.5px solid #E0E0E0',
    borderRadius: '10px', fontSize: '15px', marginTop: '4px', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: '13px', fontWeight: 600, color: '#555', display: 'block' };

  const VOICE_RECORD_LABEL = {
    hi: "🎙️ अपनी तकलीफ बोलकर सेव करें — डॉक्टर सुन लेगा",
    en: "🎙️ Record your problem — Doctor will listen",
    gu: "🎙️ તકલીફ બોલીને સેવ કરો — ડૉક્ટર સાંભળશે",
    mr: "🎙️ तक्रार बोलून सेव्ह करा — डॉक्टर ऐकतील",
    ta: "🎙️ பிரச்சனை பதிவு செய்யுங்கள் — மருத்துவர் கேட்பார்",
    te: "🎙️ సమస్య రికార్డ్ చేయండి — డాక్టర్ వింటారు",
    pa: "🎙️ ਤਕਲੀਫ਼ ਬੋਲ ਕੇ ਸੇਵ ਕਰੋ — ਡਾਕਟਰ ਸੁਣੇਗਾ",
    bn: "🎙️ সমস্যা বলে সেভ করুন — ডাক্তার শুনবেন",
    kn: "🎙️ ತೊಂದರೆ ಹೇಳಿ ಸೇವ್ ಮಾಡಿ — ಡಾಕ್ಟರ್ ಕೇಳುತ್ತಾರೆ",
    ml: "🎙️ പ്രശ്നം പറഞ്ഞ് സേവ് ചെയ്യൂ — ഡോക്ടർ കേൾക്കും",
    mw: "🎙️ तकलीफ बोलकर सेव करो — डॉक्टर सुण लेगो",
    as: "🎙️ সমস্যা কৈ সংৰক্ষণ কৰক — ডাক্তাৰে শুনিব",
    or: "🎙️ ସମସ୍ୟା କହି ସେଭ୍ କରନ୍ତୁ — ଡାକ୍ତର ଶୁଣିବେ",
    nm: "🎙️ Takleef bolke save karo — Doctor sun lega"
  };

  const RECORDING_BANNER = {
    hi: "🔴 Recording... bolte rahiye",
    en: "🔴 Recording... keep speaking",
    gu: "🔴 Recording... બોલતા રહો",
    mr: "🔴 Recording... बोलत राहा",
    ta: "🔴 Recording... தொடர்ந்து பேசுங்கள்",
    te: "🔴 Recording... మాట్లాడుతూ ఉండండి",
    pa: "🔴 Recording... ਬੋਲਦੇ ਰਹੋ",
    bn: "🔴 Recording... বলতে থাকুন",
    kn: "🔴 Recording... ಮಾತನಾಡುತ್ತಿರಿ",
    ml: "🔴 Recording... സംസാരിച്ചുകൊണ്ടിരിക്കുക",
    mw: "🔴 Recording... बोलता रो",
    as: "🔴 Recording... কৈ থাকক",
    or: "🔴 Recording... କହିବା ଜାରି ରଖନ୍ତୁ",
    nm: "🔴 Recording... bolte thako"
  };

  const PHOTO_UPLOAD_LABEL = {
    hi: "📷 चोट या दाने की फोटो डालें — डॉक्टर देख लेगा",
    en: "📷 Upload photo of injury or rash — Doctor will see it",
    gu: "📷 ઈજા કે ફોલ્લીઓની ફોટો નાખો — ડૉક્ટર જોઈ લેશે",
    mr: "📷 दुखापत किंवा पुरळाचा फोटो टाका — डॉक्टर पाहतील",
    ta: "📷 காயம் அல்லது தடிப்பின் புகைப்படம் — மருத்துவர் பார்ப்பார்",
    te: "📷 గాయం లేదా దద్దుర్ల ఫోటో — డాక్టర్ చూస్తారు",
    pa: "📷 ਸੱਟ ਜਾਂ ਧੱਫੜ ਦੀ ਫੋਟੋ ਪਾਓ — ਡਾਕਟਰ ਦੇਖ ਲਵੇਗਾ",
    bn: "📷 আঘাত বা ফুসকুড়ির ছবি দিন — ডাক্তার দেখবেন",
    kn: "📷 ಗಾಯ ಅಥವಾ ದದ್ದಿನ ಫೋಟೋ ಹಾಕಿ — ಡಾಕ್ಟರ್ ನೋಡುತ್ತಾರೆ",
    ml: "📷 പരിക്കിന്റെ ഫോട്ടോ ഇടൂ — ഡോക്ടർ കാണും",
    mw: "📷 चोट रे दाने री फोटो डालो — डॉक्टर देख लेगो",
    as: "📷 আঘাতৰ ফটো দিয়ক — ডাক্তাৰে চাব",
    or: "📷 ଆଘାତର ଫଟୋ ଦିଅନ୍ତୁ — ଡାକ୍ତର ଦେଖିବେ",
    nm: "📷 Chot ki photo dalo — Doctor dekh lega"
  };

  const PHOTO_SAVED_BANNER = {
    hi: "✅ Photo save ho gayi",
    en: "✅ Photo saved successfully",
    gu: "✅ Photo સેવ થઈ ગઈ",
    mr: "✅ Photo सेव्ह झाला",
    ta: "✅ Photo சேமிக்கப்பட்டது",
    te: "✅ Photo సేవ్ చేయబడింది",
    pa: "✅ Photo ਸੇਵ ਹੋ ਗਈ",
    bn: "✅ Photo সেভ হয়েছে",
    kn: "✅ Photo ಸೇವ್ ಆಗಿದೆ",
    ml: "✅ Photo സേവ് ചെയ്തു",
    mw: "✅ Photo सेव हो गी",
    as: "✅ Photo সংৰক্ষণ কৰা হ'ল",
    or: "✅ Photo ସେଭ୍ ହୋଇଗଲା",
    nm: "✅ Photo save hoise"
  };

  const SPEAK_TO_TYPE_LABEL = {
    hi: "🎤 बोलकर लिखें", en: "🎤 Speak to type", gu: "🎤 બોલીને લખો",
    mr: "🎤 बोलून लिहा", ta: "🎤 பேசி தட்டச்சு", te: "🎤 మాట్లాడి టైప్",
    pa: "🎤 ਬੋਲ ਕੇ ਲਿਖੋ", bn: "🎤 বলে লিখুন", kn: "🎤 ಮಾತಾಡಿ ಬರೆಯಿರಿ",
    ml: "🎤 പറഞ്ഞ് ടൈപ്പ്", mw: "🎤 बोलकर लिखो", as: "🎤 কৈ লিখক",
    or: "🎤 କହି ଲିଖନ୍ତୁ", nm: "🎤 Bolke likho"
  };

  const LISTENING_POPUP_LABEL = {
    hi: "🎤 सुन रहा हूँ... बोलिए", en: "🎤 Listening... speak now", gu: "🎤 સાંભળી રહ્યો છું... બોલો",
    mr: "🎤 ऐकत आहे... बोला", ta: "🎤 கேட்கிறேன்... பேசுங்கள்", te: "🎤 వింటున్నాను... మాట్లాడండి",
    pa: "🎤 ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ", bn: "🎤 শুনছি... বলুন", kn: "🎤 ಕೇಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡಿ",
    ml: "🎤 കേൾക്കുന്നു... സംസാരിക്കൂ", mw: "🎤 सुण रियो हूँ... बोलो", as: "🎤 শুনি আছোঁ... কওক",
    or: "🎤 ଶୁଣୁଛି... କୁହନ୍ତୁ", nm: "🎤 Suni ase... kotha kow"
  };

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
          <button className="tm-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="tm-book-consultation-card" onClick={() => { setShowModal(true); setBookError(''); setBookSuccess(''); }}>
          <h2 className="tm-book-title">🩺 {t('bookConsult')}</h2>
          <p className="tm-book-sub">{t('bookConsultSub')}</p>
          <div className="tm-book-arrow">→</div>
        </div>

        <div className="tm-section" style={{ background: '#f0fdf4', padding: '20px', borderRadius: '16px', border: '1px solid #bbf7d0', marginBottom: '24px' }}>
          <h2 className="tm-section-heading" style={{ color: '#166534', marginBottom: '8px' }}>{getUI('lakshanTitle')}</h2>
          <p style={{ color: '#15803d', fontSize: '14px', marginBottom: '16px' }}>{getUI('lakshanSub')}</p>
          
          {/* Step 1 & 2: Symptom Search and Selected */}
          <div style={{ marginBottom: '16px', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <input 
              type="text" 
              placeholder={getUI('searchPlaceholder')}
              value={symptomQuery}
              onChange={(e) => setSymptomQuery(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', marginBottom: '8px', boxSizing: 'border-box' }}
            />
            {filteredSymptoms.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {filteredSymptoms.map(sym => (
                  <button 
                    key={sym.english}
                    onClick={() => {
                      if (!selectedSymptoms.some(s => s.english === sym.english)) {
                        setSelectedSymptoms([...selectedSymptoms, sym]);
                      }
                      setSymptomQuery('');
                    }}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    + {sym.translated}
                  </button>
                ))}
              </div>
            )}
            
            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>{getUI('selected')}</p>
              {selectedSymptoms.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>{getUI('noSymptoms')}</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedSymptoms.map(sym => (
                    <div key={sym.english} style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {sym.translated}
                      <button onClick={() => setSelectedSymptoms(selectedSymptoms.filter(s => s.english !== sym.english))} style={{ background: 'none', border: 'none', color: '#166534', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Free Text Option */}
          <div style={{ marginBottom: '16px', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>
              {getUI('directTextLabel')}
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <input 
                type="text" 
                placeholder={getUI('orDescribe')}
                value={freeTextQuery}
                onChange={(e) => setFreeTextQuery(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
              />
              <button 
                onClick={handleExtractFromText}
                disabled={isExtracting}
                style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', height: '46px' }}
              >
                {isExtracting ? '...' : getUI('understand')}
              </button>
              
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {isFreeTextListening && (
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    marginBottom: '8px',
                    backgroundColor: '#dc2626',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    animation: 'pulse-recording-banner 1.5s infinite',
                    zIndex: 10
                  }}>
                    {LISTENING_POPUP_LABEL[language] || LISTENING_POPUP_LABEL['hi']}
                  </div>
                )}
                <button type="button" onClick={toggleFreeTextListening} style={{
                  background: isFreeTextListening ? '#dc2626' : '#1A6FDB',
                  color: '#fff', border: 'none', borderRadius: '50%',
                  width: '46px', height: '46px', cursor: 'pointer',
                  fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: isFreeTextListening ? 'pulse-recording-banner 1.5s infinite' : 'none',
                  transition: 'all 0.2s', flexShrink: 0
                }} title="Voice Typing">
                  {isFreeTextListening ? '⏹' : '🎤'}
                </button>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: isFreeTextListening ? '#dc2626' : '#1A6FDB', marginTop: '4px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                  {SPEAK_TO_TYPE_LABEL[language] || SPEAK_TO_TYPE_LABEL['hi']}
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || selectedSymptoms.length === 0}
            style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: (isAnalyzing || selectedSymptoms.length === 0) ? 0.7 : 1 }}
          >
            {isAnalyzing ? '...' : getUI('analyze')}
          </button>

          {/* Results Card */}
          {aiResult && (
            <div style={{ marginTop: '20px', background: '#fff', padding: '20px', borderRadius: '12px', border: '2px solid #22c55e', boxShadow: '0 4px 12px rgba(34,197,94,0.1)' }}>
              {aiResult.emergency && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>
                  🚨 {getUI('emergency')} 🚨
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Possibility</p>
                  <h3 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>{aiResult.predicted_disease_translated}</h3>
                </div>
                <div style={{ background: aiResult.severity === 'severe' ? '#fee2e2' : (aiResult.severity === 'moderate' ? '#fef3c7' : '#dcfce7'), color: aiResult.severity === 'severe' ? '#dc2626' : (aiResult.severity === 'moderate' ? '#d97706' : '#166534'), padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px' }}>
                  {aiResult.severity_translated}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>{getUI('recommendedDoc')}</p>
                <p style={{ fontSize: '16px', color: '#1e293b' }}>👨‍⚕️ {aiResult.recommended_specialization_translated}</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>{getUI('homeRemedies')}</p>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '15px' }}>
                  {aiResult.home_remedies_translated.map((hr, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{hr}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>{getUI('whenToSee')}</p>
                <p style={{ fontSize: '15px', color: '#dc2626', fontWeight: 'bold' }}>⏱ {aiResult.see_doctor_translated}</p>
              </div>

              <button 
                onClick={() => {
                  setBookForm(prev => ({ 
                    ...prev, 
                    symptoms: `${aiResult.predicted_disease_translated} - ${selectedSymptoms.map(s => s.translated).join(', ')}` 
                  }));
                  setShowModal(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ width: '100%', background: '#166534', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                📅 {getUI('bookBtn')}
              </button>
            </div>
          )}
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
                <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{appt.status}</span></p>
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
          <h2 className="tm-section-heading">📍 Nearby Doctors</h2>
          {doctorsLoading ? (
            <p>Loading...</p>
          ) : doctors.length > 0 ? (
            doctors.map((doc) => (
              <div key={doc.id} className="tm-card tm-doctor-card">
                <div className="tm-doc-info">
                  <h3>{doc.name}</h3>
                  <p><strong>{t('specialization')}:</strong> {doc.specialization}</p>
                  <p><strong>{t('hospital')}:</strong> {doc.hospital_name}</p>
                </div>
                <button
                  className="tm-btn-primary"
                  onClick={() => { setShowModal(true); setBookForm(prev => ({ ...prev, doctor_id: doc.id })); }}
                  style={{ width: '100%', marginTop: '16px' }}
                >
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

        <div className="tm-card tm-records-card" onClick={() => alert('Feature coming soon!')} style={{ cursor: 'pointer' }}>
          <div className="tm-records-left">
            <div className="tm-records-icon">📁</div>
            <h2 className="tm-records-title">My Health Records</h2>
            <div className="tm-badge-coming-soon">Coming Soon</div>
          </div>
          <p className="tm-records-sub" style={{ marginTop: '8px' }}>Your prescriptions and test reports will appear here</p>
        </div>
      </div>

      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'sticky', top: '-24px', backgroundColor: '#fff', zIndex: 10, paddingTop: '24px', paddingBottom: '16px', margin: '-24px -24px 20px -24px', paddingLeft: '24px', paddingRight: '24px', borderBottom: '1px solid #E0E0E0' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>{t('bookConsult')}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>
            {bookError && <p style={{ color: 'red', marginBottom: '12px', fontSize: '14px' }}>{bookError}</p>}
            {bookSuccess && <p style={{ color: 'green', marginBottom: '12px', fontSize: '14px' }}>{bookSuccess}</p>}
            <form onSubmit={handleBookSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Doctor</label>
                <select name="doctor_id" value={bookForm.doctor_id} onChange={handleBookChange} style={inputStyle} required>
                  <option value="">Select a doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name} — {doc.specialization}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Date</label>
                <input type="date" name="date" value={bookForm.date} onChange={handleBookChange} style={inputStyle} required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Time</label>
                <input type="time" name="time" value={bookForm.time} onChange={handleBookChange} style={inputStyle} required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Mode</label>
                <select name="mode" value={bookForm.mode} onChange={handleBookChange} style={inputStyle}>
                  <option value="video">Video Call</option>
                  <option value="audio">Audio Call</option>
                  <option value="in-person">In Person</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Symptoms / Reason</label>
                <div style={{ position: 'relative', marginTop: '4px' }}>
                  <textarea 
                    name="symptoms" 
                    value={bookForm.symptoms} 
                    onChange={handleBookChange} 
                    rows={4} 
                    style={{ ...inputStyle, resize: 'vertical', marginTop: 0, paddingRight: '80px', minHeight: '100px' }} 
                    placeholder="Describe your symptoms..." 
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {isListening && (
                      <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        marginBottom: '8px',
                        backgroundColor: '#dc2626',
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        animation: 'pulse-recording-banner 1.5s infinite',
                        zIndex: 10
                      }}>
                        {LISTENING_POPUP_LABEL[language] || LISTENING_POPUP_LABEL['hi']}
                      </div>
                    )}
                    <button type="button" onClick={toggleListening} style={{
                      background: isListening ? '#dc2626' : '#1A6FDB',
                      color: '#fff', border: 'none', borderRadius: '50%',
                      width: '40px', height: '40px', cursor: 'pointer',
                      fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: isListening ? 'pulse-recording-banner 1.5s infinite' : 'none',
                      transition: 'all 0.2s'
                    }} title="Voice Typing">
                      {isListening ? '⏹' : '🎤'}
                    </button>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: isListening ? '#dc2626' : '#1A6FDB', marginTop: '4px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                      {SPEAK_TO_TYPE_LABEL[language] || SPEAK_TO_TYPE_LABEL['hi']}
                    </div>
                  </div>
                </div>

                {/* Prominent Voice Recorder Section */}
                <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', textAlign: 'center', position: 'relative' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#166534', marginBottom: '16px' }}>
                    {VOICE_RECORD_LABEL[language] || VOICE_RECORD_LABEL['hi']}
                  </div>
                  
                  {isRecordingAudio && (
                    <div style={{
                      position: 'absolute',
                      top: '-24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#dc2626',
                      color: '#fff',
                      padding: '8px 20px',
                      borderRadius: '24px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                      animation: 'pulse-recording-banner 1.5s infinite',
                      zIndex: 10,
                      whiteSpace: 'nowrap'
                    }}>
                      {RECORDING_BANNER[language] || RECORDING_BANNER['hi']}
                    </div>
                  )}

                  <button type="button" onClick={toggleAudioRecording} style={{
                    background: isRecordingAudio ? '#dc2626' : '#16a34a',
                    color: '#fff', border: 'none', borderRadius: '28px',
                    height: '56px', padding: '0 32px', cursor: 'pointer',
                    fontSize: '20px', fontWeight: 'bold', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center', gap: '8px',
                    animation: isRecordingAudio ? 'pulse-recording-banner 1.5s infinite' : 'none',
                    transition: 'all 0.2s',
                    width: '100%',
                    maxWidth: '300px'
                  }}>
                    {isRecordingAudio ? '⏹ Stop' : '🎙️ Record'}
                  </button>

                  {/* Audio Player and Remove Button */}
                  {bookForm.symptom_audio && !isRecordingAudio && (
                    <div style={{ marginTop: '16px', backgroundColor: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                      <audio controls src={bookForm.symptom_audio} style={{ width: '100%', height: '40px' }} />
                      <button type="button" onClick={() => setBookForm(prev => ({...prev, symptom_audio: ''}))} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '13px', cursor: 'pointer', marginTop: '8px', fontWeight: 'bold' }}>✖ Remove Recording</button>
                    </div>
                  )}
                </div>

                <style>{`
                  @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
                  @keyframes pulse-recording-banner {
                    0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.5); }
                    70% { box-shadow: 0 0 0 12px rgba(220, 38, 38, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
                  }
                  @keyframes slide-up-photo {
                    from { opacity: 0; transform: translate(-50%, 10px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                  }
                `}</style>
              </div>
              {/* Prominent Photo Upload Section */}
              <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '16px', textAlign: 'center', position: 'relative', marginBottom: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E3A8A', marginBottom: '16px' }}>
                  {PHOTO_UPLOAD_LABEL[language] || PHOTO_UPLOAD_LABEL['hi']}
                </div>
                
                {bookForm.injury_photo && (
                  <div style={{
                    position: 'absolute',
                    top: '-24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#16a34a',
                    color: '#fff',
                    padding: '8px 20px',
                    borderRadius: '24px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                    animation: 'slide-up-photo 0.3s ease-out',
                    zIndex: 10,
                    whiteSpace: 'nowrap'
                  }}>
                    {PHOTO_SAVED_BANNER[language] || PHOTO_SAVED_BANNER['hi']}
                  </div>
                )}

                {showWebcam ? (
                  <div style={{ marginBottom: '10px' }}>
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px', backgroundColor: '#000' }} />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button type="button" onClick={capturePhoto} className="tm-btn-primary" style={{ flex: 1, backgroundColor: '#1A6FDB', borderColor: '#1A6FDB', height: '56px', fontSize: '18px', borderRadius: '28px' }}>📸 Capture</button>
                      <button type="button" onClick={stopWebcam} className="tm-btn-secondary" style={{ flex: 1, height: '56px', fontSize: '18px', borderRadius: '28px' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setBookForm(prev => ({ ...prev, injury_photo: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: 'none' }}
                      id="galleryInput"
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '10px' }}>
                      <button 
                        type="button" 
                        onClick={startWebcam}
                        style={{ flex: 1, minWidth: '200px', padding: '0 20px', borderRadius: '28px', border: 'none', background: '#1A6FDB', color: '#fff', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', height: '56px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      >
                        📷 Take Photo
                      </button>
                      <button 
                        type="button" 
                        onClick={() => document.getElementById('galleryInput').click()}
                        style={{ flex: 1, minWidth: '200px', padding: '0 20px', borderRadius: '28px', border: 'none', background: '#1A6FDB', color: '#fff', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', height: '56px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      >
                        📁 Upload Gallery
                      </button>
                    </div>
                    {bookForm.injury_photo && (
                      <div style={{ position: 'relative', marginTop: '16px', border: '3px solid #16a34a', borderRadius: '12px', padding: '4px', backgroundColor: '#fff' }}>
                        <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#16a34a', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', zIndex: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>✓</div>
                        <img 
                          src={bookForm.injury_photo} 
                          alt="Preview" 
                          style={{ maxHeight: '200px', borderRadius: '8px', width: '100%', objectFit: 'cover' }} 
                        />
                        <button type="button" onClick={() => setBookForm(prev => ({...prev, injury_photo: ''}))} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>&times;</button>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={booking} className="tm-btn-primary" style={{ flex: 1 }}>{booking ? 'Booking...' : 'Confirm Booking'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="tm-btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
