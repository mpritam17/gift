import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoseDay from './pages/RoseDay';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rose-day" element={<RoseDay />} />
      </Routes>
    </Router>
  );
}

export default App;
