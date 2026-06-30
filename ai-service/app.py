import os
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from translations import get_translation

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})

# Load Model and data
try:
    with open('model.pkl', 'rb') as f:
        clf = pickle.load(f)
    with open('symptoms.pkl', 'rb') as f:
        all_symptoms = pickle.load(f)
    with open('description.pkl', 'rb') as f:
        description_dict = pickle.load(f)
    with open('precautions.pkl', 'rb') as f:
        precautions_dict = pickle.load(f)
    print("All models and data loaded successfully!")
except Exception as e:
    print("Error loading models:", e)
    clf = None
    all_symptoms = []
    description_dict = {}
    precautions_dict = {}

# Load Keywords
keywords_dicts = {}
lang_map = {
    'hi': 'hindi', 'gu': 'gujarati', 'mr': 'marathi', 'ta': 'tamil',
    'te': 'telugu', 'pa': 'punjabi', 'bn': 'bengali', 'kn': 'kannada',
    'ml': 'malayalam', 'mw': 'hindi', 'as': 'assamese', 'or': 'odia',
    'nm': 'nagamese', 'en': 'english'
}

for code, name in lang_map.items():
    try:
        mod = __import__(f"keywords.{name}_keywords", fromlist=['keywords_map'])
        keywords_dicts[code] = mod.keywords_map
    except Exception as e:
        print(f"Failed to load keywords for {name}: {e}")
        keywords_dicts[code] = {}

# Severity mapping based on disease type
def get_severity(disease):
    severe = ['Heart attack', 'Paralysis (brain hemorrhage)', 'AIDS', 'Tuberculosis',
              'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E', 'Dengue',
              'Malaria', 'Pneumonia', 'Alcoholic hepatitis']
    moderate = ['Typhoid', 'Jaundice', 'hepatitis A', 'Diabetes ', 'Hypertension ',
                'Hypoglycemia', 'Hypothyroidism', 'Hyperthyroidism', 'Migraine',
                'Bronchial Asthma', 'Gastroenteritis', 'Chicken pox', 'Psoriasis']
    emergency = ['Heart attack', 'Paralysis (brain hemorrhage)', 'Dengue', 'AIDS']

    d = disease.strip()
    if d in severe:
        return "severe"
    elif d in moderate:
        return "moderate"
    else:
        return "mild"

def get_specialization(disease):
    specialization_map = {
        'Heart attack': 'Cardiology',
        'Hypertension ': 'Cardiology',
        'Diabetes ': 'Endocrinology',
        'Hypothyroidism': 'Endocrinology',
        'Hyperthyroidism': 'Endocrinology',
        'Bronchial Asthma': 'Pulmonology',
        'Tuberculosis': 'Pulmonology',
        'Pneumonia': 'Pulmonology',
        'Paralysis (brain hemorrhage)': 'Neurology',
        'Migraine': 'Neurology',
        'Cervical spondylosis': 'Orthopedics',
        'Osteoarthristis': 'Orthopedics',
        'Arthritis': 'Orthopedics',
        'Jaundice': 'Gastroenterology',
        'hepatitis A': 'Gastroenterology',
        'Hepatitis B': 'Gastroenterology',
        'Hepatitis C': 'Gastroenterology',
        'Hepatitis D': 'Gastroenterology',
        'Hepatitis E': 'Gastroenterology',
        'Alcoholic hepatitis': 'Gastroenterology',
        'Gastroenteritis': 'Gastroenterology',
        'GERD': 'Gastroenterology',
        'Peptic ulcer diseae': 'Gastroenterology',
        'Chronic cholestasis': 'Gastroenterology',
        'Urinary tract infection': 'Urology',
        'AIDS': 'Infectious Disease',
        'Malaria': 'Infectious Disease',
        'Dengue': 'Infectious Disease',
        'Typhoid': 'Infectious Disease',
        'Chicken pox': 'Infectious Disease',
        'Fungal infection': 'Dermatology',
        'Acne': 'Dermatology',
        'Psoriasis': 'Dermatology',
        'Impetigo': 'Dermatology',
    }
    return specialization_map.get(disease.strip(), 'General Medicine')

