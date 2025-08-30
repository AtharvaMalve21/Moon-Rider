import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function Register() {
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await register(name, email, password);
    } catch (e) {
      setErr(e.message || 'Registration failed');
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: '2rem auto' }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {err && <div style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>{err}</div>}
        <button className="button primary" disabled={loading}>{loading ? 'Loading...' : 'Create account'}</button>
      </form>
      <div style={{ marginTop: '0.75rem', color: 'var(--muted)' }}>
        Have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
