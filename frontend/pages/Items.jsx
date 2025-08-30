import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../src/api.js';

export default function Items() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = useMemo(() => ({
    title: '',
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10)
  }), []);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.listItems();
      setItems(res.items);
      setErr('');
    } catch (e) {
      setErr(e.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description,
        amount: Number(form.amount || 0),
        date: form.date ? new Date(form.date).toISOString() : new Date().toISOString()
      };
      if (!payload.title) {
        setErr('Title is required');
        return;
      }
      if (editingId) {
        await api.updateItem(editingId, payload);
      } else {
        await api.createItem(payload);
      }
      await load();
      resetForm();
    } catch (e) {
      setErr(e.message || 'Save failed');
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      amount: item.amount ?? '',
      date: item.date ? new Date(item.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
    });
  };

  const onDelete = async (id) => {
    const ok = window.confirm('Delete this item?');
    if (!ok) return;
    try {
      await api.deleteItem(id);
      await load();
    } catch (e) {
      setErr(e.message || 'Delete failed');
    }
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return '';
    }
  };

  return (
    <div>
      <div className="card">
        <h2>{editingId ? 'Edit Item' : 'Add Item'}</h2>
        <form onSubmit={onSubmit} className="row">
          <div className="col">
            <input className="input" name="title" placeholder="Title" value={form.title} onChange={onChange} />
          </div>
          <div className="col">
            <input className="input" name="amount" type="number" placeholder="Amount" value={form.amount} onChange={onChange} />
          </div>
          <div className="col">
            <input className="input" name="date" type="date" value={form.date} onChange={onChange} />
          </div>
          <div className="col" style={{ minWidth: 500 }}>
            <input className="input" name="description" placeholder="Description" value={form.description} onChange={onChange} />
          </div>
          <div className="col" style={{ minWidth: 220 }}>
            <button className="button primary" type="submit" style={{ width: '48%' }}>
              {editingId ? 'Update' : 'Create'}
            </button>
            <button className="button" type="button" onClick={resetForm} style={{ width: '48%', marginLeft: '4%' }}>
              Reset
            </button>
          </div>
        </form>
        {err && <div style={{ color: 'var(--danger)', marginTop: '0.5rem' }}>{err}</div>}
      </div>

      <div className="card">
        <div className="flex">
          <h2>Items</h2>
          <div className="right">{loading && <span style={{ color: 'var(--muted)' }}>Loading...</span>}</div>
        </div>
        {items.length === 0 ? (
          <div style={{ color: 'var(--muted)' }}>No items yet. Create your first item above.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th style={{ width: 160 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td style={{ color: 'var(--muted)' }}>{item.description}</td>
                    <td>${Number(item.amount || 0).toFixed(2)}</td>
                    <td>{formatDate(item.date || item.createdAt)}</td>
                    <td>
                      <div className="flex">
                        <button className="button" onClick={() => onEdit(item)}>Edit</button>
                        <button className="button danger" onClick={() => onDelete(item._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
