import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const GovtSchemes = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [age, setAge] = useState('');
  const [isPregnant, setIsPregnant] = useState('No');
  const [incomeCategory, setIncomeCategory] = useState('Medium/High');
  const [selectedSchemeModal, setSelectedSchemeModal] = useState(null);

  const schemeDetailsData = {
    pmjay: {
      title_hi: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (PM-JAY)',
      title_en: 'Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
      steps_hi: [
        'नजदीकी सूचीबद्ध सरकारी या निजी अस्पताल (Empaneled Hospital) या कॉमन सर्विस सेंटर (CSC) पर जाएं।',
        'आयुष्मान मित्र (Ayushman Mitra) से मिलें और अपना आधार कार्ड व राशन कार्ड दिखाएं।',
        'पात्रता जांच के बाद आपका मुफ्त आयुष्मान कार्ड (Ayushman Card) बन जाएगा, जिसके तहत सालाना ₹5 लाख तक का मुफ्त इलाज मिलेगा।'
      ],
      steps_en: [
        'Visit your nearest empaneled government/private hospital or Common Service Centre (CSC).',
        'Meet the Ayushman Mitra counter and present your Aadhaar Card and Ration Card.',
        'After verification, your Ayushman Card will be issued, enabling up to Rs 5 Lakh cashless treatment per year.'
      ],
      docs_hi: ['आधार कार्ड', 'राशन कार्ड / बीपीएल कार्ड', 'पारिवारिक समग्र आईडी / पहचान पत्र', 'मोबाइल नंबर'],
      docs_en: ['Aadhaar Card', 'Ration Card / BPL Card', 'Family ID / Voter ID', 'Active Mobile Number'],
      helpline: '14555 / 1800-111-565',
      portalUrl: 'https://beneficiary.nha.gov.in',
      altUrl: 'https://nha.gov.in/PM-JAY'
    },
    jsy: {
      title_hi: 'जननी सुरक्षा योजना (JSY)',
      title_en: 'Janani Suraksha Yojana (JSY)',
      steps_hi: [
        'गर्भावस्था के दौरान अपने गांव की आशा (ASHA) कार्यकर्ता या नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) में पंजीकरण करवाएं।',
        'मातृ एवं बाल सुरक्षा (MCP) कार्ड बनवाएं और नियमित प्रसवपूर्व जांच (ANC) करवाएं।',
        'सरकारी अस्पताल में संस्थागत प्रसव (Institutional Delivery) करवाने पर वित्तीय सहायता सीधे आपके बैंक खाते (DBT) में भेजी जाती है।'
      ],
      steps_en: [
        'Register your pregnancy with the local ASHA worker or at the nearest Primary Health Centre (PHC).',
        'Obtain a Mother and Child Protection (MCP) card and complete regular ANC checkups.',
        'On delivering at a government healthcare facility, cash assistance is transferred directly to your bank account via DBT.'
      ],
      docs_hi: ['गर्भवती महिला का आधार कार्ड', 'मातृ-शिशु सुरक्षा (MCP) कार्ड', 'बैंक खाता पासबुक', 'बीपीएल / अनुसूचित जाति / जनजाति प्रमाण पत्र (यदि लागू हो)'],
      docs_en: ['Mother Aadhaar Card', 'MCP Card (Mamta Card)', 'Bank Account Passbook (linked with Aadhaar)', 'BPL/SC/ST Certificate (if applicable)'],
      helpline: '104 / 108',
      portalUrl: 'https://nhm.gov.in',
      altUrl: 'https://nhm.gov.in'
    },
    pmsma: {
      title_hi: 'प्रधानमंत्री सुरक्षित मातृत्व अभियान (PMSMA)',
      title_en: 'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)',
      steps_hi: [
        'हर महीने की 9 तारीख को अपने नजदीकी सरकारी अस्पताल, सामुदायिक स्वास्थ्य केंद्र (CHC) या PHC जाएं।',
        'स्त्री रोग विशेषज्ञ (Gynecologist) या चिकित्सा अधिकारी द्वारा मुफ्त स्वास्थ्य जांच करवाएं।',
        'मुफ्त अल्ट्रासाउंड, खून-पेशाब जांच, आयरन-फोलिक एसिड की गोलियां और दवाएं बिना किसी शुल्क के प्राप्त करें।'
      ],
      steps_en: [
        'Visit the nearest government PHC, CHC, or Sub-District Hospital on the 9th of every month.',
        'Receive free antenatal checkup by a specialist gynecologist or medical officer.',
        'Get complimentary ultrasound, clinical diagnostic blood/urine tests, and free IFA/calcium medications.'
      ],
      docs_hi: ['आधार कार्ड या पहचान पत्र', 'गर्भावस्था पंजीकरण कार्ड (MCP कार्ड)', 'पिछली मेडिकल जांच रिपोर्ट्स (यदि हों)'],
      docs_en: ['Aadhaar Card or Photo ID', 'Pregnancy Registration Card (MCP Card)', 'Previous Medical Investigation Records'],
      helpline: '104 / 1800-180-1104',
      portalUrl: 'https://nhm.gov.in',
      altUrl: 'https://www.nhm.gov.in'
    },
    rbsk: {
      title_hi: 'राष्ट्रीय बाल स्वास्थ्य कार्यक्रम (RBSK)',
      title_en: 'Rashtriya Bal Swasthya Karyakram (RBSK)',
      steps_hi: [
        'आंगनवाड़ी केंद्र या सरकारी स्कूल में आने वाली RBSK मोबाइल हेल्थ टीम (MHT) से बच्चे की मुफ्त स्वास्थ्य जांच करवाएं।',
        'यदि बच्चे में कोई जन्मजात विकार, पोषण कमी, या बीमारी पाई जाती है, तो उसे नजदीकी जिला प्रारंभिक हस्तक्षेप केंद्र (DEIC) रेफर किया जाता है।',
        'सभी आवश्यक चिकित्सीय व सर्जिकल उपचार सरकारी स्तर पर 100% मुफ्त प्रदान किए जाते हैं।'
      ],
      steps_en: [
        'Get child screened by the RBSK Mobile Health Team visiting local Anganwadi centres and government schools.',
        'Children detected with conditions (4Ds: Defects at birth, Deficiencies, Diseases, Development delays) are referred to District Early Intervention Centres (DEIC).',
        'All necessary medical management and major surgical treatments are provided entirely free of cost.'
      ],
      docs_hi: ['बच्चे का जन्म प्रमाण पत्र / आधार कार्ड', 'माता-पिता का पहचान पत्र व राशन कार्ड', 'आंगनवाड़ी / स्कूल का नामांकन विवरण'],
      docs_en: ['Child Birth Certificate or Aadhaar Card', 'Parent Photo ID and Ration Card', 'Anganwadi or School Enrollment ID'],
      helpline: '104 / 108',
      portalUrl: 'https://nhm.gov.in',
      altUrl: 'https://www.nhm.gov.in'
    }
  };

  const translations = {
    en: {
      pageTitle: "Government Health Schemes",
      subtitle: "Free and subsidized healthcare initiatives for rural and urban families",
      disclaimer: "Information provided for citizen awareness. Scheme guidelines are managed by the Ministry of Health & Family Welfare, Govt. of India.",
      checkEligibility: "Check Your Scheme Eligibility",
      ageLabel: "Age (Years)",
      pregnantLabel: "Are you pregnant?",
      incomeLabel: "Family Income Category",
      yes: "Yes",
      no: "No",
      bpl: "Low (BPL / Ration Card)",
      apl: "Medium / High",
      eligibleBadge: "[ELIGIBLE] You may qualify for this scheme",
      applyBtn: "How to Apply & Benefits Guide",
      whoIsEligible: "Who is eligible?",
      whatItCovers: "Key Coverage & Benefits",
      stepsTitle: "Step-by-Step Application Process",
      docsTitle: "Required Documents",
      helplineTitle: "Toll-Free Government Helpline",
      openPortalBtn: "Open Official NHM Portal",
      closeBtn: "Close Guide",
      pmjayName: "Ayushman Bharat – PM-JAY",
      pmjayTagline: "Up to Rs 5 Lakh free cashless treatment per family per year",
      pmjayElig1: "Families in rural and vulnerable categories under SECC / BPL",
      pmjayElig2: "Families with senior citizens aged 70 and above",
      pmjayElig3: "Antyodaya & BPL ration card holders",
      pmjayCover1: "Rs 5,00,000 per family per year coverage",
      pmjayCover2: "Cashless secondary and tertiary hospitalization",
      pmjayCover3: "Covered across 27,000+ empaneled hospitals across India",
      jsyName: "Janani Suraksha Yojana (JSY)",
      jsyTagline: "Safe institutional delivery and financial assistance for mothers",
      jsyElig1: "All pregnant women delivering in government healthcare facilities",
      jsyElig2: "Special financial focus for BPL, SC, and ST rural mothers",
      jsyCover1: "Cash incentive (up to Rs 1,400 in rural / Rs 1,000 in urban areas)",
      jsyCover2: "Free institutional delivery, meals, and postnatal medicines",
      rbskName: "Rashtriya Bal Swasthya Karyakram (RBSK)",
      rbskTagline: "Comprehensive child screening and 100% free surgical care (0-18 yrs)",
      rbskElig1: "All children from birth up to 18 years of age",
      rbskElig2: "Children enrolled in Anganwadi centers and government schools",
      rbskElig3: "Children requiring surgical interventions for birth defects",
      rbskCover1: "Screening for 30+ health conditions and congenital disorders",
      rbskCover2: "Completely free medical, tertiary and surgical treatments",
      pmsmaName: "Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)",
      pmsmaTagline: "Assured quality antenatal care on 9th of every month",
      pmsmaElig1: "All pregnant women in their 2nd or 3rd trimester",
      pmsmaElig2: "Accessible to every woman irrespective of socio-economic status",
      pmsmaCover1: "Free specialist antenatal checkups on 9th of every month",
      pmsmaCover2: "Free ultrasound, laboratory diagnostics, and vital supplements"
    },
    hi: {
      pageTitle: "सरकारी स्वास्थ्य योजनाएं",
      subtitle: "हर परिवार के लिए मुफ्त और रियायती स्वास्थ्य सेवा योजनाएं",
      disclaimer: "यह जानकारी जन-जागरूकता के लिए है। योजना के नियम स्वास्थ्य एवं परिवार कल्याण मंत्रालय, भारत सरकार द्वारा संचालित हैं।",
      checkEligibility: "अपनी पात्रता (Eligibility) जांचें",
      ageLabel: "आयु (वर्ष)",
      pregnantLabel: "क्या आप गर्भवती हैं?",
      incomeLabel: "पारिवारिक आय श्रेणी",
      yes: "हाँ",
      no: "नहीं",
      bpl: "कम (BPL / राशन कार्ड)",
      apl: "मध्यम / उच्च",
      eligibleBadge: "[पात्र] आप इस योजना के लिए पात्र हो सकते हैं",
      applyBtn: "आवेदन कैसे करें (पूरी जानकारी)",
      whoIsEligible: "कौन पात्र है?",
      whatItCovers: "यह योजना क्या कवर करती है?",
      stepsTitle: "आवेदन की सरल चरणबद्ध प्रक्रिया",
      docsTitle: "आवश्यक दस्तावेज",
      helplineTitle: "टोल-फ्री सरकारी हेल्पलाइन",
      openPortalBtn: "आधिकारिक सरकारी पोर्टल खोलें",
      closeBtn: "बंद करें",
      pmjayName: "आयुष्मान भारत - PM-JAY",
      pmjayTagline: "प्रति परिवार ₹5 लाख तक का सालाना मुफ्त इलाज",
      pmjayElig1: "ग्रामीण क्षेत्रों के BPL व गरीब परिवार",
      pmjayElig2: "70 वर्ष या उससे अधिक आयु के सभी वरिष्ठ नागरिक",
      pmjayElig3: "अंत्योदय और बीपीएल राशन कार्ड धारक",
      pmjayCover1: "प्रति परिवार ₹5 लाख का सालाना मुफ्त स्वास्थ्य सुरक्षा कवर",
      pmjayCover2: "सूचीबद्ध अस्पतालों में कैशलेस और बिना पैसे के इलाज",
      pmjayCover3: "देशभर के 27,000+ सरकारी व निजी अस्पतालों में मान्य",
      jsyName: "जननी सुरक्षा योजना (JSY)",
      jsyTagline: "सुरक्षित प्रसव और गर्भवती महिलाओं के लिए वित्तीय सहायता",
      jsyElig1: "सरकारी अस्पतालों में प्रसव कराने वाली सभी गर्भवती महिलाएं",
      jsyElig2: "BPL, SC एवं ST वर्ग की ग्रामीण माताएं",
      jsyCover1: "ग्रामीण क्षेत्र में ₹1,400 तथा शहरी क्षेत्र में ₹1,000 की नकद सहायता",
      jsyCover2: "मुफ्त प्रसव, मुफ्त दवाएं, भोजन और प्रसवोत्तर देखभाल",
      rbskName: "राष्ट्रीय बाल स्वास्थ्य कार्यक्रम (RBSK)",
      rbskTagline: "0 से 18 वर्ष तक के बच्चों की मुफ्त जांच व 100% मुफ्त सर्जरी",
      rbskElig1: "जन्म से 18 वर्ष तक के सभी बच्चे",
      rbskElig2: "आंगनवाड़ी केंद्रों और सरकारी स्कूलों में पढ़ने वाले बच्चे",
      rbskElig3: "जन्मजात विकारों या बीमारी से पीड़ित बच्चे",
      rbskCover1: "30 से अधिक बीमारियों और जन्मजात विकारों की मुफ्त जांच",
      rbskCover2: "आवश्यकता पड़ने पर बड़े अस्पतालों में मुफ्त सर्जरी व इलाज",
      pmsmaName: "प्रधानमंत्री सुरक्षित मातृत्व अभियान (PMSMA)",
      pmsmaTagline: "हर महीने की 9 तारीख को मुफ्त विशेषज्ञ प्रसवपूर्व जांच",
      pmsmaElig1: "दूसरी या तीसरी तिमाही की सभी गर्भवती महिलाएं",
      pmsmaElig2: "ग्रामीण व शहरी क्षेत्रों की सभी महिलाएं",
      pmsmaCover1: "हर महीने की 9 तारीख को स्त्री रोग विशेषज्ञ द्वारा मुफ्त जांच",
      pmsmaCover2: "मुफ्त अल्ट्रासाउंड, खून-पेशाब की जांच और आयरन/कैल्शियम दवाएं"
    }
  };

  const currentLang = (language === 'hi' || language === 'mw') ? 'hi' : (translations[language] ? language : 'hi');
  const t = (key) => translations[currentLang]?.[key] || translations['hi']?.[key] || translations['en']?.[key] || key;

  const schemes = [
    {
      id: 'pmjay',
      name: t('pmjayName'),
      tagline: t('pmjayTagline'),
      eligibility: [t('pmjayElig1'), t('pmjayElig2'), t('pmjayElig3')],
      covers: [t('pmjayCover1'), t('pmjayCover2'), t('pmjayCover3')],
      isEligible: incomeCategory === 'Low (BPL)' || (age !== '' && parseInt(age) >= 70)
    },
    {
      id: 'pmsma',
      name: t('pmsmaName'),
      tagline: t('pmsmaTagline'),
      eligibility: [t('pmsmaElig1'), t('pmsmaElig2')],
      covers: [t('pmsmaCover1'), t('pmsmaCover2')],
      isEligible: isPregnant === 'Yes'
    },
    {
      id: 'jsy',
      name: t('jsyName'),
      tagline: t('jsyTagline'),
      eligibility: [t('jsyElig1'), t('jsyElig2')],
      covers: [t('jsyCover1'), t('jsyCover2')],
      isEligible: isPregnant === 'Yes'
    },
    {
      id: 'rbsk',
      name: t('rbskName'),
      tagline: t('rbskTagline'),
      eligibility: [t('rbskElig1'), t('rbskElig2'), t('rbskElig3')],
      covers: [t('rbskCover1'), t('rbskCover2')],
      isEligible: age !== '' && parseInt(age) <= 18
    }
  ];

  const handleOpenSchemeDetails = (schemeId) => {
    setSelectedSchemeModal(schemeDetailsData[schemeId]);
  };

  return (
    <div style={{ backgroundColor: '#F1F8F1', minHeight: '100vh', padding: '24px 16px', fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif" }}>
      
      {/* Back Button */}
      <div style={{ maxWidth: '640px', margin: '0 auto 12px auto' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            color: '#1b4332', backgroundColor: '#e2f2e6', border: '1px solid #c0e0c8',
            fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', padding: '8px 16px',
            borderRadius: '8px'
          }}
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1b4332', textAlign: 'center', margin: '0 0 6px 0' }}>
          {t('pageTitle')}
        </h1>
        <p style={{ fontSize: '14px', color: '#406a52', textAlign: 'center', margin: '0 0 20px 0' }}>
          {t('subtitle')}
        </p>

        {/* ELIGIBILITY CHECKER */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #d8ebd9', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1b4332', margin: '0 0 16px 0', textAlign: 'center' }}>
            {t('checkEligibility')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#2d3748', marginBottom: '6px' }}>
                {t('ageLabel')}
              </label>
              <input 
                type="number" 
                value={age} 
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 32"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#2d3748', marginBottom: '6px' }}>
                {t('pregnantLabel')}
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setIsPregnant('Yes')}
                  style={{ flex: 1, padding: '10px', border: isPregnant === 'Yes' ? '2px solid #2d6a4f' : '1px solid #cbd5e1', backgroundColor: isPregnant === 'Yes' ? '#eef8f2' : '#ffffff', color: isPregnant === 'Yes' ? '#1b4332' : '#475569', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                >
                  {t('yes')}
                </button>
                <button 
                  onClick={() => setIsPregnant('No')}
                  style={{ flex: 1, padding: '10px', border: isPregnant === 'No' ? '2px solid #2d6a4f' : '1px solid #cbd5e1', backgroundColor: isPregnant === 'No' ? '#eef8f2' : '#ffffff', color: isPregnant === 'No' ? '#1b4332' : '#475569', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                >
                  {t('no')}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#2d3748', marginBottom: '6px' }}>
                {t('incomeLabel')}
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setIncomeCategory('Low (BPL)')}
                  style={{ flex: 1, padding: '10px', border: incomeCategory === 'Low (BPL)' ? '2px solid #2d6a4f' : '1px solid #cbd5e1', backgroundColor: incomeCategory === 'Low (BPL)' ? '#eef8f2' : '#ffffff', color: incomeCategory === 'Low (BPL)' ? '#1b4332' : '#475569', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                >
                  {t('bpl')}
                </button>
                <button 
                  onClick={() => setIncomeCategory('Medium/High')}
                  style={{ flex: 1, padding: '10px', border: incomeCategory === 'Medium/High' ? '2px solid #2d6a4f' : '1px solid #cbd5e1', backgroundColor: incomeCategory === 'Medium/High' ? '#eef8f2' : '#ffffff', color: incomeCategory === 'Medium/High' ? '#1b4332' : '#475569', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                >
                  {t('apl')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SCHEME CARDS */}
        {schemes.map((scheme) => (
          <div key={scheme.id} style={{
            backgroundColor: '#ffffff',
            border: scheme.isEligible ? '2px solid #1b8a5a' : '1px solid #d8ebd9',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginBottom: '20px',
            position: 'relative'
          }}>
            {scheme.isEligible && (
              <div style={{
                position: 'absolute', top: '-11px', left: '16px',
                backgroundColor: '#1b8a5a', color: '#ffffff', fontSize: '11px', fontWeight: 'bold',
                padding: '4px 10px', borderRadius: '12px'
              }}>
                {t('eligibleBadge')}
              </div>
            )}

            <div style={{ marginBottom: '14px', marginTop: scheme.isEligible ? '6px' : '0' }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: '#1b4332' }}>
                {scheme.name}
              </h2>
              <div style={{ fontSize: '13px', color: '#2d6a4f', fontWeight: '600' }}>
                {scheme.tagline}
              </div>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155', margin: '12px 0 6px 0' }}>
              {t('whoIsEligible')}
            </div>
            <ul style={{ paddingLeft: '20px', margin: '0', color: '#475569', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {scheme.eligibility.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>

            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155', margin: '14px 0 6px 0' }}>
              {t('whatItCovers')}
            </div>
            <ul style={{ paddingLeft: '20px', margin: '0 0 18px 0', color: '#475569', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {scheme.covers.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>

            <button
              onClick={() => handleOpenSchemeDetails(scheme.id)}
              style={{
                width: '100%',
                backgroundColor: scheme.isEligible ? '#1b8a5a' : '#2d6a4f',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {t('applyBtn')}
            </button>
          </div>
        ))}

        {/* DISCLAIMER */}
        <div style={{
          backgroundColor: '#e8efe9',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '12px',
          color: '#52796f',
          textAlign: 'center',
          marginTop: '16px'
        }}>
          {t('disclaimer')}
        </div>
      </div>

      {/* APPLICATION GUIDE MODAL */}
      {selectedSchemeModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '14px', maxWidth: '580px', width: '100%',
            maxHeight: '90vh', overflowY: 'auto', padding: '24px', position: 'relative',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
          }}>
            <button
              onClick={() => setSelectedSchemeModal(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px', backgroundColor: '#e2e8f0',
                border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '18px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              &times;
            </button>

            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1b4332', fontWeight: 'bold', paddingRight: '36px' }}>
              {currentLang === 'hi' ? selectedSchemeModal.title_hi : selectedSchemeModal.title_en}
            </h3>

            {/* Steps */}
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '16px', marginBottom: '16px', borderLeft: '4px solid #2d6a4f' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#1b4332', fontWeight: 'bold' }}>
                {t('stepsTitle')}
              </h4>
              <ol style={{ margin: 0, paddingLeft: '20px', color: '#334155', fontSize: '13px', lineHeight: '1.6' }}>
                {(currentLang === 'hi' ? selectedSchemeModal.steps_hi : selectedSchemeModal.steps_en).map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Documents Required */}
            <div style={{ backgroundColor: '#fdfbf7', borderRadius: '10px', padding: '16px', marginBottom: '16px', border: '1px solid #f1e4d0' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#854d0e', fontWeight: 'bold' }}>
                {t('docsTitle')}
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#451a03', fontSize: '13px', lineHeight: '1.6' }}>
                {(currentLang === 'hi' ? selectedSchemeModal.docs_hi : selectedSchemeModal.docs_en).map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>

            {/* Helpline */}
            <div style={{ backgroundColor: '#eef8f2', borderRadius: '10px', padding: '14px', marginBottom: '20px', border: '1px solid #c0e0c8' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1b4332', marginBottom: '4px' }}>
                {t('helplineTitle')}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1b8a5a' }}>
                {selectedSchemeModal.helpline}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={selectedSchemeModal.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, minWidth: '200px', backgroundColor: '#2d6a4f', color: '#ffffff',
                  textAlign: 'center', padding: '12px', borderRadius: '8px', fontSize: '14px',
                  fontWeight: 'bold', textDecoration: 'none', display: 'block'
                }}
              >
                {t('openPortalBtn')}
              </a>
              <button
                onClick={() => setSelectedSchemeModal(null)}
                style={{
                  padding: '12px 20px', backgroundColor: '#e2e8f0', color: '#334155', border: 'none',
                  borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                {t('closeBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovtSchemes;
