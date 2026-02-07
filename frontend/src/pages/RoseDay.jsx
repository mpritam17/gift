import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CSSRose from '../components/CSSRose';
import RoseBouquet from '../components/RoseBouquet';
import FloatingPetals from '../components/FloatingPetals';
import RoseGarden from '../components/RoseGarden';
import './RoseDay.css';

function RoseDay() {
  const [dayData, setDayData] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [activePoem, setActivePoem] = useState(0);

  useEffect(() => {
    axios.get('/api/days/rose-day')
      .then(res => setDayData(res.data))
      .catch(() => {
        setDayData({
          title: "Rose Day",
          subtitle: "Every rose whispers your name 🌹",
          message: "A single rose can be my garden... a single friend, my world. Happy Rose Day!",
          poems: [
            "Roses are red, violets are blue, no flower in the world is as beautiful as you.",
            "Like petals soft upon the breeze, you calm my heart and put me at ease.",
            "Each rose I give speaks words untold, of love more precious than finest gold."
          ]
        });
      });

    const timer = setTimeout(() => setShowMessage(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (dayData?.poems) {
      const interval = setInterval(() => {
        setActivePoem(prev => (prev + 1) % dayData.poems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [dayData]);

  if (!dayData) return <div className="loading">Loading...</div>;

  return (
    <div className="rose-day">
      <FloatingPetals />
      
      {/* Navigation */}
      <Link to="/" className="back-btn">
        <span>←</span> Valentine's Week
      </Link>

      {/* Hero Section */}
      <section className="rose-hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <h1 className="rose-title">{dayData.title}</h1>
          <p className="rose-subtitle">{dayData.subtitle}</p>
          <div className="hero-rose-container">
            <CSSRose size="large" />
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className={`message-section ${showMessage ? 'visible' : ''}`}>
        <div className="message-card">
          <div className="message-roses">
            <CSSRose size="small" color="#ff2d55" noStem={true} />
            <CSSRose size="small" color="#e63946" noStem={true} />
            <CSSRose size="small" color="#ff6b8a" noStem={true} />
          </div>
          <blockquote className="message-text">
            "{dayData.message}"
          </blockquote>
          <div className="message-roses">
            <CSSRose size="small" color="#ff6b8a" noStem={true} />
            <CSSRose size="small" color="#e63946" noStem={true} />
            <CSSRose size="small" color="#ff2d55" noStem={true} />
          </div>
        </div>
      </section>

      {/* Bouquet Section */}
      <section className="bouquet-section">
        <h2 className="section-title">A Bouquet For You</h2>
        <RoseBouquet />
      </section>

      {/* Poetry Section */}
      <section className="poetry-section">
        <h2 className="section-title">Words from the Heart</h2>
        <div className="poem-carousel">
          {dayData.poems?.map((poem, i) => (
            <div 
              key={i} 
              className={`poem-card ${i === activePoem ? 'active' : ''}`}
            >
              <div className="poem-quote-mark">"</div>
              <p className="poem-text">{poem}</p>
              <div className="poem-decoration">
                <span>🌹</span>
                <span className="poem-line" />
                <span>🌹</span>
              </div>
            </div>
          ))}
          <div className="poem-dots">
            {dayData.poems?.map((_, i) => (
              <button 
                key={i} 
                className={`poem-dot ${i === activePoem ? 'active' : ''}`}
                onClick={() => setActivePoem(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Rose Garden */}
      <section className="garden-section">
        <h2 className="section-title">Wander Through the Garden</h2>
        <p className="garden-subtitle">Click on any rose to discover its meaning under the moonlight</p>
        <RoseGarden />
      </section>

      {/* Footer */}
      <footer className="rose-footer">
        <div className="footer-roses">
          {[...Array(7)].map((_, i) => (
            <span key={i} className="footer-rose" style={{ animationDelay: `${i * 0.3}s` }}>
              🌹
            </span>
          ))}
        </div>
        <p className="footer-text">Happy Rose Day</p>
        <p className="footer-date">February 7, 2026</p>
      </footer>
    </div>
  );
}

export default RoseDay;
