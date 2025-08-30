import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
    } catch (e) {
      setErr(e.message || 'Login failed');
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: '2rem auto' }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {err && <div style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>{err}</div>}
        <button className="button primary" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
      </form>
      <div style={{ marginTop: '0.75rem', color: 'var(--muted)' }}>
        No account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
