# Telemedicine Optimization for Rural Healthcare

**AI model for optimizing telemedicine deployment, ML + AI techniques and Data analysis**

## 🚀 About The Project

JeevanJyoti is an end-to-end rural healthcare telemedicine platform designed specifically to address the healthcare challenges in rural India. Built with a Mobile-First philosophy, the platform seamlessly connects rural patients with urban specialist doctors. 

The core of this project relies on advanced **Machine Learning (ML) & Artificial Intelligence (AI) techniques** and **Data Analysis** to predict diseases based on symptoms and logically optimize the physical deployment of telemedicine centers using authentic government healthcare datasets.

## ✨ Core Features & Technical Implementation

### 1. AI Telemedicine Deployment Optimizer (Data Analysis + ML)
- Uses **Real Kaggle Datasets** (`Rural Health Statistics - 2020`).
- Implements a **K-Means Clustering** Machine Learning algorithm to analyze Doctor/Specialist shortages and rural population density.
- Groups and prioritizes states (Critical Need, Moderate Need, Low Need) to mathematically optimize where government funds and telemedicine centers should be deployed first.

### 2. AI Symptom Checker & Triage (ML Techniques)
- Powered by a **Random Forest Classifier** trained on synthetic & real medical symptom sets.
- High accuracy disease prediction (Training: 99.1%, Testing: ~92%).
- Asks patients for symptoms in their local language and predicts the top 3 most likely diseases with confidence percentages to assist doctors in quick triage.

### 3. Aarogya AI Chatbot
- An intelligent healthcare assistant that guides rural users through the platform and answers basic health queries.

### 4. Multilingual & Voice Input Support
- Full support for regional languages (Hindi, Gujarati, Marathi, etc.).
- Includes a **Voice-to-Text** input feature, allowing illiterate or less tech-savvy rural patients to simply speak their symptoms.

### 5. WebRTC Video Call Consultation
- Integrated secure, real-time video and audio calling directly between the doctor and patient, eliminating the need for external software.

### 6. Admin Analytics Dashboard
- Comprehensive data visualization using Recharts.
- Real-time tracking of patient demographics, deployment reach, and appointment statuses.

## 🛠️ Tech Stack

* **Frontend:** React.js, CSS3 (Mobile-First, Responsive Design)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **AI/ML Service:** Python, Flask, Scikit-Learn, Pandas, NumPy
* **Communication:** WebRTC (for Video Calling)

## ⚙️ Installation & Setup (Local Development)

The architecture is divided into three main microservices. You will need three terminal windows to run them simultaneously.

### 1. Start the React Frontend
```bash
# In the root directory
npm install
npm start
# Runs on http://localhost:3000
```

### 2. Start the Node.js Backend
```bash
cd backend
npm install
node server.js
# Runs on http://localhost:5000
```

### 3. Start the Python AI Service
```bash
cd ai-service
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5001
```

## 🧠 ML Models
* `train_model.py`: Generates disease prediction models (`model.pkl` & `symptoms.pkl`).
* `telemedicine_optimizer.py`: Processes the RHS datasets and performs K-Means clustering for deployment optimization.

## 🎯 Future Scope
- Integration of Village/District level datasets for micro-level deployment optimization.
- Audio-based Digital E-Prescriptions for illiterate patients.
- Progressive Web App (PWA) offline support for low-bandwidth areas.
