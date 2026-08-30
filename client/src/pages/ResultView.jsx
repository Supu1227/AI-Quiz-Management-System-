import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const ResultView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState(location.state?.result || null);
  const [details, setDetails] = useState(location.state?.details || []);
  const [loading, setLoading] = useState(!result);

  useEffect(() => {
    // If user refreshed the page or arrived via link, fetch result from backend
    if (!result) {
      const fetchResult = async () => {
        try {
          const res = await API.get(`/results/${id}`);
          setResult(res.data.result);
        } catch (err) {
          console.error('Failed to load result:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchResult();
    }
  }, [id, result]);

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading your scorecard...</div>;
  }

  if (!result) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Result not found</h2>
        <Link to="/student" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const passed = result.percentage >= 50;

  return (
    <div className="container" style={{ maxWidth: '750px' }}>
      {/* Scorecard Hero Banner */}
      <div className="card" style={{ textAlign: 'center', padding: '40px 20px', background: passed ? '#f0fdf4' : '#fff1f2', borderColor: passed ? '#86efac' : '#fca5a5' }}>
        <span style={{ fontSize: '3.5rem' }}>{passed ? '🎉' : '📚'}</span>
        <h1 style={{ fontSize: '2rem', marginTop: '10px' }}>
          {passed ? 'Great Effort!' : 'Keep Practicing!'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
          Exam Completed: {new Date(result.createdAt).toLocaleDateString()}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', margin: '30px 0' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: passed ? '#16a34a' : '#dc2626' }}>
              {result.percentage}%
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>FINAL GRADE</span>
          </div>

          <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '30px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)' }}>
              {result.score} / {result.totalQuestions}
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>SCORE</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to={`/leaderboard/${result.quizId?._id || result.quizId}`} className="btn btn-primary">
            🏆 View Leaderboard
          </Link>
          <Link to="/student" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Detailed Question Review (If available) */}
      {details.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Detailed Answer Review</h3>

          {details.map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '20px', borderLeft: `6px solid ${item.isCorrect ? '#10b981' : '#ef4444'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700 }}>Question {idx + 1}</span>
                <span style={{ fontWeight: 700, color: item.isCorrect ? '#10b981' : '#ef4444' }}>
                  {item.isCorrect ? '✓ Correct (+1)' : '✗ Incorrect (0)'}
                </span>
              </div>

              <p style={{ fontSize: '1.05rem', marginBottom: '14px' }}>{item.questionText}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {item.options.map((opt, optIdx) => {
                  const isUserChoice = item.selectedOption === optIdx;
                  const isCorrectChoice = item.correctAnswer === optIdx;

                  let optBg = '#f8fafc';
                  let optBorder = 'transparent';
                  let label = null;

                  if (isCorrectChoice) {
                    optBg = '#dcfce7';
                    optBorder = '#86efac';
                    label = ' (Correct Answer)';
                  }
                  if (isUserChoice && !isCorrectChoice) {
                    optBg = '#fee2e2';
                    optBorder = '#fca5a5';
                    label = ' (Your Answer)';
                  }

                  return (
                    <div
                      key={optIdx}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '6px',
                        background: optBg,
                        border: `1px solid ${optBorder}`,
                        fontSize: '0.95rem'
                      }}
                    >
                      <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt} <strong>{label}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultView;