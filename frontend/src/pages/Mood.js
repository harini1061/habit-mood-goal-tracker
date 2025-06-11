import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Mood() {
  const [moods, setMoods] = useState([]);
  const [newMood, setNewMood] = useState('');
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState(null); // Track editing mood ID

  // Fetch all moods
  const fetchMoods = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/moods');
      setMoods(res.data);
    } catch (err) {
      console.error('Error fetching moods:', err);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  // Add or update mood
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMood) return;

    try {
      if (editingId) {
        // Update existing mood
        await axios.put(`http://localhost:5000/api/moods/${editingId}`, {
          emotion: newMood,
          note,
        });
        setEditingId(null);
      } else {
        // Create new mood
        await axios.post('http://localhost:5000/api/moods', {
          emotion: newMood,
          note,
        });
      }

      setNewMood('');
      setNote('');
      fetchMoods();
    } catch (err) {
      console.error('Error saving mood:', err);
    }
  };

  // Delete mood
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/moods/${id}`);
      fetchMoods();
    } catch (err) {
      console.error('Error deleting mood:', err);
    }
  };

  // Start editing
  const handleEdit = (mood) => {
    setNewMood(mood.emotion);
    setNote(mood.note);
    setEditingId(mood._id);
  };

  return (
    <div>
      <h1>Mood Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMood}
          onChange={(e) => setNewMood(e.target.value)}
          placeholder="Emotion (e.g., happy, sad)"
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
        />
        <button type="submit">{editingId ? 'Update Mood' : 'Add Mood'}</button>
      </form>

      {moods.length === 0 ? (
        <p>No moods found.</p>
      ) : (
        moods.map((mood) => (
          <div key={mood._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <p><strong>Emotion:</strong> {mood.emotion}</p>
            <p><strong>Note:</strong> {mood.note}</p>
            <p><strong>Date:</strong> {new Date(mood.date).toLocaleString()}</p>
            <button onClick={() => handleEdit(mood)}>✏️ Edit</button>
            <button onClick={() => handleDelete(mood._id)}>🗑️ Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Mood;
