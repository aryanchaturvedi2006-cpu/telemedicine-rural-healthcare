import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const AarogyaModal = ({ onClose }) => {
  const { language } = useLanguage();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  const LANG_MAP = {
    hi: 'hi-IN', en: 'en-IN', mw: 'hi-IN', gu: 'gu-IN', mr: 'mr-IN',
    ta: 'ta-IN', te: 'te-IN', pa: 'pa-IN', bn: 'bn-IN', kn: 'kn-IN',
    ml: 'ml-IN', as: 'hi-IN', or: 'or-IN', nm: 'en-IN'
  };

  const SPEAK_LABEL = {
    hi: '🎤 बोलकर लिखें', en: '🎤 Speak to type', gu: '🎤 બોલીને લખો',
    mr: '🎤 बोलून लिहा', ta: '🎤 பேசி தட்டச்சு',
    te: '🎤 మాట్లాడి టైప్', pa: '🎤 ਬੋਲ ਕੇ ਲਿਖੋ',
    bn: '🎤 বলে লিখুন', kn: '🎤 ಮಾತಾಡಿ ಬರೆಯಿರಿ',
    ml: '🎤 പറഞ്ഞ് ടൈപ്പ്', mw: '🎤 बोलकर लिखो',
    as: '🎤 কৈ লিখক', or: '🎤 କହି ଲିଖନ୍ତୁ', nm: '🎤 Bolke likho'
  };

  const LISTENING_LABEL = {
    hi: '🎤 सुन रहा हूँ... बोलिए', en: '🎤 Listening... speak now', gu: '🎤 સાંભળી રહ્યો છું... બોલો',
    mr: '🎤 ऐकत आहे... बोला', ta: '🎤 கேட்கிறேன்... பேசுங்கள்',
    te: '🎤 వింటున్నాను... మాట్లాడండి', pa: '🎤 ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ',
    bn: '🎤 শুনছি... বলুন', kn: '🎤 ಕೇಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡಿ',
    ml: '🎤 കേൾക്കുന്നു... സംസാരിക്കൂ', mw: '🎤 सुण रियो हूँ... बोलो',
    as: '🎤 শুনি আছোঁ... কওক', or: '🎤 ଶୁଣୁଛି... କୁହନ୍ତୁ', nm: '🎤 Suni ase... kotha kow'
  };

  const REPLAY_LABEL = {
    hi: "🔊 दोबारा सुनें", en: "🔊 Listen again", gu: "🔊 ફરીથી સાંભળો",
    mr: "🔊 पुन्हा ऐका", ta: "🔊 மீண்டும் கேளுங்கள்", te: "🔊 మళ్ళీ వినండి",
    pa: "🔊 ਦੁਬਾਰਾ ਸੁਣੋ", bn: "🔊 আবার শুনুন", kn: "🔊 ಮತ್ತೆ ಕೇಳಿ",
    ml: "🔊 വീണ്ടും കേൾക്കൂ", mw: "🔊 दोबारा सुणो", as: "🔊 পুনৰ শুনক",
    or: "🔊 ପୁଣି ଶୁଣନ୍ତୁ", nm: "🔊 Dobara suno"
  };

  const STOP_LABEL = {
    hi: "⏹ रोकें", en: "⏹ Stop", gu: "⏹ રોકો", mr: "⏹ थांबा",
    ta: "⏹ நிறுத்து", te: "⏹ ఆపండి", pa: "⏹ ਰੋਕੋ", bn: "⏹ থামুন",
    kn: "⏹ ನಿಲ್ಲಿಸಿ", ml: "⏹ നിർത്തൂ", mw: "⏹ रोको", as: "⏹ ৰওক",
    or: "⏹ ବନ୍ଦ କରନ୍ତୁ", nm: "⏹ Roko"
  };

  const MUTE_LABEL = {
    hi: "🔇 आवाज़ बंद", en: "🔇 Mute", gu: "🔇 મ્યૂટ", mr: "🔇 म्यूट",
    ta: "🔇 ஒலியடக்கு", te: "🔇 మ్యూట్", pa: "🔇 ਮਿਊਟ", bn: "🔇 মিউট",
    kn: "🔇 ಮ್ಯೂಟ್", ml: "🔇 മ്യൂട്ട്", mw: "🔇 आवाज़ बंद", as: "🔇 মিউট",
    or: "🔇 ମ୍ୟୁଟ୍", nm: "🔇 Mute"
  };

  const UNMUTE_LABEL = {
    hi: "🔊 आवाज़ चालू", en: "🔊 Unmute", gu: "🔊 અનમ્યૂટ", mr: "🔊 अनम्यूट",
    ta: "🔊 ஒலியெழுப்பு", te: "🔊 అన్‌మ్యూట్", pa: "🔊 ਅਨਮਿਊਟ", bn: "🔊 আনমিউট",
    kn: "🔊 ಅನ್‌ಮ್ಯೂಟ್", ml: "🔊 അൺമ്യൂട്ട്", mw: "🔊 आवाज़ चालू", as: "🔊 আনমিউট",
    or: "🔊 ଅନମ୍ୟୁଟ୍", nm: "🔊 Unmute"
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
  };

  const speakText = (text, messageId, autoPlay = false) => {
    if (autoPlay && isMuted) return;
    
    stopSpeaking(); // Stop any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    const TTS_LANG_MAP = {
      hi: 'hi-IN', en: 'en-IN', gu: 'gu-IN', mr: 'mr-IN',
      ta: 'ta-IN', te: 'te-IN', pa: 'pa-IN', bn: 'bn-IN',
      kn: 'kn-IN', ml: 'ml-IN', mw: 'hi-IN', as: 'as-IN',
      or: 'or-IN', nm: 'en-IN'
    };
    utterance.lang = TTS_LANG_MAP[language] || 'hi-IN';
    
    utterance.onstart = () => setSpeakingMessageId(messageId);
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Your browser does not support voice input. Please use Chrome.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = LANG_MAP[language] || 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
      setInputText(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };


  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: text.trim() };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const SYSTEM_PROMPT = `You are Aarogya AI, a compassionate health assistant for rural communities 
in India.

MOST IMPORTANT RULE — LANGUAGE MATCHING:
You must ALWAYS reply in the EXACT same language style the user writes in.
Detect the user's language from their message and mirror it perfectly:

- If user writes in PURE ENGLISH → reply in pure English only
  Example user: "I have fever and headache, suggest medicines"
  Example reply: "Fever and headache are common together. You can take 
  Paracetamol (Crocin/Dolo 650)..."

- If user writes in HINGLISH (mix of Hindi + English) → reply in Hinglish
  Example user: "bhai mujhe bukhaar he aur sardi bhi, koi medicine batao"
  Example reply: "Bhai bukhaar aur sardi ke liye Paracetamol le sakte ho 
  jaise Crocin ya Dolo. Saath mein garam paani piyo..."

- If user writes in PURE HINDI (Devanagari script) → reply in pure Hindi
  Example user: "मुझे बुखार और सिरदर्द है"
  Example reply: "बुखार और सिरदर्द के लिए पेरासिटामोल लें..."

- If user writes in any other Indian language (Tamil, Telugu, Bengali, 
  Marathi, Gujarati, Kannada, Malayalam, Punjabi, etc.) → reply in that 
  same language

NEVER switch languages mid-conversation unless the user switches first.
NEVER reply in Hindi if user wrote in English.
NEVER reply in English if user wrote in Hindi.
Always match the user's exact style — formal/informal, casual/serious.

YOUR ROLE:
1. Help users understand their symptoms in simple language
2. Suggest basic home remedies and first aid for common conditions
3. Recommend when to urgently see a real doctor (emergencies)
4. Provide basic medicine information (common OTC medicines only)
5. Give emergency guidance for critical situations

MEDICAL RULES:
- For emergencies (chest pain, difficulty breathing, severe bleeding, 
  unconsciousness, stroke signs) → IMMEDIATELY say call 108 first
- Never diagnose definitively — say 'this could be' not 'you have'
- Always recommend seeing a real doctor for serious conditions
- Keep responses simple — rural users with basic education
- Maximum 4-5 lines per response, easy words only
- NEVER output internal thoughts, 'Draft 1', 'Draft 2', or drafting process. Output ONLY the final direct response to the user.
- End every response with whether they should see a doctor:
  'Doctor se milna chahiye: Haan urgently / Haan jab ho sake / 
  Zaroorat nahi' (phrase this in user's language)`;

      const apiContents = currentMessages.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      let response;
      let data;
      let success = false;
      let lastError = null;
      
      const modelsToTry = [
        'gemini-flash-latest',
        'gemini-2.5-flash',
        'gemini-2.0-flash-lite-001',
        'gemini-2.0-flash'
      ];

      for (const model of modelsToTry) {
        if (success) break;
        let retryCount = 0;
        const MAX_RETRIES = 1; // Try each model max 2 times (initial + 1 retry)

        while (retryCount <= MAX_RETRIES) {
          try {
            response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: apiContents,
                  systemInstruction: {
                    role: 'system',
                    parts: [{ text: SYSTEM_PROMPT }]
                  },
                  generationConfig: {
                    temperature: 0.4
                  }
                })
              }
            );
            
            if (!response.ok) {
              data = await response.json().catch(() => ({}));
              console.error(`API Error Response for ${model}:`, data);
              throw new Error(data.error?.message || `HTTP ${response.status}`);
            }

            data = await response.json();
            success = true;
            break; // Success, exit retry loop
          } catch (error) {
            lastError = error;
            const errMsg = error.message.toLowerCase();
            const isRetryable = errMsg.includes('failed to fetch') || 
                                errMsg.includes('503') || 
                                errMsg.includes('high demand') ||
                                errMsg.includes('500');
                                
            if (retryCount >= MAX_RETRIES || !isRetryable) {
              break; // Break the inner retry loop, try next model
            }
            console.warn(`Fetch failed for ${model}, retrying...`, error);
            await new Promise(res => setTimeout(res, 1500)); 
            retryCount++;
          }
        }
      }

      if (!success) {
        throw lastError || new Error("Failed to connect to any AI model.");
      }

      if (!data?.candidates || data.candidates.length === 0) {
        throw new Error('No response generated');
      }

      const reply = data.candidates[0].content.parts[0].text;
      const msgId = Date.now();
      setMessages((prev) => [...prev, { id: msgId, role: 'ai', text: reply }]);
      speakText(reply, msgId, true);
    } catch (error) {
      console.error("AI Error:", error);
      const msgId = Date.now();
      const errorText = `⚠️ Connection Error: ${error.message}. Please try again later or call 108 for emergencies.`;
      setMessages((prev) => [...prev, { 
        id: msgId, 
        role: 'ai', 
        text: errorText 
      }]);
      speakText(errorText, msgId, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSuggestionChips = () => {
    const chipTranslations = {
      en: [
        "🤒 I have fever and headache",
        "💊 What medicine for cold?",
        "🚨 Chest pain — is it serious?",
        "🤢 I have stomach pain and vomiting",
        "🦟 Dengue symptoms — what to check?",
        "🤰 Pregnancy health tips",
        "🤝 How to recognize diabetes symptoms?",
        "😮💨 Difficulty breathing or cough",
        "🦴 Joint pain and body ache",
        "🥱 Weakness and tiredness",
        "💪 Weakness and body pain",
        "😴 Sleep problems or insomnia"
      ],
      hi: [
        "🤒 मुझे बुखार और सिरदर्द है",
        "💊 सर्दी की दवा क्या है?",
        "🚨 सीने में दर्द — क्या यह गंभीर है?",
        "🤢 मुझे पेट में दर्द और उल्टी हो रही है",
        "🦟 डेंगू के लक्षण — क्या जांचें?",
        "🤰 गर्भावस्था स्वास्थ्य संबंधी सुझाव",
        "🤝 मधुमेह के लक्षणों को कैसे पहचानें?",
        "😮💨 सांस लेने में कठिनाई या खांसी",
        "🦴 जोड़ों में दर्द और बदन दर्द",
        "🥱 कमजोरी और थकान",
        "💪 कमजोरी और शरीर में दर्द",
        "😴 नींद की समस्या या अनिद्रा"
      ],
      mrw: [
        "🤒 मने ताव और सिरदर्द है",
        "💊 जुखाम री दवाई कांई है?",
        "🚨 छाती में दुखणो — कांई ओ गंभीर है?",
        "🤢 मने पेट दर्द और उल्टी हो रही है",
        "🦟 डेंगू रा लक्षण — कांई जांचा?",
        "🤰 गर्भावस्था रा सेहत सुझाव",
        "🤝 शुगर रा लक्षण कियां पिछाणा?",
        "😮💨 सांस लेवण में दिक्कत या खांसी",
        "🦴 हाडकां में दर्द और बदन दर्द",
        "🥱 कमजोरी और थकान",
        "💪 कमजोरी और डील में दर्द",
        "😴 नींद री दिक्कत या उनींदापन"
      ],
      gu: [
        "🤒 મને તાવ અને માથાનો દુખાવો છે",
        "💊 શરદી માટે કઈ દવા?",
        "🚨 છાતીમાં દુખાવો — શું તે ગંભીર છે?",
        "🤢 મને પેટમાં દુખાવો અને ઉલ્ટી થાય છે",
        "🦟 ડેન્ગ્યુના લક્ષણો — શું તપાસવું?",
        "🤰 ગર્ભાવસ્થા માટે આરોગ્ય ટિપ્સ",
        "🤝 ડાયાબિટીસના લક્ષણો કેવી રીતે ઓળખવા?",
        "😮💨 શ્વાસ લેવામાં તકલીફ અથવા ઉધરસ",
        "🦴 સાંધાનો દુખાવો અને શરીરનો દુખાવો",
        "🥱 નબળાઇ અને થાક",
        "💪 નબળાઇ અને શરીરનો દુખાવો",
        "😴 ઊંઘની સમસ્યા અથવા અનિદ્રા"
      ],
      mr: [
        "🤒 मला ताप आणि डोकेदुखी आहे",
        "💊 सर्दीसाठी कोणती औषधे?",
        "🚨 छातीत दुखत आहे — हे गंभीर आहे का?",
        "🤢 मला पोटदुखी आणि उलट्या होत आहेत",
        "🦟 डेंग्यूची लक्षणे — काय तपासावे?",
        "🤰 गर्भधारणा आरोग्याच्या टिप्स",
        "🤝 मधुमेहाची लक्षणे कशी ओळखावी?",
        "😮💨 श्वास घेण्यास त्रास किंवा खोकला",
        "🦴 सांधेदुखी आणि अंगदुखी",
        "🥱 अशक्तपणा आणि थकवा",
        "💪 अशक्तपणा आणि अंगदुखी",
        "😴 झोपेची समस्या किंवा निद्रानाश"
      ],
      ta: [
        "🤒 எனக்கு காய்ச்சல் மற்றும் தலைவலி உள்ளது",
        "💊 சளிக்கு என்ன மருந்து?",
        "🚨 நெஞ்சு வலி — இது தீவிரமானதா?",
        "🤢 எனக்கு வயிற்று வலி மற்றும் வாந்தி உள்ளது",
        "🦟 டெங்கு அறிகுறிகள் — எதை சரிபார்க்க வேண்டும்?",
        "🤰 கர்ப்பகால சுகாதார குறிப்புகள்",
        "🤝 நீரிழிவு அறிகுறிகளை எவ்வாறு அடையாளம் காண்பது?",
        "😮💨 மூச்சு விடுவதில் சிரமம் அல்லது இருமல்",
        "🦴 மூட்டு வலி மற்றும் உடல் வலி",
        "🥱 பலவீனம் மற்றும் சோர்வு",
        "💪 பலவீனம் மற்றும் உடல் வலி",
        "😴 தூக்க பிரச்சினைகள் அல்லது தூக்கமின்மை"
      ],
      te: [
        "🤒 నాకు జ్వరం మరియు తలనొప్పిగా ఉంది",
        "💊 జలుబుకి ఏ మందు వాడాలి?",
        "🚨 ఛాతీ నొప్పి — ఇది తీవ్రమైనదా?",
        "🤢 నాకు కడుపు నొప్పి మరియు వాంతులు అవుతున్నాయి",
        "🦟 డెంగ్యూ లక్షణాలు — ఏమి గమనించాలి?",
        "🤰 గర్భధారణ ఆరోగ్య చిట్కాలు",
        "🤝 మధుమేహం లక్షణాలను ఎలా గుర్తించాలి?",
        "😮💨 శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా దగ్గు",
        "🦴 కీళ్ల నొప్పులు మరియు ఒళ్లు నొప్పులు",
        "🥱 బలహీనత మరియు అలసట",
        "💪 బలహీనత మరియు ఒళ్లు నొప్పులు",
        "😴 నిద్ర సమస్యలు లేదా నిద్రలేమి"
      ],
      pa: [
        "🤒 ਮੈਨੂੰ ਬੁਖਾਰ ਅਤੇ ਸਿਰਦਰਦ ਹੈ",
        "💊 ਜ਼ੁਕਾਮ ਲਈ ਕਿਹੜੀ ਦਵਾਈ?",
        "🚨 ਛਾਤੀ ਵਿੱਚ ਦਰਦ — ਕੀ ਇਹ ਗੰਭੀਰ ਹੈ?",
        "🤢 ਮੈਨੂੰ ਪੇਟ ਦਰਦ ਅਤੇ ਉਲਟੀਆਂ ਆ ਰਹੀਆਂ ਹਨ",
        "🦟 ਡੇਂਗੂ ਦੇ ਲੱਛਣ — ਕੀ ਜਾਂਚ ਕਰਨੀ ਹੈ?",
        "🤰 ਗਰਭ ਅਵਸਥਾ ਲਈ ਸਿਹਤ ਸੁਝਾਅ",
        "🤝 ਸ਼ੂਗਰ ਦੇ ਲੱਛਣਾਂ ਨੂੰ ਕਿਵੇਂ ਪਛਾਣਿਆ ਜਾਵੇ?",
        "😮💨 ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਜਾਂ ਖੰਘ",
        "🦴 ਜੋੜਾਂ ਦਾ ਦਰਦ ਅਤੇ ਸਰੀਰ ਦਾ ਦਰਦ",
        "🥱 ਕਮਜ਼ੋਰੀ ਅਤੇ ਥਕਾਵٹ",
        "💪 ਕਮਜ਼ੋਰੀ ਅਤੇ ਸਰੀਰ ਦਾ ਦਰਦ",
        "😴 ਨੀਂਦ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ ਜਾਂ ਇਨਸੌਮਨੀਆ"
      ],
      bn: [
        "🤒 আমার জ্বর এবং মাথাব্যথা আছে",
        "💊 সর্দির জন্য কী ওষুধ?",
        "🚨 বুকে ব্যথা — এটি কি গুরুতর?",
        "🤢 আমার পেট ব্যথা এবং বমি হচ্ছে",
        "🦟 ডেঙ্গুর লক্ষণ — কী পরীক্ষা করবেন?",
        "🤰 গর্ভাবস্থায় স্বাস্থ্যের টিপস",
        "🤝 ডায়াবেটিসের লক্ষণ কীভাবে চিনবেন?",
        "😮💨 শ্বাস নিতে কষ্ট বা কাশি",
        "🦴 জয়েন্টে ব্যথা এবং শরীরে ব্যথা",
        "🥱 দুর্বলতা এবং ক্লান্তি",
        "💪 দুর্বলতা এবং শরীরে ব্যথা",
        "😴 ঘুমের সমস্যা বা অনিদ্রা"
      ],
      kn: [
        "🤒 ನನಗೆ ಜ್ವರ ಮತ್ತು ತಲೆನೋವು ಇದೆ",
        "💊 ಶೀತಕ್ಕೆ ಯಾವ ಔಷಧಿ?",
        "🚨 ಎದೆ ನೋವು — ಇದು ಗಂಭೀರವೇ?",
        "🤢 ನನಗೆ ಹೊಟ್ಟೆ ನೋವು ಮತ್ತು ವಾಂತಿ ಇದೆ",
        "🦟 ಡೆಂಗ್ಯೂ ಲಕ್ಷಣಗಳು — ಏನನ್ನು ಪರೀಕ್ಷಿಸಬೇಕು?",
        "🤰 ಗರ್ಭಾವಸ್ಥೆಯ ಆರೋಗ್ಯ ಸಲಹೆಗಳು",
        "🤝 ಮಧುಮೇಹ ಲಕ್ಷಣಗಳನ್ನು ಗುರುತಿಸುವುದು ಹೇಗೆ?",
        "😮💨 ಉಸಿರಾಟದ ತೊಂದರೆ ಅಥವಾ ಕೆಮ್ಮು",
        "🦴 ಕೀಲು ನೋವು ಮತ್ತು ಮೈಕೈ ನೋವು",
        "🥱 ದೌರ್ಬಲ್ಯ ಮತ್ತು ಆಯಾಸ",
        "💪 ದೌರ್ಬಲ್ಯ ಮತ್ತು ಮೈಕೈ ನೋವು",
        "😴 ನಿದ್ರೆಯ ಸಮಸ್ಯೆಗಳು ಅಥವಾ ನಿದ್ರಾಹೀನತೆ"
      ],
      ml: [
        "🤒 എനിക്ക് പനിയും തലവേദനയും ഉണ്ട്",
        "💊 ജലദോഷത്തിന് എന്ത് മരുന്ന്?",
        "🚨 നെഞ്ചുവേദന — ഇത് ഗുരുതരമാണോ?",
        "🤢 എനിക്ക് വയറുവേദനയും ഛർദ്ദിയും ഉണ്ട്",
        "🦟 ഡെങ്കിപ്പനി ലക്ഷണങ്ങൾ — എന്തൊക്കെ ശ്രദ്ധിക്കണം?",
        "🤰 ഗർഭകാല ആരോഗ്യ ടിപ്പുകൾ",
        "🤝 പ്രമേഹ ലക്ഷണങ്ങൾ എങ്ങനെ തിരിച്ചറിയാം?",
        "😮💨 ശ്വസിക്കാൻ ബുദ്ധിമുട്ട് അല്ലെങ്കിൽ ചുമ",
        "🦴 സന്ധി വേദനയും ശരീര വേദനയും",
        "🥱 ക്ഷീണവും തളർച്ചയും",
        "💪 ക്ഷീണവും ശരീര വേദനയും",
        "😴 ഉറക്ക പ്രശ്നങ്ങൾ അല്ലെങ്കിൽ ഉറക്കമില്ലായ്മ"
      ],
      as: [
        "🤒 মোৰ জ্বৰ আৰু মূৰৰ বিষ আছে",
        "💊 চৰ্দিৰ বাবে কি ঔষধ?",
        "🚨 বুকুৰ বিষ — ই গুৰুতৰ নেকি?",
        "🤢 মোৰ পেটৰ বিষ আৰু বমি হৈছে",
        "🦟 ডেংগুৰ লক্ষণ — কি পৰীক্ষা কৰিব লাগে?",
        "🤰 গৰ্ভাৱস্থাৰ স্বাস্থ্যৰ পৰামৰ্শ",
        "🤝 ডায়েবেটিছৰ লক্ষণ কেনেকৈ চিনাক্ত কৰিব?",
        "😮💨 উশাহ লোৱাত কষ্ট বা কাহ",
        "🦴 গাঁঠিৰ বিষ আৰু গাৰ বিষ",
        "🥱 দুৰ্বলতা আৰু ভাগৰ",
        "💪 দুৰ্বলতা আৰু গাৰ বিষ",
        "😴 টোপনিৰ সমস্যা বা অনিদ্ৰা"
      ]
    };
    return chipTranslations[language] || chipTranslations.en;
  };
  const suggestionChips = getSuggestionChips();

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: '#fff', 
      zIndex: 10000, display: 'flex', flexDirection: 'column',
      fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2E7D32', color: '#fff', padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>🌿 Aarogya AI - Aapka Swasthya Saathi</div>
          <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>Your 24/7 Health Assistant — Ask anything, anytime</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              const newMutedState = !isMuted;
              setIsMuted(newMutedState);
              if (newMutedState) stopSpeaking();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: '#fff', 
              padding: '6px 12px', borderRadius: '16px', cursor: 'pointer', fontSize: '14px',
              display: 'flex', alignItems: 'center'
            }}
          >
            {isMuted ? (UNMUTE_LABEL[language] || UNMUTE_LABEL.en) : (MUTE_LABEL[language] || MUTE_LABEL.en)}
          </button>
          <button 
            onClick={onClose} 
            style={{
              background: 'none', border: 'none', color: '#fff', fontSize: '32px', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Close"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={chatRef}
        style={{ 
          flex: 1, overflowY: 'auto', backgroundColor: '#F8FBF8', 
          padding: '24px', display: 'flex', flexDirection: 'column'
        }}
      >
        {messages.length === 0 ? (
          <>
            <style>{`
              .suggestion-grid {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 10px;
                padding: 16px 0;
              }
              @media (max-width: 768px) {
                .suggestion-grid {
                  grid-template-columns: repeat(3, 1fr);
                }
              }
              @media (max-width: 480px) {
                .suggestion-grid {
                  grid-template-columns: repeat(2, 1fr);
                }
              }
            `}</style>
            <div className="suggestion-grid">
              {suggestionChips.map((chip) => (
                <button 
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#F1F8F1';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                  }}
                  style={{
                    backgroundColor: '#fff', border: '1px solid #2E7D32', color: '#2E7D32',
                    borderRadius: '20px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer',
                    transition: 'background-color 0.2s', width: '100%', textAlign: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '12px', maxWidth: msg.role === 'user' ? '75%' : '80%' }}>
              {msg.role === 'ai' && <div style={{ fontSize: '12px', color: '#2E7D32', marginBottom: '4px', fontWeight: 'bold' }}>🌿 Aarogya AI</div>}
              <div style={{
                backgroundColor: msg.role === 'user' ? '#2E7D32' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#1A1A1A',
                border: msg.role === 'ai' ? '1px solid #E0E0E0' : 'none',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '12px 16px', fontSize: '15px', whiteSpace: 'pre-wrap',
                boxShadow: msg.role === 'ai' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                lineHeight: '1.5'
              }}>
                {msg.text}
              </div>
              {msg.role === 'ai' && (
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-start' }}>
                  {speakingMessageId === msg.id ? (
                    <button
                      onClick={stopSpeaking}
                      style={{
                        background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: '16px',
                        padding: '4px 12px', fontSize: '12px', cursor: 'pointer', color: '#D32F2F',
                        display: 'flex', alignItems: 'center'
                      }}
                    >
                      {STOP_LABEL[language] || STOP_LABEL.en}
                    </button>
                  ) : (
                    <button
                      onClick={() => speakText(msg.text, msg.id, false)}
                      style={{
                        background: '#F8FBF8', border: '1px solid #C8E6C9', borderRadius: '16px',
                        padding: '4px 12px', fontSize: '12px', cursor: 'pointer', color: '#2E7D32',
                        display: 'flex', alignItems: 'center'
                      }}
                    >
                      {REPLAY_LABEL[language] || REPLAY_LABEL.en}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#2E7D32', marginBottom: '4px', fontWeight: 'bold' }}>🌿 Aarogya AI</div>
            <div style={{
              backgroundColor: '#fff', color: '#1A1A1A', border: '1px solid #E0E0E0',
              borderRadius: '18px 18px 18px 4px', padding: '12px 16px', fontSize: '15px',
              animation: 'aarogya-pulse 1s infinite'
            }}>
              ● ● ●
              <style>{`
                @keyframes aarogya-pulse {
                  0% { opacity: 0.3; }
                  50% { opacity: 1; }
                  100% { opacity: 0.3; }
                }
              `}</style>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ padding: '16px 24px 32px 24px', backgroundColor: '#fff', borderTop: '1px solid #E0E0E0', boxShadow: '0 -2px 10px rgba(0,0,0,0.02)', position: 'relative' }}>
        {isListening && (
          <div style={{
            position: 'absolute',
            top: '-48px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#2E7D32',
            color: '#fff',
            padding: '8px 20px',
            borderRadius: '24px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
            animation: 'slide-up 0.3s ease-out',
            zIndex: 10
          }}>
            {LISTENING_LABEL[language] || '🎤 Listening... speak now'}
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px', maxWidth: '1000px', margin: '0 auto', alignItems: 'center' }}>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your health question in Hindi or English..."
            style={{
              flex: 1, height: '52px', border: '1.5px solid #E0E0E0', borderRadius: '26px',
              padding: '12px 24px', fontSize: '15px', outline: 'none', boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2E7D32'}
            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
          />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              type="button"
              onClick={toggleListening}
              style={{
                width: '52px', height: '52px', borderRadius: '50%', border: 'none',
                backgroundColor: isListening ? '#2E7D32' : '#E8F5E9',
                color: isListening ? '#fff' : '#2E7D32',
                fontSize: '20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                animation: isListening ? 'mic-pulse-green 1.5s infinite' : 'none',
                transition: 'all 0.2s'
              }}
              title={SPEAK_LABEL[language] || '🎤 Speak to type'}
            >
              {isListening ? '⏹' : '🎙'}
            </button>
            <div style={{ position: 'absolute', top: '100%', marginTop: '8px', fontSize: '13px', fontWeight: 'bold', color: '#2E7D32', whiteSpace: 'nowrap' }}>
              {SPEAK_LABEL[language] || '🎤 Speak to type'}
            </div>
          </div>
          <button 
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            style={{
              width: '52px', height: '52px', borderRadius: '50%', border: 'none',
              backgroundColor: (isLoading || !inputText.trim()) ? '#A5D6A7' : '#2E7D32',
              color: '#fff', fontSize: '20px', cursor: (isLoading || !inputText.trim()) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s'
            }}
          >
            ➤
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '32px', maxWidth: '1000px', margin: '32px auto 0 auto' }}>
          <div style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
            ⚠️ Aarogya AI is for guidance only. Always consult a real doctor for medical decisions.
          </div>
        </div>
        <style>{`
          @keyframes mic-pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.5); }
            70% { box-shadow: 0 0 0 10px rgba(46, 125, 50, 0); }
            100% { box-shadow: 0 0 0 0 rgba(46, 125, 50, 0); }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translate(-50%, 10px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AarogyaModal;
