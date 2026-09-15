import os

languages = [
    'hindi', 'gujarati', 'marathi', 'tamil', 'telugu', 'punjabi', 
    'bengali', 'kannada', 'malayalam', 'assamese', 'odia', 'nagamese', 'english'
]

# Provide a basic mapping template
template = """
keywords_map = {
    "bukhar": "fever",
    "fever": "fever",
    "garam": "fever",
    "tap": "fever",
    "jwar": "fever",
    "headache": "headache",
    "sir dard": "headache",
    "matha betha": "headache",
    "thandi": "chills",
    "chills": "chills",
    "pasina": "sweating",
    "sweating": "sweating",
    "ulti": "vomiting",
    "nausea": "nausea",
    "vomiting": "vomiting",
    "dast": "diarrhea",
    "diarrhea": "diarrhea",
    "pet dard": "stomach pain",
    "stomach pain": "stomach pain",
    "badan dard": "body ache",
    "body ache": "body ache",
    "thakan": "fatigue",
    "fatigue": "fatigue",
    "khansi": "cough",
    "cough": "cough",
    "gala kharab": "sore throat",
    "sore throat": "sore throat",
    "naak behna": "running nose",
    "running nose": "running nose",
    "chhati me dard": "chest pain",
    "chest pain": "chest pain",
    "saans fulna": "shortness of breath",
    "difficulty breathing": "difficulty breathing",
    "wajan kam": "weight loss",
    "weight loss": "weight loss",
    "bhookh nahi": "loss of appetite",
    "loss of appetite": "loss of appetite",
    "pili chamdi": "yellow skin",
    "yellow skin": "yellow skin",
    "peshab me jalan": "burning sensation in urine",
    "kamjori": "weakness",
    "weakness": "weakness",
    "chakkar": "dizziness",
    "dizziness": "dizziness",
    "khujli": "itching",
    "itching": "itching",
    "lal ankh": "red eyes",
    "red eyes": "red eyes",
    "joint pain": "joint pain",
    "jodo me dard": "joint pain"
}
"""

os.makedirs('keywords', exist_ok=True)

for lang in languages:
    filename = f"keywords/{lang}_keywords.py"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(template.strip())

print("Keywords files generated successfully.")
