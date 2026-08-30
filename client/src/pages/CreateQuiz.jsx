import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [duration, setDuration] = useState(15);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/quizzes', {
        title,
        description,
        category,
        difficulty,
        duration: Number(duration)
      });

      // Immediately navigate to add questions to this new quiz!
      navigate(`/teacher/quiz/${res.data.quiz._id}/questions`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '650px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/teacher" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.7rem', marginBottom: '8px' }}>Create a New Quiz</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Set up quiz details. You will add questions on the next step.
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Quiz Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Java Fundamentals & OOP"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Provide context or instructions for students..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Duration (Minutes for Student Timer) *</label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="180"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Creating Quiz...' : 'Save & Add Questions →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;