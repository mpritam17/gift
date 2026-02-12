import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './KissDay.css';

const CHEESY_LINES = [
  "I'd like every one of my day to start with your kisses ✨",
  "Your lips are like a switch, and your kisshies turn me on instantly 💋",
  "One kiss from you and I forget the world exists 💫",
  "Given a chance I'd love to kiss all four of your lipsss 😘",
  "Your kiss is the magic spell I never want to break 🪄"
];

function KissDay() {
  const [dayData, setDayData] = useState(null);
  const [currentLine, setCurrentLine] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [kissSent, setKissSent] = useState(false);
  const [flyingKisses, setFlyingKisses] = useState([]);

  // Floating hearts background
  const floatingElements = useMemo(() => {
    const emojis = ['💋', '💕', '💗', '✨', '💖', '🌹'];
    return [...Array(18)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${8 + Math.random() * 10}s`,
      fontSize: `${14 + Math.random() * 18}px`,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
  }, []);

  useEffect(() => {
    axios.get('/api/days/kiss-day')
      .then(res => setDayData(res.data))
      .catch(() => {
        setDayData({
          title: "Kiss Day",
          subtitle: "A kiss to seal it all 💋",
          message: "Sending you the sweetest kisses!",
          color: "#e76f8a"
        });
      });
  }, []);

  // Auto-rotate cheesy lines
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine(prev => (prev + 1) % CHEESY_LINES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendKiss = () => {
    setKissSent(true);
    
    // Create flying kisses animation
    const newKisses = [];
    for (let i = 0; i < 15; i++) {
      newKisses.push({
        id: Date.now() + i,
        startX: 50,
        endX: 30 + Math.random() * 40,
        duration: 1 + Math.random() * 1.5,
        delay: Math.random() * 0.5
      });
    }
    setFlyingKisses(newKisses);

    setTimeout(() => {
      setFlyingKisses([]);
    }, 3000);
  };

  if (!dayData) {
    return <div className="loading">Preparing kisses...</div>;
  }

  return (
    <div className="kiss-day">
      {/* Floating background elements */}
      <div className="floating-elements-kiss">
        {floatingElements.map(el => (
          <span
            key={el.id}
            className="floating-element-kiss"
            style={{
              left: el.left,
              animationDelay: el.animationDelay,
              animationDuration: el.animationDuration,
              fontSize: el.fontSize
            }}
          >
            {el.emoji}
          </span>
        ))}
      </div>

      {/* Flying kisses */}
      <div className="flying-kisses-container">
        {flyingKisses.map(kiss => (
          <span
            key={kiss.id}
            className="flying-kiss"
            style={{
              '--startX': `${kiss.startX}%`,
              '--endX': `${kiss.endX}%`,
              animationDuration: `${kiss.duration}s`,
              animationDelay: `${kiss.delay}s`
            }}
          >
            💋
          </span>
        ))}
      </div>

      <Link to="/" className="back-btn-kiss">
        <span>←</span> Home
      </Link>

      <div className="kiss-content">
        <h1 className="kiss-title">{dayData.title}</h1>
        <p className="kiss-subtitle">{dayData.subtitle}</p>

        {/* Romantic card */}
        <div className="romantic-card">
          <div className="card-glow"></div>
          
          <div className="lips-container">
            <span className="big-lips">💋</span>
            <div className="lips-sparkle">✨</div>
          </div>

          {/* Cheesy line carousel */}
          <div className="cheesy-line-container">
            <p className="cheesy-line" key={currentLine}>
              {CHEESY_LINES[currentLine]}
            </p>
          </div>

          {/* Line indicators */}
          <div className="line-indicators">
            {CHEESY_LINES.map((_, idx) => (
              <span 
                key={idx} 
                className={`indicator ${idx === currentLine ? 'active' : ''}`}
                onClick={() => setCurrentLine(idx)}
              />
            ))}
          </div>
        </div>

        {/* Send a kiss section */}
        <div className="send-kiss-section">
          {!kissSent ? (
            <button className="send-kiss-btn" onClick={sendKiss}>
              <span className="btn-kiss-emoji">😘</span>
              <span className="btn-kiss-text">Send a Kiss</span>
            </button>
          ) : (
            <div className="kiss-received">
              <div className="kiss-received-emoji">🥰</div>
              <p className="kiss-received-text">Kiss received! My heart is melting... 💗</p>
            </div>
          )}
        </div>

        {/* Romantic quote */}
        <div className="romantic-quote">
          <span className="quote-mark">"</span>
          <p>I am gonna learn how to kiss you properly by the next time for sure </p>
          <span className="quote-mark">"</span>
        </div>

        {/* Heart decoration */}
        <div className="hearts-decoration">
          <span className="deco-heart" style={{ '--delay': '0s' }}>💕</span>
          <span className="deco-heart" style={{ '--delay': '0.5s' }}>💗</span>
          <span className="deco-heart" style={{ '--delay': '1s' }}>💖</span>
        </div>
      </div>
    </div>
  );
}

export default KissDay;
