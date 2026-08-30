import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand">
          <span className="brand-icon">⚡</span> AI QuizSystem
        </Link>

        {/* Dynamic Navigation Links Based on User Role */}
        <div className="nav-links">
          {user ? (
            <>
              {/* Student Links */}
              {user.role === 'student' && (
                <>
                  <Link to="/student" className="nav-item">Dashboard</Link>
                  <Link to="/results" className="nav-item">My Results</Link>
                </>
              )}

              {/* Teacher Links */}
              {user.role === 'teacher' && (
                <>
                  <Link to="/teacher" className="nav-item">Dashboard</Link>
                  <Link to="/create-quiz" className="nav-item">Create Quiz</Link>
                  <Link to="/ai-generator" className="nav-item ai-link">🤖 AI Generator</Link>
                  <Link to="/teacher/stats" className="nav-item">Performance</Link>
                </>
              )}

              {/* Admin Links */}
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-item">Admin Panel</Link>
              )}

              {/* User Badge & Logout */}
              <div className="nav-user-section">
                <span className={`role-badge role-${user.role}`}>
                  {user.role.toUpperCase()}
                </span>
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            // Logged Out Links
            <div className="auth-links">
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;