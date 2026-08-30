import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const TeacherStats = () => {
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/results/teacher/stats');
        setStats(res.data.stats);
        setResults(res.data.results || []);
      } catch (err) {
        console.error('Failed to load teacher stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading analytics...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Student Performance & Analytics 📊</h1>
          <p style={{ color: 'var(--text-muted)' }}>Overview of student submissions and scores across your quizzes</p>
        </div>

        <Link to="/teacher" className="btn btn-secondary">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
          <span style={{ fontSize: '2rem' }}>📚</span>
          <h3 style={{ fontSize: '2rem', marginTop: '6px' }}>{stats?.totalQuizzes || 0}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Quizzes Created</span>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
          <span style={{ fontSize: '2rem' }}>📝</span>
          <h3 style={{ fontSize: '2rem', marginTop: '6px' }}>{stats?.totalAttempts || 0}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Student Attempts</span>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
          <span style={{ fontSize: '2rem' }}>🎯</span>
          <h3 style={{ fontSize: '2rem', marginTop: '6px', color: '#16a34a' }}>{stats?.averageScore || 0}%</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Average Class Score</span>
        </div>
      </div>

      {/* Student Submissions Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Recent Quiz Submissions</h3>
        </div>

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No students have attempted your quizzes yet.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Quiz Title</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Date Attempted</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.studentId?.name || 'Student'}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.studentId?.email}</div>
                    </td>
                    <td><strong>{item.quizId?.title || 'Untitled Quiz'}</strong></td>
                    <td>{item.score} / {item.totalQuestions}</td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: item.percentage >= 70 ? '#dcfce7' : item.percentage >= 50 ? '#fef3c7' : '#fee2e2',
                        color: item.percentage >= 70 ? '#15803d' : item.percentage >= 50 ? '#b45309' : '#b91c1c'
                      }}>
                        {item.percentage}%
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherStats;
