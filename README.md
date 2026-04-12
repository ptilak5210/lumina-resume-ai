# ✨ Lumina Resume AI

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

A modern, minimalist, and deeply intelligent AI-powered resume builder. Lumina Resume AI helps professionals parse, refine, and optimize their profiles specifically to bypass Applicant Tracking Systems (ATS) and secure their dream jobs.

</div>

---

## 🎯 Key Features

- **🤖 AI-Powered ATS Analysis:** Instantly analyze your resume against standard ATS algorithms. Get granular feedback, find missing keywords, and see an overall pass-score.
- **📄 Smart Document Parsing:** Upload your existing PDF or DOCX resume and let the AI extract all your experiences, skills, and details seamlessly.
- **📈 Dynamic AI Suggestions:** Actionable line-by-line recommendations (e.g., using better action verbs or quantifying achievements) to dramatically increase interview odds.
- **💅 Premium Modern UI/UX:** Built with a stunning dark-mode/light-mode UI, glassmorphism elements, and highly polished animations using Framer Motion. Try our "Minimalist", "Classic", or "Modern" templates.
- **🔐 Secure Authentication:** Enterprise-grade security and user management powered by Supabase.
- **💼 Scalable Architecture:** An independent Python/Flask backend acting as the heavy-lifting engine for NLP / LLM generation using Google's Gemini Models.

---

## 🏗️ Architecture & Tech Stack

### Frontend (User Interface)
- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **Animations:** Framer Motion
- **State & Routing:** Context API, standard React Hooks structure
- **Tools:** TypeScript (for strong type safety during development)

### Backend (AI Engine & API)
- **Server:** Python 3, Flask framework
- **AI / LLM:** Google Generative AI (`gemini-2.5-flash` optimized prompts)
- **Parsing:** PyPDF2, Python-docx
- **Database / Auth:** PostgreSQL via Supabase Auth and Data APIs
- **Security:** JWT Verification, CORS, Python-dotenv

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18+)
- **Python** (v3.9+)
- A **Supabase** account (for Postgres DB and Authentication)
- A **Google Gemini API Key** (for the AI engine)

### 2. Backend Setup
The backend handles the AI-processing, document parsing, and Supabase integrations.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
env\Scripts\activate
# MacOS/Linux:
source venv/bin/activate

# Install the required dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory with the following variables:
```env
# Gemini API Configuration
GEMINI_API_KEY=your_google_gemini_api_key

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development
```

Run the backend server:
```bash
python run.py
# The server will start on http://127.0.0.1:5000
```


### 3. Frontend Setup
The frontend provides the interactive user dashboard.

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install
```

Create a `.env.local` file in the `frontend/` directory with the following variables:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend URL Match
VITE_API_URL=http://127.0.0.1:5000/api
```

Start the Vite development server:
```bash
npm run dev
# The frontend will start on http://localhost:5173
```

---

## 💡 Usage

1. Open `http://localhost:5173` in your browser.
2. Sign up for a new account.
3. Access your **Dashboard** and click **Upload Resume** to test the PyPDF parser or click **New Resume** to start from scratch.
4. Go to **AI Suggestions** to fetch your dynamic ATS scoring logic and keywords report from Gemini.

---

## 📄 License
This project is proprietary and built for personal demonstration/portfolio purposes. All rights reserved.