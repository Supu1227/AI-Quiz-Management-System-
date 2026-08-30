import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <h1>AI-Powered Online Quiz & Assessment System</h1>
        <p>
          Empowering educators with AI-assisted question generation, and giving students 
          an engaging, timed quiz experience with instant grading and live leaderboards.
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          {user ? (
            <Link 
              to={user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/student'} 
              className="btn btn-primary" 
              style={{ padding: '14px 28px', fontSize: '1.1rem' }}
            >
              Go to Your Dashboard →
            </Link>
          ) : (
            <>
              <Link 
                to="/register" 
                className="btn btn-primary" 
                style={{ padding: '14px 28px', fontSize: '1.1rem' }}
              >
                Get Started Free →
              </Link>
              <Link 
                to="/login" 
                className="btn btn-secondary" 
                style={{ padding: '14px 28px', fontSize: '1.1rem' }}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid" style={{ marginTop: '40px' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>🤖 AI MCQ Generator</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Teachers can enter any topic or paste study notes, and our AI instantly creates 
            high-quality multiple-choice questions with 4 options.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>⏱️ Live Timed Exams</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Students experience seamless exams with interactive countdown timers and automatic 
            submission when the clock hits zero.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>⚡ Instant Secure Grading</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Grades and percentages are calculated directly on the backend server, completely 
            immune to frontend tampering or inspect-element cheats.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>🏆 Real-Time Leaderboards</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Students can view their rankings on live podium leaderboards, fostering healthy 
            academic competition and motivation.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;