import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [moods, setMoods] = useState([]);
  const navigate = useNavigate();

  const userId = '6847dd137ab96450bdb4f01c'; // Replace with actual userId

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitsRes, goalsRes, moodsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/habits/${userId}`),
          axios.get(`http://localhost:5000/api/goals/${userId}`),
          axios.get('http://localhost:5000/api/moods'),
        ]);
        setHabits(habitsRes.data);
        setGoals(goalsRes.data);
        setMoods(moodsRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, []);

  const latestMood = moods.length > 0 ? moods[moods.length - 1] : null;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to the Habit, Mood & Goal Tracker</h1>
      <p>{new Date().toLocaleDateString()}</p>
      <blockquote>
        <i>"Commit to the Lord whatever you do, and he will establish your plans." - Proverbs 16:3</i>
      </blockquote>

      <div style={{ marginTop: "1rem" }}>
        <h3>Summary</h3>
        <p>🎯 Goals: {goals.length}</p>
        <p>✅ Habits: {habits.length}</p>
        <p>😊 Moods Logged: {moods.length}</p>
        {latestMood && (
          <p>📌 Last Mood: {latestMood.emotion} - {latestMood.note}</p>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => navigate('/goals')}>Go to Goals</button>
        <button onClick={() => navigate('/habits')} style={{ margin: '0 1rem' }}>Go to Habits</button>
        <button onClick={() => navigate('/moods')}>Go to Moods</button>
      </div>
    </div>
  );
}

export default Home;
