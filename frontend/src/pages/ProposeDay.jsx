import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProposeDay.css';

function ProposeDay() {
  const [dayData, setDayData] = useState(null);
  const [yesSize, setYesSize] = useState(1);
  const [noCount, setNoCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const containerRef = useRef(null);

  const PHOTOS_LINK = "https://photos.google.com/u/1/share/AF1QipPgyBmf3U_elrQPbsE98uXli1UHzOtE7xe9FOmxKk_gXceHsCDDSmQyyyliodfeLQ/photo/AF1QipO-asIrjP1NIzxynhG66FhpHTgG-X7J-F1NC5L-?key=VURRb0NlcWRJSFhaa2dLNXRidGxBbXBVVVhLbWZn";

  useEffect(() => {
    axios.get('/api/days/propose-day')
      .then(res => setDayData(res.data))
      .catch(() => {
        setDayData({
          title: "Propose Day",
          subtitle: "Will you be mine? 💍",
          message: "We are gonna make it all the wayyyyyy. 💕",
          color: "#e76f51"
        });
      });
  }, []);

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
    // Make the yes button grow larger with each "No" click
    setYesSize(prev => Math.min(prev * 1.4, 15));
  };

  const handleYesClick = () => {
    setAnswered(true);
    setShowConfetti(true);
    
    // Create confetti explosion
    createConfetti();
  };

  const createConfetti = () => {
    const confettiContainer = document.querySelector('.confetti-container');
    if (!confettiContainer) return;

    const colors = ['#ff6b8a', '#e76f51', '#ff2d55', '#ffd700', '#ff69b4', '#e63946', '#ff1493', '#ff4500'];
    const shapes = ['square', 'circle', 'heart'];
    
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      const shape = shapes[Math.floor(Math.random() * shapes.length)];  
      confetti.className = `confetti confetti-${shape}`;
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = `${Math.random() * 3}s`;
      confetti.style.animationDuration = `${3 + Math.random() * 4}s`;
      
      if (shape === 'heart') {
        confetti.innerHTML = '❤️';
        confetti.style.backgroundColor = 'transparent';
      }
      
      confettiContainer.appendChild(confetti);
    }
  };

  const noMessages = [
    "Are you sure? 🥺",
    "Pretty Pweeaaaseeeee 💔",
    "I am gonna Cry 😭",
    "Iss baar ke liye maan jaoooo!! 🙏",
    "Pretty please? 💕",
    "I'll wait forever... ⏳",
    "But... but... 😭",
    "The yes button looks nice! ➡️"
  ];

  if (!dayData) return <div className="loading">Loading...</div>;

  return (
    <div className="propose-day" ref={containerRef}>
      {showConfetti && <div className="confetti-container" />}
      
      {/* Floating hearts background */}
      <div className="floating-hearts-bg">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i} 
            className="floating-heart-propose" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 10}s`,
              fontSize: `${14 + Math.random() * 26}px`,
            }}
          >
            {['💕', '💗', '💖', '💝', '💘', '❤️'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Link to="/" className="back-btn-propose">
        <span>←</span> Valentine's Week
      </Link>

      {/* Hero Section */}
      <section className="propose-hero">
        <div className="propose-glow" />
        <div className="propose-content">
          <div className="ring-emoji">💍</div>
          <h1 className="propose-title">{dayData.title}</h1>
          <p className="propose-subtitle">{dayData.subtitle}</p>
        </div>
      </section>

      {/* The Big Question */}
      {!answered ? (
        <section className="question-section">
          <div className="question-card">
            <div className="sparkles">✨</div>
            <h2 className="the-question">Will you be mine?</h2>
            <p className="question-subtext">
              {noCount > 0 ? noMessages[Math.min(noCount - 1, noMessages.length - 1)] : "I have something to ask you... 💭"}
            </p>
            
            <div className="buttons-container">
              <button 
                className="yes-btn"
                onClick={handleYesClick}
                style={{
                  transform: `scale(${yesSize})`,
                  zIndex: Math.floor(yesSize * 10)
                }}
              >
                Yes! 💖
              </button>
              
              {yesSize < 10 && (
                <button 
                  className="no-btn"
                  onClick={handleNoClick}
                  style={{
                    opacity: Math.max(0.3, 1 - (noCount * 0.15)),
                    transform: `scale(${Math.max(0.5, 1 - (noCount * 0.1))})`
                  }}
                >
                  No 😅
                </button>
              )}
            </div>
            
            {noCount > 2 && (
              <p className="hint-text">
                Psst... the Yes button is getting bigger for a reason! 😉
              </p>
            )}
          </div>
        </section>
      ) : (
        <section className="answer-section">
          <div className="answer-card">
            <div className="celebration-emojis">
              <span>🎉</span>
              <span>💍</span>
              <span>💖</span>
              <span>🎊</span>
            </div>
            <h2 className="answer-title">OMG! You said YES!</h2>
            <p className="answer-message">
              Yayyyyyy! You just made me the happiest person in the world! <br /> 
              I luv youuuuuuu! 💕
            </p>
            <div className="answer-hearts">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="bouncing-heart" style={{ animationDelay: `${i * 0.2}s` }}>
                  ❤️
                </span>
              ))}
            </div>
            <blockquote className="love-quote">
              "Everytime I look at you, I fall in love all over again. 💘"
            </blockquote>
          </div>
        </section>
      )}

      {/* Memories Section - Only shown after Yes */}
      {answered && (
        <section className="memories-section">
          <h2 className="section-title-propose">Our Memories 📸</h2>
          
          <div className="apology-card">
            <div className="apology-icon">📷</div>
            <p className="apology-text">
              I would have uploaded some of my favourite photos here. But can't due to privacy concerns 😔
            </p>
            <p className="apology-subtext">Instead, visit my drive link:</p>
            <a 
              href={PHOTOS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="photos-link"
            >
              <span className="link-icon">🔗</span>
              View Our Photos
              <span className="link-arrow">→</span>
            </a>
          </div>
        </section>
      )}

      {/* Footer Message */}
      <section className="footer-section">
        <div className="footer-content">
          <p className="footer-message">
            Forever yours, today and always 💝
          </p>
        </div>
      </section>
    </div>
  );
}

export default ProposeDay;
