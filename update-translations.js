const fs = require('fs');
let content = fs.readFileSync('src/translations/translations.js', 'utf8');

const newKeys = {
  newPatientRequests: {
    en: 'New Patient Requests',
    hi: 'नए मरीज के अनुरोध',
    mw: 'नवा मरीज के अनुरोध',
    gu: 'નવા દર્દીની વિનંતીઓ',
    mr: 'नवीन रुग्णांच्या विनंत्या',
    ta: 'புதிய நோயாளிகளின் கோரிக்கைகள்',
    te: 'కొత్త రోగుల అభ్యర్థనలు',
    pa: 'ਨਵੇਂ ਮਰੀਜ਼ ਦੀਆਂ ਬੇਨਤੀਆਂ',
    bn: 'নতুন রোগীর অনুরোধ',
    kn: 'ಹೊಸ ರೋಗಿಯ ವಿನಂತಿಗಳು',
    ml: 'പുതിയ രോഗികളുടെ അഭ്യർത്ഥനകൾ',
    as: 'নতুন ৰোগীৰ অনুৰোধ',
    or: 'ନୂତନ ରୋଗୀ ଅନୁରୋଧ',
    nm: 'New Patient Requests'
  },
  todaysAppointments: {
    en: "Today's Appointments",
    hi: 'आज के अपॉइंटमेंट',
    mw: 'आज के अपॉइंटमेंट',
    gu: 'આજની એપોઇન્ટમેન્ટ્સ',
    mr: 'आजच्या भेटी',
    ta: 'இன்றைய நியமனங்கள்',
    te: 'నేటి అపాయింట్‌మెంట్లు',
    pa: 'ਅੱਜ ਦੀਆਂ ਮੁਲਾਕਾਤਾਂ',
    bn: 'আজকের অ্যাপয়েন্টমেন্ট',
    kn: 'ಇಂದಿನ ನೇಮಕಾತಿಗಳು',
    ml: 'ഇന്നത്തെ അപ്പോയിന്റ്മെന്റുകൾ',
    as: 'আজিৰ নিযুক্তি',
    or: 'ଆଜିର ନିଯୁକ୍ତି',
    nm: "Today's Appointments"
  },
  profileSettings: {
    en: 'Profile & Settings',
    hi: 'प्रोफ़ाइल और सेटिंग्स',
    mw: 'प्रोफ़ाइल और सेटिंग्स',
    gu: 'પ્રોફાઇલ અને સેટિંગ્સ',
    mr: 'प्रोफाइल आणि सेटिंग्ज',
    ta: 'சுயவிவரம் மற்றும் அமைப்புகள்',
    te: 'ప్రొఫైల్ & సెట్టింగ్‌లు',
    pa: 'ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸੈਟਿੰਗਾਂ',
    bn: 'প্রোফাইল এবং সেটিংস',
    kn: 'ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    ml: 'പ്രൊഫൈലും ക്രമീകരണങ്ങളും',
    as: 'প্ৰফাইল আৰু ছেটিংছ',
    or: 'ପ୍ରୋଫାଇଲ୍ ଏବଂ ସେଟିଂସମୂହ |',
    nm: 'Profile & Settings'
  }
};

let replacement = '';
for (const [key, langs] of Object.entries(newKeys)) {
  replacement += `  ${key}: {\n`;
  for (const [lang, text] of Object.entries(langs)) {
    replacement += `    ${lang}: '${text.replace(/'/g, "\\'")}',\n`;
  }
  replacement += '  },\n';
}

content = content.replace('export const TRANSLATIONS = {', 'export const TRANSLATIONS = {\n' + replacement);
fs.writeFileSync('src/translations/translations.js', content);
