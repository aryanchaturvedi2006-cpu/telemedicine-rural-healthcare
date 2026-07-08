import os
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from translations import get_translation

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})

# Load Model
try:
    with open('model.pkl', 'rb') as f:
        clf = pickle.load(f)
    with open('symptoms.pkl', 'rb') as f:
        all_symptoms = pickle.load(f)
except Exception as e:
    print("Error loading models:", e)
    clf = None
    all_symptoms = []

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

# Map diseases to properties (Severity, Specialization, Home Remedies, See Doctor)
disease_properties = {
    "Malaria": {"severity": "severe", "specialization": "General Medicine", "home_remedies": ["Rest", "Stay hydrated", "Cold compress"], "see_doctor": "today urgently", "emergency": False},
    "Dengue": {"severity": "severe", "specialization": "General Medicine", "home_remedies": ["Rest", "Stay hydrated"], "see_doctor": "today urgently", "emergency": True},
    "Typhoid": {"severity": "moderate", "specialization": "General Medicine", "home_remedies": ["Rest", "Light diet", "Stay hydrated"], "see_doctor": "within 2 days", "emergency": False},
    "Common Cold": {"severity": "mild", "specialization": "General Medicine", "home_remedies": ["Rest", "Drink warm water", "Steam"], "see_doctor": "not needed immediately", "emergency": False},
    "Heart Disease": {"severity": "severe", "specialization": "Cardiology", "home_remedies": ["Rest"], "see_doctor": "today urgently", "emergency": True},
    # Default for others
}

@app.route('/api/symptoms/analyze', methods=['POST'])
def analyze():
    data = request.json
    symptoms = data.get('symptoms', [])
    lang = data.get('language', 'en')
    
    if not symptoms or not clf:
        return jsonify({"error": "Invalid symptoms or model not loaded"}), 400
        
    vector = [1 if sym in symptoms else 0 for sym in all_symptoms]
    prob = clf.predict_proba([vector])[0]
    pred_idx = np.argmax(prob)
    pred_disease = clf.classes_[pred_idx]
    confidence = float(prob[pred_idx])
    
    props = disease_properties.get(pred_disease, {
        "severity": "moderate", 
        "specialization": "General Medicine", 
        "home_remedies": ["Rest", "Drink warm water"], 
        "see_doctor": "within 2 days", 
        "emergency": False
    })
    
    result = {
        "predicted_disease": pred_disease,
        "predicted_disease_translated": get_translation(lang, pred_disease),
        "confidence": round(confidence, 2),
        "severity": props['severity'],
        "severity_translated": get_translation(lang, props['severity']),
        "recommended_specialization": props['specialization'],
        "recommended_specialization_translated": get_translation(lang, props['specialization']),
        "home_remedies": props['home_remedies'],
        "home_remedies_translated": [get_translation(lang, hr) for hr in props['home_remedies']],
        "see_doctor": props['see_doctor'],
        "see_doctor_translated": get_translation(lang, props['see_doctor']),
        "emergency": props['emergency']
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

if __name__ == '__main__':
    app.run(port=5001, debug=True)
