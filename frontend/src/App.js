import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Habit from './pages/Habit';
import Mood from './pages/Mood';
import Goal from './pages/Goal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome'; 
import Layout from './components/Layout'; // 💡 New import

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Welcome />} />
       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* All routes that need Navbar */}
        <Route element={<Layout />}>
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
