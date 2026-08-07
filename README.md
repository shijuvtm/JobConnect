# 🚀 JobConnect

JobConnect is a full-stack AI-powered job portal that helps job seekers find jobs, apply online, manage applications, and use AI tools to improve their career prospects.

## ✨ Features

- 👤 User Registration & Login (JWT Authentication)
- 💼 Browse and Apply for Jobs
- 📄 Track Applied Jobs
- 👤 User Profile Management
- 📁 Resume Upload
- 🤖 AI Resume Checker
- 🎯 AI Skill Gap Analyzer
- 📝 AI Resume Builder
- 🎤 AI Voice Mock Interview
- 🔒 Forgot Password & Reset Password
- 📱 Responsive UI

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios
- Lucide React

### Backend
- Django
- Django REST Framework
- JWT Authentication
- Groq API
- PostgreSQL (Neon Cloud) 

---

## 📂 Project Structure

```
JobConnect
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── package.json
│
├── backend/
│   ├── services/
│   ├── settings.py
│   ├── urls.py
│   ├── views.py
│   └── requirements.txt
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/jobconnect.git

cd jobconnect
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file.

### Backend

```
SECRET_KEY=your_secret_key

GROQ_API_KEY=your_groq_api_key

EMAIL_HOST_USER=your_email

EMAIL_HOST_PASSWORD=your_password
```

### Frontend

```
VITE_API_URL=http://127.0.0.1:8000
```

---

## 🚀 AI Services

- Resume Checker
- Resume Builder
- Skill Gap Analysis
- Voice Mock Interview

Powered by **Groq API**.

---

## 📸 Screenshots

Add screenshots of:

- Home Page
- Login
- Job Listings
- AI Resume Checker
- Resume Builder
- Voice Interview
- User Profile

---

## 📌 Future Improvements

- Company Dashboard
- Admin Dashboard
- AI Cover Letter Generator
- ATS Resume Score
- Email Notifications
- Video Interview
- Resume PDF Download

---

## 👨‍💻 Author

**Shiju A**

- GitHub: https://github.com/shijuvtm
- LinkedIn: https://www.linkedin.com/in/shiju-a-800572273
- Portfolio : https://portfoliov2-pied.vercel.app
