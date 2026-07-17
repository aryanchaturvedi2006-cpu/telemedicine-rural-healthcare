import os
import pickle
import numpy as np
import pandas as pd
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

# Load Disease Properties from CSV
disease_properties = {}
try:
    desc_df = pd.read_csv('data/symptom_Description.csv')
    for _, row in desc_df.iterrows():
        disease = str(row['Disease']).strip()
        disease_properties[disease] = {
            "description": str(row['Description']).strip(),
            "home_remedies": [],
            "severity": "moderate",
            "specialization": "General Medicine",
            "see_doctor": "within 2 days",
            "emergency": False
        }
        
    prec_df = pd.read_csv('data/symptom_precaution.csv')
    for _, row in prec_df.iterrows():
        disease = str(row['Disease']).strip()
        precs = [str(row[c]).strip() for c in ['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4'] if pd.notna(row[c])]
        if disease in disease_properties:
            disease_properties[disease]["home_remedies"] = precs
        else:
            disease_properties[disease] = {
                "description": "",
                "home_remedies": precs,
                "severity": "moderate",
                "specialization": "General Medicine",
                "see_doctor": "within 2 days",
                "emergency": False
            }
except Exception as e:
    print("Error loading CSV properties:", e)

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
        "description": "No description available.",
        "severity": "moderate", 
        "specialization": "General Medicine", 
        "home_remedies": ["Rest", "Consult a doctor"], 
        "see_doctor": "within 2 days", 
        "emergency": False
    })
    
    result = {
        "predicted_disease": pred_disease,
        "predicted_disease_translated": get_translation(lang, pred_disease),
        "confidence": round(confidence, 2),
        "description": props.get('description', ''),
        "description_translated": get_translation(lang, props.get('description', '')),
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

# --- Rural Health Statistics Endpoints ---
@app.route('/api/stats/vacancies', methods=['GET'])
def get_vacancies():
    try:
        df = pd.read_csv('data/rhs_2020_vacancies_shortfalls.csv')
        df = df.replace('*', 0).replace('NA', 0).fillna(0)
        # Convert numeric columns to int/float if possible
        for col in df.columns[1:]:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)
        return jsonify(df.to_dict(orient='records'))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
