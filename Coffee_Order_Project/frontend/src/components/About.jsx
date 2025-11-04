// About page component
// Shares brand story, values, team, and stats
import React from 'react';
import Navigation from './Navigation';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <Navigation />
      
      <div className="about-container">
        <div className="about-header">
          <h1>About Coffee Haven</h1>
          <p>Discover our passion for exceptional coffee and community</p>
        </div>

        <div className="about-content">
          <div className="about-story">
            <h2>Our Story</h2>
            <p>
              Founded in 2015, Coffee Haven began as a small passion project between friends who shared 
              a love for exceptional coffee. What started as a humble coffee cart has grown into a 
              beloved community hub where people gather to enjoy premium coffee, share stories, and 
              create lasting memories.
            </p>
          </div>

          <div className="about-values">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🌱</div>
                <h3>Sustainability</h3>
                <p>We source ethically and support sustainable farming practices</p>
              </div>
              <div className="value-card">
                <div className="value-icon">☕</div>
                <h3>Quality</h3>
                <p>Only the finest beans, roasted to perfection for exceptional flavor</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Community</h3>
                <p>Building connections and supporting local initiatives</p>
              </div>
              <div className="value-card">
                <div className="value-icon">✨</div>
                <h3>Innovation</h3>
                <p>Constantly exploring new brewing techniques and flavors</p>
              </div>
            </div>
          </div>

          <div className="about-team">
            <h2>Meet Our Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">S</div>
                <h3>Sarah Chen</h3>
                <p>Head Barista & Founder</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">M</div>
                <h3>Michael Rodriguez</h3>
                <p>Coffee Roaster</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">E</div>
                <h3>Emily Johnson</h3>
                <p>Pastry Chef</p>
              </div>
            </div>
          </div>

          <div className="about-stats">
            <h2>By The Numbers</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">5000+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">8</div>
                <div className="stat-label">Years Serving</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">15</div>
                <div className="stat-label">Coffee Varieties</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}