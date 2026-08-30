import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

const LeaderboardView = () => {
  const { id } = useParams(); // Quiz ID
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get(`/quizzes/${id}/leaderboard`);
        setLeaderboard(res.data.leaderboard || []);
      } catch (err) {
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [id]);

  const getRankBadge = (index) => {
    if (index === 0) return '🥇 1st';
    if (index === 1) return '🥈 2nd';
    if (index === 2) return '🥉 3rd';
    return `#${index + 1}`;
  };

  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>🏆 Quiz Leaderboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Top performing students on this exam</p>
        </div>

        <Link to="/student" className="btn btn-secondary">
          ← Back to Quizzes
        </Link>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '20px' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading rankings...</div>
      ) : leaderboard.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No Submissions Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Be the first student to complete this quiz and claim the #1 spot!
          </p>
          <Link to={`/quiz/${id}`} className="btn btn-primary" style={{ marginTop: '20px' }}>
            Take Quiz Now →
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '90px', textAlign: 'center' }}>Rank</th>
                  <th>Student Name</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Completed On</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, idx) => (
                  <tr key={item._id} style={{ background: idx === 0 ? '#fefce8' : 'inherit' }}>
                    <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.05rem' }}>
                      {getRankBadge(idx)}
                    </td>
                    <td>
                      <strong>{item.studentId?.name || 'Anonymous Student'}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {item.studentId?.email}
                      </div>
                    </td>
                    <td>
                      <strong>{item.score}</strong> / {item.totalQuestions}
                    </td>
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
        </div>
      )}
    </div>
  );
};

export default LeaderboardView;