import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle
import random

diseases_symptoms_map = {
    "Malaria": ["fever", "chills", "sweating", "headache", "nausea", "vomiting", "body ache", "fatigue"],
    "Dengue": ["fever", "headache", "body ache", "joint pain", "nausea", "vomiting", "rash", "fatigue"],
    "Typhoid": ["fever", "headache", "stomach pain", "weakness", "loss of appetite", "constipation", "diarrhea"],
    "TB": ["cough", "weight loss", "loss of appetite", "fever", "sweating", "chest pain", "difficulty breathing", "fatigue"],
    "Common Cold": ["running nose", "sore throat", "cough", "fever", "headache", "sneezing", "fatigue"],
    "Flu": ["fever", "chills", "body ache", "cough", "sore throat", "running nose", "fatigue", "headache"],
    "Pneumonia": ["cough", "fever", "chills", "difficulty breathing", "chest pain", "fatigue", "nausea"],
    "Diarrhea": ["diarrhea", "stomach pain", "nausea", "vomiting", "dehydration signs", "fever", "weakness"],
    "Cholera": ["diarrhea", "vomiting", "dehydration signs", "weakness", "nausea", "fast heartbeat"],
    "Food Poisoning": ["nausea", "vomiting", "diarrhea", "stomach pain", "fever", "weakness"],
    "Jaundice": ["yellow skin", "dark urine", "pale skin", "weakness", "loss of appetite", "stomach pain", "fever"],
    "Hepatitis": ["fatigue", "nausea", "vomiting", "stomach pain", "dark urine", "yellow skin", "loss of appetite"],
    "Diabetes": ["frequent urination", "increased thirst", "weight loss", "fatigue", "blurry vision", "slow healing"],
    "Hypertension": ["headache", "dizziness", "shortness of breath", "chest pain", "blurry vision", "fatigue"],
    "Heart Disease": ["chest pain", "shortness of breath", "fatigue", "dizziness", "fast heartbeat", "nausea"],
    "Asthma": ["shortness of breath", "wheezing", "chest pain", "cough", "difficulty breathing"],
    "Bronchitis": ["cough", "fatigue", "shortness of breath", "chest pain", "wheezing", "fever"],
    "Anemia": ["fatigue", "weakness", "pale skin", "shortness of breath", "dizziness", "fast heartbeat"],
    "Malnutrition": ["weight loss", "fatigue", "weakness", "hair loss", "pale skin", "dizziness"],
    "Scabies": ["itching", "rash", "swelling", "red skin"],
    "Ringworm": ["itching", "rash", "red skin", "hair loss"],
    "Chickenpox": ["rash", "itching", "fever", "fatigue", "loss of appetite", "headache"],
    "Measles": ["fever", "cough", "running nose", "red eyes", "rash", "sore throat"],
    "Mumps": ["swollen face", "fever", "headache", "muscle ache", "weakness", "loss of appetite", "pain while chewing"],
    "Conjunctivitis": ["red eyes", "itching", "watery eyes", "discharge from eyes"],
    "Sinusitis": ["headache", "running nose", "facial pain", "sore throat", "cough", "fever"],
    "UTI": ["burning sensation in urine", "frequent urination", "dark urine", "pelvic pain", "fever"],
    "Kidney Stone": ["severe pain in back", "blood in urine", "nausea", "vomiting", "fever", "frequent urination"],
    "Arthritis": ["joint pain", "swelling", "stiffness", "red skin"],
    "Back Pain": ["lower back pain", "stiffness", "muscle ache"],
    "Migraine": ["headache", "nausea", "vomiting", "sensitivity to light", "blurry vision"],
    "Epilepsy": ["seizures", "fainting", "confusion", "staring spell"],
    "Depression": ["low mood", "loss of appetite", "fatigue", "sleeping problems", "weight loss"],
    "Anxiety": ["nervousness", "fast heartbeat", "sweating", "dizziness", "fatigue"],
    "Appendicitis": ["severe stomach pain", "nausea", "vomiting", "fever", "loss of appetite"],
    "Gastritis": ["stomach pain", "nausea", "vomiting", "heartburn", "loss of appetite"],
    "Constipation": ["hard stools", "stomach pain", "bloating"],
    "Piles": ["blood in stool", "itching", "pain while passing stool"],
    "Worm Infection": ["stomach pain", "diarrhea", "nausea", "vomiting", "weight loss", "weakness"],
    "Heat Stroke": ["fever", "dizziness", "nausea", "fast heartbeat", "headache", "confusion", "fainting"],
    "Dehydration": ["increased thirst", "dark urine", "dizziness", "fatigue", "dry mouth", "weakness"]
}

# Extract unique symptoms
all_symptoms = set()
for symptoms in diseases_symptoms_map.values():
    all_symptoms.update(symptoms)

all_symptoms = sorted(list(all_symptoms))
print(f"Total symptoms: {len(all_symptoms)}")
print(f"Total diseases: {len(diseases_symptoms_map)}")

# Generate Synthetic Data
# We create 100 samples per disease. For each sample, we randomly pick 3 to N symptoms from the disease's symptom list.
# We also randomly add 0-2 noise symptoms.
data = []
labels = []

for disease, symptoms in diseases_symptoms_map.items():
    for _ in range(150):
        # Pick a random number of symptoms between 3 and all
        num_symptoms = random.randint(min(3, len(symptoms)), len(symptoms))
        chosen_symptoms = random.sample(symptoms, num_symptoms)
        
        # Add noise
        num_noise = random.randint(0, 2)
        noise_pool = list(set(all_symptoms) - set(symptoms))
        if noise_pool:
            chosen_noise = random.sample(noise_pool, min(num_noise, len(noise_pool)))
            chosen_symptoms.extend(chosen_noise)
        
        # Create binary vector
        vector = [1 if sym in chosen_symptoms else 0 for sym in all_symptoms]
        data.append(vector)
        labels.append(disease)

df = pd.DataFrame(data, columns=all_symptoms)
df['Disease'] = labels

print(f"Generated dataset shape: {df.shape}")

# Train Model
X = df.drop('Disease', axis=1)
y = df['Disease']

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X, y)

print("Model training complete. Score on training set:", clf.score(X, y))

# Save Model and Symptoms List
with open('model.pkl', 'wb') as f:
    pickle.dump(clf, f)

with open('symptoms.pkl', 'wb') as f:
    pickle.dump(all_symptoms, f)

print("Saved model.pkl and symptoms.pkl")
