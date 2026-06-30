import React, { useState, useEffect, useRef } from 'react';

const VoiceInputButton = ({ onResult, language }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const langMap = {
    hi: 'hi-IN', en: 'en-IN', mw: 'hi-IN', gu: 'gu-IN', mr: 'mr-IN',
    ta: 'ta-IN', te: 'te-IN', pa: 'pa-IN', bn: 'bn-IN', kn: 'kn-IN',
    ml: 'ml-IN', as: 'hi-IN', or: 'or-IN', nm: 'en-IN'
  };

  const toggleListening = (e) => {
    e.preventDefault();
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Aapka browser voice input support nahi karta. Chrome use karein.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = langMap[language] || 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) {
        onResult(transcript);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        alert('Microphone permission allow karein');
      } else if (event.error === 'no-speech') {
        alert('Kuch sunai nahi diya, dobara try karein');
      } else {
        alert('Voice input mein samasya hui (Error: ' + event.error + ')');
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

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <button 
      type="button" 
      onClick={toggleListening} 
      style={{
        background: isListening ? '#dc2626' : '#1565C0',
        color: '#fff', 
        border: 'none', 
        borderRadius: '50%',
        width: '32px', 
        height: '32px', 
        cursor: 'pointer',
        fontSize: '14px', 
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '8px',
        animation: isListening ? 'pulse 1s infinite' : 'none'
      }}
      title="Voice Input"
    >
      {isListening ? '⏹' : '🎤'}
      <style>{`@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }`}</style>
    </button>
  );
};

export default VoiceInputButton;
