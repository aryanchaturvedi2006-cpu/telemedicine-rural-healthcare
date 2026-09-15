import pickle
import os
from app import app

client = app.test_client()

data = {
    "symptoms": ['high_fever', 'headache', 'cough', 'muscle_pain', 'fatigue'],
    "language": "en"
}

print("=== FINAL API TEST ===")
print("Sending request to /api/symptoms/analyze...")
response = client.post('/api/symptoms/analyze', json=data)
print("Response status:", response.status_code)
print("Response Data:", response.json)
