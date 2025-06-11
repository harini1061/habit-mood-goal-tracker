import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Habit from './pages/Habit';
import Mood from './pages/Mood';
import Goal from './pages/Goal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/habits" element={<Habit />} />
        <Route path="/moods" element={<Mood />} />
        <Route path="/goals" element={<Goal />} />
      </Routes>
    </Router>
  );
}

export default App; // ✅ VERY IMPORTANT
