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

from disease_info import DISEASE_DETAILS

@app.route('/api/symptoms/analyze', methods=['POST'])
def analyze():
    data = request.json or {}
    symptoms = data.get('symptoms', [])
    lang = data.get('language', 'hi')
    if not lang:
        lang = 'hi'
    
    if not symptoms or not clf:
        return jsonify({"error": "Invalid symptoms or model not loaded"}), 400
        
    vector = [1 if sym in symptoms else 0 for sym in all_symptoms]
    prob = clf.predict_proba([vector])[0]
    
    # Sort classes by predicted probability descending
    sorted_indices = np.argsort(prob)[::-1]
    
    top_3_diseases = []
    for rank, idx in enumerate(sorted_indices[:3], 1):
        disease_name = clf.classes_[idx]
        conf = float(prob[idx])
        info = DISEASE_DETAILS.get(disease_name, {})
        
        is_hi = (lang in ['hi', 'mw']) or (lang not in ['en'])
        name_tr = info.get('name_hi') if is_hi else info.get('name_en', disease_name)
        desc_tr = info.get('description_hi') if is_hi else info.get('description_en', f"{disease_name} is a medical condition.")
        remedies_tr = info.get('home_remedies_hi') if is_hi else info.get('home_remedies_en', ["Get rest", "Stay hydrated"])
        spec_tr = info.get('specialization_hi') if is_hi else info.get('specialization', "General Medicine")
        sev_tr = info.get('severity_hi') if is_hi else info.get('severity', "moderate")
        see_tr = info.get('see_doctor_hi') if is_hi else info.get('see_doctor_en', "Within 2 days")
        
        top_3_diseases.append({
            "rank": rank,
            "disease": disease_name,
            "name": name_tr or disease_name,
            "name_en": info.get('name_en', disease_name),
            "confidence": round(conf, 2),
            "confidence_percent": round(conf * 100),
            "severity": info.get('severity', 'moderate'),
            "severity_translated": sev_tr,
            "specialization": info.get('specialization', 'General Medicine'),
            "specialization_translated": spec_tr,
            "description": desc_tr,
            "home_remedies": remedies_tr,
            "see_doctor": see_tr,
            "emergency": info.get('emergency', False)
        })
    
    primary = top_3_diseases[0]
    
    result = {
        "predicted_disease": primary["disease"],
        "predicted_disease_translated": primary["name"],
        "confidence": primary["confidence"],
        "confidence_percent": primary["confidence_percent"],
        "top_3_diseases": top_3_diseases,
        "alternative_diseases_translated": [
            {
                "name": d["name"], 
                "confidence": d["confidence"], 
                "confidence_percent": d["confidence_percent"],
                "severity_translated": d["severity_translated"]
            }
            for d in top_3_diseases[1:]
        ],
        "description": primary["description"],
        "description_translated": primary["description"],
        "severity": primary["severity"],
        "severity_translated": primary["severity_translated"],
        "recommended_specialization": primary["specialization"],
        "recommended_specialization_translated": primary["specialization_translated"],
        "home_remedies": primary["home_remedies"],
        "home_remedies_translated": primary["home_remedies"],
        "see_doctor": primary["see_doctor"],
        "see_doctor_translated": primary["see_doctor"],
        "emergency": primary["emergency"]
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



import pandas as pd
# --- Rural Health Statistics Endpoints ---
@app.route('/api/stats/vacancies', methods=['GET'])
def get_vacancies():
    try:
        df = pd.read_csv('data/rhs_2020_vacancies_shortfalls.csv')
        df = df.replace('*', 0).replace('NA', 0).fillna(0)
        for col in df.columns[1:]:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)
        return jsonify(df.to_dict(orient='records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats/density', methods=['GET'])
def get_density():
    try:
        df = pd.read_csv('data/rhs_population_density.csv')
        df = df.replace('NA', 0).fillna(0)
        df['State/UT'] = df['State/UT'].astype(str).str.replace('*', '', regex=False)
        for col in df.columns[1:]:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        return jsonify(df.to_dict(orient='records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500


from telemedicine_optimizer import get_deployment_priorities
@app.route('/api/stats/optimization', methods=['GET'])
def get_optimization():
    try:
        priorities = get_deployment_priorities()
        return jsonify(priorities)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5001, debug=True)
