import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';
import CoffeeCarousel from '../index';
import './Home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <Navigation />
      
      <div className="carousel-container">
        <CoffeeCarousel />
        <div className="overlay">
          <div className="content">
            <h1>Coffee Haven</h1>
            <p>Experience the finest coffee varieties from around the world</p>
            <div className="cta-buttons">
              {!user && <Link to="/auth" className="btn primary">Sign In</Link>}
              <Link to="/menu" className="btn secondary">View Menu</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="features">
        <div className="feature">
          <div className="icon">☕</div>
          <h2>Premium Beans</h2>
          <p>Sourced from the finest farms across the globe</p>
        </div>
        <div className="feature">
          <div className="icon">🌱</div>
          <h2>Sustainable</h2>
          <p>Eco-friendly practices from farm to cup</p>
        </div>
        <div className="feature">
          <div className="icon">🛵</div>
          <h2>Fast Delivery</h2>
          <p>Hot coffee at your doorstep in minutes</p>
        </div>
      </div>
  </div>
  );
}