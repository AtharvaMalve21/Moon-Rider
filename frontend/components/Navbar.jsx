import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div className="navbar">
      <div className="brand">MERN Dashboard</div>
      <div className="links">
        {user ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
            <NavLink to="/items" className={({ isActive }) => (isActive ? 'active' : '')}>Items</NavLink>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Profile</NavLink>
            <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} style={{ marginLeft: '1rem', color: '#ef4444' }}>Logout</a>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>Register</NavLink>
          </>
        )}
      </div>
    </div>
  );
}
