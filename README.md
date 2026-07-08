# 🌿 TeleMed Rural — AI/ML Telemedicine Optimization System

> **PS-1 Internship Project — JK Lakshmipat University**  
> Built to bridge the healthcare gap in rural India using AI, ML, and multilingual technology.

---

## 📌 Project Overview

TeleMed Rural is a full-stack telemedicine web application designed specifically for rural healthcare in India. The system connects rural patients with doctors through an easy-to-use interface that supports **14 Indian languages**, requires **no password or OTP**, and uses **AI/ML models** to optimize telemedicine deployment.

### Problem Statement
Rural India faces a severe shortage of doctors — 1 doctor per 11,000 people vs WHO's recommended 1 per 1,000. Patients in villages cannot access specialists, don't speak English, and have low digital literacy.

### Our Solution
- Multilingual app (14 languages) so anyone can use it
- No complex registration — just name, age, gender, mobile number
- AI chatbot (Aarogya AI) for health guidance
- Voice input for symptoms — no typing needed
- ML models to predict doctor demand and optimize deployment

---

## 🚀 Features

### Patient Side
- 🌐 **14 Indian Languages** — Hindi, Gujarati, Marathi, Tamil, Telugu, Punjabi, Bengali, Kannada, Malayalam, Assamese, Odia, Mewari, Nagamese, English
- 📱 **Simple Registration** — No password, no OTP — just mobile number
- 🎤 **Voice Input** — Speak symptoms in Hindi/English, auto-fills the form
- 📷 **Photo Upload** — Upload injury/symptom photo during booking
- 👨‍⚕️ **Nearby Doctors** — Shows available doctors from same state
- 📅 **Appointment Booking** — Book Video Call, Audio Call, or In-Person
- 🤖 **Aarogya AI Chatbot** — 24/7 health guidance in Hindi & English

### Doctor Side
- 🔐 **Secure Login** — Email + Password with bcrypt encryption
- 📋 **Dashboard** — View all pending and confirmed appointments
- ✅ **Accept/Decline** — Manage appointment requests
- 🟢 **Availability Toggle** — Go online/offline with one click
- 📸 **Patient Photos** — View injury photos uploaded by patients

### AI/ML Features
- 🧠 **Doctor Demand Prediction** — Predicts which states/specializations need more doctors (Random Forest)
- 💊 **Symptom to Specialization** — Suggests doctor type based on symptoms (NLP + Naive Bayes)
- 📊 **No-show Prediction** — Predicts appointment no-shows (Logistic Regression)
- 📈 **Data Analysis** — State-wise doctor shortage visualization

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router v7, Context API |
| Backend | Node.js, Express.js v5 |
| Database | MySQL (mysql2) |
| Authentication | bcryptjs, localStorage |
| AI Chatbot | Google Gemini API |
| ML Models | Python, Scikit-learn, Pandas, Matplotlib |
| Voice Input | Web Speech API (built-in browser) |
| Languages | 14 Indian languages via custom translations |

---

## 📁 Project Structure

```
telemedicine-rural-healthcare-main/
├── src/                          # React Frontend
│   ├── pages/
│   │   ├── LanguageSelector.js   # 14 language selection
│   │   ├── Landing.js            # Home page
│   │   ├── PatientRegistration.js
│   │   ├── PatientLogin.js
│   │   ├── PatientDashboard.js   # Booking + nearby doctors
│   │   ├── DoctorRegistration.js
│   │   ├── LoginPage.js          # Doctor login
│   │   └── DoctorDashboard.js    # Appointments + availability
│   ├── context/
│   │   ├── AuthContext.js        # Authentication state
│   │   └── LanguageContext.js    # Language + translations
│   └── translations/
│       └── translations.js       # 14 language translations
├── backend/                      # Node.js Backend
│   ├── routes/
│   │   ├── patients.js           # Patient CRUD + login
│   │   ├── doctors.js            # Doctor CRUD + login + availability
│   │   └── appointments.js       # Booking + status management
│   ├── config/
│   │   └── db.js                 # MySQL connection pool
│   └── server.js                 # Express server
└── ml/                           # Python ML Models (In Progress)
    ├── data_analysis.ipynb
    ├── demand_prediction.ipynb
    ├── symptom_classifier.ipynb
    └── noshow_prediction.ipynb
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- Python 3.9+ (for ML models)
- XAMPP or MySQL Workbench

### 1. Clone the repository
```bash
git clone https://github.com/aryanchaturvedi2006-cpu/telemedicine-rural-healthcare.git
cd telemedicine-rural-healthcare/telemedicine-rural-healthcare-main
```

### 2. Database Setup
Open MySQL Workbench and run:
```sql
CREATE DATABASE telemedicine_db;
USE telemedicine_db;

CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  age INT,
  gender VARCHAR(20),
  mobile VARCHAR(15),
  street VARCHAR(200),
  village VARCHAR(100),
  state VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  mobile VARCHAR(15),
  specialization VARCHAR(100),
  hospital_name VARCHAR(200),
  area VARCHAR(100),
  state VARCHAR(100),
  password VARCHAR(255),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  doctor_id INT,
  date DATE,
  time TIME,
  mode VARCHAR(50),
  symptoms TEXT,
  injury_photo LONGTEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=telemedicine_db
PORT=5000
```

Start backend:
```bash
npm start
```

### 4. Frontend Setup
```bash
cd ..
npm install
```

Create `.env` file in root:
```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

Start frontend:
```bash
npm start
```

### 5. Open in browser
```
http://localhost:3000
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/patients/register` | Register new patient |
| POST | `/api/patients/login` | Patient login (mobile only) |
| POST | `/api/doctors/register` | Register new doctor |
| POST | `/api/doctors/login` | Doctor login (email + password) |
| GET | `/api/doctors/nearby?state=Gujarat` | Get doctors by state |
| PATCH | `/api/doctors/:id/availability` | Toggle doctor availability |
| POST | `/api/appointments/book` | Book appointment |
| GET | `/api/appointments/patient/:id` | Get patient appointments |
| GET | `/api/appointments/doctor/:id` | Get doctor appointments |
| PATCH | `/api/appointments/:id/status` | Update appointment status |

---

## 👥 Team

| Name | Role |
|------|------|
| Aryan Chaturvedi | Full Stack Development, AI Integration, Frontend & Backend Development |
| Kartik Phulwari | Full Stack Development, AI/ML Models, Chatbot Development |

**Institution:** JK Lakshmipat University, Jaipur  
**Program:** PS-1 Internship 2026  
**Duration:** May — July 2026

---

## 📊 ML Models (In Progress)

1. **Doctor Demand Prediction** — Random Forest Classifier to predict which states need more doctors based on population, existing doctor count, and appointment data
2. **Symptom to Specialization** — NLP-based classifier using TF-IDF + Naive Bayes to suggest appropriate doctor specialization from patient symptoms
3. **Appointment No-show Prediction** — Logistic Regression model to predict which patients are likely to miss appointments

---

## 🔮 Future Scope

- Video call integration (WebRTC)
- Prescription management
- Medicine reminder notifications
- Integration with government health schemes (Ayushman Bharat)
- Offline mode for low connectivity areas
- Android/iOS mobile app

---

## 📄 License

This project is built for educational purposes as part of PS-1 Internship at JK Lakshmipat University.
