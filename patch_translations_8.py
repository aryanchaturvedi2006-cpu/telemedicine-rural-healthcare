from deep_translator import GoogleTranslator
import re

file_path = 'src/translations/translations.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

langs = ['hi', 'mw', 'gu', 'mr', 'ta', 'te', 'pa', 'bn', 'kn', 'ml', 'as', 'or', 'nm']
keys_to_add = {
    'patientLogin': "Patient Login",
    'enterDetailsToContinue': "Enter your details to continue",
    'fullName': "Full Name",
    'enterName': "Enter your name",
    'mobileNumber': "Mobile Number",
    'tenDigitMobile': "10-digit mobile number",
    'fourDigitPin': "4-Digit PIN",
    'enterPin': "Enter your PIN",
    'forgotPin': "Forgot PIN?",
    'staySignedIn': "Stay signed in on this device",
    'loginBtn': "Login →",
    'newUserRegisterBtn': "New user? Create Account →",
    'newUserRegisterWelcome': "New user? Register now"
}

# Translate and inject
for lang in langs:
    print(f"Translating for {lang}...")
    translator = GoogleTranslator(source='en', target=lang if lang not in ['mw', 'nm'] else 'hi')
    
    additions = []
    for k, v in keys_to_add.items():
        try:
            trans = translator.translate(v) if lang not in ['mw', 'nm'] else v
            if lang == 'mw':
                trans = v + " (mw)"
            elif lang == 'nm':
                trans = v + " (nm)"
            additions.append(f'    {k}: "{trans}",')
        except Exception as e:
            additions.append(f'    {k}: "{v}",')
            
    add_str = "\n" + "\n".join(additions) + "\n"
    
    # Inject into the language block
    pattern = rf"({lang}: {{)"
    content = re.sub(pattern, r"\1" + add_str, content)

# Also add to English
en_additions = "\n" + "\n".join([f'    {k}: "{v}",' for k,v in keys_to_add.items()]) + "\n"
content = re.sub(r"(en: {)", r"\1" + en_additions, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done patching translations.")
