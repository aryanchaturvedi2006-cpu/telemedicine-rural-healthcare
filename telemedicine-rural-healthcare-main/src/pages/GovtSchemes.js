import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const GovtSchemes = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const getTranslation = (key) => {
    const translations = {
      en: {
        pageTitle: "Government Health Schemes",
        subtitle: "Free and subsidized healthcare for every family",
        ayushmanDesc: "India's largest government health scheme. Covers hospitalization for serious illnesses including cancer, heart surgery, and organ transplants at government and private hospitals.",
        whoIsEligible: "Who is eligible?",
        elig1: "Families in rural areas without a strong earning member",
        elig2: "Families with a disabled member and no other working adult",
        elig3: "All senior citizens aged 70 and above (regardless of income)",
        elig4: "No family size or gender restrictions",
        checkEligibility: "Check Eligibility",
        helpline: "Helpline: 14555",
        freeCoverage: "Free coverage per family, per year",
        mostPopular: "Most Popular",
        card1Desc: "Free maternal care and cash assistance for pregnant women in government hospitals",
        card2Desc: "₹5,000 cash benefit for pregnant and breastfeeding mothers",
        card3Desc: "Generic medicines at 50-90% lower prices — find nearby stores",
        disclaimer: "This information is for awareness only. Scheme details may change — please verify on official government websites before applying."
      },
      hi: {
        pageTitle: "सरकारी स्वास्थ्य योजनाएं",
        subtitle: "हर परिवार के लिए मुफ्त और रियायती स्वास्थ्य सेवा",
        ayushmanDesc: "भारत की सबसे बड़ी सरकारी स्वास्थ्य योजना। सरकारी और निजी अस्पतालों में कैंसर, हार्ट सर्जरी और अंग प्रत्यारोपण जैसी गंभीर बीमारियों के लिए अस्पताल में भर्ती को कवर करती है।",
        whoIsEligible: "कौन पात्र है?",
        elig1: "ग्रामीण क्षेत्रों में बिना किसी मजबूत कमाने वाले सदस्य के परिवार",
        elig2: "विकलांग सदस्य वाले परिवार और कोई अन्य कामकाजी वयस्क नहीं",
        elig3: "70 वर्ष और उससे अधिक आयु के सभी वरिष्ठ नागरिक (आय की परवाह किए बिना)",
        elig4: "परिवार के आकार या लिंग पर कोई प्रतिबंध नहीं",
        checkEligibility: "पात्रता जांचें",
        helpline: "हेल्पलाइन: 14555",
        freeCoverage: "प्रति परिवार, प्रति वर्ष मुफ्त कवरेज",
        mostPopular: "सबसे लोकप्रिय",
        card1Desc: "सरकारी अस्पतालों में गर्भवती महिलाओं के लिए मुफ्त मातृ देखभाल और नकद सहायता",
        card2Desc: "गर्भवती और स्तनपान कराने वाली माताओं के लिए ₹5,000 नकद लाभ",
        card3Desc: "जेनेरिक दवाएं 50-90% कम कीमत पर — आस-पास के स्टोर खोजें",
        disclaimer: "यह जानकारी केवल जागरूकता के लिए है। योजना के विवरण बदल सकते हैं — कृपया आवेदन करने से पहले आधिकारिक सरकारी वेबसाइटों पर सत्यापित करें।"
      },
      mrw: {
        pageTitle: "सरकारी सेहत योजना",
        subtitle: "हर परिवार रे वास्ते मुफत और रियायती सेहत सेवा",
        ayushmanDesc: "भारत री सबसू बड़ी सरकारी सेहत योजना। सरकारी और प्राइवेट अस्पताल में कैंसर, हार्ट सर्जरी और अंग प्रत्यारोपण जिसी गंभीर बीमारियां रा इलाज ने कवर करे।",
        whoIsEligible: "कुण पात्र है?",
        elig1: "गांव रा वे परिवार जिणा में कोई मज़बूत कमावण वाळो नी है",
        elig2: "विकलांग सदस्य आळा परिवार और कोई दुजो कमावण आळो नी",
        elig3: "70 साल और उणसू माथे रा सगळा बुजुर्ग (कमाई री चिंता बिना)",
        elig4: "परिवार रा आकार या लिंग रो कोई बंधन नी",
        checkEligibility: "पात्रता देखो",
        helpline: "हेल्पलाइन: 14555",
        freeCoverage: "प्रति परिवार, हर साल मुफत कवरेज",
        mostPopular: "सबसू लोकप्रिय",
        card1Desc: "सरकारी अस्पताल में गर्भवती लुगायां वास्ते मुफत देखभाल और नकद सहायता",
        card2Desc: "गर्भवती और दूध पिलावण आळी माताओं वास्ते ₹5,000 नकद लाभ",
        card3Desc: "जेनेरिक दवाइयां 50-90% कम कीमत माथे — अड़ोस-पड़ोस रा स्टोर खोजो",
        disclaimer: "आ जानकारी खाली जागरूकता वास्ते है। योजना रा विवरण बदल सके है — कृपया आवेदन करण सू पेहली आधिकारिक सरकारी वेबसाइट माथे जांच लेवो।"
      },
      gu: {
        pageTitle: "સરકારી આરોગ્ય યોજનાઓ",
        subtitle: "દરેક પરિવાર માટે મફત અને સબસિડીવાળી આરોગ્યસંભાળ",
        ayushmanDesc: "ભારતની સૌથી મોટી સરકારી આરોગ્ય યોજના. સરકારી અને ખાનગી હોસ્પિટલોમાં કેન્સર, હાર્ટ સર્જરી અને અંગ પ્રત્યારોપણ સહિતની ગંભીર બીમારીઓ માટે હોસ્પિટલમાં દાખલ થવાને આવરી લે છે.",
        whoIsEligible: "કોણ પાત્ર છે?",
        elig1: "ગ્રામીણ વિસ્તારોમાં મજબૂત કમાતા સભ્ય વિનાના પરિવારો",
        elig2: "વિકલાંગ સભ્ય ધરાવતા પરિવારો અને અન્ય કોઈ કામ કરનાર પુખ્ત ન હોય",
        elig3: "70 વર્ષ અને તેથી વધુ વયના તમામ વરિષ્ઠ નાગરિકો (આવકને ધ્યાનમાં લીધા વિના)",
        elig4: "કુટુંબના કદ અથવા લિંગ પર કોઈ નિયંત્રણો નથી",
        checkEligibility: "પાત્રતા તપાસો",
        helpline: "હેલ્પલાઇન: 14555",
        freeCoverage: "કુટુંબ દીઠ, દર વર્ષે મફત કવરેજ",
        mostPopular: "સૌથી લોકપ્રિય",
        card1Desc: "સરકારી હોસ્પિટલોમાં સગર્ભા સ્ત્રીઓ માટે મફત પ્રસૂતિ સંભાળ અને રોકડ સહાય",
        card2Desc: "સગર્ભા અને સ્તનપાન કરાવતી માતાઓ માટે ₹5,000 રોકડ લાભ",
        card3Desc: "જેનરિક દવાઓ 50-90% ઓછી કિંમતે — નજીકના સ્ટોર્સ શોધો",
        disclaimer: "આ માહિતી માત્ર જાગૃતિ માટે છે. યોજનાની વિગતો બદલાઈ શકે છે — કૃપા કરીને અરજી કરતા પહેલા સત્તાવાર સરકારી વેબસાઇટ્સ પર ચકાસો."
      },
      mr: {
        pageTitle: "सरकारी आरोग्य योजना",
        subtitle: "प्रत्येक कुटुंबासाठी मोफत आणि सवलतीची आरोग्यसेवा",
        ayushmanDesc: "भारतातील सर्वात मोठी सरकारी आरोग्य योजना. सरकारी आणि खाजगी रुग्णालयांमध्ये कर्करोग, हृदय शस्त्रक्रिया आणि अवयव प्रत्यारोपणासह गंभीर आजारांसाठी रुग्णालयात दाखल करण्याचा खर्च कव्हर करते.",
        whoIsEligible: "पात्र कोण आहे?",
        elig1: "ग्रामीण भागातील कुटुंब ज्यांच्याकडे मजबूत कमावणारा सदस्य नाही",
        elig2: "अपंग सदस्य असलेली कुटुंबे आणि इतर कोणतेही काम करणारे प्रौढ नाहीत",
        elig3: "70 वर्षे आणि त्यावरील सर्व ज्येष्ठ नागरिक (उत्पन्नाची पर्वा न करता)",
        elig4: "कुटुंबाचा आकार किंवा लिंग याबाबत कोणतेही निर्बंध नाहीत",
        checkEligibility: "पात्रता तपासा",
        helpline: "हेल्पलाइन: 14555",
        freeCoverage: "प्रति कुटुंब, प्रति वर्ष मोफत कव्हरेज",
        mostPopular: "सर्वाधिक लोकप्रिय",
        card1Desc: "सरकारी रुग्णालयांमध्ये गर्भवती महिलांसाठी मोफत माता काळजी आणि रोख मदत",
        card2Desc: "गर्भवती आणि स्तनपान करणाऱ्या मातांसाठी ₹5,000 चा रोख लाभ",
        card3Desc: "जेनेरिक औषधे 50-90% कमी किमतीत — जवळची दुकाने शोधा",
        disclaimer: "ही माहिती केवळ जागरूकतेसाठी आहे. योजनेचे तपशील बदलू शकतात — कृपया अर्ज करण्यापूर्वी अधिकृत सरकारी वेबसाइटवर पडताळणी करा."
      },
      ta: {
        pageTitle: "அரசு சுகாதார திட்டங்கள்",
        subtitle: "ஒவ்வொரு குடும்பத்திற்கும் இலவச மற்றும் மானியத்துடன் கூடிய சுகாதாரம்",
        ayushmanDesc: "இந்தியாவின் மிகப்பெரிய அரசு சுகாதார திட்டம். அரசு மற்றும் தனியார் மருத்துவமனைகளில் புற்றுநோய், இதய அறுவை சிகிச்சை மற்றும் உறுப்பு மாற்று அறுவை சிகிச்சை உள்ளிட்ட தீவிர நோய்களுக்கான மருத்துவமனை செலவை உள்ளடக்கியது.",
        whoIsEligible: "யார் தகுதியானவர்?",
        elig1: "கிராமப்புறங்களில் வலுவாக சம்பாதிக்கும் உறுப்பினர் இல்லாத குடும்பங்கள்",
        elig2: "மாற்றுத்திறனாளி உறுப்பினர் உள்ள குடும்பங்கள் மற்றும் வேறு வேலை செய்யும் பெரியவர்கள் இல்லாதவர்கள்",
        elig3: "70 வயது மற்றும் அதற்கு மேற்பட்ட மூத்த குடிமக்கள் அனைவரும் (வருமானம் எதுவாக இருந்தாலும்)",
        elig4: "குடும்ப அளவு அல்லது பாலின கட்டுப்பாடுகள் இல்லை",
        checkEligibility: "தகுதியை சரிபார்க்கவும்",
        helpline: "ஹெல்ப்லைன்: 14555",
        freeCoverage: "ஒரு குடும்பத்திற்கு, ஆண்டுக்கு இலவச கவரேஜ்",
        mostPopular: "மிகவும் பிரபலமானவை",
        card1Desc: "அரசு மருத்துவமனைகளில் கர்ப்பிணிப் பெண்களுக்கு இலவச தாய்மைப் பராமரிப்பு மற்றும் பண உதவி",
        card2Desc: "கர்ப்பிணி மற்றும் பாலூட்டும் தாய்மார்களுக்கு ₹5,000 ரொக்கப் பலன்",
        card3Desc: "50-90% குறைந்த விலையில் ஜெனரிக் மருந்துகள் — அருகிலுள்ள கடைகளைக் கண்டறியவும்",
        disclaimer: "இந்தத் தகவல் விழிப்புணர்வுக்காக மட்டுமே. திட்ட விவரங்கள் மாறக்கூடும் — விண்ணப்பிப்பதற்கு முன் அதிகாரப்பூர்வ அரசு இணையதளங்களில் சரிபார்க்கவும்."
      },
      te: {
        pageTitle: "ప్రభుత్వ ఆరోగ్య పథకాలు",
        subtitle: "ప్రతి కుటుంబానికి ఉచిత మరియు రాయితీ ఆరోగ్య సంరక్షణ",
        ayushmanDesc: "భారతదేశం యొక్క అతిపెద్ద ప్రభుత్వ ఆరోగ్య పథకం. ప్రభుత్వ మరియు ప్రైవేట్ ఆసుపత్రులలో క్యాన్సర్, గుండె శస్త్రచికిత్స మరియు అవయవ మార్పిడి వంటి తీవ్రమైన వ్యాధులకు ఆసుపత్రి ఖర్చులను కవర్ చేస్తుంది.",
        whoIsEligible: "ఎవరు అర్హులు?",
        elig1: "గ్రామీణ ప్రాంతాల్లో బలంగా సంపాదించే సభ్యుడు లేని కుటుంబాలు",
        elig2: "వికలాంగ సభ్యుడు ఉన్న కుటుంబాలు మరియు ఇతర పనిచేసే పెద్దలు లేని వారు",
        elig3: "70 సంవత్సరాలు మరియు అంతకంటే ఎక్కువ వయస్సు ఉన్న సీనియర్ సిటిజన్లు అందరూ (ఆదాయంతో సంబంధం లేకుండా)",
        elig4: "కుటుంబ పరిమాణం లేదా లింగ పరిమితులు లేవు",
        checkEligibility: "అర్హత తనిఖీ చేయండి",
        helpline: "హెల్ప్‌లైన్: 14555",
        freeCoverage: "కుటుంబానికి, సంవత్సరానికి ఉచిత కవరేజ్",
        mostPopular: "అత్యంత జనాదరణ పొందినవి",
        card1Desc: "ప్రభుత్వ ఆసుపత్రులలో గర్భిణీ స్త్రీలకు ఉచిత ప్రసూతి సంరక్షణ మరియు నగదు సహాయం",
        card2Desc: "గర్భిణీ మరియు పాలిచ్చే తల్లులకు ₹5,000 నగదు ప్రయోజనం",
        card3Desc: "50-90% తక్కువ ధరలకు జనరిక్ మందులు — సమీపంలోని దుకాణాలను కనుగొనండి",
        disclaimer: "ఈ సమాచారం అవగాహన కోసం మాత్రమే. పథకం వివరాలు మారవచ్చు — దరఖాస్తు చేయడానికి ముందు దయచేసి అధికారిక ప్రభుత్వ వెబ్‌సైట్‌లలో ధృవీకరించండి."
      },
      pa: {
        pageTitle: "ਸਰਕਾਰੀ ਸਿਹਤ ਯੋਜਨਾਵਾਂ",
        subtitle: "ਹਰੇਕ ਪਰਿਵਾਰ ਲਈ ਮੁਫਤ ਅਤੇ ਸਬਸਿਡੀ ਵਾਲੀ ਸਿਹਤ ਸੰਭਾਲ",
        ayushmanDesc: "ਭਾਰਤ ਦੀ ਸਭ ਤੋਂ ਵੱਡੀ ਸਰਕਾਰੀ ਸਿਹਤ ਯੋਜਨਾ। ਸਰਕਾਰੀ ਅਤੇ ਪ੍ਰਾਈਵੇਟ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਕੈਂਸਰ, ਦਿਲ ਦੀ ਸਰਜਰੀ, ਅਤੇ ਅੰਗ ਬਦਲਣ ਸਮੇਤ ਗੰਭੀਰ ਬਿਮਾਰੀਆਂ ਲਈ ਹਸਪਤਾਲ ਦੇ ਖਰਚੇ ਨੂੰ ਕਵਰ ਕਰਦੀ ਹੈ।",
        whoIsEligible: "ਕੌਣ ਯੋਗ ਹੈ?",
        elig1: "ਪੇਂਡੂ ਖੇਤਰਾਂ ਵਿੱਚ ਮਜ਼ਬੂਤ ਕਮਾਉਣ ਵਾਲੇ ਮੈਂਬਰ ਤੋਂ ਬਿਨਾਂ ਪਰਿਵਾਰ",
        elig2: "ਅਪਾਹਜ ਮੈਂਬਰ ਵਾਲੇ ਪਰਿਵਾਰ ਅਤੇ ਕੋਈ ਹੋਰ ਕੰਮ ਕਰਨ ਵਾਲਾ ਬਾਲਗ ਨਹੀਂ",
        elig3: "70 ਸਾਲ ਅਤੇ ਇਸ ਤੋਂ ਵੱਧ ਉਮਰ ਦੇ ਸਾਰੇ ਸੀਨੀਅਰ ਨਾਗਰਿਕ (ਆਮਦਨ ਦੀ ਪਰਵਾਹ ਕੀਤੇ ਬਿਨਾਂ)",
        elig4: "ਪਰਿਵਾਰ ਦੇ ਆਕਾਰ ਜਾਂ ਲਿੰਗ 'ਤੇ ਕੋਈ ਪਾਬੰਦੀ ਨਹੀਂ",
        checkEligibility: "ਯੋਗਤਾ ਜਾਂਚੋ",
        helpline: "ਹੈਲਪਲਾਈਨ: 14555",
        freeCoverage: "ਪ੍ਰਤੀ ਪਰਿਵਾਰ, ਪ੍ਰਤੀ ਸਾਲ ਮੁਫਤ ਕਵਰੇਜ",
        mostPopular: "ਸਭ ਤੋਂ ਵੱਧ ਪ੍ਰਸਿੱਧ",
        card1Desc: "ਸਰਕਾਰੀ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਗਰਭਵਤੀ ਔਰਤਾਂ ਲਈ ਮੁਫਤ ਜਣੇਪਾ ਦੇਖਭਾਲ ਅਤੇ ਨਕਦ ਸਹਾਇਤਾ",
        card2Desc: "ਗਰਭਵਤੀ ਅਤੇ ਦੁੱਧ ਚੁੰਘਾਉਣ ਵਾਲੀਆਂ ਮਾਵਾਂ ਲਈ ₹5,000 ਦਾ ਨਕਦ ਲਾਭ",
        card3Desc: "ਜੈਨਰਿਕ ਦਵਾਈਆਂ 50-90% ਘੱਟ ਕੀਮਤ 'ਤੇ — ਨੇੜਲੇ ਸਟੋਰ ਲੱਭੋ",
        disclaimer: "ਇਹ ਜਾਣਕਾਰੀ ਸਿਰਫ਼ ਜਾਗਰੂਕਤਾ ਲਈ ਹੈ। ਯੋਜਨਾ ਦੇ ਵੇਰਵੇ ਬਦਲ ਸਕਦੇ ਹਨ — ਕਿਰਪਾ ਕਰਕੇ ਅਰਜ਼ੀ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਅਧਿਕਾਰਤ ਸਰਕਾਰੀ ਵੈੱਬਸਾਈਟਾਂ 'ਤੇ ਪੁਸ਼ਟੀ ਕਰੋ।"
      },
      bn: {
        pageTitle: "সরকারি স্বাস্থ্য প্রকল্প",
        subtitle: "প্রতিটি পরিবারের জন্য বিনামূল্যে এবং ভর্তুকিযুক্ত স্বাস্থ্যসেবা",
        ayushmanDesc: "ভারতের বৃহত্তম সরকারি স্বাস্থ্য প্রকল্প। সরকারি এবং বেসরকারি হাসপাতালে ক্যান্সার, হার্ট সার্জারি এবং অঙ্গ প্রতিস্থাপন সহ গুরুতর অসুস্থতার জন্য হাসপাতালে ভর্তির খরচ কভার করে।",
        whoIsEligible: "কারা যোগ্য?",
        elig1: "গ্রামীণ এলাকায় শক্তিশালী উপার্জনকারী সদস্য ছাড়া পরিবার",
        elig2: "প্রতিবন্ধী সদস্য সহ পরিবার এবং অন্য কোনও কর্মজীবী প্রাপ্তবয়স্ক নেই",
        elig3: "৭০ বছর এবং তদূর্ধ্ব বয়সী সমস্ত প্রবীণ নাগরিক (আয় নির্বিশেষে)",
        elig4: "পরিবারের আকার বা লিঙ্গের কোনও বিধিনিষেধ নেই",
        checkEligibility: "যোগ্যতা যাচাই করুন",
        helpline: "হেল্পলাইন: 14555",
        freeCoverage: "পরিবার পিছু, প্রতি বছর বিনামূল্যে কভারেজ",
        mostPopular: "সবচেয়ে জনপ্রিয়",
        card1Desc: "সরকারি হাসপাতালে গর্ভবতী মহিলাদের জন্য বিনামূল্যে মাতৃকালীন যত্ন এবং নগদ সহায়তা",
        card2Desc: "গর্ভবতী এবং স্তন্যদানকারী মায়েদের জন্য ₹৫,০০০ নগদ সুবিধা",
        card3Desc: "৫০-৯০% কম দামে জেনেরিক ওষুধ — কাছাকাছি দোকান খুঁজুন",
        disclaimer: "এই তথ্য শুধুমাত্র সচেতনতার জন্য। প্রকল্পের বিশদ পরিবর্তন হতে পারে — আবেদন করার আগে দয়া করে অফিসিয়াল সরকারি ওয়েবসাইটগুলিতে যাচাই করুন।"
      },
      kn: {
        pageTitle: "ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಯೋಜನೆಗಳು",
        subtitle: "ಪ್ರತಿ ಕುಟುಂಬಕ್ಕೂ ಉಚಿತ ಮತ್ತು ಸಬ್ಸಿಡಿ ಆರೋಗ್ಯ ರಕ್ಷಣೆ",
        ayushmanDesc: "ಭಾರತದ ಅತಿದೊಡ್ಡ ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಯೋಜನೆ. ಸರ್ಕಾರಿ ಮತ್ತು ಖಾಸಗಿ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಕ್ಯಾನ್ಸರ್, ಹೃದಯ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಮತ್ತು ಅಂಗ ಕಸಿ ಸೇರಿದಂತೆ ಗಂಭೀರ ಕಾಯಿಲೆಗಳಿಗೆ ಆಸ್ಪತ್ರೆ ವೆಚ್ಚವನ್ನು ಭರಿಸುತ್ತದೆ.",
        whoIsEligible: "ಯಾರು ಅರ್ಹರು?",
        elig1: "ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ಬಲವಾಗಿ ದುಡಿಯುವ ಸದಸ್ಯರಿಲ್ಲದ ಕುಟುಂಬಗಳು",
        elig2: "ವಿಕಲಚೇತನ ಸದಸ್ಯರಿರುವ ಕುಟುಂಬಗಳು ಮತ್ತು ಬೇರೆ ಯಾವುದೇ ದುಡಿಯುವ ವಯಸ್ಕರಿಲ್ಲದವರು",
        elig3: "70 ವರ್ಷ ಮತ್ತು ಮೇಲ್ಪಟ್ಟ ಎಲ್ಲಾ ಹಿರಿಯ ನಾಗರಿಕರು (ಆದಾಯವನ್ನು ಲೆಕ್ಕಿಸದೆ)",
        elig4: "ಕುಟುಂಬದ ಗಾತ್ರ ಅಥವಾ ಲಿಂಗದ ಯಾವುದೇ ನಿರ್ಬಂಧಗಳಿಲ್ಲ",
        checkEligibility: "ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ",
        helpline: "ಸಹಾಯವಾಣಿ: 14555",
        freeCoverage: "ಪ್ರತಿ ಕುಟುಂಬಕ್ಕೆ, ಪ್ರತಿ ವರ್ಷ ಉಚಿತ ಕವರೇಜ್",
        mostPopular: "ಅತ್ಯಂತ ಜನಪ್ರಿಯ",
        card1Desc: "ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಗರ್ಭಿಣಿಯರಿಗೆ ಉಚಿತ ತಾಯ್ತನದ ಆರೈಕೆ ಮತ್ತು ನಗದು ನೆರವು",
        card2Desc: "ಗರ್ಭಿಣಿ ಮತ್ತು ಹಾಲುಣಿಸುವ ತಾಯಂದಿರಿಗೆ ₹5,000 ನಗದು ಲಾಭ",
        card3Desc: "50-90% ಕಡಿಮೆ ಬೆಲೆಯಲ್ಲಿ ಜೆನೆರಿಕ್ ಔಷಧಗಳು — ಹತ್ತಿರದ ಮಳಿಗೆಗಳನ್ನು ಹುಡುಕಿ",
        disclaimer: "ಈ ಮಾಹಿತಿಯು ಕೇವಲ ಅರಿವಿಗಾಗಿ. ಯೋಜನೆಯ ವಿವರಗಳು ಬದಲಾಗಬಹುದು — ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ದಯವಿಟ್ಟು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಿ."
      },
      ml: {
        pageTitle: "സർക്കാർ ആരോഗ്യ പദ്ധതികൾ",
        subtitle: "ഓരോ കുടുംബത്തിനും സൗജന്യവും സബ്സിഡിയുള്ളതുമായ ആരോഗ്യപരിരക്ഷ",
        ayushmanDesc: "ഇന്ത്യയിലെ ഏറ്റവും വലിയ സർക്കാർ ആരോഗ്യ പദ്ധതി. സർക്കാർ, സ്വകാര്യ ആശുപത്രികളിൽ കാൻസർ, ഹൃദയ ശസ്ത്രക്രിയ, അവയവം മാറ്റിവയ്ക്കൽ എന്നിവയുൾപ്പെടെയുള്ള ഗുരുതരമായ രോഗങ്ങൾക്കുള്ള ആശുപത്രി വാസച്ചെലവ് പരിരക്ഷിക്കുന്നു.",
        whoIsEligible: "ആരാണ് യോഗ്യർ?",
        elig1: "ഗ്രാമപ്രദേശങ്ങളിൽ പ്രധാന വരുമാനമില്ലാത്ത കുടുംബങ്ങൾ",
        elig2: "വികലാംഗനായ ഒരു അംഗമുള്ള കുടുംബങ്ങളും ജോലി ചെയ്യുന്ന മറ്റ് മുതിർന്നവരില്ലാത്തവരും",
        elig3: "70 വയസ്സും അതിൽ കൂടുതലുമുള്ള എല്ലാ മുതിർന്ന പൗരന്മാരും (വരുമാനം പരിഗണിക്കാതെ)",
        elig4: "കുടുംബത്തിൻ്റെ വലുപ്പമോ ലിംഗപരമായ നിയന്ത്രണങ്ങളോ ഇല്ല",
        checkEligibility: "യോഗ്യത പരിശോധിക്കുക",
        helpline: "ഹെൽപ്പ്ലൈൻ: 14555",
        freeCoverage: "ഒരു കുടുംബത്തിന്, പ്രതിവർഷം സൗജന്യ കവറേജ്",
        mostPopular: "ഏറ്റവും ജനപ്രിയമായവ",
        card1Desc: "സർക്കാർ ആശുപത്രികളിൽ ഗർഭിണികൾക്ക് സൗജന്യ മാതൃ പരിചരണവും സാമ്പത്തിക സഹായവും",
        card2Desc: "ഗർഭിണികൾക്കും മുലയൂട്ടുന്ന അമ്മമാർക്കും ₹5,000 സാമ്പത്തിക ആനുകൂല്യം",
        card3Desc: "50-90% കുറഞ്ഞ വിലയിൽ ജനറിക് മരുന്നുകൾ — അടുത്തുള്ള കടകൾ കണ്ടെത്തുക",
        disclaimer: "ഈ വിവരങ്ങൾ അവബോധത്തിനായി മാത്രമുള്ളതാണ്. പദ്ധതിയുടെ വിശദാംശങ്ങൾ മാറിയേക്കാം — അപേക്ഷിക്കുന്നതിന് മുമ്പ് ഔദ്യോഗിക സർക്കാർ വെബ്‌സൈറ്റുകളിൽ പരിശോധിക്കുക."
      },
      as: {
        pageTitle: "চৰকাৰী স্বাস্থ্য আঁচনি",
        subtitle: "প্ৰতিটো পৰিয়ালৰ বাবে বিনামূলীয়া আৰু ৰাজসাহায্যপ্ৰাপ্ত স্বাস্থ্যসেৱা",
        ayushmanDesc: "ভাৰতৰ আটাইতকৈ ডাঙৰ চৰকাৰী স্বাস্থ্য আঁচনি। চৰকাৰী আৰু ব্যক্তিগত চিকিৎসালয়ত কৰ্কট ৰোগ, হৃদযন্ত্ৰৰ অস্ত্ৰোপচাৰ, আৰু অংগ সংৰোপণকে ধৰি গুৰুতৰ ৰোগৰ বাবে চিকিৎসালয়ত ভৰ্তি হোৱাৰ খৰচ বহন কৰে।",
        whoIsEligible: "কোন যোগ্য?",
        elig1: "গ্ৰামাঞ্চলত উপাৰ্জনকাৰী সদস্য নথকা পৰিয়াল",
        elig2: "বিশেষভাৱে সক্ষম সদস্য থকা পৰিয়াল আৰু অন্য কোনো কৰ্মৰত প্ৰাপ্তবয়স্ক নাই",
        elig3: "৭০ বছৰ আৰু তাৰ উৰ্ধৰ সকলো জ্যেষ্ঠ নাগৰিক (উপাৰ্জন নিৰ্বিশেষে)",
        elig4: "পৰিয়ালৰ আকাৰ বা লিংগৰ কোনো বাধা নাই",
        checkEligibility: "যোগ্যতা পৰীক্ষা কৰক",
        helpline: "হেল্পলাইন: 14555",
        freeCoverage: "প্ৰতি পৰিয়ালত, প্ৰতি বছৰে বিনামূলীয়া কভাৰেজ",
        mostPopular: "আটাইতকৈ জনপ্ৰিয়",
        card1Desc: "চৰকাৰী চিকিৎসালয়ত গৰ্ভৱতী মহিলাৰ বাবে বিনামূলীয়া মাতৃ যত্ন আৰু নগদ ধনৰ সাহায্য",
        card2Desc: "গৰ্ভৱতী আৰু স্তনপান কৰোৱা মাতৃৰ বাবে ₹৫,০০০ নগদ লাভালাভ",
        card3Desc: "৫০-৯০% কম দামত জেনেৰিক ঔষধ — ওচৰৰ দোকান বিচাৰক",
        disclaimer: "এই তথ্য কেৱল সজাগতাৰ বাবেহে। আঁচনিৰ বিৱৰণ সলনি হ'ব পাৰে — অনুগ্ৰহ কৰি আবেদন কৰাৰ আগতে চৰকাৰী ৱেবছাইটত পৰীক্ষা কৰক।"
      }
    };
    const t = translations[language] || translations.en;
    return t[key];
  };

  return (
    <div style={{ background: '#F1F8F1', minHeight: '100vh', padding: '20px', fontFamily: "system-ui, 'Segoe UI', Arial, sans-serif" }}>
      <button 
        onClick={() => navigate('/landing')}
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

      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        {/* MAIN SCHEME CARD: Ayushman Bharat PM-JAY */}
        <div style={{
          background: 'white',
          border: '2px solid #00695C',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🏥</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#00695C' }}>Ayushman Bharat – PM-JAY</span>
            </div>
            <span style={{
              background: '#E0F2F1',
              color: '#00695C',
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '4px 12px',
              borderRadius: '20px'
            }}>
              {getTranslation('mostPopular')}
            </span>
          </div>

          <div style={{
            background: '#E0F2F1',
            borderRadius: '12px',
            padding: '16px',
            margin: '12px 0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00695C' }}>₹5,00,000</div>
            <div style={{ fontSize: '13px', color: '#004D40', marginTop: '4px' }}>{getTranslation('freeCoverage')}</div>
          </div>

          <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.5', margin: '16px 0' }}>
            {getTranslation('ayushmanDesc')}
          </p>

          <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1A1A1A', margin: '20px 0 10px 0' }}>
            {getTranslation('whoIsEligible')}
          </h4>
          <ul style={{ paddingLeft: '20px', margin: '0 0 24px 0', color: '#333', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>{getTranslation('elig1')}</li>
            <li>{getTranslation('elig2')}</li>
            <li>{getTranslation('elig3')}</li>
            <li>{getTranslation('elig4')}</li>
          </ul>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => window.open('https://beneficiary.nha.gov.in', '_blank')}
              style={{
                flex: 1,
                background: '#00695C',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {getTranslation('checkEligibility')}
            </button>
            <button
              onClick={() => window.location.href = 'tel:14555'}
              style={{
                flex: 1,
                background: 'white',
                color: '#00695C',
                border: '1.5px solid #00695C',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {getTranslation('helpline')}
            </button>
          </div>
        </div>

        {/* SECONDARY SCHEMES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {/* Card 1 */}
          <div style={{
            background: 'white', border: '1px solid #E0E0E0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{ fontSize: '28px' }}>🤰</div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '4px' }}>Janani Suraksha Yojana</div>
              <div style={{ fontSize: '13px', color: '#555' }}>{getTranslation('card1Desc')}</div>
            </div>
          </div>

          {/* Card 2 */}
          <div style={{
            background: 'white', border: '1px solid #E0E0E0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{ fontSize: '28px' }}>👶</div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '4px' }}>Pradhan Mantri Matru Vandana Yojana</div>
              <div style={{ fontSize: '13px', color: '#555' }}>{getTranslation('card2Desc')}</div>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => window.open('https://janaushadhi.gov.in', '_blank')}
            style={{
              background: 'white', border: '1px solid #E0E0E0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '28px' }}>💊</div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '4px' }}>Jan Aushadhi Kendra</div>
              <div style={{ fontSize: '13px', color: '#555' }}>{getTranslation('card3Desc')}</div>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div style={{
          background: '#EAEAEA',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '11px',
          color: '#888',
          textAlign: 'center'
        }}>
          {getTranslation('disclaimer')}
        </div>
      </div>
    </div>
  );
};

export default GovtSchemes;
