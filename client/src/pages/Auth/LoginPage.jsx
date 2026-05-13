import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';

const LoginPage = () => {
  const { login, loading, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const nextErrors = {};
    if (!form.email) nextErrors.email = 'Email is required';
    if (!form.password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    await login(form);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 16,
        background: 'linear-gradient(145deg, #00325d, #0e6ca5)'
      }}
    >
      <form className="card" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 420, padding: 20 }}>
        <h1 style={{ marginBottom: 8 }}>Hospital Management System</h1>
        <p style={{ color: 'var(--muted)', marginTop: 0, marginBottom: 18 }}>Sign in to continue.</p>

        <label className="label" htmlFor="email">Email</label>
        <input
          id="email"
          className="input"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <label className="label" htmlFor="password" style={{ marginTop: 12 }}>Password</label>
        <input
          id="password"
          className="input"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 16 }} disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
