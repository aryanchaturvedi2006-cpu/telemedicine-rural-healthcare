import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

print("Loading dataset.csv...")
df = pd.read_csv('data/dataset.csv')

# The dataset has Disease and Symptom_1 to Symptom_17
# First, let's get all unique symptoms
all_symptoms_set = set()

for col in df.columns[1:]:
    # Drop NaN values and get unique
    unique_symps = df[col].dropna().unique()
    for symp in unique_symps:
        # Clean string: lowercase and replace spaces/underscores
        clean_symp = str(symp).strip().lower().replace('_', ' ')
        if clean_symp:
            all_symptoms_set.add(clean_symp)

all_symptoms = sorted(list(all_symptoms_set))
print(f"Total unique symptoms: {len(all_symptoms)}")

# Create feature vectors
data = []
labels = []

for index, row in df.iterrows():
    disease = str(row['Disease']).strip()
    symptoms = []
    for col in df.columns[1:]:
        val = row[col]
        if pd.notna(val):
            clean_val = str(val).strip().lower().replace('_', ' ')
            if clean_val:
                symptoms.append(clean_val)
    
    # Binary vector
    vector = [1 if sym in symptoms else 0 for sym in all_symptoms]
    data.append(vector)
    labels.append(disease)

X = np.array(data)
y = np.array(labels)

print(f"Dataset shape: {X.shape}")
print(f"Unique diseases: {len(set(y))}")

print("Training RandomForestClassifier...")
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X, y)
print("Model training complete. Score on training set:", clf.score(X, y))

# Save Model and Symptoms List
with open('model.pkl', 'wb') as f:
    pickle.dump(clf, f)

with open('symptoms.pkl', 'wb') as f:
    pickle.dump(all_symptoms, f)

print("Saved model.pkl and symptoms.pkl")
