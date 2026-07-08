import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

print("Loading data...")

required_files = ['data/dataset.csv', 'data/Symptom-severity.csv', 'data/symptom_Description.csv', 'data/symptom_precaution.csv']
for fname in required_files:
    if not os.path.exists(fname):
        print(f"ERROR: Required file '{fname}' not found.")
        exit(1)

dataset = pd.read_csv('data/dataset.csv')
severity = pd.read_csv('data/Symptom-severity.csv')
description = pd.read_csv('data/symptom_Description.csv')
precaution = pd.read_csv('data/symptom_precaution.csv')

dataset.columns = dataset.columns.str.strip()
severity['Symptom'] = severity['Symptom'].str.strip()
description['Disease'] = description['Disease'].str.strip()
precaution['Disease'] = precaution['Disease'].str.strip()

all_symptoms = severity['Symptom'].tolist()

print("\nSample of actual symptom names in dataset:")
for s in all_symptoms[:30]:
    print(f"  '{s}'")
matching = [s for s in all_symptoms if 'fever' in s.lower() or 'headache' in s.lower() or 'cough' in s.lower() or 'fatigue' in s.lower() or 'muscle' in s.lower()]
print(f"\nSymptoms matching our sanity check words: {matching}")

print(f"Total symptoms: {len(all_symptoms)}")

symptom_cols = [col for col in dataset.columns if col.startswith('Symptom_')]

def create_feature_vector(row, all_symptoms):
    row_symptoms = []
    for col in symptom_cols:
        val = row[col]
        if pd.notna(val):
            row_symptoms.append(str(val).strip())
    return [1 if sym in row_symptoms else 0 for sym in all_symptoms]

print("Creating feature vectors...")
X, y = [], []
for _, row in dataset.iterrows():
    X.append(create_feature_vector(row, all_symptoms))
    y.append(str(row['Disease']).strip())

X = np.array(X)
y = np.array(y)
print(f"Dataset shape: {X.shape}")
print(f"Unique diseases: {len(np.unique(y))}")

# IMPORTANT: also train on partial/sparse symptom subsets so the model
# learns to handle real-world input where users select only 3-6 symptoms,
# not the full 9-17 symptom rows from the original dataset.
print("Augmenting training data with sparse symptom subsets...")
X_aug, y_aug = list(X), list(y)
rng = np.random.RandomState(42)
for i in range(len(X)):
    active_idx = np.where(X[i] == 1)[0]
    if len(active_idx) >= 4:
        for _ in range(3):
            k = rng.randint(3, min(6, len(active_idx)) + 1)
            chosen = rng.choice(active_idx, size=k, replace=False)
            sparse_vec = np.zeros(len(all_symptoms))
            sparse_vec[chosen] = 1
            X_aug.append(sparse_vec)
            y_aug.append(y[i])

X_aug = np.array(X_aug)
y_aug = np.array(y_aug)
print(f"Augmented dataset shape: {X_aug.shape}")

X_train, X_test, y_train, y_test = train_test_split(
    X_aug, y_aug, test_size=0.2, random_state=42, stratify=y_aug
)

print("Training Random Forest model...")
clf = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    min_samples_leaf=15,
    min_samples_split=30,
    max_features='sqrt',
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)
clf.fit(X_train, y_train)

y_pred_train = clf.predict(X_train)
y_pred_test = clf.predict(X_test)
train_acc = accuracy_score(y_train, y_pred_train)
test_acc = accuracy_score(y_test, y_pred_test)

print(f"Training Accuracy: {round(train_acc * 100, 2)}%")
print(f"Testing Accuracy: {round(test_acc * 100, 2)}%")

cv_scores = cross_val_score(clf, X_aug, y_aug, cv=5)
print(f"5-fold Cross-validation accuracy: {round(cv_scores.mean() * 100, 2)}% (+/- {round(cv_scores.std() * 100, 2)}%)")

test_probs = clf.predict_proba(X_test)
avg_max_confidence = np.mean(np.max(test_probs, axis=1))
print(f"Average max confidence on test set: {round(avg_max_confidence * 100, 2)}%")

# Sanity check 1 with the exact problematic symptom combination
test_symptoms = ['high_fever', 'headache', 'cough', 'fatigue', 'muscle_pain']
test_vector = [1 if sym in test_symptoms else 0 for sym in all_symptoms]
test_probs_single = clf.predict_proba([test_vector])[0]
top5_idx = np.argsort(test_probs_single)[::-1][:5]
print(f"\nSanity check 1 — symptoms: {test_symptoms}")
for idx in top5_idx:
    print(f"  {clf.classes_[idx]}: {round(test_probs_single[idx]*100, 2)}%")

# Sanity check 2 with more symptoms
test_symptoms_2 = test_symptoms + ['chills', 'sweating']
test_vector_2 = [1 if sym in test_symptoms_2 else 0 for sym in all_symptoms]
test_probs_2 = clf.predict_proba([test_vector_2])[0]
top5_idx_2 = np.argsort(test_probs_2)[::-1][:5]
print(f"\nSanity check 2 — symptoms: {test_symptoms_2}")
for idx in top5_idx_2:
    print(f"  {clf.classes_[idx]}: {round(test_probs_2[idx]*100, 2)}%")


with open('model.pkl', 'wb') as f:
    pickle.dump(clf, f)
with open('symptoms.pkl', 'wb') as f:
    pickle.dump(all_symptoms, f)

desc_dict = dict(zip(description['Disease'].str.strip(), description['Description']))
with open('description.pkl', 'wb') as f:
    pickle.dump(desc_dict, f)

prec_dict = {}
for _, row in precaution.iterrows():
    disease = str(row['Disease']).strip()
    precs = []
    for col in ['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']:
        if pd.notna(row[col]):
            precs.append(str(row[col]).strip())
    prec_dict[disease] = precs
with open('precautions.pkl', 'wb') as f:
    pickle.dump(prec_dict, f)

print("\nSaved: model.pkl, symptoms.pkl, description.pkl, precautions.pkl")
print("Training complete!")