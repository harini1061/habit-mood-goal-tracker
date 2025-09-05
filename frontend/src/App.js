// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Habit from './pages/Habit';
import Mood from './pages/Mood';
import Goal from './pages/Goal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome'; 
import Layout from './components/Layout';
import PrivateRoute from './pages/PrivateRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes that need authentication and Layout */}
        <Route element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route path="/home" element={<Home />} />
          <Route path="/habits" element={<Habit />} />
          <Route path="/moods" element={<Mood />} />
          <Route path="/goals" element={<Goal />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;