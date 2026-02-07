import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const dayEmojis = {
  'rose-day': '🌹',
  'propose-day': '💍',
  'chocolate-day': '🍫',
  'teddy-day': '🧸',
  'promise-day': '🤞',
  'hug-day': '🤗',
  'kiss-day': '💋',
  'valentines-day': '❤️'
};

function Home() {
  const [days, setDays] = useState({});

  useEffect(() => {
    axios.get('/api/days')
      .then(res => setDays(res.data))
      .catch(() => {
        // Fallback data if backend is not running
        setDays({
          'rose-day': { title: 'Rose Day', date: '2026-02-07', color: '#e63946', subtitle: 'Every rose whispers your name 🌹' },
          'propose-day': { title: 'Propose Day', date: '2026-02-08', color: '#e76f51', subtitle: 'Will you be mine? 💍' },
          'chocolate-day': { title: 'Chocolate Day', date: '2026-02-09', color: '#6b4226', subtitle: 'Life is sweet with you 🍫' },
          'teddy-day': { title: 'Teddy Day', date: '2026-02-10', color: '#c9a96e', subtitle: 'Warm hugs for you 🧸' },
          'promise-day': { title: 'Promise Day', date: '2026-02-11', color: '#457b9d', subtitle: 'Forever and always 🤞' },
          'hug-day': { title: 'Hug Day', date: '2026-02-12', color: '#f4a261', subtitle: 'Wrapped in love 🤗' },
          'kiss-day': { title: 'Kiss Day', date: '2026-02-13', color: '#e76f8a', subtitle: 'A kiss to seal it all 💋' },
          'valentines-day': { title: "Valentine's Day", date: '2026-02-14', color: '#d62828', subtitle: 'Love conquers all ❤️' }
        });
      });
  }, []);

  return (
    <div className="home">
      <div className="home-bg-hearts">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="floating-heart" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
            fontSize: `${12 + Math.random() * 24}px`,
            opacity: 0.1 + Math.random() * 0.2
          }}>♥</div>
        ))}
      </div>
      
      <header className="home-header">
        <h1 className="home-title">
          <span className="title-heart">💝</span>
          Valentine's Week
          <span className="title-heart">💝</span>
        </h1>
        <p className="home-subtitle">Seven days of love, leading to the one that matters most</p>
      </header>

      <div className="days-grid">
        {Object.entries(days).map(([slug, day], index) => {
          const isActive = slug === 'rose-day' || slug === 'propose-day'; // Rose Day and Propose Day are active
          return (
            <Link
              to={isActive ? `/${slug}` : '#'}
              key={slug}
              className={`day-card ${isActive ? 'active' : 'locked'}`}
              style={{
                '--card-color': day.color,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="day-card-glow" />
              <div className="day-card-content">
                <span className="day-emoji">{dayEmojis[slug]}</span>
                <h2 className="day-title">{day.title}</h2>
                <p className="day-date">{new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                {!isActive && <div className="day-lock">🔒 Coming Soon</div>}
                {isActive && <div className="day-open">✨ Open</div>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
