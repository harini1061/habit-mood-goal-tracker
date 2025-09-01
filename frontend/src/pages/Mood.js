import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../unified-styles.css';
// Removed Navbar import to avoid duplicate navbar
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function Mood() {
  const [moods, setMoods] = useState([]);
  const [newMood, setNewMood] = useState('');
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")); 
  const currentUserId = user ? user._id : null;


  // Fetch moods
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

  // Submit (create or update)
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!newMood) return;

  try {
    const moodData = {
      user: currentUserId,
      emotion: newMood,
      note,
      intensity: parseInt(intensity) || 5,  // ensures valid value
    };

    if (editingId) {
      await axios.put(`http://localhost:5000/api/moods/${editingId}`, moodData);
      setEditingId(null);
    } else {
      await axios.post('http://localhost:5000/api/moods', moodData);
    }

    // reset form
    setNewMood('');
    setNote('');
    setIntensity(5);

    // refresh moods
    fetchMoods();
  } catch (err) {
    console.error('Error saving mood:', err);
  }
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/moods/${id}`);
      fetchMoods();
    } catch (err) {
      console.error('Error deleting mood:', err);
    }
  };

  const handleEdit = (mood) => {
    setNewMood(mood.emotion);
    setNote(mood.note);
    setIntensity(mood.intensity || 5);
    setEditingId(mood._id);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
      `,
      padding: "2rem",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .elegant-input, .elegant-textarea {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          color: #ffffff;
          padding: 12px 18px;
          font-size: 1rem;
          font-weight: 500;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          width: 100%;
        }
        .elegant-input:focus, .elegant-textarea:focus {
          outline: none;
          border-color: rgba(135, 206, 235, 0.6);
          box-shadow: 0 0 20px rgba(135, 206, 235, 0.3);
        }
        .elegant-button {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          color: #fff;
          padding: 12px 24px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(20px);
        }
        .elegant-button:hover {
          transform: translateY(-3px);
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
        }
        .mood-card {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(25px);
          margin-bottom: 1.5rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          animation: fadeInUp 1s ease-out both;
          color: #fff;
        }
        .mood-actions button {
          margin-right: 0.5rem;
        }
      `}</style>

      {/* Floating Orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>

      <h1 style={{
        fontSize: '3rem',
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #e1f5fe 50%, #81d4fa 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 4px 30px rgba(255,255,255,0.3)',
        animation: 'fadeIn 1s ease-out'
      }}>
        😊 Mood Tracker
      </h1>

      {/* Mood Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'grid', gap: '1rem' }}>
        <input
          type="text"
          value={newMood}
          onChange={(e) => setNewMood(e.target.value)}
          placeholder="e.g., happy, sad, excited..."
          className="elegant-input"
          required
        />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          className="elegant-textarea"
          rows="3"
        />
        <label style={{ color: '#fff', fontWeight: '600' }}>Intensity: {intensity}/10</label>
        <input
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          style={{ width: '100%' }}
        />
        <button type="submit" className="elegant-button">
          {editingId ? '✏️ Update Mood' : '➕ Add Mood'}
        </button>
      </form>

      {/* Mood List */}
      {moods.length === 0 ? (
        <p style={{ color: '#fff', textAlign: 'center' }}>🌟 No moods found. Add your first one above!</p>
      ) : (
        moods.map((mood) => (
          <div key={mood._id} className="mood-card">
            <div>
              <p><b>Emotion:</b> {mood.emotion}</p>
              <p><b>Note:</b> {mood.note || 'No note'}</p>
              <p><b>Date:</b> {new Date(mood.date).toLocaleString()}</p>
              <p><b>Intensity:</b> {mood.intensity || 5}/10</p>
            </div>
            <div className="mood-actions">
              <button className="elegant-button" onClick={() => handleEdit(mood)}>✏️ Edit</button>
              <button className="elegant-button delete-button" onClick={() => handleDelete(mood._id)}>🗑️ Delete</button>
            </div>
          </div>
        ))
      )}

      {/* Mood Chart */}
      {moods.length > 0 && (
        <div style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem' }}>
          <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '1rem' }}>📊 Mood Intensity Chart</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={moods.map((m) => ({
                date: new Date(m.date).toLocaleDateString(),
                intensity: m.intensity || 5,
              }))}
            >
              <XAxis dataKey="date" stroke="#fff" />
              <YAxis domain={[0, 10]} stroke="#fff" />
              <Tooltip />
              <Bar dataKey="intensity" fill="url(#colorIntensity)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#81d4fa" />
                  <stop offset="100%" stopColor="#1e88e5" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Mood;
