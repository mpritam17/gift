import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoseDay from './pages/RoseDay';
import ProposeDay from './pages/ProposeDay';
import ChocolateDay from './pages/ChocolateDay';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rose-day" element={<RoseDay />} />
        <Route path="/propose-day" element={<ProposeDay />} />
        <Route path="/chocolate-day" element={<ChocolateDay />} />
      </Routes>
    </Router>
  );
}

export default App;