def is_emergency(disease):
    emergency_diseases = ['Heart attack', 'Paralysis (brain hemorrhage)', 'Dengue', 'AIDS']
    return disease.strip() in emergency_diseases

def get_see_doctor(severity):
    if severity == 'severe':
        return 'today urgently'
    elif severity == 'moderate':
        return 'within 2 days'
    else:
        return 'if symptoms persist'

@app.route('/api/symptoms/analyze', methods=['POST'])
def analyze():
    data = request.json
    symptoms = data.get('symptoms', [])
    lang = data.get('language', 'en')

    if not symptoms or not clf:
        return jsonify({"error": "Invalid symptoms or model not loaded"}), 400

    symptoms_clean = [s.strip() for s in symptoms]

    matched = [s for s in symptoms_clean if s in all_symptoms]
    unmatched = [s for s in symptoms_clean if s not in all_symptoms]
    print(f"MATCHED symptoms ({len(matched)}/{len(symptoms_clean)}): {matched}")
    print(f"UNMATCHED symptoms (not in model's 133 list): {unmatched}")

    if len(symptoms_clean) < 3:
        return jsonify({
            "low_confidence": True,
            "message": get_translation(lang, 'lowConfidenceMsg') or "Kripya kam se kam 3 lakshan chunen.",
            "possible_conditions": [],
            "recommended_specialization": "General Medicine",
            "see_doctor": True,
            "emergency": False
        }), 200

    vector = [1 if sym in symptoms_clean else 0 for sym in all_symptoms]
    probs = clf.predict_proba([vector])[0]
    top_indices = np.argsort(probs)[::-1][:3]
    top_diseases = [(clf.classes_[i], float(probs[i])) for i in top_indices]
    pred_disease, confidence = top_diseases[0]
    alternative_diseases = [d for d, c in top_diseases[1:]]

    severity = get_severity(pred_disease)
    specialization = get_specialization(pred_disease)
    emergency = is_emergency(pred_disease)
    see_doctor = get_see_doctor(severity)

    disease_key = pred_disease.strip()
    description = description_dict.get(disease_key, "Please consult a doctor for proper diagnosis.")
    precautions = precautions_dict.get(disease_key, ["Rest", "Stay hydrated", "Consult a doctor"])

    result = {
        "predicted_disease": pred_disease,
        "predicted_disease_translated": get_translation(lang, pred_disease),
        "confidence": round(confidence, 2),
        "low_confidence_warning": confidence < 0.3,
        "severity": severity,
        "severity_translated": get_translation(lang, severity),
        "recommended_specialization": specialization,
        "recommended_specialization_translated": get_translation(lang, specialization),
        "description": description,
        "precautions": precautions,
        "precautions_translated": [get_translation(lang, p) for p in precautions],
        "home_remedies": precautions,
        "home_remedies_translated": [get_translation(lang, p) for p in precautions],
        "see_doctor": see_doctor,
        "see_doctor_translated": get_translation(lang, see_doctor),
        "emergency": emergency,
        "alternative_diseases": alternative_diseases,
        "alternative_diseases_translated": [get_translation(lang, d) for d in alternative_diseases]
    }
    return jsonify(result)

@app.route('/api/symptoms/list', methods=['GET'])
def list_symptoms():
    lang = request.args.get('language', 'en')
    translated = [{"english": s, "translated": get_translation(lang, s)} for s in all_symptoms]
    return jsonify({"symptoms": translated})

@app.route('/api/symptoms/from-text', methods=['POST'])
def from_text():
    data = request.json
    text = data.get('text', '').lower()
    lang = data.get('language', 'en')

    kmap = keywords_dicts.get(lang, keywords_dicts.get('en', {}))

    matched = set()
    for phrase, sym in kmap.items():
        if phrase in text:
            matched.add(sym)

    return jsonify({"symptoms": list(matched)})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model_loaded": clf is not None})

if __name__ == '__main__':
    app.run(port=5001, debug=True)