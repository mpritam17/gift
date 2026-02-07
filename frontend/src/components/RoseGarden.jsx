import React, { useState, useEffect } from 'react';
import CSSRose from './CSSRose';
import './RoseGarden.css';

const roseData = [
  { color: '#e63946', name: 'Classic Red', meaning: 'True love & passion', row: 0, pos: 0.5 },
  { color: '#ff2d55', name: 'Hot Pink', meaning: 'Gratitude & appreciation', row: 0, pos: 0.2 },
  { color: '#c2185b', name: 'Deep Rose', meaning: 'Deep admiration', row: 0, pos: 0.8 },
  { color: '#ff6b8a', name: 'Soft Pink', meaning: 'Grace & sweetness', row: 1, pos: 0.15 },
  { color: '#d32f2f', name: 'Crimson', meaning: 'Desire & longing', row: 1, pos: 0.42 },
  { color: '#ffb3c1', name: 'Blush Pink', meaning: 'Joy & happiness', row: 1, pos: 0.68 },
  { color: '#9c1f3e', name: 'Burgundy', meaning: 'Unconscious beauty', row: 1, pos: 0.9 },
  { color: '#ff8fa3', name: 'Coral', meaning: 'Enthusiasm & desire', row: 2, pos: 0.1 },
  { color: '#f06292', name: 'Fuchsia', meaning: 'New beginnings', row: 2, pos: 0.33 },
  { color: '#ad1457', name: 'Magenta', meaning: 'Universal love', row: 2, pos: 0.56 },
  { color: '#e91e63', name: 'Cerise', meaning: 'First love', row: 2, pos: 0.75 },
  { color: '#ff5252', name: 'Scarlet', meaning: 'Eternal devotion', row: 2, pos: 0.93 },
];

function RoseGarden() {
  const [selectedRose, setSelectedRose] = useState(null);
  const [fireflies, setFireflies] = useState([]);

  useEffect(() => {
    const flies = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 20 + Math.random() * 60,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 5,
      size: 2 + Math.random() * 3
    }));
    setFireflies(flies);
  }, []);

  // Group roses by row for depth
  const rows = [0, 1, 2].map(r => roseData.filter(rose => rose.row === r));
  const roseSize = ['medium', 'small', 'small'];
  const rowScale = [1, 0.85, 0.7];

  return (
    <div className="rose-garden-v2">
      {/* Sky gradient with stars */}
      <div className="garden-sky">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="garden-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
            }}
          />
        ))}
        <div className="garden-moon" />
      </div>

      {/* Fireflies */}
      {fireflies.map(f => (
        <div
          key={f.id}
          className="garden-firefly"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            width: `${f.size}px`,
            height: `${f.size}px`,
          }}
        />
      ))}

      {/* Garden scene with rows for perspective */}
      <div className="garden-scene">
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className={`garden-row row-${rowIdx}`}
            style={{ '--row-scale': rowScale[rowIdx] }}
          >
            {row.map((rose, i) => {
              const globalIdx = roseData.indexOf(rose);
              const isSelected = selectedRose === globalIdx;
              return (
                <div
                  key={globalIdx}
                  className={`garden-rose-spot ${isSelected ? 'selected' : ''}`}
                  style={{
                    left: `${rose.pos * 100}%`,
                    animationDelay: `${globalIdx * 0.15}s`,
                  }}
                  onClick={() => setSelectedRose(isSelected ? null : globalIdx)}
                >
                  {/* Ground highlight under rose */}
                  <div className="rose-ground-glow" style={{ background: `radial-gradient(ellipse, ${rose.color}20, transparent 70%)` }} />
                  
                  {/* The rose */}
                  <div className="garden-rose-wrap">
                    <CSSRose size={roseSize[rowIdx]} color={rose.color} />
                  </div>

                  {/* Info tooltip */}
                  <div className="rose-tooltip" style={{ borderColor: `${rose.color}60` }}>
                    <div className="tooltip-color-dot" style={{ background: rose.color }} />
                    <h4 className="tooltip-name" style={{ color: rose.color }}>{rose.name}</h4>
                    <p className="tooltip-meaning">{rose.meaning}</p>
                    <div className="tooltip-sparkle">✨</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Grass blades */}
        <div className="garden-grass">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="grass-blade"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${15 + Math.random() * 30}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                opacity: 0.3 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>
      </div>

      {/* Selected rose detail panel */}
      {selectedRose !== null && (
        <div className="rose-detail-panel" onClick={() => setSelectedRose(null)}>
          <div className="detail-card" onClick={e => e.stopPropagation()}>
            <button className="detail-close" onClick={() => setSelectedRose(null)}>×</button>
            <div className="detail-rose-display">
              <CSSRose size="large" color={roseData[selectedRose].color} />
            </div>
            <h3 className="detail-name" style={{ color: roseData[selectedRose].color }}>
              {roseData[selectedRose].name} Rose
            </h3>
            <p className="detail-meaning">{roseData[selectedRose].meaning}</p>
            <div className="detail-divider" style={{ background: `linear-gradient(90deg, transparent, ${roseData[selectedRose].color}80, transparent)` }} />
            <p className="detail-description">
              {getDescription(roseData[selectedRose].name)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function getDescription(name) {
  const descriptions = {
    'Classic Red': 'The timeless red rose speaks of deep, abiding love. It says "I love you" when words fall short.',
    'Hot Pink': 'A hot pink rose radiates energy and fun. It\'s the perfect way to say thank you with flair.',
    'Soft Pink': 'Gentle and elegant, the soft pink rose conveys admiration and grace in every petal.',
    'Deep Rose': 'Rich and velvety, this rose whispers of deep appreciation and gratitude from the heart.',
    'Blush Pink': 'Like the first light of dawn, a blush rose brings joy and gentle happiness.',
    'Crimson': 'Deep crimson speaks of a love so profound, it transcends time itself.',
    'Coral': 'The coral rose shimmers with enthusiasm. It\'s desire wrapped in delicate petals.',
    'Burgundy': 'A burgundy rose holds unconscious beauty — a love that doesn\'t know its own depth.',
    'Fuchsia': 'Bold and vibrant, the fuchsia rose heralds new beginnings and fresh adventures together.',
    'Magenta': 'The magenta rose embodies universal love — a love that extends beyond boundaries.',
    'Cerise': 'Bright and youthful, the cerise rose captures the excitement and innocence of first love.',
    'Scarlet': 'The scarlet rose burns with eternal devotion — a promise that love will never fade.',
  };
  return descriptions[name] || 'A beautiful rose with its own special meaning.';
}

export default RoseGarden;
