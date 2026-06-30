import re

path = r'C:\Users\DELL\Desktop\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\src\translations\translations.js'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

translations = {
    'en': 'Could also be:',
    'hi': 'इसके अलावा हो सकता है:',
    'gu': 'આ પણ હોઈ શકે છે:',
    'mr': 'हे देखील असू शकते:',
    'ta': 'இதுவாகவும் இருக்கலாம்:',
    'te': 'ఇలా కూడా ఉండవచ్చు:',
    'pa': 'ਇਹ ਵੀ ਹੋ ਸਕਦਾ ਹੈ:',
    'bn': 'এটিও হতে পারে:',
    'kn': 'ಇದು ಕೂಡ ಆಗಿರಬಹುದು:',
    'ml': 'ഇതും ആകാം:',
    'mw': 'इसके अलावा हो सकता है:',
    'as': 'এইটোও হ’ব পাৰে:',
    'or': 'ଏହା ମଧ୍ୟ ହୋଇପାରେ:',
    'nm': 'Could also be:'
}

out_lines = []
current_lang = None

for line in lines:
    out_lines.append(line)
    
    m = re.match(r'^\s*([a-z]{2})\s*:\s*\{', line)
    if m:
        current_lang = m.group(1)
        
    if 'sympPossibility:' in line:
        warning_text = translations.get(current_lang, "Could also be:")
        indent = line[:len(line) - len(line.lstrip())]
        out_lines.append(f'{indent}sympCouldAlsoBe: "{warning_text}",\n')

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(out_lines)

print("Added sympCouldAlsoBe to all language blocks.")
