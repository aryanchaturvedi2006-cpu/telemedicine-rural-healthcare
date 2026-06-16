import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const AarogyaModal = ({ onClose }) => {
  const { language } = useLanguage();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
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

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
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
              temperature: 0.4,
              maxOutputTokens: 500
            }
          })
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("API Error Response:", data);
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated');
      }

      const reply = data.candidates[0].content.parts[0].text;
      setMessages((prev) => [...prev, { id: Date.now(), role: 'ai', text: reply }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [...prev, { 
        id: Date.now(), 
        role: 'ai', 
        text: `⚠️ Connection Error: ${error.message}. Please try again later or call 108 for emergencies.` 
      }]);
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

      {/* Chat Area */}
      <div 
        ref={chatRef}
        style={{ 
          flex: 1, overflowY: 'auto', backgroundColor: '#F8FBF8', 
          padding: '24px', display: 'flex', flexDirection: 'column'
        }}
      >
        {messages.length === 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'flex-start' }}>
            {["🤒 I have fever and headache", "💊 What medicine for cold?", "🚨 Chest pain — is it serious?"].map((chip) => (
              <button 
                key={chip}
                onClick={() => handleSendMessage(chip)}
                style={{
                  backgroundColor: '#fff', border: '1px solid #2E7D32', color: '#2E7D32',
                  borderRadius: '20px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer', margin: '4px'
                }}
              >
                {chip}
              </button>
            ))}
          </div>
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
