import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-page">
      {/* Floating decorative orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      <div className="floating-orb orb-4"></div>

      {/* Sparkle effects */}
      <div className="sparkle sparkle-1"></div>
      <div className="sparkle sparkle-2"></div>
      <div className="sparkle sparkle-3"></div>
      <div className="sparkle sparkle-4"></div>
      <div className="sparkle sparkle-5"></div>

      <div className="welcome-content">
        {/* Main Logo/Brand */}
        <div className="brand-header">
          <h1 className="main-title">THE WAY OF ALETHEA</h1>
          <div className="subtitle">Habit • Mood • Goal Tracker</div>
        </div>

        {/* Main content card */}
        <div className="welcome-card">
          <div className="card-gradient-top"></div>
          
          <h2 className="welcome-heading">🌟 Welcome to Your Journey</h2>
          
          <p className="welcome-description">
            Transform your daily routine into a path of continuous growth. 
            Track your habits, monitor your moods, and achieve your goals with 
            precision and mindfulness.
          </p>

          {/* Feature highlights */}
          <div className="feature-grid">
            <div className="feature-card feature-goals">
              <div className="feature-icon">🎯</div>
              <div className="feature-text">Goal Achievement</div>
            </div>

            <div className="feature-card feature-habits">
              <div className="feature-icon">✅</div>
              <div className="feature-text">Habit Building</div>
            </div>

            <div className="feature-card feature-moods">
              <div className="feature-icon">😊</div>
              <div className="feature-text">Mood Tracking</div>
            </div>
          </div>
        </div>

        {/* Motivational quote */}
        <blockquote className="motivational-quote">
          <div className="quote-mark-start">"</div>
          <span className="quote-text">
            Excellence is not an act, but a habit. We are what we repeatedly do.
          </span>
          <div className="quote-mark-end">"</div>
        </blockquote>

        {/* Action buttons */}
        <div className="welcome-buttons">
          <Link to="/signup" className="welcome-btn primary">
            🚀 Get Started
          </Link>
          <Link to="/login" className="welcome-btn secondary">
            🔐 Login
          </Link>
        </div>

        {/* Additional info */}
        <div className="info-banner">
          <span className="shimmer-effect"></span>
          <p className="info-text">
            ✨ Start your transformation journey today • Build lasting habits • Track meaningful progress
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;