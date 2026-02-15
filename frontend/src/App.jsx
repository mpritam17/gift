import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoseDay from './pages/RoseDay';
import ProposeDay from './pages/ProposeDay';
import ChocolateDay from './pages/ChocolateDay';
import TeddyDay from './pages/TeddyDay';
import PromiseDay from './pages/PromiseDay';
import HugDay from './pages/HugDay';
import KissDay from './pages/KissDay';
import ValentinesDay from './pages/ValentinesDay';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rose-day" element={<RoseDay />} />
        <Route path="/propose-day" element={<ProposeDay />} />
        <Route path="/chocolate-day" element={<ChocolateDay />} />
        <Route path="/teddy-day" element={<TeddyDay />} />
        <Route path="/promise-day" element={<PromiseDay />} />
        <Route path="/hug-day" element={<HugDay />} />
        <Route path="/kiss-day" element={<KissDay />} />
        <Route path="/valentines-day" element={<ValentinesDay />} />
      </Routes>
    </Router>
  );
}

export default App;
