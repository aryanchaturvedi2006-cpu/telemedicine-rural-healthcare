import re
import os

translations = {
    'hi': '"⚠️ पर्याप्त जानकारी नहीं — कृपया और लक्षण जोड़ें"',
    'en': '"⚠️ Not enough information — please add more symptoms"',
    'gu': '"⚠️ પૂરતી માહિતી નથી — કૃપા કરી વધુ લક્ષણ ઉમેરો"',
    'mr': '"⚠️ पुरेशी माहिती नाही — कृपया आणखी लक्षणे जोडा"',
    'ta': '"⚠️ போதுமான தகவல் இல்லை — மேலும் அறிகுறிகளைச் சேர்க்கவும்"',
    'te': '"⚠️ తగినంత సమాచారం లేదు — మరిన్ని లక్షణాలు జోడించండి"',
    'pa': '"⚠️ ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ ਨਹੀਂ — ਹੋਰ ਲੱਛਣ ਜੋੜੋ"',
    'bn': '"⚠️ পর্যাপ্ত তথ্য নেই — আরও উপসর্গ যোগ করুন"',
    'kn': '"⚠️ ಸಾಕಷ್ಟು ಮಾಹಿತಿ ಇಲ್ಲ — ಇನ್ನಷ್ಟು ಲಕ್ಷಣ ಸೇರಿಸಿ"',
    'ml': '"⚠️ മതിയായ വിവരം ഇല്ല — കൂടുതൽ ലക്ഷണങ്ങൾ ചേർക്കൂ"',
    'mw': '"⚠️ पूरी जानकारी कोनी — और लखण जोड़ो"',
    'as': '"⚠️ পৰ্যাপ্ত তথ্য নাই — অধিক লক্ষণ যোগ কৰক"',
    'or': '"⚠️ ପର୍ଯ୍ୟାପ୍ତ ସୂଚନା ନାହିଁ — ଅଧିକ ଲକ୍ଷଣ ଯୋଡ଼ନ୍ତୁ"',
    'nm': '"⚠️ Information kom ase — aro symptom add koro"'
}

filepath = r'c:\Users\DELL\Desktop\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\src\translations\translations.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# We will inject the new key `lowConfidenceMsg` right after `sympClose: "...",` for each language.
for lang, trans in translations.items():
    # Find the language block
    # It usually starts with `lang: {`
    # We can use a regex to find sympClose or just append it before the end of the block.
    # Actually, sympClose might not exist in all of them or it might be easier to look for:
    # sympClose: "Close", or something like that.
    
    # Or even simpler: we can just replace `sympClose: "(.*?)"` with `sympClose: "\1", lowConfidenceMsg: {trans}`
    # Let's see if sympClose exists in all blocks.
    # Another approach: find `symptomCheckNow:` and replace it with `lowConfidenceMsg: {trans}, symptomCheckNow:`
    pattern = rf"({lang}:\s*{{[\s\S]*?)(symptomCheckNow:)"
    
    if re.search(pattern, content):
        content = re.sub(pattern, rf"\1lowConfidenceMsg: {trans}, \2", content, count=1)
    else:
        print(f"Could not find injection point for {lang}")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied successfully.")
