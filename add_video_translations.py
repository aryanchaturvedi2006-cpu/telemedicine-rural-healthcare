import re

path = r'C:\Users\DELL\Desktop\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\src\translations\translations.js'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

translations_requestNow = {
    'en': 'Request Consultation Now',
    'hi': 'अभी परामर्श का अनुरोध करें',
    'gu': 'હવે પરામર્શની વિનંતી કરો',
    'mr': 'आता सल्लामसलत करण्याची विनंती करा',
    'ta': 'இப்போது ஆலோசனையைக் கோருங்கள்',
    'te': 'ఇప్పుడే సంప్రదింపులను అభ్యర్థించండి',
    'pa': 'ਹੁਣੇ ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦੀ ਬੇਨਤੀ ਕਰੋ',
    'bn': 'এখনই পরামর্শের অনুরোধ করুন',
    'kn': 'ಈಗ ಸಮಾಲೋಚನೆಯನ್ನು ವಿನಂತಿಸಿ',
    'ml': 'ഇപ്പോൾ കൺസൾട്ടേഷൻ അഭ്യർത്ഥിക്കുക',
    'mw': 'अभी परामर्श रो अनुरोध करो',
    'as': 'এতিয়া পৰামৰ্শৰ অনুৰোধ কৰক',
    'or': 'ବର୍ତ୍ତମାନ ପରାମର୍ଶ ପାଇଁ ଅନୁରୋଧ କରନ୍ତୁ',
    'nm': 'Request Consultation Now'
}

translations_waitingForDoctor = {
    'en': 'Waiting for doctor to start the call...',
    'hi': 'डॉक्टर द्वारा कॉल शुरू करने की प्रतीक्षा की जा रही है...',
    'gu': 'ડૉક્ટર કૉલ શરૂ કરે તેની રાહ જોઈ રહ્યા છીએ...',
    'mr': 'डॉक्टर कॉल सुरू करण्याची वाट पाहत आहोत...',
    'ta': 'மருத்துவர் அழைப்பைத் தொடங்க காத்திருக்கிறது...',
    'te': 'డాక్టర్ కాల్ ప్రారంభించే వరకు వేచి ఉంది...',
    'pa': 'ਡਾਕਟਰ ਦੁਆਰਾ ਕਾਲ ਸ਼ੁਰੂ ਕਰਨ ਦੀ ਉਡੀਕ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...',
    'bn': 'ডাক্তার কল শুরু করার জন্য অপেক্ষা করছি...',
    'kn': 'ವೈದ್ಯರು ಕರೆಯನ್ನು ಪ್ರಾರಂಭಿಸಲು ಕಾಯಲಾಗುತ್ತಿದೆ...',
    'ml': 'ഡോക്ടർ കോൾ ആരംഭിക്കുന്നതിനായി കാത്തിരിക്കുന്നു...',
    'mw': 'डॉक्टर कॉल शुरू करण री उडीक कर रिया है...',
    'as': 'ডাক্তৰে কল আৰম্ভ কৰালৈ অপেক্ষা কৰি আছে...',
    'or': 'ଡାକ୍ତର କଲ୍ ଆରମ୍ଭ କରିବା ପାଇଁ ଅପେକ୍ଷା କରାଯାଉଛି...',
    'nm': 'Doctor call start kora laagi roki ase...'
}

translations_startVideoCall = {
    'en': 'Start Video Call',
    'hi': 'वीडियो कॉल शुरू करें',
    'gu': 'વિડિઓ કૉલ શરૂ કરો',
    'mr': 'व्हिडिओ कॉल सुरू करा',
    'ta': 'வீடியோ அழைப்பைத் தொடங்கவும்',
    'te': 'వీడియో కాల్ ప్రారంభించండి',
    'pa': 'ਵੀਡੀਓ ਕਾਲ ਸ਼ੁਰੂ ਕਰੋ',
    'bn': 'ভিডিও কল শুরু করুন',
    'kn': 'ವೀಡಿಯೊ ಕರೆ ಪ್ರಾರಂಭಿಸಿ',
    'ml': 'വീഡിയോ കോൾ ആരംഭിക്കുക',
    'mw': 'वीडियो कॉल शुरू करो',
    'as': 'ভিডিঅ’ কল আৰম্ভ কৰক',
    'or': 'ଭିଡିଓ କଲ୍ ଆରମ୍ଭ କରନ୍ତୁ',
    'nm': 'Start Video Call'
}

translations_joinVideoCall = {
    'en': 'Join Video Call',
    'hi': 'वीडियो कॉल से जुड़ें',
    'gu': 'વિડિઓ કૉલમાં જોડાઓ',
    'mr': 'व्हिडिओ कॉलमध्ये सामील व्हा',
    'ta': 'வீடியோ அழைப்பில் சேரவும்',
    'te': 'వీడియో కాల్‌లో చేరండి',
    'pa': 'ਵੀਡੀਓ ਕਾਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
    'bn': 'ভিডিও কলে যোগ দিন',
    'kn': 'ವೀಡಿಯೊ ಕರೆಗೆ ಸೇರಿ',
    'ml': 'വീഡിയോ കോളിൽ ചേരുക',
    'mw': 'वीडियो कॉल में जुड़ो',
    'as': 'ভিডিঅ’ কলত যোগদান কৰক',
    'or': 'ଭିଡିଓ କଲ୍ ରେ ଯୋଗ ଦିଅନ୍ତୁ',
    'nm': 'Join Video Call'
}

out_lines = []
current_lang = None

for line in lines:
    out_lines.append(line)
    
    m = re.match(r'^\s*([a-z]{2})\s*:\s*\{', line)
    if m:
        current_lang = m.group(1)
        
    if 'confidenceLow:' in line:
        reqNow_val = translations_requestNow.get(current_lang, "Request Consultation Now")
        waiting_val = translations_waitingForDoctor.get(current_lang, "Waiting for doctor to start the call...")
        start_val = translations_startVideoCall.get(current_lang, "Start Video Call")
        join_val = translations_joinVideoCall.get(current_lang, "Join Video Call")
        
        indent = line[:len(line) - len(line.lstrip())]
        out_lines.append(f'{indent}requestNow: "{reqNow_val}",\n')
        out_lines.append(f'{indent}waitingForDoctor: "{waiting_val}",\n')
        out_lines.append(f'{indent}startVideoCall: "{start_val}",\n')
        out_lines.append(f'{indent}joinVideoCall: "{join_val}",\n')

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(out_lines)

print("Added video call translation keys to all language blocks.")
