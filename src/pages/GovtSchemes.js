
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const GovtSchemes = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [age, setAge] = useState('');
  const [isPregnant, setIsPregnant] = useState('No');
  const [incomeCategory, setIncomeCategory] = useState('Medium/High');

  const translations = {
  "en": {
    "pageTitle": "Government Health Schemes",
    "subtitle": "Free and subsidized healthcare for every family",
    "disclaimer": "This information is for awareness only. Scheme details may change — please verify on official government websites before applying.",
    "checkEligibility": "Check which scheme is for you",
    "ageLabel": "Age",
    "pregnantLabel": "Are you pregnant?",
    "incomeLabel": "Family Income",
    "yes": "Yes",
    "no": "No",
    "bpl": "Low (BPL)",
    "apl": "Medium/High",
    "eligibleBadge": "✅ You may be eligible",
    "eligibleDesc": "Based on your details, you might qualify for this scheme.",
    "applyBtn": "How to Apply",
    "whoIsEligible": "Who is eligible?",
    "whatItCovers": "What it covers",
    "pmjayName": "Ayushman Bharat – PM-JAY",
    "pmjayTagline": "Up to ₹5 Lakh free coverage per family",
    "pmjayElig1": "Families in rural areas without a strong earning adult",
    "pmjayElig2": "Families with a disabled member",
    "pmjayElig3": "All senior citizens aged 70 and above",
    "pmjayElig4": "BPL card holders",
    "pmjayCover1": "₹5 lakh per family per year",
    "pmjayCover2": "Cashless treatment at empaneled hospitals",
    "pmjayCover3": "Secondary and tertiary hospitalization",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "Janani Suraksha Yojana (JSY)",
    "jsyTagline": "Financial assistance for pregnant women",
    "jsyElig1": "Pregnant women from BPL households",
    "jsyElig2": "SC/ST pregnant women",
    "jsyElig3": "Women giving birth in government/empaneled hospitals",
    "jsyCover1": "Cash assistance for institutional delivery",
    "jsyCover2": "Free delivery and post-delivery care",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "Rashtriya Bal Swasthya Karyakram (RBSK)",
    "rbskTagline": "Child health screening and early intervention",
    "rbskElig1": "All children from birth to 18 years of age",
    "rbskElig2": "Children enrolled in Anganwadi centers",
    "rbskElig3": "Children studying in government schools",
    "rbskCover1": "Free health screening for diseases and deficiencies",
    "rbskCover2": "Free medical and surgical treatment",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "PM Surakshit Matritva Abhiyan",
    "pmsmaTagline": "Assured comprehensive antenatal care",
    "pmsmaElig1": "All pregnant women",
    "pmsmaElig2": "Women in their 2nd or 3rd trimester",
    "pmsmaCover1": "Free antenatal checkups on the 9th of every month",
    "pmsmaCover2": "Free ultrasound, blood tests, and medicines",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "hi": {
    "pageTitle": "सरकारी स्वास्थ्य योजनाएं",
    "subtitle": "हर परिवार के लिए मुफ्त और रियायती स्वास्थ्य सेवा",
    "disclaimer": "यह जानकारी केवल जागरूकता के लिए है। योजना के विवरण बदल सकते हैं — कृपया आवेदन करने से पहले आधिकारिक सरकारी वेबसाइटों पर सत्यापित करें।",
    "checkEligibility": "जांचें कि आपके लिए कौन सी योजना है",
    "ageLabel": "आयु",
    "pregnantLabel": "क्या आप गर्भवती हैं?",
    "incomeLabel": "पारिवारिक आय",
    "yes": "हाँ",
    "no": "नहीं",
    "bpl": "कम (BPL)",
    "apl": "मध्यम/उच्च",
    "eligibleBadge": "✅ आप पात्र हो सकते हैं",
    "eligibleDesc": "आपके विवरण के आधार पर, आप इस योजना के लिए अर्हता प्राप्त कर सकते हैं।",
    "applyBtn": "आवेदन कैसे करें",
    "whoIsEligible": "कौन पात्र है?",
    "whatItCovers": "यह क्या कवर करता है",
    "pmjayName": "आयुष्मान भारत - PM-JAY",
    "pmjayTagline": "प्रति परिवार ₹5 लाख तक का मुफ्त कवरेज",
    "pmjayElig1": "ग्रामीण क्षेत्रों में बिना किसी मजबूत कमाने वाले वयस्क के परिवार",
    "pmjayElig2": "विकलांग सदस्य वाले परिवार",
    "pmjayElig3": "70 वर्ष और उससे अधिक आयु के सभी वरिष्ठ नागरिक",
    "pmjayElig4": "BPL कार्ड धारक",
    "pmjayCover1": "प्रति परिवार, प्रति वर्ष ₹5 लाख",
    "pmjayCover2": "सूचीबद्ध अस्पतालों में कैशलेस इलाज",
    "pmjayCover3": "माध्यमिक और तृतीयक अस्पताल में भर्ती",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "जननी सुरक्षा योजना (JSY)",
    "jsyTagline": "गर्भवती महिलाओं के लिए वित्तीय सहायता",
    "jsyElig1": "BPL परिवारों की गर्भवती महिलाएं",
    "jsyElig2": "SC/ST गर्भवती महिलाएं",
    "jsyElig3": "सरकारी/सूचीबद्ध अस्पतालों में जन्म देने वाली महिलाएं",
    "jsyCover1": "संस्थागत प्रसव के लिए नकद सहायता",
    "jsyCover2": "मुफ्त प्रसव और प्रसवोत्तर देखभाल",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "राष्ट्रीय बाल स्वास्थ्य कार्यक्रम (RBSK)",
    "rbskTagline": "बाल स्वास्थ्य जांच और प्रारंभिक हस्तक्षेप",
    "rbskElig1": "जन्म से 18 वर्ष तक के सभी बच्चे",
    "rbskElig2": "आंगनवाड़ी केंद्रों में नामांकित बच्चे",
    "rbskElig3": "सरकारी स्कूलों में पढ़ने वाले बच्चे",
    "rbskCover1": "बीमारियों और कमियों के लिए मुफ्त स्वास्थ्य जांच",
    "rbskCover2": "मुफ्त चिकित्सा और शल्य चिकित्सा उपचार",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "पीएम सुरक्षित मातृत्व अभियान",
    "pmsmaTagline": "सुनिश्चित व्यापक प्रसवपूर्व देखभाल",
    "pmsmaElig1": "सभी गर्भवती महिलाएं",
    "pmsmaElig2": "दूसरी या तीसरी तिमाही की महिलाएं",
    "pmsmaCover1": "हर महीने की 9 तारीख को मुफ्त प्रसवपूर्व जांच",
    "pmsmaCover2": "मुफ्त अल्ट्रासाउंड, रक्त परीक्षण और दवाएं",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "gu": {
    "pageTitle": "સરકારી આરોગ્ય યોજનાઓ",
    "subtitle": "દરેક પરિવાર માટે મફત અને સબસિડીવાળી આરોગ્યસંભાળ",
    "disclaimer": "આ માહિતી માત્ર જાગૃતિ માટે છે. યોજનાની વિગતો બદલાઈ શકે છે — કૃપા કરીને અરજી કરતા પહેલા સત્તાવાર સરકારી વેબસાઇટ્સ પર ચકાસો.",
    "checkEligibility": "તમારા માટે કઈ યોજના છે તે તપાસો",
    "ageLabel": "ઉંમર",
    "pregnantLabel": "શું તમે ગર્ભવતી છો?",
    "incomeLabel": "પારિવારિક આવક",
    "yes": "હા",
    "no": "ના",
    "bpl": "ઓછી (BPL)",
    "apl": "મધ્યમ/ઉચ્ચ",
    "eligibleBadge": "✅ તમે પાત્ર હોઈ શકો છો",
    "eligibleDesc": "તમારી વિગતોના આધારે, તમે આ યોજના માટે લાયક ઠરી શકો છો.",
    "applyBtn": "કેવી રીતે અરજી કરવી",
    "whoIsEligible": "કોણ પાત્ર છે?",
    "whatItCovers": "તે શું આવરી લે છે",
    "pmjayName": "આયુષ્માન ભારત - PM-JAY",
    "pmjayTagline": "કુટુંબ દીઠ ₹5 લાખ સુધીનું મફત કવરેજ",
    "pmjayElig1": "મજબૂત કમાતા પુખ્ત વયના વિનાના પરિવારો",
    "pmjayElig2": "વિકલાંગ સભ્યવાળા પરિવારો",
    "pmjayElig3": "70 વર્ષ અને તેથી વધુ વયના તમામ વરિષ્ઠ નાગરિકો",
    "pmjayElig4": "BPL કાર્ડ ધારકો",
    "pmjayCover1": "કુટુંબ દીઠ દર વર્ષે ₹5 લાખ",
    "pmjayCover2": "એમ્પેનલ્ડ હોસ્પિટલોમાં કેશલેસ સારવાર",
    "pmjayCover3": "ગંભીર બીમારીઓ માટે હોસ્પિટલમાં દાખલ",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "જનની સુરક્ષા યોજના (JSY)",
    "jsyTagline": "સગર્ભા સ્ત્રીઓ માટે નાણાકીય સહાય",
    "jsyElig1": "BPL પરિવારોની સગર્ભા સ્ત્રીઓ",
    "jsyElig2": "SC/ST સગર્ભા સ્ત્રીઓ",
    "jsyElig3": "સરકારી હોસ્પિટલોમાં જન્મ આપતી સ્ત્રીઓ",
    "jsyCover1": "સંસ્થાકીય ડિલિવરી માટે રોકડ સહાય",
    "jsyCover2": "મફત ડિલિવરી અને ડિલિવરી પછીની સંભાળ",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "રાષ્ટ્રીય બાળ સ્વાસ્થ્ય કાર્યક્રમ (RBSK)",
    "rbskTagline": "બાળ આરોગ્ય તપાસ અને પ્રારંભિક હસ્તક્ષેપ",
    "rbskElig1": "જન્મથી 18 વર્ષ સુધીના તમામ બાળકો",
    "rbskElig2": "આંગણવાડીમાં નોંધાયેલા બાળકો",
    "rbskElig3": "સરકારી શાળામાં ભણતા બાળકો",
    "rbskCover1": "બીમારીઓ અને ખામીઓ માટે મફત આરોગ્ય તપાસ",
    "rbskCover2": "મફત તબીબી અને સર્જિકલ સારવાર",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "પીએમ સુરક્ષિત માતૃત્વ અભિયાન",
    "pmsmaTagline": "નિશ્ચિત વ્યાપક પ્રિનેટલ કેર",
    "pmsmaElig1": "તમામ સગર્ભા સ્ત્રીઓ",
    "pmsmaElig2": "બીજા કે ત્રીજા ત્રિમાસિક ગાળાની સ્ત્રીઓ",
    "pmsmaCover1": "દર મહિનાની 9મી તારીખે મફત પ્રિનેટલ તપાસ",
    "pmsmaCover2": "મફત અલ્ટ્રાસાઉન્ડ, રક્ત પરીક્ષણો અને દવાઓ",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "mr": {
    "pageTitle": "सरकारी आरोग्य योजना",
    "subtitle": "प्रत्येक कुटुंबासाठी मोफत आणि सवलतीची आरोग्यसेवा",
    "disclaimer": "ही माहिती केवळ जागरूकतेसाठी आहे. योजनेचे तपशील बदलू शकतात — कृपया अर्ज करण्यापूर्वी अधिकृत सरकारी वेबसाइटवर पडताळणी करा.",
    "checkEligibility": "तुमच्यासाठी कोणती योजना आहे ते तपासा",
    "ageLabel": "वय",
    "pregnantLabel": "तुम्ही गर्भवती आहात का?",
    "incomeLabel": "कुटुंबाचे उत्पन्न",
    "yes": "होय",
    "no": "नाही",
    "bpl": "कमी (BPL)",
    "apl": "मध्यम/उच्च",
    "eligibleBadge": "✅ तुम्ही पात्र असू शकता",
    "eligibleDesc": "तुमच्या तपशीलांवर आधारित, तुम्ही या योजनेसाठी पात्र ठरू शकता.",
    "applyBtn": "अर्ज कसा करावा",
    "whoIsEligible": "पात्र कोण आहे?",
    "whatItCovers": "यात काय समाविष्ट आहे",
    "pmjayName": "आयुष्मान भारत - PM-JAY",
    "pmjayTagline": "प्रति कुटुंब ₹5 लाखांपर्यंत मोफत कव्हरेज",
    "pmjayElig1": "मजबूत कमावता प्रौढ नसलेली कुटुंबे",
    "pmjayElig2": "अपंग सदस्य असलेली कुटुंबे",
    "pmjayElig3": "70 वर्षे आणि त्यावरील सर्व ज्येष्ठ नागरिक",
    "pmjayElig4": "BPL कार्ड धारक",
    "pmjayCover1": "प्रति कुटुंब दरवर्षी ₹5 लाख",
    "pmjayCover2": "नोंदणीकृत रुग्णालयांमध्ये कॅशलेस उपचार",
    "pmjayCover3": "गंभीर आजारांसाठी रुग्णालयात दाखल",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "जननी सुरक्षा योजना (JSY)",
    "jsyTagline": "गर्भवती महिलांसाठी आर्थिक मदत",
    "jsyElig1": "BPL कुटुंबातील गर्भवती महिला",
    "jsyElig2": "SC/ST गर्भवती महिला",
    "jsyElig3": "सरकारी रुग्णालयात जन्म देणाऱ्या महिला",
    "jsyCover1": "संस्थात्मक प्रसूतीसाठी रोख मदत",
    "jsyCover2": "मोफत प्रसूती आणि प्रसूतीनंतरची काळजी",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "राष्ट्रीय बाल स्वास्थ्य कार्यक्रम (RBSK)",
    "rbskTagline": "बाल आरोग्य तपासणी आणि प्रारंभिक हस्तक्षेप",
    "rbskElig1": "जन्मापासून 18 वर्षांपर्यंतची सर्व मुले",
    "rbskElig2": "अंगणवाडीतील मुले",
    "rbskElig3": "सरकारी शाळेतील मुले",
    "rbskCover1": "आजार आणि कमतरतेसाठी मोफत आरोग्य तपासणी",
    "rbskCover2": "मोफत वैद्यकीय आणि शस्त्रक्रिया उपचार",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "पीएम सुरक्षित मातृत्व अभियान",
    "pmsmaTagline": "निश्चित सर्वसमावेशक प्रसवपूर्व काळजी",
    "pmsmaElig1": "सर्व गर्भवती महिला",
    "pmsmaElig2": "दुसऱ्या किंवा तिसऱ्या तिमाहीतील महिला",
    "pmsmaCover1": "दर महिन्याच्या 9 तारखेला मोफत प्रसवपूर्व तपासणी",
    "pmsmaCover2": "मोफत अल्ट्रासाऊंड, रक्त चाचण्या आणि औषधे",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "ta": {
    "pageTitle": "அரசு சுகாதார திட்டங்கள்",
    "subtitle": "ஒவ்வொரு குடும்பத்திற்கும் இலவச மற்றும் மானியத்துடன் கூடிய சுகாதாரம்",
    "disclaimer": "இந்தத் தகவல் விழிப்புணர்வுக்காக மட்டுமே. திட்ட விவரங்கள் மாறக்கூடும் — விண்ணப்பிப்பதற்கு முன் அதிகாரப்பூர்வ அரசு இணையதளங்களில் சரிபார்க்கவும்.",
    "checkEligibility": "உங்களுக்கான திட்டம் எது என சரிபார்க்கவும்",
    "ageLabel": "வயது",
    "pregnantLabel": "நீங்கள் கர்ப்பமாக இருக்கிறீர்களா?",
    "incomeLabel": "குடும்ப வருமானம்",
    "yes": "ஆம்",
    "no": "இல்லை",
    "bpl": "குறைந்த (BPL)",
    "apl": "நடுத்தர/அதிக",
    "eligibleBadge": "✅ நீங்கள் தகுதியுடையவராக இருக்கலாம்",
    "eligibleDesc": "உங்கள் விவரங்களின் அடிப்படையில், நீங்கள் இந்தத் திட்டத்திற்குத் தகுதி பெறலாம்.",
    "applyBtn": "எப்படி விண்ணப்பிப்பது",
    "whoIsEligible": "யார் தகுதியானவர்?",
    "whatItCovers": "இது எவற்றை உள்ளடக்கும்",
    "pmjayName": "ஆயுஷ்மான் பாரத் - PM-JAY",
    "pmjayTagline": "குடும்பத்திற்கு ₹5 லட்சம் வரை இலவச காப்பீடு",
    "pmjayElig1": "வலுவான வருமானம் ஈட்டும் நபர் இல்லாத குடும்பங்கள்",
    "pmjayElig2": "மாற்றுத்திறனாளி உறுப்பினர் உள்ள குடும்பங்கள்",
    "pmjayElig3": "70 வயது மற்றும் அதற்கு மேற்பட்ட முதியவர்கள்",
    "pmjayElig4": "BPL அட்டைதாரர்கள்",
    "pmjayCover1": "ஒரு குடும்பத்திற்கு ஆண்டுக்கு ₹5 லட்சம்",
    "pmjayCover2": "அங்கீகரிக்கப்பட்ட மருத்துவமனைகளில் பணமில்லா சிகிச்சை",
    "pmjayCover3": "தீவிர நோய்களுக்கான சிகிச்சை",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "ஜனனி சுரக்ஷா யோஜனா (JSY)",
    "jsyTagline": "கர்ப்பிணிப் பெண்களுக்கான நிதி உதவி",
    "jsyElig1": "BPL குடும்பங்களைச் சேர்ந்த கர்ப்பிணிப் பெண்கள்",
    "jsyElig2": "SC/ST கர்ப்பிணிப் பெண்கள்",
    "jsyElig3": "அரசு மருத்துவமனைகளில் பிரசவிக்கும் பெண்கள்",
    "jsyCover1": "பிரசவத்திற்கான ரொக்க உதவி",
    "jsyCover2": "இலவச பிரசவம் மற்றும் பிரசவத்திற்குப் பிந்தைய பராமரிப்பு",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "ராஷ்ட்ரிய பால் ஸ்வஸ்திய கார்யக்ரம் (RBSK)",
    "rbskTagline": "குழந்தைகள் சுகாதார பரிசோதனை மற்றும் ஆரம்ப தலையீடு",
    "rbskElig1": "பிறப்பு முதல் 18 வயது வரை உள்ள அனைத்து குழந்தைகளும்",
    "rbskElig2": "அங்கன்வாடிகளில் உள்ள குழந்தைகள்",
    "rbskElig3": "அரசுப் பள்ளி மாணவர்கள்",
    "rbskCover1": "நோய்கள் மற்றும் குறைபாடுகளுக்கான இலவச சுகாதார பரிசோதனை",
    "rbskCover2": "இலவச மருத்துவ மற்றும் அறுவை சிகிச்சை",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "பிஎம் சுரக்ஷித் மாத்ரித்வா அபியான்",
    "pmsmaTagline": "உறுதியான விரிவான பேறுகால பராமரிப்பு",
    "pmsmaElig1": "அனைத்து கர்ப்பிணிப் பெண்களும்",
    "pmsmaElig2": "2வது அல்லது 3வது மாதத்தில் உள்ள பெண்கள்",
    "pmsmaCover1": "ஒவ்வொரு மாதமும் 9ம் தேதி இலவச பேறுகால பரிசோதனை",
    "pmsmaCover2": "இலவச அல்ட்ராசவுண்ட், ரத்தப் பரிசோதனை மற்றும் மருந்துகள்",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "te": {
    "pageTitle": "ప్రభుత్వ ఆరోగ్య పథకాలు",
    "subtitle": "ప్రతి కుటుంబానికి ఉచిత మరియు రాయితీ ఆరోగ్య సంరక్షణ",
    "disclaimer": "ఈ సమాచారం అవగాహన కోసం మాత్రమే. పథకం వివరాలు మారవచ్చు — దరఖాస్తు చేయడానికి ముందు దయచేసి అధికారిక ప్రభుత్వ వెబ్‌సైట్‌లలో ధృవీకరించండి.",
    "checkEligibility": "మీ కోసం ఏ పథకం ఉందో తనిఖీ చేయండి",
    "ageLabel": "వయస్సు",
    "pregnantLabel": "మీరు గర్భవతిగా ఉన్నారా?",
    "incomeLabel": "కుటుంబ ఆదాయం",
    "yes": "అవును",
    "no": "కాదు",
    "bpl": "తక్కువ (BPL)",
    "apl": "మధ్యస్థ/ఎక్కువ",
    "eligibleBadge": "✅ మీరు అర్హులు కావచ్చు",
    "eligibleDesc": "మీ వివరాల ఆధారంగా, మీరు ఈ పథకానికి అర్హత పొందవచ్చు.",
    "applyBtn": "ఎలా దరఖాస్తు చేయాలి",
    "whoIsEligible": "ఎవరు అర్హులు?",
    "whatItCovers": "ఇది దేనిని కవర్ చేస్తుంది",
    "pmjayName": "ఆయుష్మాన్ భారత్ - PM-JAY",
    "pmjayTagline": "కుటుంబానికి ₹5 లక్షల వరకు ఉచిత కవరేజ్",
    "pmjayElig1": "బలమైన సంపాదించే వ్యక్తి లేని కుటుంబాలు",
    "pmjayElig2": "వికలాంగ సభ్యుడు ఉన్న కుటుంబాలు",
    "pmjayElig3": "70 ఏళ్లు పైబడిన సీనియర్ సిటిజన్లు అందరూ",
    "pmjayElig4": "BPL కార్డ్ హోల్డర్లు",
    "pmjayCover1": "కుటుంబానికి సంవత్సరానికి ₹5 లక్షలు",
    "pmjayCover2": "గుర్తింపు పొందిన ఆసుపత్రులలో నగదు రహిత చికిత్స",
    "pmjayCover3": "తీవ్రమైన వ్యాధులకు ఆసుపత్రిలో చేరడం",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "జననీ సురక్ష యోజన (JSY)",
    "jsyTagline": "గర్భిణీ స్త్రీలకు ఆర్థిక సహాయం",
    "jsyElig1": "BPL కుటుంబాలకు చెందిన గర్భిణీ స్త్రీలు",
    "jsyElig2": "SC/ST గర్భిణీ స్త్రీలు",
    "jsyElig3": "ప్రభుత్వ ఆసుపత్రులలో జన్మనిచ్చే మహిళలు",
    "jsyCover1": "సంస్థాగత ప్రసవం కోసం నగదు సహాయం",
    "jsyCover2": "ఉచిత ప్రసవం మరియు ప్రసవానంతర సంరక్షణ",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "రాష్ట్రీయ బాల్ స్వాస్థ్య కార్యక్రమం (RBSK)",
    "rbskTagline": "పిల్లల ఆరోగ్య పరీక్షలు మరియు ప్రారంభ జోక్యం",
    "rbskElig1": "పుట్టినప్పటి నుండి 18 ఏళ్ల వరకు పిల్లలు",
    "rbskElig2": "అంగన్‌వాడీ పిల్లలు",
    "rbskElig3": "ప్రభుత్వ పాఠశాలల పిల్లలు",
    "rbskCover1": "వ్యాధులు మరియు లోపాల కోసం ఉచిత ఆరోగ్య పరీక్షలు",
    "rbskCover2": "ఉచిత వైద్య మరియు శస్త్రచికిత్స చికిత్స",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "పిఎం సురక్షిత్ మాతృత్వ అభియాన్",
    "pmsmaTagline": "ఖచ్చితమైన సమగ్ర ప్రసూతి సంరక్షణ",
    "pmsmaElig1": "గర్భిణీ స్త్రీలందరూ",
    "pmsmaElig2": "2వ లేదా 3వ త్రైమాసికంలో ఉన్న మహిళలు",
    "pmsmaCover1": "ప్రతి నెల 9వ తేదీన ఉచిత ప్రసూతి పరీక్షలు",
    "pmsmaCover2": "ఉచిత అల్ట్రాసౌండ్, రక్త పరీక్షలు మరియు మందులు",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "pa": {
    "pageTitle": "ਸਰਕਾਰੀ ਸਿਹਤ ਯੋਜਨਾਵਾਂ",
    "subtitle": "ਹਰੇਕ ਪਰਿਵਾਰ ਲਈ ਮੁਫਤ ਅਤੇ ਸਬਸਿਡੀ ਵਾਲੀ ਸਿਹਤ ਸੰਭਾਲ",
    "disclaimer": "ਇਹ ਜਾਣਕਾਰੀ ਸਿਰਫ਼ ਜਾਗਰੂਕਤਾ ਲਈ ਹੈ। ਯੋਜਨਾ ਦੇ ਵੇਰਵੇ ਬਦਲ ਸਕਦੇ ਹਨ — ਕਿਰਪਾ ਕਰਕੇ ਅਰਜ਼ੀ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਅਧਿਕਾਰਤ ਸਰਕਾਰੀ ਵੈੱਬਸਾਈਟਾਂ 'ਤੇ ਪੁਸ਼ਟੀ ਕਰੋ।",
    "checkEligibility": "ਜਾਂਚ ਕਰੋ ਕਿ ਤੁਹਾਡੇ ਲਈ ਕਿਹੜੀ ਯੋਜਨਾ ਹੈ",
    "ageLabel": "ਉਮਰ",
    "pregnantLabel": "ਕੀ ਤੁਸੀਂ ਗਰਭਵਤੀ ਹੋ?",
    "incomeLabel": "ਪਰਿਵਾਰਕ ਆਮਦਨ",
    "yes": "ਹਾਂ",
    "no": "ਨਹੀਂ",
    "bpl": "ਘੱਟ (BPL)",
    "apl": "ਮੱਧਮ/ਵੱਧ",
    "eligibleBadge": "✅ ਤੁਸੀਂ ਯੋਗ ਹੋ ਸਕਦੇ ਹੋ",
    "eligibleDesc": "ਤੁਹਾਡੇ ਵੇਰਵਿਆਂ ਦੇ ਆਧਾਰ 'ਤੇ, ਤੁਸੀਂ ਇਸ ਯੋਜਨਾ ਲਈ ਯੋਗ ਹੋ ਸਕਦੇ ਹੋ।",
    "applyBtn": "ਅਰਜ਼ੀ ਕਿਵੇਂ ਦੇਣੀ ਹੈ",
    "whoIsEligible": "ਕੌਣ ਯੋਗ ਹੈ?",
    "whatItCovers": "ਇਹ ਕੀ ਕਵਰ ਕਰਦਾ ਹੈ",
    "pmjayName": "ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ - PM-JAY",
    "pmjayTagline": "ਪ੍ਰਤੀ ਪਰਿਵਾਰ ₹5 ਲੱਖ ਤੱਕ ਮੁਫ਼ਤ ਕਵਰੇਜ",
    "pmjayElig1": "ਮਜ਼ਬੂਤ ਕਮਾਉਣ ਵਾਲੇ ਬਾਲਗ ਤੋਂ ਬਿਨਾਂ ਪਰਿਵਾਰ",
    "pmjayElig2": "ਅਪਾਹਜ ਮੈਂਬਰ ਵਾਲੇ ਪਰਿਵਾਰ",
    "pmjayElig3": "70 ਸਾਲ ਅਤੇ ਇਸ ਤੋਂ ਵੱਧ ਉਮਰ ਦੇ ਸਾਰੇ ਸੀਨੀਅਰ ਨਾਗਰਿਕ",
    "pmjayElig4": "BPL ਕਾਰਡ ਧਾਰਕ",
    "pmjayCover1": "ਪ੍ਰਤੀ ਪਰਿਵਾਰ, ਪ੍ਰਤੀ ਸਾਲ ₹5 ਲੱਖ",
    "pmjayCover2": "ਸੂਚੀਬੱਧ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਨਕਦ ਰਹਿਤ ਇਲਾਜ",
    "pmjayCover3": "ਗੰਭੀਰ ਬਿਮਾਰੀਆਂ ਲਈ ਹਸਪਤਾਲ ਵਿੱਚ ਭਰਤੀ",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "ਜਨਨੀ ਸੁਰੱਖਿਆ ਯੋਜਨਾ (JSY)",
    "jsyTagline": "ਗਰਭਵਤੀ ਔਰਤਾਂ ਲਈ ਵਿੱਤੀ ਸਹਾਇਤਾ",
    "jsyElig1": "BPL ਪਰਿਵਾਰਾਂ ਦੀਆਂ ਗਰਭਵਤੀ ਔਰਤਾਂ",
    "jsyElig2": "SC/ST ਗਰਭਵਤੀ ਔਰਤਾਂ",
    "jsyElig3": "ਸਰਕਾਰੀ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਜਨਮ ਦੇਣ ਵਾਲੀਆਂ ਔਰਤਾਂ",
    "jsyCover1": "ਸੰਸਥਾਗਤ ਜਣੇਪੇ ਲਈ ਨਕਦ ਸਹਾਇਤਾ",
    "jsyCover2": "ਮੁਫ਼ਤ ਜਣੇਪਾ ਅਤੇ ਜਣੇਪੇ ਤੋਂ ਬਾਅਦ ਦੀ ਦੇਖਭਾਲ",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "ਰਾਸ਼ਟਰੀ ਬਾਲ ਸਿਹਤ ਪ੍ਰੋਗਰਾਮ (RBSK)",
    "rbskTagline": "ਬਾਲ ਸਿਹਤ ਜਾਂਚ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਦਖਲ",
    "rbskElig1": "ਜਨਮ ਤੋਂ 18 ਸਾਲ ਤੱਕ ਦੇ ਸਾਰੇ ਬੱਚੇ",
    "rbskElig2": "ਆਂਗਣਵਾੜੀ ਬੱਚੇ",
    "rbskElig3": "ਸਰਕਾਰੀ ਸਕੂਲਾਂ ਦੇ ਬੱਚੇ",
    "rbskCover1": "ਬਿਮਾਰੀਆਂ ਅਤੇ ਕਮੀਆਂ ਲਈ ਮੁਫਤ ਸਿਹਤ ਜਾਂਚ",
    "rbskCover2": "ਮੁਫਤ ਡਾਕਟਰੀ ਅਤੇ ਸਰਜੀਕਲ ਇਲਾਜ",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "ਪੀਐਮ ਸੁਰੱਖਿਅਤ ਮਾਤ੍ਰਿਤਵ ਅਭਿਆਨ",
    "pmsmaTagline": "ਨਿਸ਼ਚਿਤ ਵਿਆਪਕ ਜਣੇਪੇ ਦੀ ਦੇਖਭਾਲ",
    "pmsmaElig1": "ਸਾਰੀਆਂ ਗਰਭਵਤੀ ਔਰਤਾਂ",
    "pmsmaElig2": "ਦੂਜੀ ਜਾਂ ਤੀਜੀ ਤਿਮਾਹੀ ਦੀਆਂ ਔਰਤਾਂ",
    "pmsmaCover1": "ਹਰ ਮਹੀਨੇ ਦੀ 9 ਤਰੀਕ ਨੂੰ ਮੁਫ਼ਤ ਜਣੇਪਾ ਜਾਂਚ",
    "pmsmaCover2": "ਮੁਫਤ ਅਲਟਰਾਸਾਊਂਡ, ਖੂਨ ਦੇ ਟੈਸਟ ਅਤੇ ਦਵਾਈਆਂ",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "bn": {
    "pageTitle": "সরকারি স্বাস্থ্য প্রকল্প",
    "subtitle": "প্রতিটি পরিবারের জন্য বিনামূল্যে এবং ভর্তুকিযুক্ত স্বাস্থ্যসেবা",
    "disclaimer": "এই তথ্য শুধুমাত্র সচেতনতার জন্য। প্রকল্পের বিশদ পরিবর্তন হতে পারে — আবেদন করার আগে দয়া করে অফিসিয়াল সরকারি ওয়েবসাইটগুলিতে যাচাই করুন।",
    "checkEligibility": "আপনার জন্য কোন প্রকল্প আছে তা যাচাই করুন",
    "ageLabel": "বয়স",
    "pregnantLabel": "আপনি কি গর্ভবতী?",
    "incomeLabel": "পারিবারিক আয়",
    "yes": "হ্যাঁ",
    "no": "না",
    "bpl": "কম (BPL)",
    "apl": "মাঝারি/উচ্চ",
    "eligibleBadge": "✅ আপনি যোগ্য হতে পারেন",
    "eligibleDesc": "আপনার বিবরণের উপর ভিত্তি করে, আপনি এই প্রকল্পের জন্য যোগ্য হতে পারেন।",
    "applyBtn": "কিভাবে আবেদন করবেন",
    "whoIsEligible": "কারা যোগ্য?",
    "whatItCovers": "এটি কি কভার করে",
    "pmjayName": "আয়ুষ্মান ভারত - PM-JAY",
    "pmjayTagline": "পরিবার প্রতি ৫ লক্ষ টাকা পর্যন্ত বিনামূল্যে কভারেজ",
    "pmjayElig1": "শক্তিশালী উপার্জনকারী প্রাপ্তবয়স্ক ছাড়া পরিবার",
    "pmjayElig2": "প্রতিবন্ধী সদস্য সহ পরিবার",
    "pmjayElig3": "৭০ বছর এবং তদূর্ধ্ব বয়সী সমস্ত প্রবীণ নাগরিক",
    "pmjayElig4": "BPL কার্ড ধারক",
    "pmjayCover1": "পরিবার পিছু প্রতি বছর ৫ লক্ষ টাকা",
    "pmjayCover2": "তালিকাভুক্ত হাসপাতালে ক্যাশলেস চিকিৎসা",
    "pmjayCover3": "গুরুতর অসুস্থতার জন্য হাসপাতালে ভর্তি",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "জননী সুরক্ষা যোজনা (JSY)",
    "jsyTagline": "গর্ভবতী মহিলাদের জন্য আর্থিক সহায়তা",
    "jsyElig1": "BPL পরিবারের গর্ভবতী মহিলারা",
    "jsyElig2": "SC/ST গর্ভবতী মহিলারা",
    "jsyElig3": "সরকারি হাসপাতালে সন্তান জন্মদানকারী মহিলারা",
    "jsyCover1": "প্রাতিষ্ঠানিক প্রসবের জন্য নগদ সহায়তা",
    "jsyCover2": "বিনামূল্যে প্রসব এবং প্রসবোত্তর যত্ন",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "রাষ্ট্রীয় বাল স্বাস্থ্য কার্যক্রম (RBSK)",
    "rbskTagline": "শিশু স্বাস্থ্য পরীক্ষা এবং প্রাথমিক হস্তক্ষেপ",
    "rbskElig1": "জন্ম থেকে ১৮ বছর বয়সী সমস্ত শিশু",
    "rbskElig2": "অঙ্গনওয়াড়ি শিশু",
    "rbskElig3": "সরকারি স্কুলের শিশু",
    "rbskCover1": "রোগ এবং ঘাটতির জন্য বিনামূল্যে স্বাস্থ্য পরীক্ষা",
    "rbskCover2": "বিনামূল্যে চিকিৎসা এবং অস্ত্রোপচার",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "প্রধানমন্ত্রী সুরক্ষিত মাতৃত্ব অভিযান",
    "pmsmaTagline": "নিশ্চিত ব্যাপক প্রসবপূর্ব যত্ন",
    "pmsmaElig1": "সমস্ত গর্ভবতী মহিলারা",
    "pmsmaElig2": "দ্বিতীয় বা তৃতীয় ত্রৈমাসিকের মহিলারা",
    "pmsmaCover1": "প্রতি মাসের ৯ তারিখে বিনামূল্যে প্রসবপূর্ব পরীক্ষা",
    "pmsmaCover2": "বিনামূল্যে আল্ট্রাসাউন্ড, রক্ত পরীক্ষা এবং ওষুধ",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "kn": {
    "pageTitle": "ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಯೋಜನೆಗಳು",
    "subtitle": "ಪ್ರತಿ ಕುಟುಂಬಕ್ಕೂ ಉಚಿತ ಮತ್ತು ಸಬ್ಸಿಡಿ ಆರೋಗ್ಯ ರಕ್ಷಣೆ",
    "disclaimer": "ಈ ಮಾಹಿತಿಯು ಕೇವಲ ಅರಿವಿಗಾಗಿ. ಯೋಜನೆಯ ವಿವರಗಳು ಬದಲಾಗಬಹುದು — ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ದಯವಿಟ್ಟು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",
    "checkEligibility": "ನಿಮಗಾಗಿ ಯಾವ ಯೋಜನೆಯಿದೆ ಎಂದು ಪರಿಶೀಲಿಸಿ",
    "ageLabel": "ವಯಸ್ಸು",
    "pregnantLabel": "ನೀವು ಗರ್ಭಿಣಿಯೇ?",
    "incomeLabel": "ಕುಟುಂಬದ ಆದಾಯ",
    "yes": "ಹೌದು",
    "no": "ಇಲ್ಲ",
    "bpl": "ಕಡಿಮೆ (BPL)",
    "apl": "ಮಧ್ಯಮ/ಹೆಚ್ಚು",
    "eligibleBadge": "✅ ನೀವು ಅರ್ಹರಾಗಿರಬಹುದು",
    "eligibleDesc": "ನಿಮ್ಮ ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ, ನೀವು ಈ ಯೋಜನೆಗೆ ಅರ್ಹರಾಗಿರಬಹುದು.",
    "applyBtn": "ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ",
    "whoIsEligible": "ಯಾರು ಅರ್ಹರು?",
    "whatItCovers": "ಇದು ಏನನ್ನು ಒಳಗೊಂಡಿದೆ",
    "pmjayName": "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ - PM-JAY",
    "pmjayTagline": "ಪ್ರತಿ ಕುಟುಂಬಕ್ಕೆ ₹5 ಲಕ್ಷದವರೆಗೆ ಉಚಿತ ಕವರೇಜ್",
    "pmjayElig1": "ಬಲವಾಗಿ ದುಡಿಯುವ ವಯಸ್ಕರಿಲ್ಲದ ಕುಟುಂಬಗಳು",
    "pmjayElig2": "ವಿಕಲಚೇತನ ಸದಸ್ಯರಿರುವ ಕುಟುಂಬಗಳು",
    "pmjayElig3": "70 ವರ್ಷ ಮತ್ತು ಮೇಲ್ಪಟ್ಟ ಎಲ್ಲಾ ಹಿರಿಯ ನಾಗರಿಕರು",
    "pmjayElig4": "BPL ಕಾರ್ಡ್ ಹೊಂದಿರುವವರು",
    "pmjayCover1": "ಪ್ರತಿ ಕುಟುಂಬಕ್ಕೆ ವರ್ಷಕ್ಕೆ ₹5 ಲಕ್ಷ",
    "pmjayCover2": "ನೋಂದಾಯಿತ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ನಗದುರಹಿತ ಚಿಕಿತ್ಸೆ",
    "pmjayCover3": "ಗಂಭೀರ ಕಾಯಿಲೆಗಳಿಗೆ ಆಸ್ಪತ್ರೆಗೆ ದಾಖಲು",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "ಜನನಿ ಸುರಕ್ಷಾ ಯೋಜನೆ (JSY)",
    "jsyTagline": "ಗರ್ಭಿಣಿಯರಿಗೆ ಆರ್ಥಿಕ ನೆರವು",
    "jsyElig1": "BPL ಕುಟುಂಬಗಳ ಗರ್ಭಿಣಿಯರು",
    "jsyElig2": "SC/ST ಗರ್ಭಿಣಿಯರು",
    "jsyElig3": "ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಜನ್ಮ ನೀಡುವ ಮಹಿಳೆಯರು",
    "jsyCover1": "ಸಾಂಸ್ಥಿಕ ಹೆರಿಗೆಗಾಗಿ ನಗದು ನೆರವು",
    "jsyCover2": "ಉಚಿತ ಹೆರಿಗೆ ಮತ್ತು ಹೆರಿಗೆಯ ನಂತರದ ಆರೈಕೆ",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "ರಾಷ್ಟ್ರೀಯ ಬಾಲ ಸ್ವಾಸ್ಥ್ಯ ಕಾರ್ಯಕ್ರಮ (RBSK)",
    "rbskTagline": "ಮಕ್ಕಳ ಆರೋಗ್ಯ ತಪಾಸಣೆ ಮತ್ತು ಆರಂಭಿಕ ಹಸ್ತಕ್ಷೇಪ",
    "rbskElig1": "ಹುಟ್ಟಿನಿಂದ 18 ವರ್ಷದವರೆಗಿನ ಎಲ್ಲಾ ಮಕ್ಕಳು",
    "rbskElig2": "ಅಂಗನವಾಡಿ ಮಕ್ಕಳು",
    "rbskElig3": "ಸರ್ಕಾರಿ ಶಾಲಾ ಮಕ್ಕಳು",
    "rbskCover1": "ರೋಗಗಳು ಮತ್ತು ಕೊರತೆಗಳಿಗೆ ಉಚಿತ ಆರೋಗ್ಯ ತಪಾಸಣೆ",
    "rbskCover2": "ಉಚಿತ ವೈದ್ಯಕೀಯ ಮತ್ತು ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಚಿಕಿತ್ಸೆ",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "ಪಿಎಂ ಸುರಕ್ಷಿತ್ ಮಾತೃತ್ವ ಅಭಿಯಾನ್",
    "pmsmaTagline": "ಖಚಿತ ಸಮಗ್ರ ಹೆರಿಗೆ ಪೂರ್ವ ಆರೈಕೆ",
    "pmsmaElig1": "ಎಲ್ಲಾ ಗರ್ಭಿಣಿಯರು",
    "pmsmaElig2": "ಎರಡನೇ ಅಥವಾ ಮೂರನೇ ತ್ರೈಮಾಸಿಕದಲ್ಲಿರುವ ಮಹಿಳೆಯರು",
    "pmsmaCover1": "ಪ್ರತಿ ತಿಂಗಳ 9 ರಂದು ಉಚಿತ ಹೆರಿಗೆ ಪೂರ್ವ ತಪಾಸಣೆ",
    "pmsmaCover2": "ಉಚಿತ ಅಲ್ಟ್ರಾಸೌಂಡ್, ರಕ್ತ ಪರೀಕ್ಷೆಗಳು ಮತ್ತು ಔಷಧಗಳು",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "ml": {
    "pageTitle": "സർക്കാർ ആരോഗ്യ പദ്ധതികൾ",
    "subtitle": "ഓരോ കുടുംബത്തിനും സൗജന്യവും സബ്സിഡിയുള്ളതുമായ ആരോഗ്യപരിരക്ഷ",
    "disclaimer": "ഈ വിവരങ്ങൾ അവബോധത്തിനായി മാത്രമുള്ളതാണ്. പദ്ധതിയുടെ വിശദാംശങ്ങൾ മാറിയേക്കാം — അപേക്ഷിക്കുന്നതിന് മുമ്പ് ഔദ്യോഗിക സർക്കാർ വെബ്‌സൈറ്റുകളിൽ പരിശോധിക്കുക.",
    "checkEligibility": "നിങ്ങൾക്കുള്ള പദ്ധതി ഏതാണെന്ന് പരിശോധിക്കുക",
    "ageLabel": "പ്രായം",
    "pregnantLabel": "നിങ്ങൾ ഗർഭിണിയാണോ?",
    "incomeLabel": "കുടുംബ വരുമാനം",
    "yes": "അതെ",
    "no": "അല്ല",
    "bpl": "കുറഞ്ഞ (BPL)",
    "apl": "ഇടത്തരം/കൂടിയ",
    "eligibleBadge": "✅ നിങ്ങൾ യോഗ്യനായിരിക്കാം",
    "eligibleDesc": "നിങ്ങളുടെ വിവരങ്ങളുടെ അടിസ്ഥാനത്തിൽ, നിങ്ങൾ ഈ പദ്ധതിക്ക് അർഹനാകാം.",
    "applyBtn": "എങ്ങനെ അപേക്ഷിക്കാം",
    "whoIsEligible": "ആരാണ് യോഗ്യർ?",
    "whatItCovers": "ഇത് എന്തൊക്കെ ഉൾക്കൊള്ളുന്നു",
    "pmjayName": "ആയുഷ്മാൻ ഭാരത് - PM-JAY",
    "pmjayTagline": "ഒരു കുടുംബത്തിന് ₹5 ലക്ഷം വരെ സൗജന്യ കവറേജ്",
    "pmjayElig1": "പ്രധാന വരുമാനമുള്ള മുതിർന്ന ആളില്ലാത്ത കുടുംബങ്ങൾ",
    "pmjayElig2": "വികലാംഗനായ ഒരു അംഗമുള്ള കുടുംബങ്ങൾ",
    "pmjayElig3": "70 വയസ്സും അതിൽ കൂടുതലുമുള്ള എല്ലാ മുതിർന്ന പൗരന്മാരും",
    "pmjayElig4": "BPL കാർഡ് ഉടമകൾ",
    "pmjayCover1": "ഒരു കുടുംബത്തിന് പ്രതിവർഷം ₹5 ലക്ഷം",
    "pmjayCover2": "എംപാനൽ ചെയ്ത ആശുപത്രികളിൽ പണമില്ലാത്ത ചികിത്സ",
    "pmjayCover3": "ഗുരുതരമായ രോഗങ്ങൾക്ക് ആശുപത്രിവാസം",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "ജനനി സുരക്ഷാ യോജന (JSY)",
    "jsyTagline": "ഗർഭിണികൾക്കുള്ള സാമ്പത്തിക സഹായം",
    "jsyElig1": "BPL കുടുംബങ്ങളിലെ ഗർഭിണികൾ",
    "jsyElig2": "SC/ST ഗർഭിണികൾ",
    "jsyElig3": "സർക്കാർ ആശുപത്രികളിൽ പ്രസവിക്കുന്ന സ്ത്രീകൾ",
    "jsyCover1": "സ്ഥാപനപരമായ പ്രസവത്തിന് സാമ്പത്തിക സഹായം",
    "jsyCover2": "സൗജന്യ പ്രസവവും പ്രസവാനന്തര പരിചരണവും",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "രാഷ്ട്രീയ ബാൽ സ്വാസ്ഥ്യ കാര്യക്രം (RBSK)",
    "rbskTagline": "കുട്ടികളുടെ ആരോഗ്യ പരിശോധനയും മുൻകൂർ ഇടപെടലും",
    "rbskElig1": "ജനനം മുതൽ 18 വയസ്സ് വരെയുള്ള എല്ലാ കുട്ടികളും",
    "rbskElig2": "അങ്കണവാടി കുട്ടികൾ",
    "rbskElig3": "സർക്കാർ സ്കൂൾ കുട്ടികൾ",
    "rbskCover1": "രോഗങ്ങൾക്കും കുറവുകൾക്കുമുള്ള സൗജന്യ ആരോഗ്യ പരിശോധന",
    "rbskCover2": "സൗജന്യ വൈദ്യശാസ്ത്ര ശസ്ത്രക്രിയ ചികിത്സ",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "പിഎം സുരക്ഷിത് മാതൃത്വ അഭിയാൻ",
    "pmsmaTagline": "ഉറപ്പുള്ള സമഗ്ര ഗർഭകാല പരിചരണം",
    "pmsmaElig1": "എല്ലാ ഗർഭിണികളും",
    "pmsmaElig2": "രണ്ടാമത്തെയോ മൂന്നാമത്തെയോ ത്രിമാസത്തിലെ സ്ത്രീകൾ",
    "pmsmaCover1": "എല്ലാ മാസവും 9-ാം തീയതി സൗജന്യ ഗർഭകാല പരിശോധന",
    "pmsmaCover2": "സൗജന്യ അൾട്രാസൗണ്ട്, രക്തപരിശോധനകൾ, മരുന്നുകൾ",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "mw": {
    "pageTitle": "सरकारी सेहत योजना",
    "subtitle": "हर परिवार रे वास्ते मुफत और रियायती सेहत सेवा",
    "disclaimer": "आ जानकारी खाली जागरूकता वास्ते है। योजना रा विवरण बदल सके है — कृपया आवेदन करण सू पेहली आधिकारिक सरकारी वेबसाइट माथे जांच लेवो।",
    "checkEligibility": "जांचो के थारे वास्ते किसी योजना है",
    "ageLabel": "उमर",
    "pregnantLabel": "काई थे गर्भवती हो?",
    "incomeLabel": "परिवार री कमाई",
    "yes": "हां",
    "no": "ना",
    "bpl": "कम (BPL)",
    "apl": "मध्यम/ज्यादा",
    "eligibleBadge": "✅ थे पात्र हो सको हो",
    "eligibleDesc": "थारे विवरण रे आधार माथे, थे इण योजना वास्ते पात्र हो सको हो।",
    "applyBtn": "आवेदन कियां करां",
    "whoIsEligible": "कुण पात्र है?",
    "whatItCovers": "इण में काई कवर है",
    "pmjayName": "आयुष्मान भारत - PM-JAY",
    "pmjayTagline": "हर परिवार ने ₹5 लाख तकर रो मुफत कवरेज",
    "pmjayElig1": "मजबूत कमावण वाळा आदमी बिना परिवार",
    "pmjayElig2": "विकलांग सदस्य आळा परिवार",
    "pmjayElig3": "70 साल और उणसू माथे रा सगळा बुजुर्ग",
    "pmjayElig4": "BPL कार्ड आळा",
    "pmjayCover1": "हर परिवार ने हर साल ₹5 लाख",
    "pmjayCover2": "सूचीबद्ध अस्पताल में मुफत इलाज",
    "pmjayCover3": "गंभीर बीमारियां वास्ते अस्पताल में भरती",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "जननी सुरक्षा योजना (JSY)",
    "jsyTagline": "गर्भवती लुगायां वास्ते आर्थिक सहायता",
    "jsyElig1": "BPL परिवार री गर्भवती लुगायां",
    "jsyElig2": "SC/ST गर्भवती लुगायां",
    "jsyElig3": "सरकारी अस्पताल में जलम देवण आळी लुगायां",
    "jsyCover1": "अस्पताल में प्रसव वास्ते नकद सहायता",
    "jsyCover2": "मुफत प्रसव और प्रसव रे बाद री देखभाल",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "राष्ट्रीय बाल स्वास्थ्य कार्यक्रम (RBSK)",
    "rbskTagline": "टाबरां री सेहत जांच और शुरुआती इलाज",
    "rbskElig1": "जलम सू 18 साल तकर रा सगळा टाबर",
    "rbskElig2": "आंगनबाड़ी रा टाबर",
    "rbskElig3": "सरकारी स्कूल रा टाबर",
    "rbskCover1": "बीमारियां और कमियां वास्ते मुफत सेहत जांच",
    "rbskCover2": "मुफत दवाई और ऑपरेशन",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "पीएम सुरक्षित मातृत्व अभियान",
    "pmsmaTagline": "पक्की प्रसव पूर्व देखभाल",
    "pmsmaElig1": "सगळी गर्भवती लुगायां",
    "pmsmaElig2": "दुजा या तीजा तीमाई री लुगायां",
    "pmsmaCover1": "हर महिने री 9 तारीख ने मुफत प्रसव पूर्व जांच",
    "pmsmaCover2": "मुफत अल्ट्रासाउंड, खून री जांच और दवाईयां",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "as": {
    "pageTitle": "চৰকাৰী স্বাস্থ্য আঁচনি",
    "subtitle": "প্ৰতিটো পৰিয়ালৰ বাবে বিনামূলীয়া আৰু ৰাজসাহায্যপ্ৰাপ্ত স্বাস্থ্যসেৱা",
    "disclaimer": "এই তথ্য কেৱল সজাগতাৰ বাবেহে। আঁচনিৰ বিৱৰণ সলনি হ'ব পাৰে — অনুগ্ৰহ কৰি আবেদন কৰাৰ আগতে চৰকাৰী ৱেবছাইটত পৰীক্ষা কৰক।",
    "checkEligibility": "আপোনাৰ বাবে কোনখন আঁচনি আছে পৰীক্ষা কৰক",
    "ageLabel": "বয়স",
    "pregnantLabel": "আপুনি গৰ্ভৱতী নেকি?",
    "incomeLabel": "পৰিয়ালৰ উপাৰ্জন",
    "yes": "হয়",
    "no": "নহয়",
    "bpl": "কম (BPL)",
    "apl": "মধ্যমীয়া/বেছি",
    "eligibleBadge": "✅ আপুনি যোগ্য হ'ব পাৰে",
    "eligibleDesc": "আপোনাৰ বিৱৰণৰ ওপৰত ভিত্তি কৰি, আপুনি এই আঁচনিৰ বাবে যোগ্য হ'ব পাৰে।",
    "applyBtn": "কেনেদৰে আবেদন কৰিব",
    "whoIsEligible": "কোন যোগ্য?",
    "whatItCovers": "ই কি সামৰি লয়",
    "pmjayName": "আয়ুষ্মান ভাৰত - PM-JAY",
    "pmjayTagline": "প্ৰতি পৰিয়ালত ₹৫ লাখলৈকে বিনামূলীয়া কভাৰেজ",
    "pmjayElig1": "উপাৰ্জনকাৰী প্ৰাপ্তবয়স্ক নথকা পৰিয়াল",
    "pmjayElig2": "বিশেষভাৱে সক্ষম সদস্য থকা পৰিয়াল",
    "pmjayElig3": "৭০ বছৰ আৰু তাৰ উৰ্ধৰ সকলো জ্যেষ্ঠ নাগৰিক",
    "pmjayElig4": "BPL কাৰ্ড থকা লোক",
    "pmjayCover1": "প্ৰতি পৰিয়ালত প্ৰতি বছৰে ₹৫ লাখ",
    "pmjayCover2": "তালিকাভুক্ত চিকিৎসালয়ত বিনামূলীয়া চিকিৎসা",
    "pmjayCover3": "গুৰুতৰ ৰোগৰ বাবে চিকিৎসালয়ত ভৰ্তি",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "জননী সুৰক্ষা যোজনা (JSY)",
    "jsyTagline": "গৰ্ভৱতী মহিলাৰ বাবে আৰ্থিক সাহায্য",
    "jsyElig1": "BPL পৰিয়ালৰ গৰ্ভৱতী মহিলা",
    "jsyElig2": "SC/ST গৰ্ভৱতী মহিলা",
    "jsyElig3": "চৰকাৰী চিকিৎসালয়ত সন্তান জন্ম দিয়া মহিলা",
    "jsyCover1": "চিকিৎসালয়ত প্ৰসৱৰ বাবে নগদ সাহায্য",
    "jsyCover2": "বিনামূলীয়া প্ৰসৱ আৰু প্ৰসৱোত্তৰ যত্ন",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "ৰাষ্ট্ৰীয় বাল স্বাস্থ্য কাৰ্যক্ৰম (RBSK)",
    "rbskTagline": "শিশুৰ স্বাস্থ্য পৰীক্ষা আৰু প্ৰাৰম্ভিক হস্তক্ষেপ",
    "rbskElig1": "জন্মৰ পৰা ১৮ বছৰলৈকে সকলো শিশু",
    "rbskElig2": "অংগনৱাড়ীৰ শিশু",
    "rbskElig3": "চৰকাৰী বিদ্যালয়ৰ শিশু",
    "rbskCover1": "ৰোগ আৰু অভাৱৰ বাবে বিনামূলীয়া স্বাস্থ্য পৰীক্ষা",
    "rbskCover2": "বিনামূলীয়া চিকিৎসা আৰু অস্ত্ৰোপচাৰ",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "প্ৰধানমন্ত্ৰী সুৰক্ষিত মাতৃত্ব অভিযান",
    "pmsmaTagline": "নিশ্চিত ব্যাপক প্ৰসৱপূৰ্ব যতন",
    "pmsmaElig1": "সকলো গৰ্ভৱতী মহিলা",
    "pmsmaElig2": "দ্বিতীয় বা তৃতীয় ত্ৰৈমাসিকৰ মহিলা",
    "pmsmaCover1": "প্ৰতি মাহৰ ৯ তাৰিখে বিনামূলীয়া প্ৰসৱপূৰ্ব পৰীক্ষা",
    "pmsmaCover2": "বিনামূলীয়া আল্ট্ৰাছাউণ্ড, তেজ পৰীক্ষা আৰু ঔষধ",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "or": {
    "pageTitle": "ସରକାରୀ ସ୍ୱାସ୍ଥ୍ୟ ଯୋଜନା",
    "subtitle": "ପ୍ରତ୍ୟେକ ପରିବାର ପାଇଁ ମାଗଣା ଏବଂ ରିହାତି ସ୍ୱାସ୍ଥ୍ୟସେବା",
    "disclaimer": "ଏହି ସୂଚନା କେବଳ ସଚେତନତା ପାଇଁ। ଯୋଜନା ବିବରଣୀ ବଦଳିପାରେ — ଦୟାକରି ଆବେଦନ କରିବା ପୂର୍ବରୁ ସରକାରୀ ୱେବସାଇଟରେ ଯାଞ୍ଚ କରନ୍ତୁ।",
    "checkEligibility": "ଆପଣଙ୍କ ପାଇଁ କେଉଁ ଯୋଜନା ଅଛି ଯାଞ୍ଚ କରନ୍ତୁ",
    "ageLabel": "ବୟସ",
    "pregnantLabel": "ଆପଣ ଗର୍ଭବତୀ କି?",
    "incomeLabel": "ପରିବାର ଆୟ",
    "yes": "ହଁ",
    "no": "ନା",
    "bpl": "କମ୍ (BPL)",
    "apl": "ମଧ୍ୟମ/ଅଧିକ",
    "eligibleBadge": "✅ ଆପଣ ଯୋଗ୍ୟ ହୋଇପାରନ୍ତି",
    "eligibleDesc": "ଆପଣଙ୍କ ବିବରଣୀ ଆଧାରରେ, ଆପଣ ଏହି ଯୋଜନା ପାଇଁ ଯୋଗ୍ୟ ହୋଇପାରନ୍ତି।",
    "applyBtn": "କିପରି ଆବେଦନ କରିବେ",
    "whoIsEligible": "କିଏ ଯୋଗ୍ୟ?",
    "whatItCovers": "ଏହା କଣ କଭର କରେ",
    "pmjayName": "ଆୟୁଷ୍ମାନ ଭାରତ - PM-JAY",
    "pmjayTagline": "ପରିବାର ପିଛା ₹୫ ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ ମାଗଣା କଭରେଜ୍",
    "pmjayElig1": "ରୋଜଗାରକ୍ଷମ ବୟସ୍କ ନଥିବା ପରିବାର",
    "pmjayElig2": "ଭିନ୍ନକ୍ଷମ ସଦସ୍ୟ ଥିବା ପରିବାର",
    "pmjayElig3": "୭୦ ବର୍ଷ ଓ ତଦୁର୍ଦ୍ଧ୍ୱ ସମସ୍ତ ବରିଷ୍ଠ ନାଗରିକ",
    "pmjayElig4": "BPL କାର୍ଡ ଧାରକ",
    "pmjayCover1": "ପରିବାର ପିଛା ବର୍ଷକୁ ₹୫ ଲକ୍ଷ",
    "pmjayCover2": "ତାଲିକାଭୁକ୍ତ ଡାକ୍ତରଖାନାରେ ମାଗଣା ଚିକିତ୍ସା",
    "pmjayCover3": "ଗୁରୁତର ରୋଗ ପାଇଁ ଡାକ୍ତରଖାନାରେ ଭର୍ତ୍ତି",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "ଜନନୀ ସୁରକ୍ଷା ଯୋଜନା (JSY)",
    "jsyTagline": "ଗର୍ଭବତୀ ମହିଳାଙ୍କ ପାଇଁ ଆର୍ଥିକ ସହାୟତା",
    "jsyElig1": "BPL ପରିବାରର ଗର୍ଭବତୀ ମହିଳା",
    "jsyElig2": "SC/ST ଗର୍ଭବତୀ ମହିଳା",
    "jsyElig3": "ସରକାରୀ ଡାକ୍ତରଖାନାରେ ଜନ୍ମ ଦେଉଥିବା ମହିଳା",
    "jsyCover1": "ଡାକ୍ତରଖାନାରେ ପ୍ରସବ ପାଇଁ ଆର୍ଥିକ ସହାୟତା",
    "jsyCover2": "ମାଗଣା ପ୍ରସବ ଏବଂ ପ୍ରସବ ପରବର୍ତ୍ତୀ ଯତ୍ନ",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "ରାଷ୍ଟ୍ରୀୟ ବାଲ ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଯ୍ୟକ୍ରମ (RBSK)",
    "rbskTagline": "ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା ଏବଂ ପ୍ରାରମ୍ଭିକ ପଦକ୍ଷେପ",
    "rbskElig1": "ଜନ୍ମରୁ ୧୮ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ସମସ୍ତ ଶିଶୁ",
    "rbskElig2": "ଅଙ୍ଗନବାଡି ଶିଶୁ",
    "rbskElig3": "ସରକାରୀ ବିଦ୍ୟାଳୟର ଶିଶୁ",
    "rbskCover1": "ରୋଗ ଏବଂ ଅଭାବ ପାଇଁ ମାଗଣା ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା",
    "rbskCover2": "ମାଗଣା ଡାକ୍ତରୀ ଏବଂ ଅସ୍ତ୍ରୋପଚାର ଚିକିତ୍ସା",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "ପିଏମ୍ ସୁରକ୍ଷିତ ମାତୃତ୍ୱ ଅଭିଯାନ",
    "pmsmaTagline": "ନିଶ୍ଚିତ ବ୍ୟାପକ ପ୍ରସବପୂର୍ବ ଯତ୍ନ",
    "pmsmaElig1": "ସମସ୍ତ ଗର୍ଭବତୀ ମହିଳା",
    "pmsmaElig2": "ଦ୍ୱିତୀୟ ବା ତୃତୀୟ ତ୍ରୈମାସିକରେ ଥିବା ମହିଳା",
    "pmsmaCover1": "ପ୍ରତି ମାସ ୯ ତାରିଖରେ ମାଗଣା ପ୍ରସବପୂର୍ବ ପରୀକ୍ଷା",
    "pmsmaCover2": "ମାଗଣା ଅଲଟ୍ରାସାଉଣ୍ଡ, ରକ୍ତ ପରୀକ୍ଷା ଏବଂ ଔଷଧ",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  },
  "nm": {
    "pageTitle": "Sarkari Health Schemes",
    "subtitle": "Sobke laagi free aru subsidy health care",
    "disclaimer": "Eitu information khali janakari laagi ase. Scheme details change hobo pare — apply korar aage official website te check koribiyo.",
    "checkEligibility": "Apna laagi kon scheme ase check korok",
    "ageLabel": "Boyosh",
    "pregnantLabel": "Apuni pregnant ase naki?",
    "incomeLabel": "Family income",
    "yes": "Hoi",
    "no": "Nai",
    "bpl": "Kom (BPL)",
    "apl": "Medium/Beshi",
    "eligibleBadge": "✅ Apuni eligible hobo pare",
    "eligibleDesc": "Apnar details hisabe, apuni eitu scheme laagi eligible hobo pare.",
    "applyBtn": "Kene apply koribo",
    "whoIsEligible": "Kon eligible ase?",
    "whatItCovers": "Ete ki cover ase",
    "pmjayName": "Ayushman Bharat - PM-JAY",
    "pmjayTagline": "Family pisu ₹5 Lakh tak free coverage",
    "pmjayElig1": "Income koribole manu nathaka family",
    "pmjayElig2": "Handicapped manu thaka family",
    "pmjayElig3": "70 bochor aru upor manu",
    "pmjayElig4": "BPL card thaka manu",
    "pmjayCover1": "Family pisu bochorot ₹5 lakh",
    "pmjayCover2": "Empaneled hospital te free treatment",
    "pmjayCover3": "Daangor bemari laagi hospital te bhorti",
    "pmjayApplyUrl": "https://beneficiary.nha.gov.in",
    "jsyName": "Janani Suraksha Yojana (JSY)",
    "jsyTagline": "Pregnant mohila laagi poisa sahajyo",
    "jsyElig1": "BPL family laga pregnant mohila",
    "jsyElig2": "SC/ST pregnant mohila",
    "jsyElig3": "Sarkari hospital te bacha jonom diya mohila",
    "jsyCover1": "Hospital te delivery laagi poisa sahajyo",
    "jsyCover2": "Free delivery aru delivery pisot care",
    "jsyApplyUrl": "https://nhm.gov.in",
    "rbskName": "Rashtriya Bal Swasthya Karyakram (RBSK)",
    "rbskTagline": "Bacha laga health checkup aru treatment",
    "rbskElig1": "Jonom pora 18 bochor tak bacha",
    "rbskElig2": "Anganwadi laga bacha",
    "rbskElig3": "Sarkari school laga bacha",
    "rbskCover1": "Bemari aru komti laagi free health checkup",
    "rbskCover2": "Free medical aru operation treatment",
    "rbskApplyUrl": "https://rbsk.gov.in",
    "pmsmaName": "PM Surakshit Matritva Abhiyan",
    "pmsmaTagline": "Ghorboti somoy te free checkup",
    "pmsmaElig1": "Sob pregnant mohila",
    "pmsmaElig2": "Pregnant laga 2nd ba 3rd trimester te thaka mohila",
    "pmsmaCover1": "Protek maah laga 9 tarik te free checkup",
    "pmsmaCover2": "Free ultrasound, blood test aru dawai",
    "pmsmaApplyUrl": "https://pmsma.nhp.gov.in"
  }
};

  const getTranslation = (key) => {
    const t = translations[language] || translations.en;
    return t[key] || translations.en[key];
  };

  const schemes = [
    {
      id: 'pmjay',
      icon: '🏥',
      name: getTranslation('pmjayName'),
      tagline: getTranslation('pmjayTagline'),
      eligibility: [
        getTranslation('pmjayElig1'),
        getTranslation('pmjayElig2'),
        getTranslation('pmjayElig3'),
        getTranslation('pmjayElig4')
      ],
      covers: [
        getTranslation('pmjayCover1'),
        getTranslation('pmjayCover2'),
        getTranslation('pmjayCover3')
      ],
      applyUrl: getTranslation('pmjayApplyUrl'),
      isEligible: incomeCategory === 'Low (BPL)' || (age !== '' && parseInt(age) >= 70)
    },
    {
      id: 'jsy',
      icon: '🤰',
      name: getTranslation('jsyName'),
      tagline: getTranslation('jsyTagline'),
      eligibility: [
        getTranslation('jsyElig1'),
        getTranslation('jsyElig2'),
        getTranslation('jsyElig3')
      ],
      covers: [
        getTranslation('jsyCover1'),
        getTranslation('jsyCover2')
      ],
      applyUrl: getTranslation('jsyApplyUrl'),
      isEligible: isPregnant === 'Yes'
    },
    {
      id: 'pmsma',
      icon: '🤱',
      name: getTranslation('pmsmaName'),
      tagline: getTranslation('pmsmaTagline'),
      eligibility: [
        getTranslation('pmsmaElig1'),
        getTranslation('pmsmaElig2')
      ],
      covers: [
        getTranslation('pmsmaCover1'),
        getTranslation('pmsmaCover2')
      ],
      applyUrl: getTranslation('pmsmaApplyUrl'),
      isEligible: isPregnant === 'Yes'
    },
    {
      id: 'rbsk',
      icon: '👶',
      name: getTranslation('rbskName'),
      tagline: getTranslation('rbskTagline'),
      eligibility: [
        getTranslation('rbskElig1'),
        getTranslation('rbskElig2'),
        getTranslation('rbskElig3')
      ],
      covers: [
        getTranslation('rbskCover1'),
        getTranslation('rbskCover2')
      ],
      applyUrl: getTranslation('rbskApplyUrl'),
      isEligible: age !== '' && parseInt(age) <= 18
    }
  ];

  return (
    <div style={{ background: '#F1F8F1', minHeight: '100vh', padding: '20px', fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif" }}>
      <button 
        onClick={() => navigate(-1)}
        style={{
          color: '#2E7D32',
          background: 'none',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          padding: '10px 0',
          marginBottom: '8px'
        }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', margin: '0 0 8px 0' }}>
        {getTranslation('pageTitle')}
      </h1>
      <p style={{ fontSize: '14px', color: '#555', textAlign: 'center', margin: '0 0 24px 0' }}>
        {getTranslation('subtitle')}
      </p>

      {/* ELIGIBILITY CHECKER */}
      <div style={{ maxWidth: '480px', margin: '0 auto 24px auto', background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#00695C', margin: '0 0 16px 0', textAlign: 'center' }}>
          {getTranslation('checkEligibility')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              {getTranslation('ageLabel')}
            </label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 35"
              style={{ width: '100%', padding: '12px', border: '1.5px solid #E0E0E0', borderRadius: '10px', fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              {getTranslation('pregnantLabel')}
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setIsPregnant('Yes')}
                style={{ flex: 1, padding: '12px', border: isPregnant === 'Yes' ? '2px solid #00695C' : '1.5px solid #E0E0E0', background: isPregnant === 'Yes' ? '#E0F2F1' : 'white', color: isPregnant === 'Yes' ? '#00695C' : '#555', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {getTranslation('yes')}
              </button>
              <button 
                onClick={() => setIsPregnant('No')}
                style={{ flex: 1, padding: '12px', border: isPregnant === 'No' ? '2px solid #00695C' : '1.5px solid #E0E0E0', background: isPregnant === 'No' ? '#E0F2F1' : 'white', color: isPregnant === 'No' ? '#00695C' : '#555', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {getTranslation('no')}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              {getTranslation('incomeLabel')}
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setIncomeCategory('Low (BPL)')}
                style={{ flex: 1, padding: '12px', border: incomeCategory === 'Low (BPL)' ? '2px solid #00695C' : '1.5px solid #E0E0E0', background: incomeCategory === 'Low (BPL)' ? '#E0F2F1' : 'white', color: incomeCategory === 'Low (BPL)' ? '#00695C' : '#555', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {getTranslation('bpl')}
              </button>
              <button 
                onClick={() => setIncomeCategory('Medium/High')}
                style={{ flex: 1, padding: '12px', border: incomeCategory === 'Medium/High' ? '2px solid #00695C' : '1.5px solid #E0E0E0', background: incomeCategory === 'Medium/High' ? '#E0F2F1' : 'white', color: incomeCategory === 'Medium/High' ? '#00695C' : '#555', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {getTranslation('apl')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        {schemes.map((scheme) => (
          <div key={scheme.id} style={{
            background: 'white',
            border: scheme.isEligible ? '3px solid #4CAF50' : '2px solid #E0E0E0',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            marginBottom: '20px',
            position: 'relative'
          }}>
            {scheme.isEligible && (
              <div style={{
                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                background: '#4CAF50', color: 'white', fontSize: '12px', fontWeight: 'bold',
                padding: '6px 12px', borderRadius: '20px', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(76,175,80,0.4)'
              }}>
                {getTranslation('eligibleBadge')}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', marginTop: scheme.isEligible ? '8px' : '0' }}>
              <div style={{ fontSize: '32px' }}>{scheme.icon}</div>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: '#1A1A1A' }}>{scheme.name}</h2>
                <div style={{ fontSize: '13px', color: '#00695C', fontWeight: 'bold' }}>{scheme.tagline}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', margin: '16px 0 8px 0' }}>{getTranslation('whoIsEligible')}</h4>
            <ul style={{ paddingLeft: '20px', margin: '0', color: '#555', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {scheme.eligibility.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>

            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', margin: '16px 0 8px 0' }}>{getTranslation('whatItCovers')}</h4>
            <ul style={{ paddingLeft: '20px', margin: '0 0 20px 0', color: '#555', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {scheme.covers.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>

            <button
              onClick={() => window.open(scheme.applyUrl, '_blank')}
              style={{
                width: '100%',
                background: scheme.isEligible ? '#4CAF50' : '#00695C',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {getTranslation('applyBtn')}
            </button>
          </div>
        ))}

        {/* DISCLAIMER */}
        <div style={{
          background: '#EAEAEA',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '11px',
          color: '#888',
          textAlign: 'center',
          marginTop: '24px'
        }}>
          {getTranslation('disclaimer')}
        </div>
      </div>
    </div>
  );
};

export default GovtSchemes;
