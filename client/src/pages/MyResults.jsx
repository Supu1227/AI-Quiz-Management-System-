import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await API.get('/results');
        setResults(res.data.results || []);
      } catch (err) {
        console.error('Failed to load results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading your results...</div>;

  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>My Quiz History 🎯</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review your past attempts and track your academic improvement</p>
        </div>

        <Link to="/student" className="btn btn-secondary">
          ← Available Quizzes
        </Link>
      </div>

      {results.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No Quizzes Attempted Yet</h3>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px' }}>
            Take your first quiz to see your scores and progress recorded here!
          </p>
          <Link to="/student" className="btn btn-primary">
            Browse Quizzes →
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th>Category</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Attempted On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res) => (
                  <tr key={res._id}>
                    <td><strong>{res.quizId?.title || 'Untitled Quiz'}</strong></td>
                    <td>
                      <span style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                        {res.quizId?.category || 'General'}
                      </span>
                    </td>
                    <td>{res.score} / {res.totalQuestions}</td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: res.percentage >= 70 ? '#dcfce7' : res.percentage >= 50 ? '#fef3c7' : '#fee2e2',
                        color: res.percentage >= 70 ? '#15803d' : res.percentage >= 50 ? '#b45309' : '#b91c1c'
                      }}>
                        {res.percentage}%
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {new Date(res.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Link to={`/result/${res._id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                        View Details →
                      </Link>
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

export default MyResults;