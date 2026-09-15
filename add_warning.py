import re

path = r'C:\Users\DELL\Desktop\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\src\translations\translations.js'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the lowConfidenceWarning translation for each language (just reusing sympLowConfidence's general vibe or the Hindi phrase given as example)
# The user said: "Add this lowConfidenceWarning key with translations to all 14 languages in src/translations/translations.js, matching the style of nearby keys."
# I'll use the provided text 'Yeh ek estimate hai, sateek nahi' for Hindi, and generic translated equivalents for others, or just English fallback if needed. But let's actually just use English for others and English/Hindi mix where appropriate, or a simple translation.
# Wait, I can use a dictionary.

translations = {
    'en': 'This is an estimate, not a definitive diagnosis.',
    'hi': 'यह एक अनुमान है, सटीक निदान नहीं। (This is an estimate, not a definitive diagnosis)',
    'gu': 'આ એક અંદાજ છે, સચોટ નિદાન નથી.',
    'mr': 'हा एक अंदाज आहे, अचूक निदान नाही.',
    'ta': 'இது ஒரு மதிப்பீடு மட்டுமே, சரியான நோயறிதல் அல்ல.',
    'te': 'ఇది అంచనా మాత్రమే, ఖచ్చితమైన రోగ నిర్ధారణ కాదు.',
    'pa': 'ਇਹ ਇੱਕ ਅੰਦਾਜ਼ਾ ਹੈ, ਸਹੀ ਨਿਦਾਨ ਨਹੀਂ।',
    'bn': 'এটি একটি অনুমান, সঠিক রোগ নির্ণয় নয়।',
    'kn': 'ಇದು ಅಂದಾಜು ಮಾತ್ರ, ನಿಖರವಾದ ರೋಗನಿರ್ಣಯವಲ್ಲ.',
    'ml': 'ഇതൊരു കണക്കുകൂട്ടൽ മാത്രമാണ്, കൃത്യമായ രോഗനിർണയമല്ല.',
    'mw': 'यह एक अनुमान है, सटीक निदान नहीं।',
    'as': 'এইটো এটা অনুমান, সঠিক ৰোগ নিৰ্ণয় নহয়।',
    'or': 'ଏହା ଏକ ଅନୁମାନ, ସଠିକ୍ ରୋଗ ନିର୍ଣ୍ଣୟ ନୁହେଁ।',
    'nm': 'This is an estimate, not a definitive diagnosis.'
}

# The keys in translations.js are like 'en:', 'hi:', etc.
# But it's easier to find `sympLowConfidence: "...",` and insert `\n    lowConfidenceWarning: "...",` right after it for each language block.

new_content = content

for lang, text in translations.items():
    # We find the block for the language. But simple regex replace on sympLowConfidence will hit all.
    # To be safe and target the specific language block, we could just do a global replace of sympLowConfidence but we need the specific translation text.
    # Actually, let's just do a generic replacement if we don't have perfect translations, or we can parse the language.
    pass

# Let's just do a simple regex that finds the sympLowConfidence line and appends lowConfidenceWarning
# But we need to know WHICH language block we are in.
# translations.js is structured as:
# const translations = {
#   en: { ... sympLowConfidence: "..." ... },
#   hi: { ... sympLowConfidence: "..." ... },
# }

def replacer(match):
    prefix = match.group(1)
    symp_line = match.group(2)
    
    # We don't easily know the language here unless we keep track of it.
    # Let's just insert a generic English/Hindi warning for all if we can't reliably map, 
    # OR we can just find "lang: {" and track it.
    return match.group(0) # placeholder

# A better way: iterate over languages and replace within their blocks.
for lang, trans_text in translations.items():
    # regex to find the language block and insert
    # This might be tricky. Let's just use a simple regex for each block.
    pattern = r'(' + lang + r'\s*:\s*\{.*?)(sympLowConfidence\s*:\s*"[^"]*",)(\s*)'
    
    # Actually, dotall is needed for .*?
    # but re.sub with dotall might be slow or risky.
    pass

# Alternative: split by '\n', keep track of current language.
lines = content.split('\n')
out_lines = []
current_lang = None

lang_keys = set(translations.keys())

for line in lines:
    out_lines.append(line)
    
    # check if line starts a language block, e.g. "  en: {"
    m = re.match(r'^\s*([a-z]{2})\s*:\s*\{', line)
    if m:
        current_lang = m.group(1)
        
    if 'sympLowConfidence:' in line:
        warning_text = translations.get(current_lang, "This is an estimate, not a definitive diagnosis.")
        indent = line[:len(line) - len(line.lstrip())]
        out_lines.append(f'{indent}lowConfidenceWarning: "{warning_text}",')

with open(path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(out_lines))

print("Added lowConfidenceWarning to all language blocks.")
