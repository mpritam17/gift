import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HugDay.css';

function HugDay() {
  const [dayData, setDayData] = useState(null);
  const [confetti, setConfetti] = useState([]);
  const [hugCount, setHugCount] = useState(0);
  const [isHugging, setIsHugging] = useState(false);

  // Floating background elements
  const floatingElements = useMemo(() => {
    const emojis = ['🤗', '💕', '🧡', '✨', '💛', '🫂'];
    return [...Array(12)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${8 + Math.random() * 10}s`,
      fontSize: `${14 + Math.random() * 14}px`,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
  }, []);

  useEffect(() => {
    axios.get('/api/days/hug-day')
      .then(res => setDayData(res.data))
      .catch(() => {
        setDayData({
          title: "Hug Day",
          subtitle: "Keep pressing till you don't feel good 🤗",
          message: "A warm hug just for you!",
          color: "#f4a261"
        });
      });
  }, []);

  const createConfetti = () => {
    const hugEmojis = ['🤗', '🫂', '💕', '💗', '💖', '💝', '🧡', '💛', '💚', '💙', '💜', '🤍', '❤️', '✨', '⭐'];
    const newConfetti = [];
    
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: Date.now() + i,
        emoji: hugEmojis[Math.floor(Math.random() * hugEmojis.length)],
        left: Math.random() * 100,
        animationDuration: 2 + Math.random() * 3,
        animationDelay: Math.random() * 0.5,
        size: 20 + Math.random() * 30,
        rotation: Math.random() * 360
      });
    }
    
    setConfetti(prev => [...prev, ...newConfetti]);
    
    // Clean up old confetti after animation
    setTimeout(() => {
      setConfetti(prev => prev.filter(c => !newConfetti.find(nc => nc.id === c.id)));
    }, 5000);
  };

  const handleHug = () => {
    setIsHugging(true);
    setHugCount(prev => prev + 1);
    createConfetti();
    
    setTimeout(() => {
      setIsHugging(false);
    }, 1000);
  };

  if (!dayData) {
    return <div className="loading">Preparing hugs...</div>;
  }

  return (
    <div className="hug-day">
      {/* Floating background elements */}
      <div className="floating-elements-hug">
        {floatingElements.map(el => (
          <span
            key={el.id}
            className="floating-element-hug"
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

      {/* Confetti */}
      <div className="confetti-container">
        {confetti.map(c => (
          <span
            key={c.id}
            className="confetti-piece"
            style={{
              left: `${c.left}%`,
              animationDuration: `${c.animationDuration}s`,
              animationDelay: `${c.animationDelay}s`,
              fontSize: `${c.size}px`,
              '--rotation': `${c.rotation}deg`
            }}
          >
            {c.emoji}
          </span>
        ))}
      </div>

      <Link to="/" className="back-btn-hug">
        <span>←</span> Home
      </Link>

      <div className="hug-content">
        <h1 className="hug-title">{dayData.title}</h1>
        <p className="hug-subtitle">{dayData.subtitle}</p>

        <div className="hug-button-container">
          <button 
            className={`hug-button ${isHugging ? 'hugging' : ''}`}
            onClick={handleHug}
          >
            <span className="hug-emoji">🤗</span>
            <span className="hug-text">Hug Me</span>
          </button>
          
          {hugCount > 0 && (
            <div className="hug-counter">
              <span className="counter-emoji">💕</span>
              <span className="counter-text">{hugCount} {hugCount === 1 ? 'hug' : 'hugs'} received!</span>
            </div>
          )}
        </div>

        <p className="hug-message">
          {hugCount === 0 && "Click the button for a virtual hug! 🤗"}
          {hugCount === 1 && "Aww, that felt warm! 💕"}
          {hugCount > 1 && hugCount < 5 && "More hugs coming your way! 🫂"}
          {hugCount >= 5 && hugCount < 10 && "You're so loved! 💖"}
          {hugCount >= 10 && "Infinite hugs for you, always! 💗✨"}
        </p>
      </div>
    </div>
  );
}

export default HugDay;
