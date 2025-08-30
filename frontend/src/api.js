const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token') || '';
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  updateProfile: (payload) => request('/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  listItems: () => request('/items'),
  createItem: (payload) => request('/items', { method: 'POST', body: JSON.stringify(payload) }),
  getItem: (id) => request(`/items/${id}`),
  updateItem: (id, payload) => request(`/items/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteItem: (id) => request(`/items/${id}`, { method: 'DELETE' }),
  dailyStats: (days = 30) => request(`/stats/daily?days=${days}`)
};
