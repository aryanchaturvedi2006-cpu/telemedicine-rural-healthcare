import pickle
import os

print("=== SYMPTOMS LIST ===")
with open('symptoms.pkl', 'rb') as f:
    symptoms = pickle.load(f)
print(symptoms)

print("\n=== API TEST ===")
from app import app
client = app.test_client()

data = {
    "symptoms": ['fever', 'headache', 'cough', 'body_ache', 'fatigue'],
    "language": "en"
}

print("Sending request to /api/symptoms/analyze...")
response = client.post('/api/symptoms/analyze', json=data)
print("Response status:", response.status_code)
