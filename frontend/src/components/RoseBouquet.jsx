import React from 'react';
import CSSRose from './CSSRose';
import './RoseBouquet.css';

function RoseBouquet() {
  const roses = [
    { color: '#e63946', delay: 0, x: 0, y: 0, rotate: 0 },
    { color: '#ff2d55', delay: 0.2, x: -55, y: 15, rotate: -15 },
    { color: '#c2185b', delay: 0.4, x: 55, y: 15, rotate: 15 },
    { color: '#ff6b8a', delay: 0.6, x: -100, y: 40, rotate: -25 },
    { color: '#d32f2f', delay: 0.8, x: 100, y: 40, rotate: 25 },
    { color: '#ff8fa3', delay: 1.0, x: -30, y: 10, rotate: -8 },
    { color: '#e63946', delay: 1.2, x: 30, y: 10, rotate: 8 },
    { color: '#ff2d55', delay: 1.4, x: -75, y: 30, rotate: -20 },
    { color: '#c2185b', delay: 1.6, x: 75, y: 30, rotate: 20 },
  ];

  return (
    <div className="bouquet-wrapper">
      <div className="bouquet-glow" />
      <div className="bouquet">
        {roses.map((rose, i) => (
          <div
            key={i}
            className="bouquet-rose"
            style={{
              '--delay': `${rose.delay}s`,
              '--x': `${rose.x}px`,
              '--y': `${rose.y}px`,
              '--rotate': `${rose.rotate}deg`
            }}
          >
            <CSSRose size="medium" color={rose.color} noStem={true} />
          </div>
        ))}
      </div>
      {/* Wrapping paper */}
      <div className="bouquet-wrap">
        <div className="wrap-fold wrap-left" />
        <div className="wrap-fold wrap-right" />
        <div className="wrap-ribbon" />
        <div className="wrap-bow">
          <div className="bow-loop bow-left" />
          <div className="bow-loop bow-right" />
          <div className="bow-knot" />
        </div>
      </div>
    </div>
  );
}

export default RoseBouquet;
