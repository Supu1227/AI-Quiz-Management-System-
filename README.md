# ⚡ AI-Powered Online Quiz Management & Assessment System
[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://reactjs.org/)
[![Node Version](https://img.shields.io/badge/Node-v18%2B-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg)](https://www.mongodb.com/)
[![Authentication](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-orange.svg)](https://jwt.io/)
[![AI Integration](https://img.shields.io/badge/AI-Google%20Generative%20AI-purple.svg)](https://ai.google.dev/)
> A full-stack web application designed for creating, taking, and evaluating interactive quizzes with **AI-assisted question generation** using Google AI.
---
## 🚀 Key Features
### 🎓 For Students
* **Live Timed Exams:** Attempt quizzes with an interactive countdown timer and automated submission when time expires.
* **Tamper-Proof Grading:** Scores and percentages are computed strictly on the backend server to prevent client-side inspection.
* **Detailed Scorecard:** Immediate post-exam review showing chosen options vs. correct answers.
* **Real-Time Leaderboard:** Live podium display (🥇, 🥈, 🥉) ranking top students for every quiz.
* **Quiz History:** Track scores across past attempts.
### 👩‍🏫 For Teachers
* **Quiz Management (CRUD):** Create, update, delete, and publish quizzes with custom time limits.
* **Question Management:** Add manual 4-option MCQs with a radio button answer selector.
* **🤖 AI MCQ Generator:** 
  * Generate questions by entering a **Topic** (e.g. *"Java Exception Handling"*).
  * Or generate questions by pasting raw **Lecture Study Notes**.
* **Review Studio:** In-browser editing interface to review, edit, discard, or approve AI questions before adding them to quizzes.
* **Performance Analytics:** Monitor total quiz attempts and class average scores.
### 🛡️ For Administrators
* **System Metrics Dashboard:** View platform-wide counts of total students, teachers, quizzes, attempts, and average score.
* **User Directory:** View all registered accounts and roles.
---
## 🏛️ System Architecture


              USERS (Browser)
                      │
  ┌───────────────────┼───────────────────┐
  ▼                   ▼                   ▼
STUDENT TEACHER ADMIN │ │ │ └───────────────────┼───────────────────┘ ▼ React.js Frontend (Vite) │ Axios (With Bearer Interceptor) │ ▼ Express.js REST API │ ┌─────────────────────┼─────────────────────┐ ▼ ▼ ▼ JWT & bcrypt Quiz & Question Result Engine Authentication Management & Leaderboard │ │ │ └─────────────────────┼─────────────────────┘ ▼ MongoDB Database + Google AI Service



---
## 🛠️ Technology Stack
* **Frontend:** React.js (Vite), JavaScript, HTML5, CSS3
* **Backend:** Node.js, Express.js (REST API)
* **Database:** MongoDB, Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT), bcryptjs password hashing
* **AI Integration:** Google Generative AI / Gemini API
* **Routing & HTTP:** Axios (with Bearer token interceptor), React Router DOM
---
## 🔑 Pre-configured Demo Accounts
Anyone testing the live application can use these pre-created accounts:
| Role | Email | Password | What You Can Do |
| :--- | :--- | :--- | :--- |
| **Teacher** | `sharma@quiz.com` | `password123` | Create quizzes, generate AI questions, review studio, publish, view class stats |
| **Student** | `rahul@student.com` | `password123` | Browse published exams, live countdown timer, instant grading, view leaderboard |
*(Anyone can also click **Register** on the website to create a new Student or Teacher account).*
---
## 💻 Local Installation & Setup
### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Community Server locally or MongoDB Atlas connection string)
### 1. Clone the Repository
```bash
git clone https://github.com/Supu1227/AI-Quiz-Management-System-.git
cd AI-Quiz-Management-System-
2. Backend Setup
bash


cd server
npm install
Create a .env file in the server/ directory:

env


PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai_quiz_db
JWT_SECRET=super_secret_jwt_key_quiz_app_2026
AI_API_KEY=your_gemini_or_ai_api_key_here
Start the backend server:

bash


npm run dev
3. Frontend Setup
In a new terminal:

bash


cd client
npm install
npm run dev
Open http://localhost:5173 in your browser!

📡 Core API Endpoints
Authentication
POST /api/auth/register - Register a new user (student or teacher)
POST /api/auth/login - Authenticate user and receive JWT token
GET /api/auth/me - Fetch authenticated user profile
Quizzes & Questions
GET /api/quizzes - Fetch quizzes (filtered by user role)
POST /api/quizzes - Create a quiz (Teacher only)
PUT /api/quizzes/:id - Edit or publish a quiz (Teacher only)
DELETE /api/quizzes/:id - Delete a quiz (Teacher only)
POST /api/quizzes/:id/questions - Add question with 4 options (Teacher only)
GET /api/quizzes/:id/questions - Fetch questions (hides answer key for students)
AI Question Generation
POST /api/ai/generate - Generate structured 4-option MCQs from topic or notes
Quiz Submissions & Leaderboard
POST /api/quizzes/:id/submit - Submit answers and calculate score on backend
GET /api/quizzes/:id/leaderboard - Ranked student leaderboard
GET /api/results/teacher/stats - Class performance and submission stats
🔒 Security Implementations
One-Way Password Hashing: Passwords encrypted using bcryptjs with 10 salt rounds.
Stateless JWT Tokens: User identity and role verified on every protected route.
Backend Role Guards: Access restrictions (protect and authorizeRoles) enforced by the backend server.
Answer Key Protection: Correct answers are stripped (.select('-correctAnswer')) when students take exams to prevent browser console inspection.
Server-Side Grading: Scores are calculated exclusively on the backend by matching submissions against MongoDB records.
