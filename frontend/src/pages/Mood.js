import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../unified-styles.css';
import Navbar from './Navbar';
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
      if (editingId) {
        await axios.put(`http://localhost:5000/api/moods/${editingId}`, {
          emotion: newMood,
          note,
          intensity: parseInt(intensity) || 5
        });
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/moods', {
          emotion: newMood,
          note,
          intensity: parseInt(intensity)
        });
      }

      setNewMood('');
      setNote('');
      setIntensity(5);
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
    <div>
      

      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mood Tracker</h1>

        {/* Mood Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Emotion
            </label>
            <input
              type="text"
              value={newMood}
              onChange={(e) => setNewMood(e.target.value)}
              placeholder="e.g., happy, sad, excited, anxious"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Intensity Level (1 = Worst, 10 = Amazing)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="flex-1 h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #f87171 0%, #facc15 50%, #4ade80 100%)`
                }}
              />
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg">
                {intensity}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>😞 Worst (1)</span>
              <span>😐 Neutral (5)</span>
              <span>😊 Amazing (10)</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any additional thoughts or context..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {editingId ? '✏️ Update Mood' : '➕ Add Mood'}
          </button>
        </form>

        {/* Mood List */}
        {moods.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No moods found. Add your first mood above!</p>
        ) : (
          <div className="space-y-4 mb-8">
            {moods.map((mood) => (
              <div
                key={mood._id}
                className="bg-white border border-gray-300 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-800">
                      <span className="text-blue-600">Emotion:</span> {mood.emotion}
                    </p>
                    <p className="text-gray-600 mt-1">
                      <span className="font-medium">Note:</span> {mood.note || 'No additional notes'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-medium">Date:</span> {new Date(mood.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {mood.intensity || 5}/10
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(mood)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mood._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium text-sm hover:underline"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Mood Chart */}
        <div className="bg-white p-8 mt-8 rounded-3xl shadow-2xl border-4 border-yellow-400 relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
          {/* Animated border glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 rounded-3xl opacity-20 animate-pulse"></div>
          
          {/* Attention-grabbing header */}
          <div className="relative z-10 flex items-center justify-between mb-8 bg-gradient-to-r from-orange-400 to-pink-500 -mx-8 -mt-8 px-8 py-6 rounded-t-3xl">
            <h2 className="text-4xl font-black text-white flex items-center gap-4 drop-shadow-lg">
              📊 MOOD INTENSITY CHART
            </h2>
            <div className="bg-white px-6 py-3 rounded-full text-gray-900 text-lg font-black shadow-xl border-2 border-yellow-400">
              {moods.length} ENTRIES
            </div>
          </div>
          
          {moods.length === 0 ? (
            <div className="relative z-10 text-center py-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl border-4 border-dashed border-orange-300">
              <div className="text-9xl mb-8 animate-bounce">📈</div>
              <p className="text-gray-800 text-2xl font-bold">Add mood entries to see your amazing chart!</p>
            </div>
          ) : (
            <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-inner border-4 border-orange-400">
              <ResponsiveContainer width="100%" height={450}>
                <BarChart
                  data={moods.map((m) => ({
                    date: new Date(m.date).toLocaleDateString(),
                    intensity: m.intensity || 5,
                    emotion: m.emotion
                  }))}
                  margin={{ top: 40, right: 50, left: 40, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity={1}/>
                      <stop offset="33%" stopColor="#FF6B35" stopOpacity={1}/>
                      <stop offset="66%" stopColor="#FF1744" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#E91E63" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="glowEffect" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFFF00" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#FF6B35" stopOpacity={0.8}/>
                    </linearGradient>
                    <filter id="strongShadow">
                      <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.6" floodColor="#FFD700"/>
                    </filter>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={true}
                    tickLine={true}
                    tick={{ fill: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}
                    stroke="#FFD700"
                    strokeWidth={4}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    axisLine={true}
                    tickLine={true}
                    tick={{ fill: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}
                    stroke="#FFD700"
                    strokeWidth={4}
                    label={{ 
                      value: 'INTENSITY LEVEL', 
                      angle: -90, 
                      position: 'insideLeft', 
                      style: { textAnchor: 'middle', fill: '#FFFFFF', fontSize: '18px', fontWeight: 'bold' } 
                    }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFD700',
                      color: '#000000',
                      border: '3px solid #FF6B35',
                      borderRadius: '15px',
                      boxShadow: '0 10px 30px rgba(255, 215, 0, 0.5)',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                    cursor={{ fill: 'rgba(255, 215, 0, 0.2)' }}
                  />
                  <Bar 
                    dataKey="intensity" 
                    fill="url(#colorIntensity)"
                    radius={[8, 8, 0, 0]}
                    stroke="#FFD700"
                    strokeWidth={4}
                    filter="url(#strongShadow)"
                  />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Intensity Scale Reference */}
              <div className="mt-8 pt-8 border-t-4 border-yellow-400">
                <div className="flex justify-between items-center text-lg font-black">
                  <span className="flex items-center gap-3 bg-red-500 text-white px-6 py-3 rounded-full shadow-xl border-2 border-white">
                    <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
                    LOW (1-3)
                  </span>
                  <span className="flex items-center gap-3 bg-yellow-500 text-black px-6 py-3 rounded-full shadow-xl border-2 border-white">
                    <div className="w-5 h-5 bg-black rounded-full shadow-md"></div>
                    MEDIUM (4-6)
                  </span>
                  <span className="flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-full shadow-xl border-2 border-white">
                    <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
                    HIGH (7-10)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mood;