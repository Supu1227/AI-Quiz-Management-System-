import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

const ManageQuestions = () => {
  const { id } = useParams(); // Quiz ID

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // New question form state
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [quizRes, qRes] = await Promise.all([
        API.get(`/quizzes/${id}`),
        API.get(`/quizzes/${id}/questions`)
      ]);
      setQuiz(quizRes.data.quiz);
      setQuestions(qRes.data.questions || []);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setError('');

    // Check that all 4 options are non-empty
    if (options.some(opt => !opt.trim())) {
      setError('Please provide all 4 options');
      return;
    }

    setSubmitting(true);

    try {
      await API.post(`/quizzes/${id}/questions`, {
        questionText,
        options,
        correctAnswer: Number(correctAnswer)
      });

      // Reset form
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);

      // Reload questions
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Delete this question?')) {
      try {
        await API.delete(`/questions/${questionId}`);
        loadData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete question');
      }
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading question manager...</div>;

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <Link to="/teacher" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '1.8rem', marginTop: '6px' }}>Manage Questions: {quiz?.title}</h1>
        </div>

        <Link
          to={`/ai-generator?quizId=${id}`}
          className="btn btn-secondary"
          style={{ borderColor: '#8b5cf6', color: '#7c3aed' }}
        >
          🤖 Generate with AI
        </Link>
      </div>

      {/* Add New Question Form */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>+ Add a New Question</h3>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '14px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAddQuestion}>
          <div className="form-group">
            <label>Question Text *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Which keyword is used to inherit a class in Java?"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>

          <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>
            Options (Select the radio button for the CORRECT answer) *
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {options.map((opt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={correctAnswer === idx}
                  onChange={() => setCorrectAnswer(idx)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  title="Mark as correct answer"
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  required
                />
                {correctAnswer === idx && (
                  <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    ✓ Correct
                  </span>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Adding Question...' : 'Save Question'}
          </button>
        </form>
      </div>

      {/* Existing Questions List */}
      <div>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>
          Questions in this Quiz ({questions.length})
        </h3>

        {questions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No questions yet! Add one above or use the AI Generator.
          </div>
        ) : (
          questions.map((q, idx) => (
            <div key={q._id} className="card" style={{ marginBottom: '14px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                  {idx + 1}. {q.questionText}
                </span>
                <button
                  onClick={() => handleDeleteQuestion(q._id)}
                  className="btn btn-danger"
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                >
                  Delete
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {q.options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      background: q.correctAnswer === optIdx ? '#dcfce7' : '#f8fafc',
                      border: `1px solid ${q.correctAnswer === optIdx ? '#86efac' : '#e2e8f0'}`,
                      fontWeight: q.correctAnswer === optIdx ? 700 : 400
                    }}
                  >
                    <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                    {q.correctAnswer === optIdx && ' ✓'}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageQuestions;