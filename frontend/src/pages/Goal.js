import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Goal() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const userId = '6847dd137ab96450bdb4f01c'; // Your actual userId

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/goals/${userId}`);
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !userId) return;

    try {
      await axios.post('http://localhost:5000/api/goals', {
        title,
        description,
        targetDate,
        userId
      });
      setTitle('');
      setDescription('');
      setTargetDate('');
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  return (
    <div>
      <h1>Goal Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Goal Title"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
        <button type="submit">Add Goal</button>
      </form>

      {goals.length === 0 ? (
        <p>No goals found.</p>
      ) : (
        goals.map((goal) => (
          <div key={goal._id}>
            <p><strong>Title:</strong> {goal.title}</p>
            <p><strong>Description:</strong> {goal.description}</p>
            <p><strong>Target Date:</strong> {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Status:</strong> {goal.completed ? '✅ Completed' : '❌ Not Completed'}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Goal;
