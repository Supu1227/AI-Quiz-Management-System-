import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/users')
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading Admin Console...</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>System Administration 🛡️</h1>
        <p style={{ color: 'var(--text-muted)' }}>Platform metrics, user directories, and overall performance.</p>
      </div>

      {/* Global Stat Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1.8rem' }}>🎓</span>
          <h3 style={{ fontSize: '2rem', marginTop: '6px' }}>{stats?.totalStudents || 0}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Students</span>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1.8rem' }}>👩‍🏫</span>
          <h3 style={{ fontSize: '2rem', marginTop: '6px' }}>{stats?.totalTeachers || 0}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Teachers</span>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1.8rem' }}>📚</span>
          <h3 style={{ fontSize: '2rem', marginTop: '6px' }}>{stats?.totalQuizzes || 0}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Quizzes</span>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1.8rem' }}>📝</span>
          <h3 style={{ fontSize: '2rem', marginTop: '6px' }}>{stats?.totalAttempts || 0}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Attempts</span>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1.8rem' }}>📈</span>
          <h3 style={{ fontSize: '2rem', marginTop: '6px', color: '#16a34a' }}>{stats?.averageScore || 0}%</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Avg Score</span>
        </div>
      </div>

      {/* Registered Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Registered Users ({users.length})</h3>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>User ID</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {u._id}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;