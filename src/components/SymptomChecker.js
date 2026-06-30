import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import VoiceInputButton from './common/VoiceInputButton';

const SymptomChecker = ({ onClose, onBookConsultation }) => {
  const { language, t } = useLanguage();
  
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [symptomQuery, setSymptomQuery] = useState('');
  
  const [freeTextQuery, setFreeTextQuery] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [aiResult, setAiResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Common symptoms array directly mapped with translations

  // Fetch all 133 symptoms on mount
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/symptoms/list?language=${language || 'en'}`);
        if (res.ok) {
          const data = await res.json();
          setAvailableSymptoms(data.symptoms || []);
        }
      } catch (e) {
        console.error('Failed to fetch symptoms', e);
      }
    };
    fetchSymptoms();
  }, [language]);

  // Filter symptoms based on search query
  useEffect(() => {
    if (!symptomQuery) { setFilteredSymptoms([]); return; }
    const q = symptomQuery.toLowerCase();
    const filtered = availableSymptoms.filter(s =>
      s.translated.toLowerCase().includes(q) || s.english.toLowerCase().includes(q)
    );
    const unselected = filtered.filter(s => !selectedSymptoms.some(sel => sel.english === s.english));
    setFilteredSymptoms(unselected.slice(0, 15));
  }, [symptomQuery, availableSymptoms, selectedSymptoms]);

  const handleExtractFromText = async (textOrEvent) => {
    const isEvent = textOrEvent && typeof textOrEvent === 'object' && textOrEvent.nativeEvent;
    const overrideText = isEvent ? null : textOrEvent;
    const textToExtract = (typeof overrideText === 'string') ? overrideText : freeTextQuery;

    if (!textToExtract.trim()) return;
    setIsExtracting(true);
    setErrorMsg('');
    try {
      const res = await fetch(`http://localhost:5001/api/symptoms/from-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToExtract, language: language || 'en' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.symptoms && data.symptoms.length > 0) {
          if (aiResult?.low_confidence) setAiResult(null);
          const newSelected = [...selectedSymptoms];
          data.symptoms.forEach(sym => {
            if (!newSelected.some(s => s.key === sym)) {
              const matched = availableSymptoms.find(a => a.english === sym);
              if (matched) newSelected.push({ key: matched.english, display: matched.translated });
            }
          });
          setSelectedSymptoms(newSelected);
          setFreeTextQuery('');
        } else {
          setErrorMsg(t('sympNoSymptomsFound') || 'No symptoms found.');
        }
      } else {
        setErrorMsg(t('sympErrorExtract') || 'Error extracting symptoms.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg(t('sympErrorExtract') || 'Network error while extracting.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length < 5) {
      setErrorMsg("Please select at least 5 symptoms.");
      return;
    }
    setIsAnalyzing(true);
    setErrorMsg('');
    try {
      console.log("Selected symptoms:", selectedSymptoms);
      const res = await fetch(`http://localhost:5001/api/symptoms/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms.map(s => s.key),
          language: language || 'en'
        })
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Analyze API Response:", data);
        setAiResult(data);
      } else {
        setErrorMsg(t('sympErrorAnalyze') || 'Failed to analyze.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg(t('sympErrorAnalyze') || 'Network error while analyzing.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAll = () => {
    setAiResult(null);
    setSelectedSymptoms([]);
    setFreeTextQuery('');
    setSymptomQuery('');
    setErrorMsg('');
  };

  const toggleSymptom = (sym) => {
    if (aiResult?.low_confidence) setAiResult(null);
    if (selectedSymptoms.some(s => s.key === sym.key)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s.key !== sym.key));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  // UI Constants
  const colors = {
    primary: '#2d6a4f',
    primaryLight: '#40916c',
    bg: '#f8fbf8',
    cardBg: '#ffffff',
    text: '#1b4332',
    textMuted: '#52796f',
    border: '#d8f3dc',
    danger: '#d90429',
    dangerLight: '#ffe5e5',
    warning: '#f48c06',
    warningLight: '#ffeed4',
    success: '#06d6a0',
    successLight: '#dffaf2'
  };

  const symptomNames = t('symptomNames') || {};
  const commonSymptoms = [
    { key: 'high_fever', display: symptomNames.fever || 'Fever' },
    { key: 'headache', display: symptomNames.headache || 'Headache' },
    { key: 'cough', display: symptomNames.cough || 'Cough' },
    { key: 'muscle_pain', display: symptomNames.body_ache || 'Body Ache' },
    { key: 'fatigue', display: symptomNames.fatigue || 'Fatigue' },
    { key: 'nausea', display: symptomNames.nausea || 'Nausea' },
    { key: 'vomiting', display: symptomNames.vomiting || 'Vomiting' },
    { key: 'diarrhoea', display: symptomNames.diarrhea || 'Diarrhea' },
    { key: 'chest_pain', display: symptomNames.chest_pain || 'Chest Pain' },
    { key: 'breathlessness', display: symptomNames.breathing_difficulty || 'Breathing Difficulty' },
    { key: 'abdominal_pain', display: symptomNames.stomach_pain || 'Stomach Pain' },
    { key: 'skin_rash', display: symptomNames.skin_rash || 'Skin Rash' }
  ];

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.08) return { label: t('confidenceHigh') || 'अधिक संभावना', color: '#16a34a', fillPercent: 90 };
    if (confidence >= 0.04) return { label: t('confidenceMedium') || 'मध्यम संभावना', color: '#ca8a04', fillPercent: 55 };
    return { label: t('confidenceLow') || 'अनुमानित संभावना', color: '#dc2626', fillPercent: 25 };
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: colors.bg, zIndex: 10000, 
      display: 'flex', flexDirection: 'column', fontFamily: "system-ui, 'Segoe UI', sans-serif"
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: colors.primary, color: '#fff', padding: '20px 24px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px' }}>🩺</span> {t('symptomCheckerHeading') || 'Symptom Checker'}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.9 }}>
            {t('symptomCheckerSubtitle') || 'Identify diseases using AI'}
          </p>
        </div>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', 
          width: '40px', height: '40px', borderRadius: '50%', fontSize: '24px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s'
        }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.3)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}>
          &times;
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Error Alert */}
        {errorMsg && (
          <div style={{ backgroundColor: colors.dangerLight, color: colors.danger, padding: '16px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
            <span>⚠️ {errorMsg}</span>
            <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', color: colors.danger, cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
          </div>
        )}

        {!aiResult || (aiResult.low_confidence && (!aiResult.possible_conditions || aiResult.possible_conditions.length === 0)) ? (
          <>
            {/* Info Card / Warning */}
            {aiResult?.low_confidence ? (
              <div style={{ backgroundColor: colors.warningLight, color: colors.warning, padding: '16px', borderRadius: '12px', fontWeight: 'bold', border: `1px solid ${colors.warning}`, marginBottom: '20px', lineHeight: '1.5', fontSize: '15px' }}>
                {aiResult.message || t('sympLowConfidence')}
              </div>
            ) : (
              <div style={{ backgroundColor: colors.successLight, color: colors.success, padding: '16px', borderRadius: '12px', fontWeight: 'bold', border: `1px solid ${colors.success}`, marginBottom: '20px', lineHeight: '1.5', fontSize: '15px' }}>
                {t('sympFreeInfo')}
              </div>
            )}

            {/* SECTION 1 - VOICE INPUT */}
            <div style={{ backgroundColor: colors.cardBg, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: `1px solid ${colors.border}`, textAlign: 'center' }}>
              <label style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', color: colors.text, marginBottom: '16px' }}>
                {t('sympVoiceLabel') || '🎤 Speak your symptoms'}
              </label>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}>
                  <VoiceInputButton
                    language={language}
                    onResult={(text) => {
                      const newText = freeTextQuery ? `${freeTextQuery} ${text}` : text;
                      setFreeTextQuery(newText);
                      handleExtractFromText(newText);
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <textarea
                  placeholder={t('sympTypeHere') || 'Type your symptoms...'}
                  value={freeTextQuery}
                  onChange={(e) => setFreeTextQuery(e.target.value)}
                  style={{ flex: 1, padding: '16px', borderRadius: '12px', border: `2px solid ${colors.border}`, fontSize: '16px', outline: 'none', resize: 'vertical', minHeight: '60px' }}
                  onFocus={e => e.target.style.borderColor = colors.primaryLight}
                  onBlur={e => e.target.style.borderColor = colors.border}
                />
                <button 
                  onClick={handleExtractFromText} 
                  disabled={isExtracting || !freeTextQuery.trim()}
                  style={{ 
                    backgroundColor: colors.primary, color: '#fff', border: 'none', borderRadius: '12px', padding: '0 24px', 
                    fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', opacity: (isExtracting || !freeTextQuery.trim()) ? 0.6 : 1,
                    height: '56px', whiteSpace: 'nowrap'
                  }}
                >
                  {isExtracting ? (t('sympExtracting') || 'Extracting...') : 'Extract →'}
                </button>
              </div>
            </div>

            {/* SECTION 2 - COMMON SYMPTOMS */}
            <div style={{ backgroundColor: colors.cardBg, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: `1px solid ${colors.border}` }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: colors.text, marginBottom: '16px' }}>
                {t('sympCommonLabel') || 'Common symptoms — tap to select'}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {commonSymptoms.map((sym, idx) => {
                  const isSelected = selectedSymptoms.some(s => s.key === sym.key);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleSymptom(sym)}
                      style={{
                        background: isSelected ? colors.primary : 'transparent',
                        color: isSelected ? '#fff' : colors.primary,
                        border: `2px solid ${colors.primary}`,
                        padding: '10px 18px',
                        borderRadius: '24px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        transition: '0.2s'
                      }}
                    >
                      {sym.display}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3 - SEARCH MORE SYMPTOMS */}
            <div style={{ backgroundColor: colors.cardBg, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: `1px solid ${colors.border}` }}>
              <input
                type="text"
                placeholder={t('sympSearch') || 'Search and add symptoms...'}
                value={symptomQuery}
                onChange={(e) => setSymptomQuery(e.target.value)}
                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: `2px solid ${colors.border}`, fontSize: '16px', boxSizing: 'border-box', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = colors.primaryLight}
                onBlur={e => e.target.style.borderColor = colors.border}
              />
              
              {filteredSymptoms.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                  {filteredSymptoms.map((sym, idx) => (
                    <button key={idx} 
                      onClick={() => { 
                        toggleSymptom({ key: sym.english, display: sym.translated });
                        setSymptomQuery(''); 
                      }}
                      style={{ 
                        background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 16px', 
                        borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: '0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background='#e2e8f0'}
                      onMouseOut={e => e.currentTarget.style.background='#f1f5f9'}
                    >
                      + {sym.translated}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 4 - SELECTED SYMPTOMS display */}
            {selectedSymptoms.length > 0 && (
              <div style={{ backgroundColor: colors.cardBg, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: `1px solid ${colors.border}` }}>
                <p style={{ fontSize: '15px', fontWeight: 'bold', color: colors.textMuted, marginBottom: '16px' }}>
                  {t('sympSelected') || 'Selected Symptoms'}:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {selectedSymptoms.map(sym => (
                    <div key={sym.key} style={{ 
                      background: colors.primaryLight, color: '#fff', padding: '10px 18px', 
                      borderRadius: '24px', fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px',
                      boxShadow: '0 2px 4px rgba(45,106,79,0.2)'
                    }}>
                      {sym.display}
                      <button onClick={() => toggleSymptom(sym)} 
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width:'24px', height:'24px', cursor: 'pointer', fontWeight: 'bold', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 5 - ANALYZE BUTTON */}
            <button onClick={handleAnalyze} disabled={isAnalyzing || selectedSymptoms.length < 5}
              style={{ 
                width: '100%', background: colors.primary, color: '#fff', border: 'none', padding: '20px', 
                borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', 
                opacity: (isAnalyzing || selectedSymptoms.length < 5) ? 0.6 : 1, marginTop: '10px',
                boxShadow: '0 4px 12px rgba(45,106,79,0.3)', transition: '0.2s'
              }}>
              {isAnalyzing ? (t('sympAnalyzing') || 'Analyzing...') : (t('sympAnalyzeBtn') || 'Analyze Symptoms')}
            </button>
          </>
        ) : (
          /* Results Section */
          <div style={{ backgroundColor: colors.cardBg, borderRadius: '20px', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: `2px solid ${colors.primaryLight}` }}>
            
            {/* Caution Banner */}
            {aiResult.low_confidence_warning && (
              <div style={{ backgroundColor: colors.warningLight, color: colors.warning, padding: '12px', borderRadius: '8px', fontWeight: 'bold', border: `1px solid ${colors.warning}`, marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
                ⚠️ {t('lowConfidenceWarning') || 'Yeh ek estimate hai, sateek nahi'}
              </div>
            )}

            {/* Emergency Banner */}
            {aiResult.emergency && (
              <div style={{ 
                background: colors.danger, color: '#fff', padding: '16px', borderRadius: '12px', 
                textAlign: 'center', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px',
                animation: 'pulse 1.5s infinite', boxShadow: '0 4px 12px rgba(217, 4, 41, 0.4)'
              }}>
                🚨 {t('sympEmergencyAlert') || 'EMERGENCY: PLEASE SEEK IMMEDIATE MEDICAL ATTENTION!'} 🚨
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '14px', color: colors.textMuted, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px', letterSpacing: '1px' }}>
                  {t('sympPredictedDisease') || 'Predicted Disease'}
                </p>
                <h3 style={{ margin: 0, fontSize: '32px', color: colors.text, fontWeight: '900' }}>
                  {aiResult.predicted_disease_translated || aiResult.predicted_disease}
                </h3>
                {aiResult.alternative_diseases_translated && aiResult.alternative_diseases_translated.length > 0 && (
                  <p style={{ marginTop: '8px', fontSize: '14px', color: colors.textMuted, fontWeight: 'bold' }}>
                    {t('sympCouldAlsoBe') || 'Could also be:'} {aiResult.alternative_diseases_translated.join(', ')}
                  </p>
                )}
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', color: colors.textMuted, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' }}>
                  {t('sympSeverity') || 'Severity'}
                </p>
                <div style={{ 
                  background: aiResult.severity==='severe' ? colors.dangerLight : (aiResult.severity==='moderate' ? colors.warningLight : colors.successLight), 
                  color: aiResult.severity==='severe' ? colors.danger : (aiResult.severity==='moderate' ? colors.warning : colors.success), 
                  padding: '8px 16px', borderRadius: '24px', fontWeight: 'bold', fontSize: '15px', display: 'inline-block', border: '1px solid currentColor'
                }}>
                  {aiResult.severity_translated}
                </div>
              </div>
            </div>

            {/* Confidence Bar */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: colors.text }}>{t('sympConfidence') || 'Confidence'}</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: getConfidenceLabel(aiResult.confidence).color }}>
                  {getConfidenceLabel(aiResult.confidence).label}
                </span>
              </div>
              <div style={{ height: '10px', background: colors.border, borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  background: getConfidenceLabel(aiResult.confidence).color, 
                  width: `${getConfidenceLabel(aiResult.confidence).fillPercent}%`,
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}></div>
              </div>
            </div>

            {/* Description */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', borderLeft: `4px solid ${colors.primary}`, marginBottom: '24px' }}>
              <p style={{ fontSize: '15px', fontWeight: 'bold', color: colors.text, marginBottom: '8px' }}>{t('sympDescription') || 'Description'}</p>
              <p style={{ fontSize: '16px', color: '#334155', lineHeight: '1.6', margin: 0 }}>{aiResult.description}</p>
            </div>

            {/* Grid for Precautions & Doctor */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: colors.text, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {t('sympPrecautions') || '🛡️ Precautions & Remedies'}
                </p>
                <ol style={{ margin: 0, paddingLeft: '24px', color: '#475569', fontSize: '15px', lineHeight: '1.8' }}>
                  {(aiResult.home_remedies_translated || aiResult.precautions_translated || []).map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ol>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: colors.successLight, padding: '16px', borderRadius: '12px', border: `1px solid ${colors.success}` }}>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: colors.success, marginBottom: '4px' }}>{t('sympRecommendedDoc') || 'Recommended Specialist'}</p>
                  <p style={{ fontSize: '18px', color: '#064e3b', fontWeight: 'bold', margin: 0 }}>👨‍⚕️ {aiResult.recommended_specialization_translated || aiResult.recommended_specialization}</p>
                </div>
                <div style={{ background: aiResult.severity==='severe' ? colors.dangerLight : '#f1f5f9', padding: '16px', borderRadius: '12px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: colors.textMuted, marginBottom: '4px' }}>{t('sympSeeDoctor') || 'When to see Doctor'}</p>
                  <p style={{ fontSize: '16px', color: aiResult.severity==='severe' ? colors.danger : colors.text, fontWeight: 'bold', margin: 0 }}>⏱ {aiResult.see_doctor_translated}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => {
                const symptomString = `${aiResult.predicted_disease_translated || aiResult.predicted_disease} - ${selectedSymptoms.map(s => s.display).join(', ')}`;
                onBookConsultation(symptomString);
              }}
                style={{ flex: 2, background: colors.primary, color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 12px rgba(45,106,79,0.3)' }}
                onMouseOver={e => e.currentTarget.style.background = colors.primaryLight}
                onMouseOut={e => e.currentTarget.style.background = colors.primary}
              >
                {t('sympBookDoctor') || '📅 Book this Doctor'}
              </button>
              <button onClick={resetAll}
                style={{ flex: 1, background: '#fff', color: colors.text, border: `2px solid ${colors.border}`, padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseOut={e => e.currentTarget.style.background = '#fff'}
              >
                {t('sympReset') || '🔄 Reset'}
              </button>
            </div>
            
          </div>
        )}
      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SymptomChecker;
