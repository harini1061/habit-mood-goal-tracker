import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Mood() {
  const [moods, setMoods] = useState([]);
  const [newMood, setNewMood] = useState('');
  const [note, setNote] = useState('');

  const fetchMoods = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/moods');
      setMoods(response.data);
      console.log('Fetched moods:', response.data); // ✅ Debugging log
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMood) return;

    try {
      await axios.post('http://localhost:5000/api/moods', {
        emotion: newMood,
        note: note
      });
      setNewMood('');
      setNote('');
      fetchMoods();
    } catch (error) {
      console.error('Error adding mood:', error);
    }
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
        <button type="submit">Add Mood</button>
      </form>

      {moods.length === 0 ? (
        <p>No moods found.</p>
      ) : (
        moods.map((mood) => (
          <div key={mood._id}>
            <p>Emotion: {mood.emotion}</p>
            <p>Note: {mood.note}</p>
            <p>Date: {new Date(mood.date).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Mood;
