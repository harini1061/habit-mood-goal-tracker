import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Habit() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');

  const userId = '6847dd137ab96450bdb4f01c'; // ✅ Replace with your actual userId

  // Fetch habits
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/habits/${userId}`);
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  // Add a new habit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      await axios.post('http://localhost:5000/api/habits', {
        name,
        frequency,
        userId
      });
      setName('');
      setFrequency('daily');
      fetchHabits(); // refresh the list
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  return (
    <div>
      <h1>Habit Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter habit name"
        />
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button type="submit">Add Habit</button>
      </form>

      {habits.length === 0 ? (
        <p>No habits found.</p>
      ) : (
        habits.map((habit) => (
          <div key={habit._id}>
            <p>Habit: {habit.name}</p>
            <p>Frequency: {habit.frequency}</p>
            <p>Created: {new Date(habit.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Habit;
