from deep_translator import GoogleTranslator
import re

file_path = 'src/translations/translations.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

langs = ['hi', 'mw', 'gu', 'mr', 'ta', 'te', 'pa', 'bn', 'kn', 'ml', 'as', 'or', 'nm']
keys_to_add = {
    'welcomeLoginBtn': 'Login',
    'doctorSignInTitle': 'Doctor Sign In',
    'doctorSignInSub': 'Access your patient dashboard',
    'backToLogin': 'Back to Login',
    'resetPassword': 'Reset Password',
    'resetPwdSub': 'Enter your registered email to receive a temporary password.',
    'sendNewPwdBtn': 'Send New Password',
    'forgotPwd': 'Forgot Password?',
    'newDoctorRegister': 'New doctor? Register here',
    'area': 'Area / District',
    'alreadyHaveAccountDoctor': 'Already have an account? Login here',
    'setPin': 'Set 4-Digit PIN',
    'pinDesc': "You'll use this PIN to login next time",
    'enterPin': 'Enter 4-digit PIN',
    'networkError': 'Could not connect to server. Your data has been saved locally. You can continue.'
}

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
    pattern = rf"({lang}:\s*{{)"
    content = re.sub(pattern, r"\1" + add_str, content)

# Also add to English
en_additions = "\n" + "\n".join([f'    {k}: "{v}",' for k,v in keys_to_add.items()]) + "\n"
content = re.sub(r"(en:\s*{)", r"\1" + en_additions, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done patching translations 10.")
