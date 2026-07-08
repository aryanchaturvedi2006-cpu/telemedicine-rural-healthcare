import os
import glob
import re

directory = r'C:\Users\DELL\Desktop\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\telemedicine-rural-healthcare-main\ai-service\keywords'

replacements = {
    r"'fever'": r"'high_fever'",
    r'"fever"': r'"high_fever"',
    r"'body_ache'": r"'muscle_pain'",
    r'"body_ache"': r'"muscle_pain"',
    r"'diarrhea'": r"'diarrhoea'",
    r'"diarrhea"': r'"diarrhoea"',
    r"'breathing_difficulty'": r"'breathlessness'",
    r'"breathing_difficulty"': r'"breathlessness"',
    r"'stomach_pain'": r"'abdominal_pain'",
    r'"stomach_pain"': r'"abdominal_pain"',
}

for filepath in glob.glob(os.path.join(directory, '*.py')):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        # we only replace the mapped symptom value, not the keys (which are in the native language)
        # e.g., 'bukhar': 'fever' -> 'bukhar': 'high_fever'
        # The replacement dictionary handles string literals.
        new_content = re.sub(old, new, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {os.path.basename(filepath)}")

print("Keyword mapping update complete.")
