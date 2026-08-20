import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { DEMO_ADMIN_CREDENTIALS } from '../services/adminAuth';
import { useAdminAuth } from './auth/AdminAuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated, isSuperAdmin, bootstrapping } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/admin';

  if (!bootstrapping && isAuthenticated && isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-pill">DILYUM</span>
          <h1>Super Admin Login</h1>
          <p>Platform control for restaurants, menus, and QR systems.</p>
        </div>

        <form className="admin-form" onSubmit={onSubmit} noValidate>
          <label className="admin-field">
            <span>Admin Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dilyum.com"
              required
            />
          </label>

          <label className="admin-field">
            <span>Admin Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}

          <button type="submit" className="admin-btn admin-btn-primary admin-btn-block" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p className="admin-login-hint">
          Demo: <code>{DEMO_ADMIN_CREDENTIALS.email}</code> / <code>{DEMO_ADMIN_CREDENTIALS.password}</code>
        </p>
      </div>
    </div>
  );
}
