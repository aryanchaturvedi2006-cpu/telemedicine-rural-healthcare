import re
import json

file_path = r'c:\Users\DELL\Desktop\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\src\translations\translations.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_keys = {
  "sympLowConfidence": {
    "hi": "⚠️ पर्याप्त जानकारी नहीं — कृपया और लक्षण जोड़ें जैसे बुखार कितने दिन से है, सिर दर्द कहां है आदि",
    "en": "⚠️ Not enough information — please add more symptoms like how many days fever, where exactly is the pain etc.",
    "gu": "⚠️ પૂરતી માહિતી નથી — કૃપા કરીને વધુ લક્ષણો ઉમેરો જેમ કે કેટલા દિવસથી તાવ છે, માથું ક્યાં દુખે છે વગેરે",
    "mr": "⚠️ पुरेशी माहिती नाही — कृपया आणखी लक्षणे जोडा जसे की ताप किती दिवसांपासून आहे, डोकेदुखी कुठे आहे इ.",
    "ta": "⚠️ போதுமான தகவல் இல்லை — எத்தனை நாட்கள் காய்ச்சல், சரியாக எங்கு வலி போன்ற கூடுதல் அறிகுறிகளைச் சேர்க்கவும்",
    "te": "⚠️ తగినంత సమాచారం లేదు — జ్వరం ఎన్ని రోజులు, నొప్పి సరిగ్గా ఎక్కడ ఉంది వంటి మరిన్ని లక్షణాలను జోడించండి",
    "pa": "⚠️ ਲੋੜੀਂਦੀ ਜਾਣਕਾਰੀ ਨਹੀਂ — ਕਿਰਪਾ ਕਰਕੇ ਹੋਰ ਲੱਛਣ ਸ਼ਾਮਲ ਕਰੋ ਜਿਵੇਂ ਕਿ ਕਿੰਨੇ ਦਿਨਾਂ ਤੋਂ ਬੁਖਾਰ ਹੈ, ਸਿਰ ਦਰਦ ਕਿੱਥੇ ਹੈ ਆਦਿ",
    "bn": "⚠️ পর্যাপ্ত তথ্য নেই — অনুগ্রহ করে আরও উপসর্গ যোগ করুন যেমন কত দিন জ্বর, ঠিক কোথায় ব্যথা ইত্যাদি",
    "kn": "⚠️ ಸಾಕಷ್ಟು ಮಾಹಿತಿ ಇಲ್ಲ — ಎಷ್ಟು ದಿನಗಳಿಂದ ಜ್ವರ, ನಿಖರವಾಗಿ ಎಲ್ಲಿ ನೋವು ಇದೆ ಎಂಬಂತಹ ಹೆಚ್ಚಿನ ಲಕ್ಷಣಗಳನ್ನು ಸೇರಿಸಿ",
    "ml": "⚠️ മതിയായ വിവരങ്ങളില്ല — എത്ര ദിവസമായി പനി, കൃത്യമായി എവിടെയാണ് വേദന തുടങ്ങിയ കൂടുതൽ ലക്ഷണങ്ങൾ ചേർക്കുക",
    "mw": "⚠️ पूरी जानकारी कोनी — कृपया और लखण जोड़ो जियां बुखार कतरा दिन सूं है, सिर दर्द कठे है आदि",
    "as": "⚠️ পৰ্যাপ্ত তথ্য নাই — অনুগ্ৰহ কৰি আৰু লক্ষণ যোগ কৰক যেনে কিমান দিন জ্বৰ, ঠিক ক'ত বিষ ইত্যাদি",
    "or": "⚠️ ପର୍ଯ୍ୟାପ୍ତ ସୂଚନା ନାହିଁ — ଦୟାକରି ଅଧିକ ଲକ୍ଷଣ ଯୋଡନ୍ତୁ ଯେପରିକି କେତେ ଦିନରୁ ଜ୍ୱର, ଠିକ୍ କେଉଁଠି ଯନ୍ତ୍ରଣା ଇତ୍ୟାଦି",
    "nm": "⚠️ Pura jankari nai — kripya aur symptom jodein jaise bukhar kitne din se hai, dard kahan hai aadi"
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
