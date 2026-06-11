import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Landing.css';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const Landing = () => {
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleBack = () => {
    setLanguage('');
    navigate('/');
  };

  // Aarogya AI State
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

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
- End every response with whether they should see a doctor:
  'Doctor se milna chahiye: Haan urgently / Haan jab ho sake / 
  Zaroorat nahi' (phrase this in user's language)`;

      const apiContents = currentMessages.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

  const aiSectionStyle = {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
    maxWidth: '800px', // matches existing layout width
    margin: '32px auto 0 auto',
    borderTop: '4px solid #2E7D32',
    boxSizing: 'border-box'
  };

  return (
    <div className="landing-container">
      <div className="landing-header-top">
        <button className="btn-change-language" onClick={handleBack}>
          ← {t('changeLanguage')}
        </button>
      </div>

      <div className="landing-header-main">
        <h1 className="landing-title">
          <span className="medical-cross">✚</span> TeleMed Rural
        </h1>
        <p className="landing-tagline">Quality Healthcare, Anywhere in India</p>
      </div>

      <div className="landing-grid">
        <button 
          className="landing-card primary-card" 
          onClick={() => navigate('/patient-registration')}
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
          onClick={() => navigate('/patient-registration')}
        >
          <div className="card-icon">➕</div>
          <h2 className="card-title">{t('createAccount')}</h2>
          <p className="card-desc">Register with just your name and mobile number</p>
        </button>

        <button 
          className="landing-card secondary-card" 
          onClick={() => navigate('/patient-login')}
        >
          <div className="card-icon">🔑</div>
          <h2 className="card-title">{t('alreadyHaveAccountTile')}</h2>
          <p className="card-desc">Welcome back, continue your care</p>
        </button>
      </div>

      {/* Aarogya AI Section */}
      <div style={aiSectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2E7D32' }}>🌿 Aarogya AI</div>
            <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>Your 24/7 Health Assistant — Ask anything, anytime</div>
          </div>
          <div style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', fontWeight: 'bold' }}>
            ● Online
          </div>
        </div>

        <div 
          ref={chatRef}
          style={{ 
            height: '280px', overflowY: 'auto', backgroundColor: '#F8FBF8', 
            borderRadius: '12px', padding: '16px', margin: '16px 0', border: '1px solid #E0E0E0',
            display: 'flex', flexDirection: 'column'
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
                    borderRadius: '20px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', margin: '4px'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '8px', maxWidth: msg.role === 'user' ? '75%' : '80%' }}>
                {msg.role === 'ai' && <div style={{ fontSize: '11px', color: '#2E7D32', marginBottom: '4px' }}>🌿 Aarogya AI</div>}
                <div style={{
                  backgroundColor: msg.role === 'user' ? '#2E7D32' : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#1A1A1A',
                  border: msg.role === 'ai' ? '1px solid #E0E0E0' : 'none',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '10px 16px', fontSize: '14px', whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', color: '#2E7D32', marginBottom: '4px' }}>🌿 Aarogya AI</div>
              <div style={{
                backgroundColor: '#fff', color: '#1A1A1A', border: '1px solid #E0E0E0',
                borderRadius: '18px 18px 18px 4px', padding: '10px 16px', fontSize: '14px',
                animation: 'pulse 1s infinite'
              }}>
                ● ● ●
                <style>{`
                  @keyframes pulse {
                    0% { opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { opacity: 0.3; }
                  }
                `}</style>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your health question in Hindi or English..."
            style={{
              flex: 1, height: '48px', border: '1.5px solid #E0E0E0', borderRadius: '24px',
              padding: '12px 20px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2E7D32'}
            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            style={{
              width: '48px', height: '48px', borderRadius: '50%', border: 'none',
              backgroundColor: (isLoading || !inputText.trim()) ? '#A5D6A7' : '#2E7D32',
              color: '#fff', fontSize: '20px', cursor: (isLoading || !inputText.trim()) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ➤
          </button>
        </div>
        
        <div style={{ fontSize: '11px', color: '#888', textAlign: 'center', marginTop: '8px' }}>
          ⚠️ Aarogya AI is for guidance only. Always consult a real doctor for medical decisions.
        </div>
      </div>
    </div>
  );
};

export default Landing;
