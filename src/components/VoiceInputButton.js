import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const SPEECH_LANG_MAP = {
  hi: 'hi-IN', en: 'en-IN', mw: 'hi-IN', gu: 'gu-IN', mr: 'mr-IN',
  ta: 'ta-IN', te: 'te-IN', pa: 'pa-IN', bn: 'bn-IN', kn: 'kn-IN',
  ml: 'ml-IN', as: 'as-IN', or: 'or-IN', nm: 'en-IN'
};

const VoiceInputButton = ({ onResult }) => {
  const { t, language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert(t('voiceNotSupported') || 'Voice input is not supported in this browser. Please use Chrome.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_LANG_MAP[language] || 'hi-IN';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
      onResult(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <button type="button" onClick={toggleListening} style={{
        background: isListening ? '#dc2626' : '#1d4ed8',
        color: '#fff', border: 'none', borderRadius: '50%',
        width: '40px', height: '40px', cursor: 'pointer', fontSize: '18px'
      }}>
        {isListening ? '⏹' : '🎤'}
      </button>
      <span style={{ fontSize: '12px', color: isListening ? '#dc2626' : '#1d4ed8' }}>
        {isListening ? t('listening') : t('speakToWrite')}
      </span>
    </div>
  );
};

export default VoiceInputButton;
