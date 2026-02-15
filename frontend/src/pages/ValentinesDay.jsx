import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ValentinesDay.css';

const APOLOGY_LINES = [
  "I am sorry.",
  "For everything.",
  "For the times I wasn't there when you needed me.",
  "For the words I said that hurt you.",
  "For the words I should have said but didn't.",
  "For not listening when you were trying to tell me something important.",
  "For taking you for granted.",
  "For the moments I made you feel alone.",
  "For not being the person you deserved.",
  "For making you angry and irritated.",
  "You deserved better.",
  "You deserve better.",
  "I hope someday you can forgive me.",
  "Not because I deserve it.",
  "But because you deserve peace.",
  "I am sorry for everything."
];

function ValentinesDay() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showAllLines, setShowAllLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  // Track visit on page load
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await axios.post('/api/track-visit', {
          page: 'valentines-day',
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer: document.referrer
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.log('Visit tracking failed');
      }
    };
    trackVisit();
  }, []);

  // Subtle floating particles - no emojis, just soft light
  const floatingParticles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 15}s`,
      animationDuration: `${15 + Math.random() * 20}s`,
      size: `${2 + Math.random() * 4}px`,
      opacity: 0.1 + Math.random() * 0.2
    }));
  }, []);

  useEffect(() => {
    if (currentLineIndex >= APOLOGY_LINES.length) {
      setIsComplete(true);
      return;
    }

    const currentLine = APOLOGY_LINES[currentLineIndex];
    let charIndex = 0;
    setIsTyping(true);
    setDisplayedText('');

    const typingInterval = setInterval(() => {
      if (charIndex <= currentLine.length) {
        setDisplayedText(currentLine.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // Add line to shown lines after a pause
        setTimeout(() => {
          setShowAllLines(prev => [...prev, currentLine]);
          setCurrentLineIndex(prev => prev + 1);
        }, 1500);
      }
    }, 60);

    return () => clearInterval(typingInterval);
  }, [currentLineIndex]);

  return (
    <div className="valentines-day">
      {/* Subtle floating particles */}
      <div className="floating-particles">
        {floatingParticles.map(particle => (
          <span
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity
            }}
          />
        ))}
      </div>

      <Link to="/" className="back-btn-valentines">
        <span>Back</span>
      </Link>

      <div className="valentines-content">
        <h1 className="valentines-title">I Am Sorry</h1>
        
        <div className="apology-container">
          {/* Previous lines fade into background, become scrollable when complete */}
          <div className={`previous-lines ${isComplete ? 'scrollable' : ''}`}>
            {showAllLines.map((line, index) => (
              <p 
                key={index} 
                className="faded-line"
                style={isComplete ? {} : { 
                  opacity: Math.max(0.15, 1 - (showAllLines.length - index) * 0.12),
                  transform: `translateY(${(showAllLines.length - index) * -2}px)`
                }}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Current typing line */}
          {!isComplete && (
            <div className="current-line-container">
              <p className="current-line">
                {displayedText}
                {isTyping && <span className="cursor">|</span>}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ValentinesDay;
