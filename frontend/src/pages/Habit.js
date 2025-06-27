import React, { useState, useEffect } from 'react';
import axios from 'axios';
// External CSS for styling
import '../unified-styles.css';

function Habit() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [editId, setEditId] = useState(null);

  const userId = '6847dd137ab96450bdb4f01c'; // ✅ Replace with dynamic user ID if needed

  // Fetch habits on load
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
        // Edit habit
        await axios.put(`http://localhost:5000/api/habits/${editId}`, {
          name,
          frequency,
        });
      } else {
        // Add new habit
        await axios.post('http://localhost:5000/api/habits', {
          name,
          frequency,
          userId,
        });
      }

      // Reset form
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

  return (
    <div className="habit-container">
      <h1>Habit Tracker</h1>

      <form className="habit-form" onSubmit={handleSubmit}>
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
          habits.map((habit) => (
            <div key={habit._id} className="habit-item">
              <p><strong>Habit:</strong> {habit.name}</p>
              <p><strong>Frequency:</strong> {habit.frequency}</p>
              <p><strong>Created:</strong> {new Date(habit.createdAt).toLocaleDateString()}</p>
              <div className="habit-actions">
                <button onClick={() => handleEdit(habit)}>📝 Edit</button>
                <button onClick={() => handleDelete(habit._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Habit;
