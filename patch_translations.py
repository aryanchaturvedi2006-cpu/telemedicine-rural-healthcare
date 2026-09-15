import re
import json

file_path = r'c:\Users\DELL\Desktop\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\src\translations\translations.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_keys = {
    'hi': {
        'sympVoiceLabel': '🎤 बोलकर अपनी तकलीफ बताएं',
        'sympCommonLabel': 'सामान्य लक्षण — इनमें से चुनें',
        'sympMinWarning': '⚠️ सटीक परिणाम के लिए कम से कम 3 लक्षण चुनें'
    },
    'en': {
        'sympVoiceLabel': '🎤 Speak your symptoms',
        'sympCommonLabel': 'Common symptoms — tap to select',
        'sympMinWarning': '⚠️ Select at least 3 symptoms for accurate results'
    },
    'gu': {
        'sympVoiceLabel': '🎤 બોલીને તમારી તકલીફ જણાવો',
        'sympCommonLabel': 'સામાન્ય લક્ષણ — ટેપ કરીને પસંદ કરો',
        'sympMinWarning': '⚠️ સચોટ પરિણામ માટે ઓછામાં ઓછા 3 લક્ષણ પસંદ કરો'
    },
    'mr': {
        'sympVoiceLabel': '🎤 बोलून तुमची तक्रार सांगा',
        'sympCommonLabel': 'सामान्य लक्षणे — निवडा',
        'sympMinWarning': '⚠️ अचूक निकालासाठी किमान 3 लक्षणे निवडा'
    },
    'ta': {
        'sympVoiceLabel': '🎤 பேசி உங்கள் அறிகுறிகள் சொல்லுங்கள்',
        'sympCommonLabel': 'பொதுவான அறிகுறிகள் — தேர்ந்தெடுக்கவும்',
        'sympMinWarning': '⚠️ துல்லியமான முடிவுக்கு குறைந்தது 3 அறிகுறிகள் தேர்ந்தெடுக்கவும்'
    },
    'te': {
        'sympVoiceLabel': '🎤 మాట్లాడి మీ లక్షణాలు చెప్పండి',
        'sympCommonLabel': 'సాధారణ లక్షణాలు — నొక్కి ఎంచుకోండి',
        'sympMinWarning': '⚠️ ఖచ్చితమైన ఫలితానికి కనీసం 3 లక్షణాలు ఎంచుకోండి'
    },
    'pa': {
        'sympVoiceLabel': '🎤 ਬੋਲ ਕੇ ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ',
        'sympCommonLabel': 'ਆਮ ਲੱਛਣ — ਚੁਣੋ',
        'sympMinWarning': '⚠️ ਸਹੀ ਨਤੀਜੇ ਲਈ ਘੱਟੋ-ਘੱਟ 3 ਲੱਛਣ ਚੁਣੋ'
    },
    'bn': {
        'sympVoiceLabel': '🎤 বলে আপনার উপসর্গ জানান',
        'sympCommonLabel': 'সাধারণ উপসর্গ — বেছে নিন',
        'sympMinWarning': '⚠️ সঠিক ফলাফলের জন্য কমপক্ষে ৩টি উপসর্গ বেছে নিন'
    },
    'kn': {
        'sympVoiceLabel': '🎤 ಮಾತಾಡಿ ನಿಮ್ಮ ಲಕ್ಷಣಗಳು ಹೇಳಿ',
        'sympCommonLabel': 'ಸಾಮಾನ್ಯ ರೋಗಲಕ್ಷಣ — ಆಯ್ಕೆ ಮಾಡಿ',
        'sympMinWarning': '⚠️ ನಿಖರ ಫಲಿತಾಂಶಕ್ಕೆ ಕನಿಷ್ಠ 3 ರೋಗಲಕ್ಷಣ ಆಯ್ಕೆ ಮಾಡಿ'
    },
    'ml': {
        'sympVoiceLabel': '🎤 പറഞ്ഞ് നിങ്ങളുടെ ലക്ഷണങ്ങൾ അറിയിക്കൂ',
        'sympCommonLabel': 'സാധാരണ ലക്ഷണങ്ങൾ — തിരഞ്ഞെടുക്കൂ',
        'sympMinWarning': '⚠️ കൃത്യമായ ഫലത്തിന് കുറഞ്ഞത് 3 ലക്ഷണങ്ങൾ തിരഞ്ഞെടുക്കൂ'
    },
    'mw': {
        'sympVoiceLabel': '🎤 बोलकर आपरी तकलीफ बताओ',
        'sympCommonLabel': 'सामान्य लखण — चुणो',
        'sympMinWarning': '⚠️ सटीक नतीजे वास्ते कम से कम 3 लखण चुणो'
    },
    'as': {
        'sympVoiceLabel': '🎤 কৈ আপোনাৰ লক্ষণ জনাওক',
        'sympCommonLabel': 'সাধাৰণ লক্ষণ — বাছক',
        'sympMinWarning': '⚠️ সঠিক ফলাফলৰ বাবে কমেও 3 টা লক্ষণ বাছক'
    },
    'or': {
        'sympVoiceLabel': '🎤 କହି ଆପଣଙ୍କ ଲକ୍ଷଣ ଜଣାନ୍ତୁ',
        'sympCommonLabel': 'ସାଧାରଣ ଲକ୍ଷଣ — ବାଛନ୍ତୁ',
        'sympMinWarning': '⚠️ ସଠିକ୍ ଫଳ ପାଇଁ ଅତିକମ୍ 3 ଟି ଲକ୍ଷଣ ବାଛନ୍ତୁ'
    },
    'nm': {
        'sympVoiceLabel': '🎤 Bolke apni takleef batao',
        'sympCommonLabel': 'Common symptom — chuniye',
        'sympMinWarning': '⚠️ Sahi result laagi kam se kam 3 symptom chuniye'
    }
}

for lang, keys in new_keys.items():
    pattern = re.compile(r'(^[ \t]*' + lang + r'[ \t]*:[ \t]*{.*?)(^[ \t]*sympSearch:[ \t]*".*?",)', re.MULTILINE | re.DOTALL)
    match = pattern.search(content)
    if match:
        insert_str = f'\n    sympVoiceLabel: "{keys["sympVoiceLabel"]}",\n    sympCommonLabel: "{keys["sympCommonLabel"]}",\n    sympMinWarning: "{keys["sympMinWarning"]}",\n'
        content = content[:match.end(1)] + insert_str + content[match.end(1):]
    else:
        print(f"Could not find block for {lang}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Translations updated successfully.")
