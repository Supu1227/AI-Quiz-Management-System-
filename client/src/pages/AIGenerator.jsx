import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const AIGenerator = () => {
  const [searchParams] = useSearchParams();
  const preselectedQuizId = searchParams.get('quizId') || '';
  const navigate = useNavigate();

  // Input states
  const [mode, setMode] = useState('topic'); // 'topic' or 'notes'
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [numQuestions, setNumQuestions] = useState(3);
  const [difficulty, setDifficulty] = useState('medium');
  const [selectedQuizId, setSelectedQuizId] = useState(preselectedQuizId);

  // Review states
  const [quizzes, setQuizzes] = useState([]);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch teacher's quizzes for the destination dropdown
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await API.get('/quizzes');
        setQuizzes(res.data.quizzes || []);
        if (!selectedQuizId && res.data.quizzes?.length > 0) {
          setSelectedQuizId(res.data.quizzes[0]._id);
        }
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      }
    };

    fetchQuizzes();
  }, [selectedQuizId]);

  // Handle AI generation request
  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setGenerating(true);

    try {
      const payload = {
        numQuestions: Number(numQuestions),
        difficulty
      };

      if (mode === 'topic') {
        if (!topic.trim()) throw new Error('Please enter a topic');
        payload.topic = topic.trim();
      } else {
        if (!notes.trim()) throw new Error('Please paste your study notes');
        payload.notes = notes.trim();
      }

      const res = await API.post('/ai/generate', payload);
      setGeneratedQuestions(res.data.questions || []);
      setSuccessMsg(`Generated ${res.data.questions.length} questions! Review and edit them below.`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  // Editing generated question text
  const handleEditQuestionText = (idx, text) => {
    const updated = [...generatedQuestions];
    updated[idx].questionText = text;
    setGeneratedQuestions(updated);
  };

  // Editing generated options
  const handleEditOption = (qIdx, optIdx, text) => {
    const updated = [...generatedQuestions];
    updated[qIdx].options[optIdx] = text;
    setGeneratedQuestions(updated);
  };

  // Changing correct answer
  const handleSetCorrectAnswer = (qIdx, optIdx) => {
    const updated = [...generatedQuestions];
    updated[qIdx].correctAnswer = optIdx;
    setGeneratedQuestions(updated);
  };

  // Delete a generated question from review
  const handleDeleteGenerated = (idx) => {
    setGeneratedQuestions(generatedQuestions.filter((_, i) => i !== idx));
  };

  // Save approved questions to the selected quiz
  const handleApproveAndSave = async () => {
    if (!selectedQuizId) {
      alert('Please select a quiz to add these questions to');
      return;
    }

    if (generatedQuestions.length === 0) {
      alert('No questions to save');
      return;
    }

    setSaving(true);

    try {
      // Loop and save each approved question
      for (const q of generatedQuestions) {
        await API.post(`/quizzes/${selectedQuizId}/questions`, {
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer
        });
      }

      alert('🎉 Approved questions successfully added to the quiz!');
      navigate(`/teacher/quiz/${selectedQuizId}/questions`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save some questions');
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/teacher" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          ← Back to Teacher Dashboard
        </Link>
      </div>

      {/* Generator Card */}
      <div className="card">
        <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🤖 AI Question Generator</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Use Google AI to instantly generate high-quality MCQs from any topic or raw teacher notes.
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            {successMsg}
          </div>
        )}

        {/* Mode Switch Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            type="button"
            className={`btn ${mode === 'topic' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMode('topic')}
          >
            📌 Option 1: Generate by Topic
          </button>
          <button
            type="button"
            className={`btn ${mode === 'notes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMode('notes')}
          >
            📝 Option 2: Generate from Study Notes
          </button>
        </div>

        <form onSubmit={handleGenerate}>
          {mode === 'topic' ? (
            <div className="form-group">
              <label>Topic Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Java Exception Handling, Database Normalization, Binary Trees..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required={mode === 'topic'}
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Paste Lecture / Study Notes *</label>
              <textarea
                className="form-textarea"
                rows={5}
                placeholder="Paste paragraph or study notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required={mode === 'notes'}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Number of Questions (1-10)</label>
              <input
                type="number"
                className="form-input"
                min="1"
                max="10"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
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

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '1rem', background: '#7c3aed' }}
            disabled={generating}
          >
            {generating ? '🤖 AI is analyzing & generating questions...' : '✨ Generate Questions with AI'}
          </button>
        </form>
      </div>

      {/* Review & Approve Section */}
      {generatedQuestions.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>Review & Approve Questions ({generatedQuestions.length})</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                You can freely edit question text, options, or delete questions before saving.
              </p>
            </div>

            {/* Target Quiz Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Target Quiz:</span>
              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
              >
                {quizzes.map((q) => (
                  <option key={q._id} value={q._id}>{q.title}</option>
                ))}
              </select>

              <button
                onClick={handleApproveAndSave}
                disabled={saving}
                className="btn btn-success"
              >
                {saving ? 'Saving...' : '✓ Approve & Add to Quiz'}
              </button>
            </div>
          </div>

          {/* Question Cards in Review */}
          {generatedQuestions.map((q, qIdx) => (
            <div key={qIdx} className="card" style={{ marginBottom: '20px', borderLeft: '6px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, color: '#7c3aed' }}>AI Question #{qIdx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteGenerated(qIdx)}
                  className="btn btn-danger"
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                >
                  Discard
                </button>
              </div>

              {/* Editable Question */}
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  value={q.questionText}
                  onChange={(e) => handleEditQuestionText(qIdx, e.target.value)}
                  placeholder="Question text"
                />
              </div>

              {/* Editable Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={q.correctAnswer === optIdx}
                      onChange={() => handleSetCorrectAnswer(qIdx, optIdx)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      title="Set as correct answer"
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={opt}
                      onChange={(e) => handleEditOption(qIdx, optIdx, e.target.value)}
                      style={{
                        background: q.correctAnswer === optIdx ? '#f0fdf4' : '#fff',
                        borderColor: q.correctAnswer === optIdx ? '#86efac' : 'var(--border)'
                      }}
                    />
                    {q.correctAnswer === optIdx && (
                      <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        ✓ Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Bottom Save Button */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={handleApproveAndSave}
              disabled={saving}
              className="btn btn-success"
              style={{ padding: '12px 30px', fontSize: '1.1rem' }}
            >
              {saving ? 'Saving Questions...' : '✓ Approve & Add All to Quiz'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGenerator;