import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../unified-styles.css';
import Navbar from './Navbar';

function Habit() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [editId, setEditId] = useState(null);

  const userId = '6847dd137ab96450bdb4f01c'; // ✅ Replace with dynamic user ID if needed

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/habits/${editId}`, {
          name,
          frequency,
        });
      } else {
        await axios.post('http://localhost:5000/api/habits', {
          name,
          frequency,
          userId,
        });
      }

      setName('');
      setFrequency('daily');
      setEditId(null);
      fetchHabits();
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const handleEdit = (habit) => {
    setName(habit.name);
    setFrequency(habit.frequency);
    setEditId(habit._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/habits/${id}`);
      fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleCancel = () => {
    setName('');
    setFrequency('daily');
    setEditId(null);
  };

  const markCompleted = async (habitId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/habits/${habitId}/complete`);
      alert(`✅ Habit marked as completed!\n🔥 Current streak: ${res.data.streak}`);
      fetchHabits();
    } catch (error) {
      if (error.response?.status === 400) {
        alert('⚠️ You’ve already marked this habit today!');
      } else {
        console.error('Error marking habit complete:', error);
        alert('❌ Something went wrong.');
      }
    }
  };

  return (
    <div className="habit-container">
      
      <h1>🧠 Habit Tracker</h1>

      <form className="habit-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter habit name"
          required
        />

        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>

        <button type="submit">
          {editId ? 'Update Habit' : 'Add Habit'}
        </button>

        {editId && (
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <div className="habit-list">
        {habits.length === 0 ? (
          <p>No habits found.</p>
        ) : (
          habits.map((habit) => {
            const last = habit.lastCompleted ? new Date(habit.lastCompleted).toLocaleDateString() : 'Never';
            return (
              <div key={habit._id} className="habit-item">
                <p><strong>Habit:</strong> {habit.name}</p>
                <p><strong>Frequency:</strong> {habit.frequency}</p>
                <p><strong>Created:</strong> {new Date(habit.createdAt).toLocaleDateString()}</p>
                <p><strong>🔥 Streak:</strong> {habit.streak || 0} days</p>
                <p><strong>Last Completed:</strong> {last}</p>

                <div className="habit-actions">
                  <button onClick={() => handleEdit(habit)}>📝 Edit</button>
                  <button onClick={() => handleDelete(habit._id)}>🗑️ Delete</button>
                  <button onClick={() => markCompleted(habit._id)}>✅ Mark Today</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Habit;
