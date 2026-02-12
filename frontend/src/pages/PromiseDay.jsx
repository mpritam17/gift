import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './PromiseDay.css';

const PROMISES = [
  {
    id: 1,
    question: "Promise me you will, wait for me",
    emoji: "⏳",
    field: "promiseWait"
  },
  {
    id: 2,
    question: "Promise me you will love me forever.",
    emoji: "💕",
    field: "promiseLoveForever"
  }
];

const MY_PROMISE = "I will stay by your side, for the rest of my life, I promise";

function PromiseDay() {
  const [dayData, setDayData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({
    promiseWait: '',
    promiseLoveForever: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMyPromise, setShowMyPromise] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [typingText, setTypingText] = useState('');

  // Floating elements for background
  const floatingElements = useMemo(() => {
    const emojis = ['🤞', '💫', '✨', '💕', '🌟', '💜'];
    return [...Array(15)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${8 + Math.random() * 10}s`,
      fontSize: `${14 + Math.random() * 16}px`,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
  }, []);

  useEffect(() => {
    axios.get('/api/days/promise-day')
      .then(res => setDayData(res.data))
      .catch(() => {
        setDayData({
          title: "Promise Day",
          subtitle: "Forever and always 🤞",
          message: "Promises from the heart...",
          color: "#457b9d"
        });
      });
  }, []);

  // Typing effect for my promise
  useEffect(() => {
    if (showMyPromise && !completed) {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= MY_PROMISE.length) {
          setTypingText(MY_PROMISE.slice(0, index));
          index++;
        } else {
          clearInterval(timer);
          setTimeout(() => setCompleted(true), 500);
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [showMyPromise, completed]);

  const handleResponse = async (response) => {
    const currentPromise = PROMISES[currentStep];
    const newResponses = { ...responses, [currentPromise.field]: response };
    setResponses(newResponses);

    if (currentStep < PROMISES.length - 1) {
      // Move to next question with animation
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 500);
    } else {
      // All questions answered, submit and show my promise
      setIsSubmitting(true);
      try {
        await axios.post('/api/promise-day', newResponses);
      } catch (error) {
        console.error('Error submitting:', error);
      }
      setIsSubmitting(false);
      setTimeout(() => {
        setShowMyPromise(true);
      }, 800);
    }
  };

  if (!dayData) {
    return <div className="loading">Loading promises...</div>;
  }

  return (
    <div className="promise-day">
      {/* Floating background elements */}
      <div className="floating-elements-promise">
        {floatingElements.map(el => (
          <span
            key={el.id}
            className="floating-element-promise"
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

      <Link to="/" className="back-btn-promise">
        <span>←</span> Home
      </Link>

      <div className="promise-content">
        <h1 className="promise-title">{dayData.title}</h1>
        <p className="promise-subtitle">{dayData.subtitle}</p>

        {!showMyPromise ? (
          <div className="promise-cards-container">
            <div className="progress-indicator">
              {PROMISES.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`progress-dot ${idx <= currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
                />
              ))}
            </div>

            <div className={`promise-card ${isSubmitting ? 'submitting' : ''}`}>
              <div className="promise-emoji">{PROMISES[currentStep].emoji}</div>
              <p className="promise-question">{PROMISES[currentStep].question}</p>
              
              <div className="promise-buttons">
                <button 
                  className="promise-btn yes"
                  onClick={() => handleResponse('Yes, I promise!')}
                  disabled={isSubmitting}
                >
                  <span className="btn-emoji">💕</span>
                  Yes, I promise!
                </button>
                <button 
                  className="promise-btn maybe"
                  onClick={() => handleResponse('I will try my best')}
                  disabled={isSubmitting}
                >
                  <span className="btn-emoji">🤗</span>
                  I will try my best
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="my-promise-section">
            <div className="my-promise-card">
              <div className="pinky-promise-icon">🤞</div>
              <h2 className="my-promise-header">My Promise to You</h2>
              <p className="my-promise-text">
                {typingText}
                {!completed && <span className="cursor">|</span>}
              </p>
              {completed && (
                <div className="promise-seal">
                  <span className="seal-emoji">💍</span>
                  <span className="seal-text">Sealed with love</span>
                </div>
              )}
            </div>

            {completed && (
              <div className="hearts-explosion">
                {[...Array(20)].map((_, i) => (
                  <span 
                    key={i} 
                    className="explosion-heart"
                    style={{
                      '--delay': `${Math.random() * 2}s`,
                      '--x': `${(Math.random() - 0.5) * 200}px`,
                      '--y': `${(Math.random() - 0.5) * 200}px`,
                      '--rotation': `${Math.random() * 360}deg`
                    }}
                  >
                    {['💕', '💜', '💗', '✨', '🤞'][Math.floor(Math.random() * 5)]}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pinky promise hands decoration */}
        <div className="pinky-hands-decoration">
          <span className="pinky-hand left">🤙</span>
          <span className="pinky-hand right">🤙</span>
        </div>
      </div>
    </div>
  );
}

export default PromiseDay;
