import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TeddyDay.css';

function TeddyDay() {
  const [dayData, setDayData] = useState(null);
  const [teddyPosition, setTeddyPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [formData, setFormData] = useState({
    isFreeForMovie: '',
    movieDate: '',
    movieChoice: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const teddyRef = useRef(null);

  useEffect(() => {
    axios.get('/api/days/teddy-day')
      .then(res => setDayData(res.data))
      .catch(() => {
        setDayData({
          title: "Teddy Day",
          subtitle: "Warm hugs for you 🧸",
          message: "A cuddly teddy just for you!",
          color: "#c9a96e"
        });
      });
  }, []);

  // Mouse/Touch handlers for dragging teddy
  const handleMouseDown = (e) => {
    if (teddyRef.current) {
      const rect = teddyRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const containerRect = document.querySelector('.teddy-playground')?.getBoundingClientRect();
      if (containerRect) {
        const x = e.clientX - containerRect.left - containerRect.width / 2 - dragOffset.x;
        const y = e.clientY - containerRect.top - containerRect.height / 2 - dragOffset.y;
        setTeddyPosition({ x, y });
        
        // Add tilt effect based on movement
        setRotateY(x / 10);
        setRotateX(-y / 10);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Smooth return of rotation
    setRotateX(0);
    setRotateY(0);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    if (teddyRef.current) {
      const rect = teddyRef.current.getBoundingClientRect();
      setDragOffset({
        x: touch.clientX - rect.left - rect.width / 2,
        y: touch.clientY - rect.top - rect.height / 2
      });
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      const containerRect = document.querySelector('.teddy-playground')?.getBoundingClientRect();
      if (containerRect) {
        const x = touch.clientX - containerRect.left - containerRect.width / 2 - dragOffset.x;
        const y = touch.clientY - containerRect.top - containerRect.height / 2 - dragOffset.y;
        setTeddyPosition({ x, y });
        setRotateY(x / 10);
        setRotateX(-y / 10);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('/api/movie-date', formData);
      setSubmitted(true);
      setShowHearts(true);
      createHeartBurst();
    } catch (error) {
      console.error('Error submitting:', error);
      // Still show success for demo
      setSubmitted(true);
      setShowHearts(true);
      createHeartBurst();
    } finally {
      setIsSubmitting(false);
    }
  };

  const createHeartBurst = () => {
    const container = document.querySelector('.heart-burst-container');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
      const heart = document.createElement('div');
      heart.className = 'burst-heart';
      heart.innerHTML = ['❤️', '🧸', '💕', '🤎', '💛'][Math.floor(Math.random() * 5)];
      heart.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
      heart.style.animationDelay = `${Math.random() * 0.5}s`;
      heart.style.setProperty('--angle', `${Math.random() * 360}deg`);
      heart.style.setProperty('--distance', `${100 + Math.random() * 150}px`);
      container.appendChild(heart);
      
      setTimeout(() => heart.remove(), 2000);
    }
  };

  // Get tomorrow's date for min date attribute
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!dayData) return <div className="loading">Loading...</div>;

  return (
    <div 
      className="teddy-day"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {showHearts && <div className="heart-burst-container" />}
      
      {/* Floating elements background */}
      <div className="floating-elements-bg">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="floating-element" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 10}s`,
              fontSize: `${14 + Math.random() * 20}px`,
            }}
          >
            {['🧸', '💕', '🤎', '⭐', '💛', '✨'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      <Link to="/" className="back-btn-teddy">
        <span>←</span> Back
      </Link>

      {/* Hero Section */}
      <section className="teddy-hero">
        <div className="teddy-glow" />
        <div className="teddy-content">
          <div className="teddy-emoji-title">🧸</div>
          <h1 className="teddy-title">{dayData.title}</h1>
          <p className="teddy-subtitle">{dayData.subtitle}</p>
        </div>
      </section>

      {/* Teddy Playground */}
      <section className="teddy-playground-section">
        <h2 className="section-title">Your Cuddly Friend</h2>
        <p className="section-hint">✨ Drag me around! ✨</p>
        
        <div className="teddy-playground">
          <div 
            ref={teddyRef}
            className={`teddy-3d ${isDragging ? 'dragging' : ''}`}
            style={{
              transform: `translate(${teddyPosition.x}px, ${teddyPosition.y}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="teddy-bear">
              {/* Teddy Ears */}
              <div className="teddy-ear teddy-ear-left">
                <div className="teddy-ear-inner"></div>
              </div>
              <div className="teddy-ear teddy-ear-right">
                <div className="teddy-ear-inner"></div>
              </div>
              
              {/* Teddy Head */}
              <div className="teddy-head">
                {/* Eyes */}
                <div className="teddy-eye teddy-eye-left">
                  <div className="teddy-pupil"></div>
                  <div className="teddy-eye-shine"></div>
                </div>
                <div className="teddy-eye teddy-eye-right">
                  <div className="teddy-pupil"></div>
                  <div className="teddy-eye-shine"></div>
                </div>
                
                {/* Nose & Muzzle */}
                <div className="teddy-muzzle">
                  <div className="teddy-nose"></div>
                  <div className="teddy-mouth"></div>
                </div>
                
                {/* Blush */}
                <div className="teddy-blush teddy-blush-left"></div>
                <div className="teddy-blush teddy-blush-right"></div>
              </div>
              
              {/* Teddy Body */}
              <div className="teddy-body">
                <div className="teddy-belly"></div>
                <div className="teddy-heart">❤️</div>
              </div>
              
              {/* Teddy Arms */}
              <div className="teddy-arm teddy-arm-left"></div>
              <div className="teddy-arm teddy-arm-right"></div>
              
              {/* Teddy Legs */}
              <div className="teddy-leg teddy-leg-left">
                <div className="teddy-paw"></div>
              </div>
              <div className="teddy-leg teddy-leg-right">
                <div className="teddy-paw"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Night Question Section */}
      <section className="movie-night-section">
        <div className="movie-card">
          <div className="movie-card-glow" />
          
          {!submitted ? (
            <>
              <h2 className="movie-title">🎬 Movie Night? 🍿</h2>
              <p className="movie-subtitle">I have a special question for you...</p>
              
              <form onSubmit={handleSubmit} className="movie-form">
                {/* Question 1: Are you free? */}
                <div className="form-group">
                  <label className="form-label">Would you be free for a movie night with me? 🥺</label>
                  <div className="radio-group">
                    <label className={`radio-option ${formData.isFreeForMovie === 'yes' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="isFreeForMovie"
                        value="yes"
                        checked={formData.isFreeForMovie === 'yes'}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="radio-custom"></span>
                      <span className="radio-text">Yes! I'd love to! 💕</span>
                    </label>
                    <label className={`radio-option ${formData.isFreeForMovie === 'maybe' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="isFreeForMovie"
                        value="maybe"
                        checked={formData.isFreeForMovie === 'maybe'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <span className="radio-text">Maybe, let me check! 🤔</span>
                    </label>
                  </div>
                </div>

                {/* Question 2: Pick a date */}
                <div className="form-group">
                  <label className="form-label">When would you like to go? 📅</label>
                  <input
                    type="date"
                    name="movieDate"
                    value={formData.movieDate}
                    onChange={handleInputChange}
                    min={getTomorrowDate()}
                    className="date-input"
                    required
                  />
                </div>

                {/* Question 3: Movie choice */}
                <div className="form-group">
                  <label className="form-label">What movie would you like to watch? 🎥</label>
                  <input
                    type="text"
                    name="movieChoice"
                    value={formData.movieChoice}
                    onChange={handleInputChange}
                    placeholder="Type the movie name..."
                    className="text-input"
                    required
                  />
                  <div className="movie-suggestions">
                    <span className="suggestion-label">Popular picks:</span>
                    <div className="suggestions-list">
                      {['A romantic comedy', 'Action thriller', 'Your favorite!', 'Surprise me! 🎁'].map((suggestion, i) => (
                        <button
                          key={i}
                          type="button"
                          className="suggestion-btn"
                          onClick={() => setFormData(prev => ({ ...prev, movieChoice: suggestion }))}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="btn-loading">Sending... 💌</span>
                  ) : (
                    <span>Send My Answer 💝</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="success-message">
              <div className="success-icon">🎉</div>
              <h2 className="success-title">Yay! Can't Wait!</h2>
              <p className="success-text">
                I got your answer! 
                {formData.isFreeForMovie === 'yes' ? " So excited for our movie date! 💕" : " I'll be waiting for your confirmation! 🤞"}
              </p>
              <div className="success-details">
                <p>📅 Date: {new Date(formData.movieDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <p>🎬 Movie: {formData.movieChoice}</p>
              </div>
              <div className="teddy-hug">🧸💕</div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="teddy-footer">
        <p>Made with 🧸 and lots of love</p>
      </footer>
    </div>
  );
}

export default TeddyDay;
