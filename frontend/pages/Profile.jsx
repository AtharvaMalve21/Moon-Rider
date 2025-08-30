import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../src/api.js';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setAvatarUrl(user?.avatarUrl || '');
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setSaving(true);
    try {
      const { user: updated } = await api.updateProfile({ name: name.trim(), avatarUrl });
      setUser(updated);
      setMsg('Profile updated successfully');
    } catch (e) {
      setErr(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 640, margin: '1rem auto' }}>
      <h2>Profile</h2>
      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginBottom: 6, color: 'var(--muted)' }}>Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />

        <label style={{ display: 'block', marginBottom: 6, color: 'var(--muted)' }}>Email</label>
        <input className="input" value={email} readOnly style={{ opacity: 0.8 }} />

        <label style={{ display: 'block', marginBottom: 6, color: 'var(--muted)' }}>Avatar URL</label>
        <input className="input" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />

        {avatarUrl ? (
          <div className="row">
            <div className="col" style={{ maxWidth: 180 }}>
              <div style={{ color: 'var(--muted)', marginBottom: 6 }}>Preview</div>
              <img
                src={avatarUrl}
                alt="avatar"
                style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #1f2937' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>
        ) : null}

        {err && <div style={{ color: 'var(--danger)', marginBottom: 8 }}>{err}</div>}
        {msg && <div style={{ color: 'var(--success)', marginBottom: 8 }}>{msg}</div>}

        <button className="button primary" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
      </form>
    </div>
  );
}
