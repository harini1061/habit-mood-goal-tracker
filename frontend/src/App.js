// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Mood from './pages/Mood';
import Habit from './pages/Habit';
import Goal from './pages/Goal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to the Habit, Mood & Goal Tracker</h1>} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/habit" element={<Habit />} />
        <Route path="/goal" element={<Goal />} />
      </Routes>
    </Router>
  );
}

export default App;
