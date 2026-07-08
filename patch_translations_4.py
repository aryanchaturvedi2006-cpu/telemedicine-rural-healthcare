import re
import json

file_path = r'c:\Users\DELL\Desktop\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\src\translations\translations.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_keys = {
  "sympFreeInfo": {
    "hi": "💊 जैसा आप महसूस कर रहे हैं वैसे लक्षण चुनें — हम बताएंगे आपको कौन सी बीमारी है, बिल्कुल मुफ्त! (4-5 लक्षण चुनने पर सटीक परिणाम मिलेगा)",
    "en": "💊 Select symptoms as you feel — we'll tell you which illness you have, completely free! (Select 4-5 symptoms for accurate results)",
    "gu": "💊 જેવું તમને લાગે છે તેવા લક્ષણ પસંદ કરો — અમે જણાવીશું તમને કઈ બીમારી છે, બિલ્કુલ મફત! (4-5 લક્ષણ પસંદ કરવાથી સચોટ પરિણામ મળશે)",
    "mr": "💊 तुम्हाला जसे वाटत आहे तसे लक्षणे निवडा — आम्ही सांगू तुम्हाला कोणता आजार आहे, पूर्णपणे मोफत! (4-5 लक्षणे निवडल्यास अचूक निकाल मिळेल)",
    "ta": "💊 உங்களுக்கு எப்படி உணர்கிறீர்கள் என்று அறிகுறிகளை தேர்ந்தெடுங்கள் — நாங்கள் சொல்கிறோம் உங்களுக்கு என்ன நோய் என்று, முற்றிலும் இலவசம்! (4-5 அறிகுறிகள் தேர்ந்தெடுத்தால் துல்லியமான முடிவு கிடைக்கும்)",
    "te": "💊 మీకు ఎలా అనిపిస్తుందో లక్షణాలు ఎంచుకోండి — మేము చెప్తాము మీకు ఏ వ్యాధి అని, పూర్తిగా ఉచితం! (4-5 లక్షణాలు ఎంచుకుంటే ఖచ్చితమైన ఫలితం వస్తుంది)",
    "pa": "💊 ਜਿਵੇਂ ਤੁਸੀਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ ਉਵੇਂ ਲੱਛਣ ਚੁਣੋ — ਅਸੀਂ ਦੱਸਾਂਗੇ ਤੁਹਾਨੂੰ ਕਿਹੜੀ ਬਿਮਾਰੀ ਹੈ, ਬਿਲਕੁਲ ਮੁਫ਼ਤ! (4-5 ਲੱਛਣ ਚੁਣਨ ਨਾਲ ਸਹੀ ਨਤੀਜਾ ਮਿਲੇਗਾ)",
    "bn": "💊 আপনি যেমন অনুভব করছেন সেরকম উপসর্গ বেছে নিন — আমরা বলব আপনার কোন রোগ আছে, সম্পূর্ণ বিনামূল্যে! (4-5 উপসর্গ বাছলে সঠিক ফলাফল পাবেন)",
    "kn": "💊 ನಿಮಗೆ ಹೇಗೆ ಅನಿಸುತ್ತಿದೆ ಎಂಬ ಲಕ್ಷಣಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ — ನಾವು ಹೇಳುತ್ತೇವೆ ನಿಮಗೆ ಯಾವ ರೋಗ ಎಂದು, ಸಂಪೂರ್ಣ ಉಚಿತ! (4-5 ಲಕ್ಷಣ ಆಯ್ಕೆ ಮಾಡಿದರೆ ನಿಖರ ಫಲಿತಾಂಶ ಸಿಗುತ್ತದೆ)",
    "ml": "💊 നിങ്ങൾക്ക് എങ്ങനെ തോന്നുന്നുവോ അതുപോലെ ലക്ഷണങ്ങൾ തിരഞ്ഞെടുക്കൂ — ഞങ്ങൾ പറയും നിങ്ങൾക്ക് ഏത് രോഗം എന്ന്, തികച്ചും സൗജന്യം! (4-5 ലക്ഷണങ്ങൾ തിരഞ്ഞെടുത്താൽ കൃത്യമായ ഫലം കിട്ടും)",
    "mw": "💊 जियां आपको महसूस हो रह्यो है वियां लखण चुणो — हम बतावां थाने कुणसी बीमारी है, बिल्कुल मुफ्त! (4-5 लखण चुणने पर सटीक नतीजो मिलेगो)",
    "as": "💊 আপুনি যেনে অনুভৱ কৰিছেন তেনে লক্ষণ বাছক — আমি ক'ম আপোনাৰ কোন ৰোগ আছে, সম্পূৰ্ণ বিনামূলীয়া! (4-5 লক্ষণ বাছিলে সঠিক ফলাফল পাব)",
    "or": "💊 ଆପଣ ଯେପରି ଅନୁଭବ କରୁଛନ୍ତି ସେହି ଲକ୍ଷଣ ବାଛନ୍ତୁ — ଆମେ ବତାଇବୁ ଆପଣଙ୍କୁ କେଉଁ ରୋଗ ଅଛି, ସଂପୂର୍ଣ୍ଣ ମାଗଣା! (4-5 ଲକ୍ଷଣ ବାଛିଲେ ସଠିକ୍ ଫଳ ମିଳିବ)",
    "nm": "💊 Jaise aapko feel ho raha hai waise symptom chuniye — hum batayenge aapko kaunsi bimari hai, bilkul free! (4-5 symptom chunne par sahi result milega)"
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
