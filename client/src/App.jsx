import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import QuizAttempt from './pages/QuizAttempt';
import ResultView from './pages/ResultView';
import LeaderboardView from './pages/LeaderboardView';
import MyResults from './pages/MyResults';

// Teacher Pages
import TeacherDashboard from './pages/TeacherDashboard';
import CreateQuiz from './pages/CreateQuiz';
import ManageQuestions from './pages/ManageQuestions';
import AIGenerator from './pages/AIGenerator';
import TeacherStats from './pages/TeacherStats';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Routes (Protected: Student & Admin) */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:id"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <QuizAttempt />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/result/:id"
                element={
                  <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <ResultView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <MyResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard/:id"
                element={
                  <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <LeaderboardView />
                  </ProtectedRoute>
                }
              />

              {/* Teacher Routes (Protected: Teacher & Admin) */}
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-quiz"
                element={
                  <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <CreateQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/quiz/:id/questions"
                element={
                  <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <ManageQuestions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-generator"
                element={
                  <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <AIGenerator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/stats"
                element={
                  <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherStats />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes (Protected: Admin only) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;