import re
import json

file_path = r'c:\Users\DELL\Desktop\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\src\translations\translations.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

raw_symptoms = {
  "fever": {
    "hi": "बुखार", "en": "Fever", "gu": "તાવ", "mr": "ताप",
    "ta": "காய்ச்சல்", "te": "జ్వరం", "pa": "ਬੁਖਾਰ", "bn": "জ্বর",
    "kn": "ಜ್ವರ", "ml": "പനി", "mw": "बुखार", "as": "জ্বৰ",
    "or": "ଜ୍ୱର", "nm": "Bukhaar"
  },
  "headache": {
    "hi": "सिर दर्द", "en": "Headache", "gu": "માથાનો દુખાવો",
    "mr": "डोकेदुखी", "ta": "தலைவலி", "te": "తలనొప్పి",
    "pa": "ਸਿਰ ਦਰਦ", "bn": "মাথাব্যথা", "kn": "ತಲೆನೋವು",
    "ml": "തലവേദന", "mw": "सिर दर्द", "as": "মূৰৰ বিষ",
    "or": "ମୁଣ୍ଡ ବିନ୍ଧା", "nm": "Sar dard"
  },
  "cough": {
    "hi": "खांसी", "en": "Cough", "gu": "ઉધરસ", "mr": "खोकला",
    "ta": "இருமல்", "te": "దగ్గు", "pa": "ਖੰਘ", "bn": "কাশি",
    "kn": "ಕೆಮ್ಮು", "ml": "ചുമ", "mw": "खांसी", "as": "কাহ",
    "or": "କାଶ", "nm": "Khansi"
  },
  "body_ache": {
    "hi": "बदन दर्द", "en": "Body Ache", "gu": "શરીરનો દુખાવો",
    "mr": "अंगदुखी", "ta": "உடல் வலி", "te": "శరీర నొప్పి",
    "pa": "ਸਰੀਰ ਦਰਦ", "bn": "শরীর ব্যথা", "kn": "ಮೈ ನೋವು",
    "ml": "ദേഹവേദന", "mw": "बदन दर्द", "as": "গা বিষ",
    "or": "ଶରୀର ଯନ୍ତ୍ରଣା", "nm": "Badan dard"
  },
  "fatigue": {
    "hi": "थकान", "en": "Fatigue", "gu": "થાક", "mr": "थकवा",
    "ta": "சோர்வு", "te": "అలసట", "pa": "ਥਕਾਵਟ", "bn": "ক্লান্তি",
    "kn": "ಆಯಾಸ", "ml": "ക്ഷീണം", "mw": "थकान", "as": "ভাগৰ",
    "or": "ଥକାପଣ", "nm": "Thakaan"
  },
  "nausea": {
    "hi": "जी मिचलाना", "en": "Nausea", "gu": "ઉબકા", "mr": "मळमळ",
    "ta": "குமட்டல்", "te": "వికారం", "pa": "ਮਤਲੀ", "bn": "বমি বমি ভাব",
    "kn": "ವಾಕರಿಕೆ", "ml": "ഓക്കാനം", "mw": "जी मिचलाणो",
    "as": "বমি বমি ভাব", "or": "ବାନ୍ତି ଭାବ", "nm": "Ji michlaana"
  },
  "vomiting": {
    "hi": "उल्टी", "en": "Vomiting", "gu": "ઉલ્ટી", "mr": "उलटी",
    "ta": "வாந்தி", "te": "వాంతి", "pa": "ਉਲਟੀ", "bn": "বমি",
    "kn": "ವಾಂತಿ", "ml": "ഛർദ്ദി", "mw": "उल्टी", "as": "বমি",
    "or": "ବାନ୍ତି", "nm": "Ulti"
  },
  "diarrhea": {
    "hi": "दस्त", "en": "Diarrhea", "gu": "ઝાડા", "mr": "जुलाब",
    "ta": "வயிற்றுப்போக்கு", "te": "విరేచనాలు", "pa": "ਦਸਤ",
    "bn": "ডায়রিয়া", "kn": "ಅತಿಸಾರ", "ml": "വയറിളക്കം",
    "mw": "दस्त", "as": "পেটচলা", "or": "ତରଳ ଝାଡ଼ା", "nm": "Dast"
  },
  "chest_pain": {
    "hi": "सीने में दर्द", "en": "Chest Pain", "gu": "છાતીનો દુખાવો",
    "mr": "छातीत दुखणे", "ta": "மார்பு வலி", "te": "ఛాతీ నొప్పి",
    "pa": "ਛਾਤੀ ਦਰਦ", "bn": "বুকে ব্যথা", "kn": "ಎದೆ ನೋವು",
    "ml": "നെഞ്ചുവേദന", "mw": "छाती में दर्द", "as": "বুকৰ বিষ",
    "or": "ବୁକ ଯନ୍ତ୍ରଣା", "nm": "Seene mein dard"
  },
  "breathing_difficulty": {
    "hi": "सांस लेने में तकलीफ", "en": "Breathing Difficulty",
    "gu": "શ્વાસ લેવામાં તકલીફ", "mr": "श्वास घेण्यास त्रास",
    "ta": "மூச்சு திணறல்", "te": "శ్వాస తీసుకోవడం కష్టం",
    "pa": "ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ", "bn": "শ্বাস নিতে কষ্ট",
    "kn": "ಉಸಿರಾಟ ತೊಂದರೆ", "ml": "ശ്വാസം എടുക്കാൻ ബുദ്ധിമുട്ട്",
    "mw": "सांस लेण में तकलीफ", "as": "উশাহ লোৱাত কষ্ট",
    "or": "ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ", "nm": "Saans lene mein takleef"
  },
  "stomach_pain": {
    "hi": "पेट दर्द", "en": "Stomach Pain", "gu": "પેટનો દુખાવો",
    "mr": "पोटदुखी", "ta": "வயிற்று வலி", "te": "కడుపు నొప్పి",
    "pa": "ਪੇਟ ਦਰਦ", "bn": "পেটে ব্যথা", "kn": "ಹೊಟ್ಟೆ ನೋವು",
    "ml": "വയറുവേദന", "mw": "पेट दर्द", "as": "পেটৰ বিষ",
    "or": "ପେଟ ଯନ୍ତ୍ରଣା", "nm": "Pet dard"
  },
  "skin_rash": {
    "hi": "त्वचा पर दाने", "en": "Skin Rash", "gu": "ચામડી પર ફોલ્લી",
    "mr": "त्वचेवर पुरळ", "ta": "தோல் வெடிப்பு", "te": "చర్మం మీద దద్దుర్లు",
    "pa": "ਚਮੜੀ ਤੇ ਧੱਫੜ", "bn": "ত্বকে ফুসকুড়ি", "kn": "ಚರ್ಮದ ಮೇಲೆ ದದ್ದು",
    "ml": "ചർമ്മത്തിൽ തടിപ്പ്", "mw": "चमड़ी पर दाणे", "as": "ছালত খজুৱতি",
    "or": "ଚର୍ମରେ ଦାଗ", "nm": "Charham mein daane"
  }
}

