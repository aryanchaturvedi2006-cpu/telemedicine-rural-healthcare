import re

path = r'C:\Users\DELL\Desktop\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\src\translations\translations.js'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

translations_changePassword = {
    'en': 'Change Password',
    'hi': 'पासवर्ड बदलें',
    'gu': 'પાસવર્ડ બદલો',
    'mr': 'पासवर्ड बदला',
    'ta': 'கடவுச்சொல்லை மாற்றவும்',
    'te': 'పాస్వర్డ్ మార్చండి',
    'pa': 'ਪਾਸਵਰਡ ਬਦਲੋ',
    'bn': 'পাসওয়ার্ড পরিবর্তন করুন',
    'kn': 'ಪಾಸ್ವರ್ಡ್ ಬದಲಾಯಿಸಿ',
    'ml': 'പാസ്‌വേഡ് മാറ്റുക',
    'mw': 'पासवर्ड बदलो',
    'as': 'পাছৱৰ্ড সলনি কৰক',
    'or': 'ପାସୱାର୍ଡ ବଦଳାନ୍ତୁ',
    'nm': 'Change Password'
}

translations_currentPassword = {
    'en': 'Current Password',
    'hi': 'वर्तमान पासवर्ड',
    'gu': 'વર્તમાન પાસવર્ડ',
    'mr': 'सध्याचा पासवर्ड',
    'ta': 'தற்போதைய கடவுச்சொல்',
    'te': 'ప్రస్తుత పాస్వర్డ్',
    'pa': 'ਮੌਜੂਦਾ ਪਾਸਵਰਡ',
    'bn': 'বর্তমান পাসওয়ার্ড',
    'kn': 'ಪ್ರಸ್ತುತ ಪಾಸ್ವರ್ಡ್',
    'ml': 'നിലവിലെ പാസ്‌വേഡ്',
    'mw': 'अभी रो पासवर्ड',
    'as': 'বৰ্তমান পাছৱৰ্ড',
    'or': 'ବର୍ତ୍ତମାନର ପାସୱାର୍ଡ',
    'nm': 'Current Password'
}

translations_newPassword = {
    'en': 'New Password',
    'hi': 'नया पासवर्ड',
    'gu': 'નવો પાસવર્ડ',
    'mr': 'नवीन पासवर्ड',
    'ta': 'புதிய கடவுச்சொல்',
    'te': 'కొత్త పాస్వర్డ్',
    'pa': 'ਨਵਾਂ ਪਾਸਵਰਡ',
    'bn': 'নতুন পাসওয়ার্ড',
    'kn': 'ಹೊಸ ಪಾಸ್ವರ್ಡ್',
    'ml': 'പുതിയ പാസ്‌വേഡ്',
    'mw': 'नयो पासवर्ड',
    'as': 'নতুন পাছৱৰ্ড',
    'or': 'ନୂଆ ପାସୱାର୍ଡ',
    'nm': 'New Password'
}

translations_confirmNewPassword = {
    'en': 'Confirm New Password',
    'hi': 'नया पासवर्ड कन्फर्म करें',
    'gu': 'નવો પાસવર્ડ કન્ફર્મ કરો',
    'mr': 'नवीन पासवर्ड कन्फर्म करा',
    'ta': 'புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    'te': 'కొత్త పాస్వర్డ్ నిర్ధారించండి',
    'pa': 'ਨਵੇਂ ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    'bn': 'নতুন পাসওয়ার্ড নিশ্চিত করুন',
    'kn': 'ಹೊಸ ಪಾಸ್ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ',
    'ml': 'പുതിയ പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക',
    'mw': 'नयो पासवर्ड पक्को करो',
    'as': 'নতুন পাছৱৰ্ড নিশ্চিত কৰক',
    'or': 'ନୂଆ ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ',
    'nm': 'Confirm New Password'
}

translations_passwordMismatch = {
    'en': 'Passwords do not match',
    'hi': 'पासवर्ड मेल नहीं खाते',
    'gu': 'પાસવર્ડ મેચ થતા નથી',
    'mr': 'पासवर्ड जुळत नाहीत',
    'ta': 'கடவுச்சொற்கள் பொருந்தவில்லை',
    'te': 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు',
    'pa': 'ਪਾਸਵਰਡ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ',
    'bn': 'পাসওয়ার্ড মিলছে না',
    'kn': 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ',
    'ml': 'പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല',
    'mw': 'पासवर्ड मेल नी खावे',
    'as': 'পাছৱৰ্ড মিলি যোৱা নাই',
    'or': 'ପାସୱାର୍ଡ ମେଳ ଖାଉନାହିଁ',
    'nm': 'Passwords do not match'
}


out_lines = []
current_lang = None

for line in lines:
    out_lines.append(line)
    
    m = re.match(r'^\s*([a-z]{2})\s*:\s*\{', line)
    if m:
        current_lang = m.group(1)
        
    if 'requestNow:' in line:
        chg_pw = translations_changePassword.get(current_lang, "Change Password")
        curr_pw = translations_currentPassword.get(current_lang, "Current Password")
        new_pw = translations_newPassword.get(current_lang, "New Password")
        conf_pw = translations_confirmNewPassword.get(current_lang, "Confirm New Password")
        mism_pw = translations_passwordMismatch.get(current_lang, "Passwords do not match")
        
        indent = line[:len(line) - len(line.lstrip())]
        out_lines.append(f'{indent}changePassword: "{chg_pw}",\n')
        out_lines.append(f'{indent}currentPassword: "{curr_pw}",\n')
        out_lines.append(f'{indent}newPassword: "{new_pw}",\n')
        out_lines.append(f'{indent}confirmNewPassword: "{conf_pw}",\n')
        out_lines.append(f'{indent}passwordMismatch: "{mism_pw}",\n')

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(out_lines)

print("Added change password translation keys to all language blocks.")
