import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import VoiceInputButton from './common/VoiceInputButton';
import { AI_BASE_URL } from '../config';

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

  // Fetch available symptoms on mount and on language change
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const res = await fetch(`${AI_BASE_URL}/api/symptoms/list?language=${language || 'hi'}`);
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
    const unselected = filtered.filter(s => !selectedSymptoms.some(sel => sel.key === s.english));
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
      const res = await fetch(`${AI_BASE_URL}/api/symptoms/from-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToExtract, language: language || 'hi' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.symptoms && data.symptoms.length > 0) {
          const newSelected = [...selectedSymptoms];
          data.symptoms.forEach(sym => {
            if (!newSelected.some(s => s.key === sym)) {
              const matched = availableSymptoms.find(a => a.english === sym);
              if (matched) newSelected.push({ key: matched.english, display: matched.translated });
              else newSelected.push({ key: sym, display: sym });
            }
          });
          setSelectedSymptoms(newSelected);
          setFreeTextQuery('');
        } else {
          setErrorMsg(t('sympNoSymptomsFound') || 'No matching symptoms detected from text. Please select symptoms below.');
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
    if (selectedSymptoms.length < 1) {
      setErrorMsg(t('sympMinSymptoms') || 'Please select at least 1 symptom.');
      return;
    }
    setIsAnalyzing(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${AI_BASE_URL}/api/symptoms/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms.map(s => s.key),
          language: language || 'hi'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data);
      } else {
        setErrorMsg(t('sympErrorAnalyze') || 'Failed to analyze symptoms.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg(t('sympErrorAnalyze') || 'Network error while analyzing symptoms.');
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
    if (selectedSymptoms.some(s => s.key === sym.key)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s.key !== sym.key));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  // Solid clean color palette without gradients
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
    success: '#1b8a5a',
    successLight: '#dffaf2'
  };

  const symptomNames = t('symptomNames') || {};
  const commonSymptoms = [
    { key: 'fever', display: symptomNames.fever || 'बुखार (Fever)' },
    { key: 'headache', display: symptomNames.headache || 'सिरदर्द (Headache)' },
    { key: 'cough', display: symptomNames.cough || 'खांसी (Cough)' },
    { key: 'body ache', display: symptomNames.body_ache || 'बदन दर्द (Body Ache)' },
    { key: 'fatigue', display: symptomNames.fatigue || 'थकान (Fatigue)' },
    { key: 'chills', display: 'ठंड लगना (Chills)' },
    { key: 'sweating', display: 'पसीना आना (Sweating)' },
    { key: 'sore throat', display: 'गले में खराश (Sore Throat)' },
    { key: 'running nose', display: 'बहती नाक (Running Nose)' },
    { key: 'nausea', display: symptomNames.nausea || 'जी मिचलाना (Nausea)' },
    { key: 'vomiting', display: symptomNames.vomiting || 'उल्टी (Vomiting)' },
    { key: 'diarrhea', display: symptomNames.diarrhea || 'दस्त (Diarrhea)' },
    { key: 'chest pain', display: symptomNames.chest_pain || 'सीने में दर्द (Chest Pain)' },
    { key: 'difficulty breathing', display: symptomNames.breathing_difficulty || 'सांस लेने में तकलीफ (Breathing Difficulty)' },
    { key: 'stomach pain', display: symptomNames.stomach_pain || 'पेट दर्द (Stomach Pain)' },
    { key: 'joint pain', display: 'जोड़ों में दर्द (Joint Pain)' },
    { key: 'rash', display: symptomNames.skin_rash || 'त्वचा पर दाने (Skin Rash)' },
    { key: 'dizziness', display: 'चक्कर आना (Dizziness)' }
  ];

  const getConfidenceLabel = (confidence) => {
    const pct = Math.round(confidence * 100);
    if (pct >= 50) return { label: 'High Probability', color: '#16a34a', fillPercent: pct };
    if (pct >= 25) return { label: 'Moderate Probability', color: '#ca8a04', fillPercent: pct };
    return { label: 'Possible Indication', color: '#dc2626', fillPercent: Math.max(pct, 15) };
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: colors.bg, zIndex: 10000, 
      display: 'flex', flexDirection: 'column', fontFamily: "system-ui, 'Segoe UI', sans-serif"
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: colors.primary, color: '#fff', padding: '18px 24px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
            {t('symptomCheckerHeading') || 'AI Symptom Checker'}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.9 }}>
            {t('symptomCheckerSubtitle') || 'Accurate multi-disease prediction in your selected language'}
          </p>
        </div>
        <button onClick={onClose} style={{
          backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', 
          width: '36px', height: '36px', borderRadius: '50%', fontSize: '22px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          &times;
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '850px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Error Alert */}
        {errorMsg && (
          <div style={{ backgroundColor: colors.dangerLight, color: colors.danger, padding: '14px 18px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', color: colors.danger, cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>&times;</button>
          </div>
        )}

        {!aiResult ? (
          <>
            {/* Free Info Alert */}
            <div style={{ backgroundColor: colors.successLight, color: colors.success, padding: '14px 18px', borderRadius: '10px', fontWeight: '600', border: `1px solid ${colors.border}`, fontSize: '14px', lineHeight: '1.5' }}>
              {t('sympFreeInfo') || 'Select your symptoms or speak below. Our clinical AI model will evaluate and provide the top 3 probable health conditions and doctor recommendations.'}
            </div>

            {/* SECTION 1 - VOICE INPUT & TEXT */}
            <div style={{ backgroundColor: colors.cardBg, borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}`, textAlign: 'center' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: colors.text, marginBottom: '14px' }}>
                {t('sympVoiceLabel') || 'Speak or describe your symptoms'}
              </label>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                <div style={{ transform: 'scale(1.3)', transformOrigin: 'center' }}>
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

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <textarea
                  rows="2"
                  placeholder={t('sympTextInputPlaceholder') || 'e.g. 2 days fever, severe headache, dry cough and body weakness...'}
                  value={freeTextQuery}
                  onChange={(e) => setFreeTextQuery(e.target.value)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '10px', border: `1px solid ${colors.border}`,
                    fontSize: '14px', fontFamily: 'inherit', outline: 'none', resize: 'none'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleExtractFromText();
                    }
                  }}
                />
                <button
                  onClick={handleExtractFromText}
                  disabled={isExtracting || !freeTextQuery.trim()}
                  style={{
                    backgroundColor: colors.primary, color: '#fff', border: 'none', padding: '12px 20px',
                    borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
                    opacity: (isExtracting || !freeTextQuery.trim()) ? 0.6 : 1, height: '48px'
                  }}
                >
                  {isExtracting ? 'Extracting...' : (t('sympUnderstandBtn') || 'Extract')}
                </button>
              </div>
            </div>

            {/* SECTION 2 - COMMON SYMPTOMS SELECTION */}
            <div style={{ backgroundColor: colors.cardBg, borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}` }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: colors.text, fontWeight: 'bold' }}>
                {t('sympCommonSymptomsTitle') || 'Common Symptoms (Click to Select)'}
              </h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
                {commonSymptoms.map(sym => {
                  const isSelected = selectedSymptoms.some(s => s.key === sym.key);
                  return (
                    <button
                      key={sym.key}
                      onClick={() => toggleSymptom(sym)}
                      style={{
                        padding: '9px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: isSelected ? '700' : '500',
                        cursor: 'pointer', border: isSelected ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                        backgroundColor: isSelected ? colors.primary : '#ffffff',
                        color: isSelected ? '#ffffff' : colors.text,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSelected ? `✓ ${sym.display}` : `+ ${sym.display}`}
                    </button>
                  );
                })}
              </div>

              {/* SEARCH MORE SYMPTOMS */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder={t('sympSearchPlaceholder') || 'Search from 65+ symptoms...'}
                  value={symptomQuery}
                  onChange={(e) => setSymptomQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${colors.border}`,
                    fontSize: '14px', boxSizing: 'border-box', outline: 'none'
                  }}
                />
                
                {filteredSymptoms.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                    backgroundColor: '#fff', border: `1px solid ${colors.border}`, borderRadius: '10px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)', maxHeight: '180px', overflowY: 'auto', marginTop: '4px'
                  }}>
                    {filteredSymptoms.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedSymptoms([...selectedSymptoms, { key: s.english, display: s.translated }]);
                          setSymptomQuery('');
                        }}
                        style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: colors.text }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                      >
                        {s.translated} ({s.english})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3 - SELECTED SYMPTOMS */}
            {selectedSymptoms.length > 0 && (
              <div style={{ backgroundColor: colors.cardBg, borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: colors.text, fontWeight: 'bold' }}>
                    {t('sympSelectedTitle') || 'Selected Symptoms'} ({selectedSymptoms.length})
                  </h3>
                  <button onClick={() => setSelectedSymptoms([])} style={{ background: 'none', border: 'none', color: colors.danger, cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                    {t('sympClearAll') || 'Clear All'}
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {selectedSymptoms.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: '#eef8f2', color: colors.primary, padding: '7px 14px', borderRadius: '16px',
                        fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', border: `1px solid ${colors.border}`
                      }}
                    >
                      {s.display}
                      <button
                        onClick={() => setSelectedSymptoms(selectedSymptoms.filter((_, idx) => idx !== i))}
                        style={{ background: 'none', border: 'none', color: colors.danger, cursor: 'pointer', fontWeight: 'bold', padding: 0, fontSize: '14px' }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  style={{
                    width: '100%', backgroundColor: colors.primary, color: '#fff', border: 'none',
                    padding: '16px', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold',
                    cursor: 'pointer', opacity: isAnalyzing ? 0.7 : 1, transition: '0.2s',
                    boxShadow: '0 2px 8px rgba(45,106,79,0.2)'
                  }}
                >
                  {isAnalyzing ? (t('sympAnalyzing') || 'Analyzing Symptoms...') : (t('sympAnalyzeBtn') || 'Analyze Symptoms & Find Condition')}
                </button>
              </div>
            )}
          </>
        ) : (
          /* SECTION 4 - AI RESULTS (TOP 3 ACCURATE DISEASES) */
          <div style={{ backgroundColor: colors.cardBg, borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: `2px solid ${colors.primaryLight}` }}>
            
            {/* Emergency Banner */}
            {aiResult.emergency && (
              <div style={{ 
                backgroundColor: colors.danger, color: '#fff', padding: '16px', borderRadius: '10px', 
                textAlign: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px'
              }}>
                [EMERGENCY] Please seek immediate medical care or call 108 emergency services.
              </div>
            )}

            {/* TOP 3 DISEASES OVERVIEW CARD */}
            <div style={{ marginBottom: '24px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: colors.textMuted, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '0.5px' }}>
                Top 3 Predicted Conditions (शीर्ष 3 संभावित बीमारियां)
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '12px' }}>
                {(aiResult.top_3_diseases || []).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px', borderRadius: '10px',
                      backgroundColor: idx === 0 ? '#eef8f2' : '#f8fafc',
                      border: idx === 0 ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                      display: 'flex', flexDirection: 'column', gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: idx === 0 ? colors.primary : colors.textMuted }}>
                        Rank #{item.rank || idx + 1}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: idx === 0 ? colors.primary : colors.text }}>
                        {item.confidence_percent || Math.round(item.confidence * 100)}% Match
                      </span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: colors.text, marginTop: '2px' }}>
                      {item.name || item.disease}
                    </div>
                    <div style={{ fontSize: '12px', color: colors.textMuted }}>
                      Severity: {item.severity_translated || item.severity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PRIMARY DISEASE DETAIL SECTION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <p style={{ fontSize: '13px', color: colors.textMuted, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>
                  Primary Identified Condition
                </p>
                <h3 style={{ margin: 0, fontSize: '26px', color: colors.text, fontWeight: '800' }}>
                  1. {aiResult.predicted_disease_translated || aiResult.predicted_disease} ({Math.round(aiResult.confidence * 100)}%)
                </h3>
              </div>
              
              <div>
                <div style={{ 
                  backgroundColor: aiResult.severity==='severe' ? colors.dangerLight : (aiResult.severity==='moderate' ? colors.warningLight : colors.successLight), 
                  color: aiResult.severity==='severe' ? colors.danger : (aiResult.severity==='moderate' ? colors.warning : colors.success), 
                  padding: '6px 14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', border: '1px solid currentColor'
                }}>
                  {aiResult.severity_translated || aiResult.severity}
                </div>
              </div>
            </div>

            {/* Confidence Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: colors.text }}>
                  Match Confidence Level
                </span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: getConfidenceLabel(aiResult.confidence).color }}>
                  {getConfidenceLabel(aiResult.confidence).label} ({Math.round(aiResult.confidence * 100)}%)
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: colors.border, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  backgroundColor: getConfidenceLabel(aiResult.confidence).color, 
                  width: `${getConfidenceLabel(aiResult.confidence).fillPercent}%`
                }}></div>
              </div>
            </div>

            {/* Translated Clinical Description */}
            <div style={{ backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '10px', borderLeft: `4px solid ${colors.primary}`, marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: colors.text, marginBottom: '6px' }}>
                Clinical Summary & Description:
              </p>
              <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                {aiResult.description_translated || aiResult.description}
              </p>
            </div>

            {/* Grid for Precautions & Doctor */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 'bold', color: colors.text, marginBottom: '10px' }}>
                  Recommended Home Remedies & Precautions (घरेलू नुस्खे / सावधानियां):
                </p>
                <ol style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '14px', lineHeight: '1.7' }}>
                  {(aiResult.home_remedies_translated || aiResult.home_remedies || []).map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ol>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ backgroundColor: colors.successLight, padding: '14px 16px', borderRadius: '10px', border: `1px solid ${colors.success}` }}>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: colors.success, marginBottom: '4px' }}>
                    Recommended Specialist (परामर्श के लिए डॉक्टर)
                  </p>
                  <p style={{ fontSize: '16px', color: '#064e3b', fontWeight: 'bold', margin: 0 }}>
                    {aiResult.recommended_specialization_translated || aiResult.recommended_specialization}
                  </p>
                </div>
                <div style={{ backgroundColor: aiResult.severity==='severe' ? colors.dangerLight : '#f1f5f9', padding: '14px 16px', borderRadius: '10px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: colors.textMuted, marginBottom: '4px' }}>
                    When to Consult Doctor (डॉक्टर से कब मिलें)
                  </p>
                  <p style={{ fontSize: '15px', color: aiResult.severity==='severe' ? colors.danger : colors.text, fontWeight: 'bold', margin: 0 }}>
                    {aiResult.see_doctor_translated || aiResult.see_doctor}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px' }}>
              <button onClick={() => {
                const symptomString = `${aiResult.predicted_disease_translated || aiResult.predicted_disease} - ${selectedSymptoms.map(s => s.display).join(', ')}`;
                onBookConsultation(symptomString, aiResult.recommended_specialization);
              }}
                style={{ flex: 2, backgroundColor: colors.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {t('sympBookDoctor') || 'Book Consultation with Specialist'}
              </button>
              <button onClick={resetAll}
                style={{ flex: 1, backgroundColor: '#fff', color: colors.text, border: `2px solid ${colors.border}`, padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {t('sympReset') || 'Check Another Symptom'}
              </button>
            </div>
            
            {/* Disclaimer */}
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: colors.textMuted, fontStyle: 'italic', borderTop: `1px solid ${colors.border}`, paddingTop: '14px' }}>
              {t('sympDisclaimer') || 'Notice: This assessment is powered by AI for rural triage and decision support. Please consult a licensed doctor for formal diagnosis.'}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
