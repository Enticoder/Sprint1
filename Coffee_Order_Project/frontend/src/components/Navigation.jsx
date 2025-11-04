// Navigation bar component
// Provides links to main pages and shows auth controls (Sign In/Logout)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

export default function Navigation({ showCart, cartInfo }) {
  // Access auth state and navigation for logout flow
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">Coffee Haven</Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/menu" className="nav-link">Menu</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>
      </div>
      <div className="nav-right">
        {/* Optional cart info badge shown when provided by pages like Menu */}
        {showCart && cartInfo && (
          <div className="cart-info">
            🛒 {cartInfo}
          </div>
        )}
        {/* Right side shows welcome + Logout when authenticated; else Sign In */}
        {user ? (
          <>
            <span className="welcome-text">Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="btn logout">Logout</button>
          </>
        ) : (
          <Link to="/auth" className="btn primary">Sign In</Link>
        )}
      </div>
    </nav>
  );
}