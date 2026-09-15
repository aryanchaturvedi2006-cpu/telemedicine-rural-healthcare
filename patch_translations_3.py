import re
import json

file_path = r'c:\Users\DELL\Desktop\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\src\translations\translations.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_keys = {
  "sympPredictedDisease": {
    "hi": "संभावित बीमारी", "en": "Predicted Disease",
    "gu": "અનુમાનિત બીમારી", "mr": "अनुमानित आजार",
    "ta": "கணிக்கப்பட்ட நோய்", "te": "అంచనా వేసిన వ్యాధి",
    "pa": "ਅਨੁਮਾਨਿਤ ਬਿਮਾਰੀ", "bn": "অনুমানিত রোগ",
    "kn": "ಅಂದಾಜು ರೋಗ", "ml": "പ്രവചിക്കപ്പെട്ട രോഗം",
    "mw": "संभावित बीमारी", "as": "অনুমানিত ৰোগ",
    "or": "ଅନୁମାନିତ ରୋଗ", "nm": "Possible bimari"
  },
  "sympConfidence": {
    "hi": "विश्वसनीयता", "en": "Confidence",
    "gu": "વિશ્વાસ", "mr": "विश्वासार्हता",
    "ta": "நம்பகத்தன்மை", "te": "విశ్వాసం",
    "pa": "ਭਰੋਸੇਯੋਗਤਾ", "bn": "আস্থা",
    "kn": "ವಿಶ್ವಾಸಾರ್ಹತೆ", "ml": "വിശ്വാസ്യത",
    "mw": "भरोसो", "as": "বিশ্বাসযোগ্যতা",
    "or": "ବିଶ୍ୱାସଯୋଗ୍ୟତା", "nm": "Bharosa"
  },
  "sympDescription": {
    "hi": "विवरण", "en": "Description",
    "gu": "વિવરણ", "mr": "वर्णन",
    "ta": "விளக்கம்", "te": "వివరణ",
    "pa": "ਵੇਰਵਾ", "bn": "বিবরণ",
    "kn": "ವಿವರಣೆ", "ml": "വിവരണം",
    "mw": "विवरण", "as": "বিৱৰণ",
    "or": "ବିବରଣ", "nm": "Vivran"
  },
  "sympPrecautions": {
    "hi": "🛡️ सावधानियां और उपाय", "en": "🛡️ Precautions & Remedies",
    "gu": "🛡️ સાવચેતી અને ઉપાય", "mr": "🛡️ खबरदारी आणि उपाय",
    "ta": "🛡️ முன்னெச்சரிக்கை மற்றும் தீர்வுகள்",
    "te": "🛡️ జాగ్రత్తలు మరియు నివారణలు",
    "pa": "🛡️ ਸਾਵਧਾਨੀਆਂ ਅਤੇ ਉਪਾਅ", "bn": "🛡️ সতর্কতা ও প্রতিকার",
    "kn": "🛡️ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಪರಿಹಾರಗಳು",
    "ml": "🛡️ മുൻകരുതലുകളും പ്രതിവിധികളും",
    "mw": "🛡️ सावधानी अर उपाय", "as": "🛡️ সাৱধানতা আৰু উপায়",
    "or": "🛡️ ସତର୍କତା ଓ ଉପାୟ", "nm": "🛡️ Sawdhani ar Ilaaj"
  },
  "sympRecommendedDoc": {
    "hi": "अनुशंसित विशेषज्ञ", "en": "Recommended Specialist",
    "gu": "ભલામણ કરેલ નિષ્ણાત", "mr": "शिफारस केलेले तज्ञ",
    "ta": "பரிந்துரைக்கப்பட்ட நிபுணர்",
    "te": "సిఫార్సు చేయబడిన నిపుణుడు",
    "pa": "ਸਿਫਾਰਿਸ਼ ਕੀਤਾ ਮਾਹਰ", "bn": "প্রস্তাবিত বিশেষজ্ঞ",
    "kn": "ಶಿಫಾರಸು ಮಾಡಿದ ತಜ್ಞ", "ml": "ശുപാർശ ചെയ്ത വിദഗ്ധൻ",
    "mw": "सुझायो विशेषज्ञ", "as": "পৰামৰ্শ দিয়া বিশেষজ্ঞ",
    "or": "ପ୍ରସ୍ତାବିତ ବିଶେଷଜ୍ଞ", "nm": "Suggested Doctor"
  },
  "sympBookDoctor": {
    "hi": "📅 इस डॉक्टर से मिलें", "en": "📅 Book this Doctor",
    "gu": "📅 આ ડૉક્ટરને મળો", "mr": "📅 या डॉक्टरांना भेटा",
    "ta": "📅 இந்த மருத்துவரை சந்திக்கவும்",
    "te": "📅 ఈ డాక్టర్ను బుక్ చేయండి",
    "pa": "📅 ਇਸ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ", "bn": "📅 এই ডাক্তার বুক করুন",
    "kn": "📅 ಈ ಡಾಕ್ಟರ್ ಅನ್ನು ಭೇಟಿ ಮಾಡಿ",
    "ml": "📅 ഈ ഡോക്ടറെ കാണൂ",
    "mw": "📅 इण डॉक्टर सूं मिलो", "as": "📅 এই ডাক্তাৰক লগ কৰক",
    "or": "📅 ଏହି ଡାକ୍ତରଙ୍କୁ ଭେଟନ୍ତୁ", "nm": "📅 Is doctor se milo"
  },
  "sympReset": {
    "hi": "🔄 फिर से करें", "en": "🔄 Reset",
    "gu": "🔄 ફરીથી કરો", "mr": "🔄 पुन्हा करा",
    "ta": "🔄 மீட்டமை", "te": "🔄 రీసెట్ చేయండి",
    "pa": "🔄 ਦੁਬਾਰਾ ਕਰੋ", "bn": "🔄 আবার করুন",
    "kn": "🔄 ಮರುಹೊಂದಿಸಿ", "ml": "🔄 പുനഃക്രമീകരിക്കൂ",
    "mw": "🔄 फिर करो", "as": "🔄 পুনৰ কৰক",
    "or": "🔄 ପୁଣି କରନ୍ତୁ", "nm": "🔄 Dobara karo"
  }
}

langs = ['hi', 'en', 'gu', 'mr', 'ta', 'te', 'pa', 'bn', 'kn', 'ml', 'mw', 'as', 'or', 'nm']

for lang in langs:
    pattern = re.compile(r'(^[ \t]*' + lang + r'[ \t]*:[ \t]*{.*?)(^[ \t]*sympSearch:[ \t]*".*?",)', re.MULTILINE | re.DOTALL)
    match = pattern.search(content)
    if match:
        insert_str = ""
        for k, v_dict in new_keys.items():
            val = v_dict.get(lang, v_dict['en']).replace('"', '\\"')
            insert_str += f'    {k}: "{val}",\n'
        content = content[:match.end(1)] + "\n" + insert_str + content[match.end(1):]
    else:
        print(f"Could not find block for {lang}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Translations patched successfully.")
