import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const QuizAttempt = () => {
  const { id } = useParams(); // Quiz ID from URL
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: optionIndex }
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const timerRef = useRef(null);

  // 1. Fetch Quiz Details & Questions
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const [quizRes, qRes] = await Promise.all([
          API.get(`/quizzes/${id}`),
          API.get(`/quizzes/${id}/questions`)
        ]);

        setQuiz(quizRes.data.quiz);
        setQuestions(qRes.data.questions || []);
        setTimeLeft(quizRes.data.quiz.duration * 60); // Convert minutes to seconds
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load exam questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  // 2. Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0 && !loading && questions.length > 0) {
      // Auto-submit when time reaches zero!
      handleAutoSubmit();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, loading, questions]);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Select an option
  const handleSelectOption = (optionIndex) => {
    const currentQ = questions[currentIndex];
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ._id]: optionIndex
    });
  };

  // Submit Exam
  const handleSubmit = async (isAuto = false) => {
    if (!isAuto && !window.confirm('Are you sure you want to submit your quiz?')) {
      return;
    }

    setSubmitting(true);
    clearInterval(timerRef.current);

    try {
      // Prepare payload for backend calculation engine
      const answersPayload = questions.map((q) => ({
        questionId: q._id,
        selectedOption: selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : null
      }));

      const res = await API.post(`/quizzes/${id}/submit`, {
        answers: answersPayload
      });

      // Navigate to Result page with the submission details
      navigate(`/result/${res.data.result._id}`, {
        state: {
          result: res.data.result,
          details: res.data.details,
          quizTitle: quiz.title
        }
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quiz');
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    if (!submitting) {
      alert('⏰ Time is up! Your answers are being automatically submitted.');
      handleSubmit(true);
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Preparing your quiz environment...</div>;
  }

  if (error) {
    return <div className="container" style={{ color: 'var(--danger)', padding: '50px', textAlign: 'center' }}>{error}</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>This quiz does not have any questions yet!</h2>
        <button onClick={() => navigate('/student')} className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isUrgent = timeLeft < 60; // Less than 1 minute remaining

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      {/* Top Header: Quiz Name, Timer, and Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>{quiz?.title}</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Live Timer Badge */}
        <div className={`timer-badge ${isUrgent ? 'urgent' : ''}`}>
          ⏰ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Jump Badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {questions.map((q, idx) => {
          const isAnswered = selectedAnswers[q._id] !== undefined;
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q._id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '36px',
                height: '36px',
                padding: 0,
                borderRadius: '8px',
                fontSize: '0.85rem',
                background: isCurrent ? 'var(--primary)' : isAnswered ? '#10b981' : '#e2e8f0',
                color: isCurrent || isAnswered ? 'white' : '#334155',
                fontWeight: 700
              }}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="card" style={{ padding: '30px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', lineHeight: '1.6' }}>
          {currentIndex + 1}. {currentQ.questionText}
        </h3>

        {/* 4 Options Selection */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedAnswers[currentQ._id] === optIdx;
            return (
              <div
                key={optIdx}
                className={`option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectOption(optIdx)}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  border: isSelected ? '7px solid var(--primary)' : '2px solid var(--border)',
                  background: 'white', display: 'inline-block'
                }} />
                <span style={{ fontSize: '1rem' }}>{option}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <button
            onClick={() => setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="btn btn-secondary"
          >
            ← Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="btn btn-primary"
            >
              Next Question →
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="btn btn-success"
              style={{ fontSize: '1rem', padding: '10px 24px' }}
            >
              {submitting ? 'Submitting...' : 'Submit Exam ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;