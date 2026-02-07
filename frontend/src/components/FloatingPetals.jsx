import React from 'react';
import './FloatingPetals.css';

function FloatingPetals() {
  const petals = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 12,
    duration: 8 + Math.random() * 10,
    size: 8 + Math.random() * 20,
    rotation: Math.random() * 360,
    sway: 30 + Math.random() * 80,
    opacity: 0.15 + Math.random() * 0.4,
    color: ['#e63946', '#ff2d55', '#ff6b8a', '#c2185b', '#ff8fa3', '#d32f2f', '#ffb3c1'][Math.floor(Math.random() * 7)]
  }));

  return (
    <div className="floating-petals-container">
      {petals.map(petal => (
        <div
          key={petal.id}
          className="floating-petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            '--petal-size': `${petal.size}px`,
            '--petal-rotation': `${petal.rotation}deg`,
            '--sway-amount': `${petal.sway}px`,
            '--petal-opacity': petal.opacity,
            '--petal-color': petal.color,
          }}
        />
      ))}
    </div>
  );
}

export default FloatingPetals;