error_analyze = {
  "hi": "जांच में दिक्कत हुई, फिर कोशिश करें",
  "en": "Analysis failed, please try again",
  "gu": "તપાસમાં મુશ્કેલી, ફરી પ્રયાસ કરો",
  "mr": "तपासणीत अडचण, पुन्हा प्रयत्न करा",
  "ta": "பகுப்பாய்வு தோல்வியடைந்தது, மீண்டும் முயற்சிக்கவும்",
  "te": "విశ్లేషణ విఫలమైంది, మళ్ళీ ప్రయత్నించండి",
  "pa": "ਜਾਂਚ ਵਿੱਚ ਮੁਸ਼ਕਲ, ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
  "bn": "বিশ্লেষণ ব্যর্থ হয়েছে, আবার চেষ্টা করুন",
  "kn": "ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಯಿತು, ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
  "ml": "വിശകലനം പരാജയപ്പെട്ടു, വീണ്ടും ശ്രമിക്കൂ",
  "mw": "जांच में दिक्कत, फिर कोशिश करो",
  "as": "বিশ্লেষণ বিফল হ'ল, পুনৰ চেষ্টা কৰক",
  "or": "ବିଶ୍ଲେଷଣ ବିଫଳ, ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ",
  "nm": "Jaanch mein dikkat, dobara try karo"
}

langs = ['hi', 'en', 'gu', 'mr', 'ta', 'te', 'pa', 'bn', 'kn', 'ml', 'mw', 'as', 'or', 'nm']

for lang in langs:
    pattern = re.compile(r'(^[ \t]*' + lang + r'[ \t]*:[ \t]*{.*?)(^[ \t]*sympSearch:[ \t]*".*?",)', re.MULTILINE | re.DOTALL)
    match = pattern.search(content)
    if match:
        # Build symptomNames object for this lang
        s_obj = "{\n"
        for sym_key, translations in raw_symptoms.items():
            val = translations.get(lang, translations['en']).replace('"', '\\"')
            s_obj += f'      {sym_key}: "{val}",\n'
        s_obj += "    }"
        
        err_val = error_analyze.get(lang, error_analyze['en']).replace('"', '\\"')
        
        insert_str = f'\n    sympErrorAnalyze: "{err_val}",\n    symptomNames: {s_obj},\n'
        content = content[:match.end(1)] + insert_str + content[match.end(1):]
    else:
        print(f"Could not find block for {lang}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Translations patched successfully.")
