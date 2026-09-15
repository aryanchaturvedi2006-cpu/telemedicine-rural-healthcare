import re

path = r'C:\Users\DELL\Desktop\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\src\translations\translations.js'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

translations_high = {
    'en': 'High likelihood',
    'hi': 'अधिक संभावना',
    'gu': 'વધુ સંભાવના',
    'mr': 'अधिक शक्यता',
    'ta': 'அதிக வாய்ப்பு',
    'te': 'ఎక్కువ అవకాశం',
    'pa': 'ਵਧੇਰੇ ਸੰਭਾਵਨਾ',
    'bn': 'উচ্চ সম্ভাবনা',
    'kn': 'ಹೆಚ್ಚಿನ ಸಾಧ್ಯತೆ',
    'ml': 'ഉയർന്ന സാധ്യത',
    'mw': 'अधिक संभावना',
    'as': 'অধিক সম্ভাৱনা',
    'or': 'ଅଧିକ ସମ୍ଭାବନା',
    'nm': 'High likelihood'
}

translations_medium = {
    'en': 'Medium likelihood',
    'hi': 'मध्यम संभावना',
    'gu': 'મધ્યમ સંભાવના',
    'mr': 'मध्यम शक्यता',
    'ta': 'நடுத்தர வாய்ப்பு',
    'te': 'మధ్యస్థ అవకాశం',
    'pa': 'ਮੱਧਮ ਸੰਭਾਵਨਾ',
    'bn': 'মাঝারি সম্ভাবনা',
    'kn': 'ಮಧ್ಯಮ ಸಾಧ್ಯತೆ',
    'ml': 'ഇടത്തരം സാധ്യത',
    'mw': 'मध्यम संभावना',
    'as': 'মধ্যমীয়া সম্ভাৱনা',
    'or': 'ମଧ୍ୟମ ସମ୍ଭାବନା',
    'nm': 'Medium likelihood'
}

translations_low = {
    'en': 'Estimated guess',
    'hi': 'अनुमानित संभावना',
    'gu': 'અંદાજિત સંભાવના',
    'mr': 'अंदाजित शक्यता',
    'ta': 'மதிப்பிடப்பட்ட வாய்ப்பு',
    'te': 'అంచనా వేయబడిన అవకాశం',
    'pa': 'ਅੰਦਾਜ਼ਨ ਸੰਭਾਵਨਾ',
    'bn': 'আনুমানিক সম্ভাবনা',
    'kn': 'ಅಂದಾಜು ಸಾಧ್ಯತೆ',
    'ml': 'കണക്കാക്കിയ സാധ്യത',
    'mw': 'अनुमानित संभावना',
    'as': 'আনুমানিক সম্ভাৱনা',
    'or': 'ଆନୁମାନିକ ସମ୍ଭାବନା',
    'nm': 'Estimated guess'
}


out_lines = []
current_lang = None

for line in lines:
    out_lines.append(line)
    
    m = re.match(r'^\s*([a-z]{2})\s*:\s*\{', line)
    if m:
        current_lang = m.group(1)
        
    if 'sympConfidence:' in line:
        high_val = translations_high.get(current_lang, "High likelihood")
        medium_val = translations_medium.get(current_lang, "Medium likelihood")
        low_val = translations_low.get(current_lang, "Estimated guess")
        
        indent = line[:len(line) - len(line.lstrip())]
        out_lines.append(f'{indent}confidenceHigh: "{high_val}",\n')
        out_lines.append(f'{indent}confidenceMedium: "{medium_val}",\n')
        out_lines.append(f'{indent}confidenceLow: "{low_val}",\n')

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(out_lines)

print("Added confidence translation keys to all language blocks.")
