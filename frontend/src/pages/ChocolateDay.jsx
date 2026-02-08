import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ChocolateDay.css';

const DAIRY_MILK_VARIANTS = [
  { id: 1, name: 'Dairy Milk Silk', emoji: '💜', description: 'Smooth & silky' },
  { id: 2, name: 'Dairy Milk Fruit & Nut', emoji: '🍇', description: 'Raisins & almonds' },
  { id: 3, name: 'Dairy Milk Crackle', emoji: '🍚', description: 'Crispy rice puffs' },
  { id: 4, name: 'Dairy Milk Roast Almond', emoji: '🥜', description: 'Crunchy almonds' },
  { id: 5, name: 'Dairy Milk Oreo', emoji: '🍪', description: 'Cookie crumbles' },
  { id: 6, name: 'Dairy Milk Bubbly', emoji: '🫧', description: 'Airy bubbles' },
  { id: 7, name: 'Dairy Milk Classic', emoji: '🍫', description: 'The OG chocolate' },
  { id: 8, name: 'Dairy Milk Silk Mousse', emoji: '☁️', description: 'Fluffy mousse' },
  { id: 9, name: 'Dairy Milk Silk Bubbly', emoji: '✨', description: 'Silky bubbles' },
  { id: 10, name: 'Dairy Milk 5 Star', emoji: '⭐', description: 'Caramel & nougat' },
];

function ChocolateDay() {
  const [dayData, setDayData] = useState(null);
  const [rankings, setRankings] = useState(DAIRY_MILK_VARIANTS);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const dragNode = useRef(null);

  useEffect(() => {
    axios.get('/api/days/chocolate-day')
      .then(res => setDayData(res.data))
      .catch(() => {
        setDayData({
          title: "Chocolate Day",
          subtitle: "Life is sweet with you 🍫",
          message: "Sweetness overload!",
          color: "#6b4226"
        });
      });
  }, []);

  // Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    dragNode.current = e.target;
    dragNode.current.addEventListener('dragend', handleDragEnd);
    
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnter = (e, index) => {
    if (index !== draggedItem) {
      setDragOverIndex(index);
      const newRankings = [...rankings];
      const draggedItemContent = newRankings[draggedItem];
      newRankings.splice(draggedItem, 1);
      newRankings.splice(index, 0, draggedItemContent);
      setDraggedItem(index);
      setRankings(newRankings);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
    if (dragNode.current) {
      dragNode.current.classList.remove('dragging');
      dragNode.current.removeEventListener('dragend', handleDragEnd);
    }
    dragNode.current = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Touch handlers for mobile
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchedIndex, setTouchedIndex] = useState(null);

  const handleTouchStart = (e, index) => {
    setTouchStartY(e.touches[0].clientY);
    setTouchedIndex(index);
    e.currentTarget.classList.add('touching');
  };

  const handleTouchMove = (e, index) => {
    if (touchedIndex === null) return;
    
    const touch = e.touches[0];
    const elements = document.querySelectorAll('.ranking-item');
    
    elements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (touch.clientY > rect.top && touch.clientY < rect.bottom && i !== touchedIndex) {
        const newRankings = [...rankings];
        const draggedItemContent = newRankings[touchedIndex];
        newRankings.splice(touchedIndex, 1);
        newRankings.splice(i, 0, draggedItemContent);
        setTouchedIndex(i);
        setRankings(newRankings);
      }
    });
  };

  const handleTouchEnd = (e) => {
    if (touchedIndex !== null) {
      const elements = document.querySelectorAll('.ranking-item');
      elements.forEach(el => el.classList.remove('touching'));
    }
    setTouchedIndex(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const rankingData = rankings.map((item, index) => ({
      rank: index + 1,
      name: item.name,
      id: item.id
    }));

    try {
      await axios.post('/api/chocolate-ranking', { rankings: rankingData });
      setSubmitted(true);
      setShowConfetti(true);
      createChocolateConfetti();
    } catch (error) {
      console.error('Error submitting:', error);
      // Still show success for demo
      setSubmitted(true);
      setShowConfetti(true);
      createChocolateConfetti();
    } finally {
      setIsSubmitting(false);
    }
  };

  const createChocolateConfetti = () => {
    const container = document.querySelector('.chocolate-confetti-container');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'choco-confetti';
      confetti.innerHTML = ['🍫', '🍬', '💜', '✨', '🤎'][Math.floor(Math.random() * 5)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      confetti.style.animationDuration = `${3 + Math.random() * 3}s`;
      container.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 6000);
    }
  };

  if (!dayData) return <div className="loading">Loading...</div>;

  return (
    <div className="chocolate-day">
      {showConfetti && <div className="chocolate-confetti-container" />}
      
      {/* Floating chocolates background */}
      <div className="floating-chocolates-bg">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="floating-chocolate" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 10}s`,
              fontSize: `${16 + Math.random() * 24}px`,
            }}
          >
            {['🍫', '🍬', '🤎', '💜', '🍩'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <Link to="/" className="back-btn-chocolate">
        <span>←</span> Back
      </Link>

      {/* Hero Section */}
      <section className="chocolate-hero">
        <div className="chocolate-glow" />
        <div className="chocolate-content">
          <div className="chocolate-bar-3d">
            <div className="chocolate-wrapper">
              <div className="chocolate-bar">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="chocolate-piece">
                    <div className="chocolate-shine"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <h1 className="chocolate-title">{dayData.title}</h1>
          <p className="chocolate-subtitle">{dayData.subtitle}</p>
        </div>
      </section>

      {/* Chocolate Message */}
      <section className="chocolate-message-section">
        <div className="message-box">
          <p className="sweet-message">
            Life is like a box of chocolates, and I'm so glad I found you - the sweetest one of all! 🍫💕
          </p>
        </div>
      </section>

      {/* Ranking Section */}
      <section className="ranking-section">
        <div className="ranking-card">
          <div className="ranking-card-glow" />
          
          {!submitted ? (
            <>
              <h2 className="ranking-title">Can I get to know you better?</h2>
              <p className="ranking-subtitle">
                Rank these Dairy Milk variants from your favorite (1) to least favorite (10)
                <br />
                <span className="drag-hint">✨ Drag and drop to reorder ✨</span>
              </p>
              
              <div className="ranking-list">
                {rankings.map((item, index) => (
                  <div
                    key={item.id}
                    className={`ranking-item ${draggedItem === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragOver={handleDragOver}
                    onTouchStart={(e) => handleTouchStart(e, index)}
                    onTouchMove={(e) => handleTouchMove(e, index)}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div className="rank-number">#{index + 1}</div>
                    <div className="item-emoji">{item.emoji}</div>
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-description">{item.description}</span>
                    </div>
                    <div className="drag-handle">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="btn-loading">Submitting... 🍫</span>
                ) : (
                  <span>Submit My Rankings 💜</span>
                )}
              </button>
            </>
          ) : (
            <div className="success-message">
              <div className="success-icon">🍫</div>
              <h2 className="success-title">Sweet! Got it!</h2>
              <p className="success-text treat-message">
                Be Ready for Your Treat! Hehehehe 😋🍫
              </p>
              <div className="chocolate-hearts">🍫💕🍫</div>
            </div>
          )}
        </div>
      </section>

      {/* Floating Chocolate Pieces */}
      <div className="floating-pieces">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="floating-piece"
            style={{
              left: `${10 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            🍫
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="chocolate-footer">
        <p>Made with 🍫 and lots of sweetness</p>
      </footer>
    </div>
  );
}

export default ChocolateDay;
