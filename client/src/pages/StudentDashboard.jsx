import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await API.get('/quizzes');
        setQuizzes(res.data.quizzes || []);
      } catch (err) {
        setError('Failed to load quizzes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="container">
      {/* Welcome Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse available quizzes below, test your skills against the timer, and climb the leaderboard.
        </p>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '20px' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.1rem' }}>
          Loading available quizzes...
        </div>
      ) : quizzes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No Quizzes Available Right Now</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Check back soon! Teachers are currently preparing new quizzes.
          </p>
        </div>
      ) : (
        <div className="grid">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                    {quiz.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize', color: quiz.difficulty === 'hard' ? '#dc2626' : quiz.difficulty === 'easy' ? '#16a34a' : '#d97706' }}>
                    ● {quiz.difficulty}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{quiz.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {quiz.description || 'No description provided.'}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <span>⏱️ Duration: <strong>{quiz.duration} mins</strong></span>
                  <span>👨‍🏫 By: <strong>{quiz.teacherId?.name || 'Instructor'}</strong></span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/quiz/${quiz._id}`} className="btn btn-primary" style={{ flex: 1 }}>
                    Attempt Quiz →
                  </Link>
                  <Link to={`/leaderboard/${quiz._id}`} className="btn btn-secondary" title="View Leaderboard">
                    🏆
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;