import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {
      const res = await API.get('/quizzes');
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      console.error('Failed to load teacher quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Toggle publish / unpublish
  const handleTogglePublish = async (quiz) => {
    try {
      await API.put(`/quizzes/${quiz._id}`, {
        published: !quiz.published
      });
      fetchQuizzes();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update publish state');
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will delete all its questions too.`)) {
      try {
        await API.delete(`/quizzes/${id}`);
        fetchQuizzes();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete quiz');
      }
    }
  };

  return (
    <div className="container">
      {/* Top Header & Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Instructor Dashboard 👩‍🏫</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome, {user?.name}. Manage your quizzes and AI questions.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/ai-generator" className="btn btn-secondary" style={{ borderColor: '#8b5cf6', color: '#7c3aed' }}>
            🤖 AI Question Generator
          </Link>
          <Link to="/create-quiz" className="btn btn-primary">
            + Create New Quiz
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading your quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <h3>You haven't created any quizzes yet!</h3>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px' }}>
            Start by creating a manual quiz or use our AI Generator to build questions in seconds.
          </p>
          <Link to="/create-quiz" className="btn btn-primary">
            Create Your First Quiz →
          </Link>
        </div>
      ) : (
        <div className="grid">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                    {quiz.category}
                  </span>

                  {/* Publish Status Badge */}
                  <span style={{
                    fontSize: '0.8rem',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    background: quiz.published ? '#dcfce7' : '#fee2e2',
                    color: quiz.published ? '#16a34a' : '#dc2626'
                  }}>
                    {quiz.published ? '● LIVE (Published)' : '○ DRAFT'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{quiz.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {quiz.description || 'No description.'}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <span>⏱️ Duration: <strong>{quiz.duration} mins</strong></span> | <span>Difficulty: <strong>{quiz.difficulty}</strong></span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link to={`/teacher/quiz/${quiz._id}/questions`} className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem' }}>
                    ⚙️ Manage Questions
                  </Link>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleTogglePublish(quiz)}
                      className="btn btn-secondary"
                      style={{ flex: 1, fontSize: '0.85rem' }}
                    >
                      {quiz.published ? 'Unpublish' : 'Publish Live'}
                    </button>

                    <Link to={`/leaderboard/${quiz._id}`} className="btn btn-secondary" title="View Student Rankings">
                      🏆
                    </Link>

                    <button
                      onClick={() => handleDeleteQuiz(quiz._id, quiz.title)}
                      className="btn btn-danger"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      title="Delete Quiz"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;