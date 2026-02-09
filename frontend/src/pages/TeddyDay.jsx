import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TeddyDay.css';

function TeddyDay() {
  const [dayData, setDayData] = useState(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    isFreeForMovie: '',
    movieDate: '',
    movieChoice: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const teddyRef = useRef(null);
  const containerRef = useRef(null);

  // Memoize floating elements so they don't re-render on drag
  const floatingElements = useMemo(() => {
    const emojis = ['🧸', '💕', '🤎', '⭐', '💛', '✨'];
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${8 + Math.random() * 10}s`,
      fontSize: `${14 + Math.random() * 20}px`,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
  }, []);

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

  // Mouse/Touch handlers for 360-degree rotation
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPosition.x;
    const deltaY = e.clientY - lastPosition.y;
    
    // Full 360 rotation - scale factor controls rotation speed
    setRotateY(prev => prev + deltaX * 0.5);
    setRotateX(prev => prev - deltaY * 0.5);
    
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setLastPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    
    const deltaX = touch.clientX - lastPosition.x;
    const deltaY = touch.clientY - lastPosition.y;
    
    setRotateY(prev => prev + deltaX * 0.5);
    setRotateX(prev => prev - deltaY * 0.5);
    
    setLastPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
    <div className="teddy-day">
      {showHearts && <div className="heart-burst-container" />}
      
      {/* Floating elements background */}
      <div className="floating-elements-bg">
        {floatingElements.map((el) => (
          <div 
            key={el.id} 
            className="floating-element" 
            style={{
              left: el.left,
              animationDelay: el.animationDelay,
              animationDuration: el.animationDuration,
              fontSize: el.fontSize,
            }}
          >
            {el.emoji}
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
        <p className="section-hint">✨ Drag to spin me around! ✨</p>
        
        <div 
          ref={containerRef}
          className="teddy-playground"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            ref={teddyRef}
            className={`teddy-3d ${isDragging ? 'dragging' : ''}`}
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="teddy-bear">
              {/* 3D Head - sphere made of layers */}
              <div className="teddy-head-3d">
                {[...Array(8)].map((_, i) => (
                  <div key={`head-${i}`} className={`head-layer head-layer-${i}`}></div>
                ))}
                {/* Eyes */}
                <div className="teddy-eye-3d teddy-eye-left">
                  <div className="eye-sphere">
                    <div className="eye-pupil"></div>
                    <div className="eye-shine"></div>
                  </div>
                </div>
                <div className="teddy-eye-3d teddy-eye-right">
                  <div className="eye-sphere">
                    <div className="eye-pupil"></div>
                    <div className="eye-shine"></div>
                  </div>
                </div>
                {/* Muzzle */}
                <div className="teddy-muzzle-3d">
                  {[...Array(5)].map((_, i) => (
                    <div key={`muzzle-${i}`} className={`muzzle-layer muzzle-layer-${i}`}></div>
                  ))}
                  <div className="teddy-nose-3d">
                    <div className="nose-top"></div>
                    <div className="nose-front"></div>
                  </div>
                  <div className="teddy-mouth"></div>
                </div>
                {/* Blush */}
                <div className="teddy-blush teddy-blush-left"></div>
                <div className="teddy-blush teddy-blush-right"></div>
              </div>
              
              {/* 3D Ears */}
              <div className="teddy-ear-3d teddy-ear-left">
                {[...Array(4)].map((_, i) => (
                  <div key={`ear-l-${i}`} className={`ear-layer ear-layer-${i}`}></div>
                ))}
                <div className="ear-inner-3d"></div>
              </div>
              <div className="teddy-ear-3d teddy-ear-right">
                {[...Array(4)].map((_, i) => (
                  <div key={`ear-r-${i}`} className={`ear-layer ear-layer-${i}`}></div>
                ))}
                <div className="ear-inner-3d"></div>
              </div>
              
              {/* 3D Body */}
              <div className="teddy-body-3d">
                {[...Array(8)].map((_, i) => (
                  <div key={`body-${i}`} className={`body-layer body-layer-${i}`}></div>
                ))}
                <div className="teddy-belly-3d">
                  {[...Array(4)].map((_, i) => (
                    <div key={`belly-${i}`} className={`belly-layer belly-layer-${i}`}></div>
                  ))}
                </div>
                <div className="teddy-heart">❤️</div>
              </div>
              
              {/* 3D Arms */}
              <div className="teddy-arm-3d teddy-arm-left">
                {[...Array(4)].map((_, i) => (
                  <div key={`arm-l-${i}`} className={`arm-layer arm-layer-${i}`}></div>
                ))}
                <div className="paw-3d"></div>
              </div>
              <div className="teddy-arm-3d teddy-arm-right">
                {[...Array(4)].map((_, i) => (
                  <div key={`arm-r-${i}`} className={`arm-layer arm-layer-${i}`}></div>
                ))}
                <div className="paw-3d"></div>
              </div>
              
              {/* 3D Legs */}
              <div className="teddy-leg-3d teddy-leg-left">
                {[...Array(4)].map((_, i) => (
                  <div key={`leg-l-${i}`} className={`leg-layer leg-layer-${i}`}></div>
                ))}
                <div className="foot-3d"></div>
              </div>
              <div className="teddy-leg-3d teddy-leg-right">
                {[...Array(4)].map((_, i) => (
                  <div key={`leg-r-${i}`} className={`leg-layer leg-layer-${i}`}></div>
                ))}
                <div className="foot-3d"></div>
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
                  <label className="form-label">When are you free? 📅</label>
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
                      {['A romantic comedy', 'Action thriller', 'Your favorite!', 'Something sexyy 😏'].map((suggestion, i) => (
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
