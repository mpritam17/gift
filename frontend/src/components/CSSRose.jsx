import React, { useMemo } from 'react';
import './CSSRose.css';

function CSSRose({ size = 'medium', color = '#e63946', noStem = false, animate = true }) {
  const sizeClass = `rose-${size}`;
  const widths = { large: 180, medium: 120, small: 80, tiny: 50 };
  const w = widths[size] || widths.medium;
  const showStem = !noStem && size !== 'tiny';
  const svgH = showStem ? 220 : 120;

  const uid = useMemo(() => 'rose' + Math.random().toString(36).slice(2, 9), []);

  // Color palette generation
  const hex2rgb = (hex) => {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  
  const mixColor = (hex, target, amount) => {
    const [r1, g1, b1] = hex2rgb(hex);
    const [r2, g2, b2] = target;
    return `rgb(${Math.round(r1 + (r2 - r1) * amount)},${Math.round(g1 + (g2 - g1) * amount)},${Math.round(b1 + (b2 - b1) * amount)})`;
  };

  // Rich color palette
  const highlight = mixColor(color, [255, 245, 248], 0.6);
  const lightPink = mixColor(color, [255, 220, 230], 0.45);
  const midTone = mixColor(color, [255, 180, 190], 0.25);
  const deepRose = mixColor(color, [140, 40, 60], 0.35);
  const shadow = mixColor(color, [80, 20, 40], 0.5);
  const darkCore = mixColor(color, [40, 10, 20], 0.65);

  return (
    <div className={`css-rose ${sizeClass} ${animate ? 'animated' : ''}`}>
      <svg viewBox={`0 0 120 ${svgH}`} width={w} height={w * svgH / 120} className="rose-svg">
        <defs>
          {/* Outer petal gradient - dramatic light to shadow */}
          <radialGradient id={`${uid}-outer`} cx="20%" cy="20%" r="90%" fx="15%" fy="15%">
            <stop offset="0%" stopColor={highlight} />
            <stop offset="25%" stopColor={lightPink} />
            <stop offset="55%" stopColor={color} />
            <stop offset="85%" stopColor={deepRose} />
            <stop offset="100%" stopColor={shadow} />
          </radialGradient>
          
          {/* Mid petal gradient */}
          <radialGradient id={`${uid}-mid`} cx="30%" cy="25%" r="80%" fx="25%" fy="20%">
            <stop offset="0%" stopColor={lightPink} />
            <stop offset="40%" stopColor={color} />
            <stop offset="75%" stopColor={deepRose} />
            <stop offset="100%" stopColor={shadow} />
          </radialGradient>
          
          {/* Inner petal gradient */}
          <radialGradient id={`${uid}-inner`} cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor={midTone} />
            <stop offset="50%" stopColor={deepRose} />
            <stop offset="100%" stopColor={shadow} />
          </radialGradient>
          
          {/* Core gradient - deep and rich */}
          <radialGradient id={`${uid}-core`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={shadow} />
            <stop offset="60%" stopColor={darkCore} />
            <stop offset="100%" stopColor={darkCore} />
          </radialGradient>

          {/* Soft ambient glow */}
          <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="70%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          
          {/* Leaf gradients */}
          <linearGradient id={`${uid}-leaf`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#81c784" />
            <stop offset="40%" stopColor="#4caf50" />
            <stop offset="100%" stopColor="#2e7d32" />
          </linearGradient>
          
          <linearGradient id={`${uid}-stem`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2e7d32" />
            <stop offset="50%" stopColor="#388e3c" />
            <stop offset="100%" stopColor="#2e7d32" />
          </linearGradient>

          {/* Soft shadow filter */}
          <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset in="blur" dx="0" dy="2" result="offsetBlur" />
            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
          </filter>
          
          {/* Petal edge highlight filter */}
          <filter id={`${uid}-soft`} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="0.3" />
          </filter>
        </defs>

        {/* Ambient glow behind rose */}
        <ellipse cx="60" cy="60" rx="52" ry="48" fill={`url(#${uid}-glow)`} className="rose-glow" />

        {/* ============ THE ROSE BLOOM ============ */}
        <g className="rose-bloom" transform="translate(60, 60)">
          
          {/* === LAYER 1: Outermost petals (5 large, dramatic curves) === */}
          <g className="petal-layer outer-layer">
            {/* Petal 1 - Top */}
            <path className="petal outer" fill={`url(#${uid}-outer)`}
              d="M0,-2 C-12,-8 -28,-35 -22,-48 C-16,-58 -4,-56 2,-48 C10,-38 16,-20 12,-8 C8,0 0,-2 0,-2Z" 
              opacity="0.95" />
            {/* Petal 2 - Top Right */}
            <path className="petal outer" fill={`url(#${uid}-outer)`}
              d="M2,0 C10,-6 35,-22 48,-18 C58,-14 56,-2 48,6 C38,14 18,18 6,14 C0,10 2,0 2,0Z" 
              opacity="0.92" />
            {/* Petal 3 - Bottom Right */}
            <path className="petal outer" fill={`url(#${uid}-outer)`}
              d="M0,2 C8,10 24,34 20,48 C16,58 4,56 -4,48 C-12,38 -16,18 -10,6 C-6,0 0,2 0,2Z" 
              opacity="0.9" />
            {/* Petal 4 - Bottom Left */}
            <path className="petal outer" fill={`url(#${uid}-outer)`}
              d="M-2,0 C-8,8 -30,28 -46,24 C-56,20 -54,6 -46,-2 C-36,-10 -18,-14 -6,-10 C0,-6 -2,0 -2,0Z" 
              opacity="0.93" />
            {/* Petal 5 - Top Left */}
            <path className="petal outer" fill={`url(#${uid}-outer)`}
              d="M0,-2 C-8,-8 -32,-28 -28,-44 C-24,-54 -10,-52 -2,-44 C6,-34 12,-14 8,-4 C4,2 0,-2 0,-2Z" 
              opacity="0.91" />
          </g>

          {/* === LAYER 2: Middle petals (5, slightly smaller, offset) === */}
          <g className="petal-layer mid-layer">
            <path className="petal mid" fill={`url(#${uid}-mid)`}
              d="M0,-2 C-8,-6 -20,-26 -16,-36 C-12,-44 -2,-42 2,-36 C8,-28 10,-14 6,-6 C4,0 0,-2 0,-2Z" 
              opacity="0.96" />
            <path className="petal mid" fill={`url(#${uid}-mid)`}
              d="M2,0 C6,-4 24,-16 36,-12 C44,-8 42,2 36,8 C28,14 12,14 4,10 C0,6 2,0 2,0Z" 
              opacity="0.94" />
            <path className="petal mid" fill={`url(#${uid}-mid)`}
              d="M0,2 C6,8 18,26 14,38 C10,46 0,44 -4,38 C-10,28 -10,12 -6,4 C-2,0 0,2 0,2Z" 
              opacity="0.93" />
            <path className="petal mid" fill={`url(#${uid}-mid)`}
              d="M-2,0 C-6,6 -22,20 -34,16 C-42,12 -40,0 -34,-6 C-26,-12 -10,-14 -4,-8 C0,-4 -2,0 -2,0Z" 
              opacity="0.95" />
            <path className="petal mid" fill={`url(#${uid}-mid)`}
              d="M0,-2 C-6,-6 -18,-22 -14,-32 C-10,-40 0,-38 4,-32 C10,-24 10,-10 6,-4 C2,0 0,-2 0,-2Z" 
              opacity="0.94" />
          </g>

          {/* === LAYER 3: Inner petals (5, tighter curl) === */}
          <g className="petal-layer inner-layer">
            <path className="petal inner" fill={`url(#${uid}-inner)`}
              d="M0,-1 C-5,-4 -12,-16 -10,-24 C-8,-30 -1,-28 2,-24 C6,-18 6,-10 4,-4 C2,0 0,-1 0,-1Z" />
            <path className="petal inner" fill={`url(#${uid}-inner)`}
              d="M1,0 C4,-3 16,-10 24,-8 C30,-6 28,1 24,5 C18,10 8,10 3,6 C0,4 1,0 1,0Z" />
            <path className="petal inner" fill={`url(#${uid}-inner)`}
              d="M0,1 C4,5 12,18 10,26 C8,32 1,30 -2,26 C-6,20 -6,10 -3,4 C-1,0 0,1 0,1Z" />
            <path className="petal inner" fill={`url(#${uid}-inner)`}
              d="M-1,0 C-4,4 -14,14 -22,12 C-28,10 -26,2 -22,-2 C-16,-8 -6,-10 -2,-6 C0,-2 -1,0 -1,0Z" />
            <path className="petal inner" fill={`url(#${uid}-inner)`}
              d="M0,-1 C-4,-4 -12,-14 -10,-22 C-8,-28 -1,-26 2,-22 C6,-16 6,-8 4,-3 C2,0 0,-1 0,-1Z" />
          </g>

          {/* === LAYER 4: Innermost bud petals (spiral effect) === */}
          <g className="petal-layer bud-layer">
            <path className="petal bud" fill={deepRose}
              d="M0,-1 C-3,-3 -8,-10 -6,-15 C-4,-18 0,-17 2,-14 C4,-10 4,-5 2,-2 C1,0 0,-1 0,-1Z" />
            <path className="petal bud" fill={deepRose}
              d="M1,0 C3,-2 10,-6 14,-4 C17,-2 16,2 14,4 C10,7 4,6 2,4 C0,2 1,0 1,0Z" />
            <path className="petal bud" fill={deepRose}
              d="M0,1 C2,4 6,12 4,16 C2,19 -1,18 -2,15 C-4,11 -3,5 -1,2 C0,0 0,1 0,1Z" />
            <path className="petal bud" fill={deepRose}
              d="M-1,0 C-3,2 -8,8 -13,6 C-16,4 -15,0 -12,-2 C-8,-5 -3,-5 -1,-3 C0,-1 -1,0 -1,0Z" />
          </g>

          {/* === LAYER 5: The spiral center === */}
          <g className="rose-center">
            {/* Tight spiral petals */}
            <path fill={shadow}
              d="M0,0 C-2,-2 -5,-6 -4,-9 C-3,-11 0,-10 1,-8 C2,-5 2,-2 1,-1 C0,0 0,0 0,0Z" />
            <path fill={shadow}
              d="M0,0 C2,-1 6,-4 8,-2 C10,0 9,3 7,4 C4,5 1,4 0,2 C0,1 0,0 0,0Z" />
            <path fill={shadow}
              d="M0,0 C1,2 3,7 1,9 C-1,11 -3,9 -4,7 C-5,4 -3,1 -1,0 C0,0 0,0 0,0Z" />
            
            {/* Center core */}
            <ellipse cx="0" cy="0" rx="3" ry="2.5" fill={`url(#${uid}-core)`} />
            
            {/* Tiny spiral detail */}
            <path d="M-1,-0.5 Q0,-1.5 1,-0.5 Q1.5,0.5 0,1 Q-1,0.5 -1,-0.5Z" 
                  fill={darkCore} opacity="0.8" />
            <circle cx="0" cy="0" r="0.8" fill={darkCore} />
          </g>

          {/* Subtle highlight for 3D depth */}
          <ellipse cx="-15" cy="-20" rx="12" ry="10" fill="white" opacity="0.06" />
        </g>

        {/* ============ STEM & FOLIAGE ============ */}
        {showStem && (
          <g className="stem-group">
            {/* Sepals (calyx) - the green part under the bloom */}
            <path d="M55,108 C48,100 42,94 44,88 C50,90 54,98 56,105Z" fill="#388e3c" opacity="0.8" />
            <path d="M60,110 C60,102 58,94 62,90 C66,94 64,102 62,108Z" fill="#43a047" opacity="0.75" />
            <path d="M65,108 C72,100 78,94 76,88 C70,90 66,98 64,105Z" fill="#388e3c" opacity="0.8" />
            <path d="M57,110 C52,104 46,100 48,94 C52,96 56,102 58,108Z" fill="#2e7d32" opacity="0.7" />
            <path d="M63,110 C68,104 74,100 72,94 C68,96 64,102 62,108Z" fill="#2e7d32" opacity="0.7" />

            {/* Main stem - elegant S-curve */}
            <path d="M60,108 C62,125 66,145 62,165 C58,185 60,200 60,215"
                  stroke={`url(#${uid}-stem)`} strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Stem highlight */}
            <path d="M61,108 C63,125 67,145 63,165 C59,185 61,200 61,215"
                  stroke="#66bb6a" strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round" />

            {/* Left leaf - elegant shape */}
            <g transform="translate(58, 140)">
              <path d="M0,0 C-15,-12 -35,-14 -42,-6 C-48,4 -38,14 -20,12 C-8,10 -2,4 0,0Z"
                    fill={`url(#${uid}-leaf)`} opacity="0.9" />
              {/* Leaf veins */}
              <path d="M0,0 C-12,-6 -28,-6 -38,-2" stroke="#1b5e20" strokeWidth="0.8" fill="none" opacity="0.4" />
              <path d="M-14,-4 Q-18,0 -16,4" stroke="#1b5e20" strokeWidth="0.4" fill="none" opacity="0.3" />
              <path d="M-24,-4 Q-28,0 -26,4" stroke="#1b5e20" strokeWidth="0.4" fill="none" opacity="0.3" />
              <path d="M-34,-2 Q-36,2 -34,5" stroke="#1b5e20" strokeWidth="0.4" fill="none" opacity="0.3" />
            </g>

            {/* Right leaf */}
            <g transform="translate(62, 175)">
              <path d="M0,0 C14,-10 32,-10 38,-2 C44,8 34,16 18,14 C8,12 2,4 0,0Z"
                    fill={`url(#${uid}-leaf)`} opacity="0.85" />
              {/* Leaf veins */}
              <path d="M0,0 C12,-4 26,-4 34,0" stroke="#1b5e20" strokeWidth="0.8" fill="none" opacity="0.4" />
              <path d="M12,-2 Q16,2 14,6" stroke="#1b5e20" strokeWidth="0.4" fill="none" opacity="0.3" />
              <path d="M22,-2 Q26,2 24,6" stroke="#1b5e20" strokeWidth="0.4" fill="none" opacity="0.3" />
            </g>

            {/* Small leaf bud */}
            <g transform="translate(60, 195)">
              <path d="M0,0 C-8,-6 -16,-6 -18,-2 C-20,4 -14,8 -6,6 C-2,4 0,2 0,0Z"
                    fill={`url(#${uid}-leaf)`} opacity="0.75" />
            </g>

            {/* Thorns */}
            <path d="M64,155 L70,150" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M58,185 L52,180" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default CSSRose;
