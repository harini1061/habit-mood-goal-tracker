import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../unified-styles.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  Area,
  AreaChart
} from 'recharts';

function Mood() {
  const [moods, setMoods] = useState([]);
  const [newMood, setNewMood] = useState('');
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const [showPreviousMoods, setShowPreviousMoods] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")); 
  const currentUserId = user ? user._id : null;

  // Fetch moods
  const fetchMoods = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/moods", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMoods(res.data);
    } catch (err) {
      console.error("Error fetching moods:", err);
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
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const moodData = {
        emotion: newMood,
        note,
        intensity: parseInt(intensity) || 5,
      };

      if (!editingId) {
        moodData.user = currentUserId;
      }

      if (editingId) {
        await axios.put(`http://localhost:5000/api/moods/${editingId}`, moodData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/moods', moodData, {
          headers: { Authorization: `Bearer ${token}` }
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
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/moods/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMoods();
    } catch (err) {
      console.error("Error deleting mood:", err);
    }
  };

  const handleEdit = (mood) => {
    setNewMood(mood.emotion);
    setNote(mood.note);
    setIntensity(mood.intensity || 5);
    setEditingId(mood._id);
    // Auto-expand the previous moods section when editing
    setShowPreviousMoods(true);
  };

  // Get mood color based on intensity
  const getMoodColor = (intensity) => {
    if (intensity >= 8) return '#10B981'; // Green - Very positive
    if (intensity >= 6) return '#22D3EE'; // Cyan - Positive
    if (intensity >= 4) return '#F59E0B'; // Yellow - Neutral
    if (intensity >= 2) return '#F97316'; // Orange - Negative
    return '#EF4444'; // Red - Very negative
  };

  // Get mood emoji based on intensity
  const getMoodEmoji = (intensity) => {
    if (intensity >= 8) return '😄';
    if (intensity >= 6) return '😊';
    if (intensity >= 4) return '😐';
    if (intensity >= 2) return '😕';
    return '😢';
  };

  // Calculate analytics
  const averageIntensity = moods.length > 0 ? 
    Math.round((moods.reduce((sum, m) => sum + (m.intensity || 5), 0) / moods.length) * 10) / 10 : 0;

  const moodCounts = moods.reduce((acc, mood) => {
    const range = mood.intensity >= 8 ? 'Very Positive' :
                  mood.intensity >= 6 ? 'Positive' :
                  mood.intensity >= 4 ? 'Neutral' :
                  mood.intensity >= 2 ? 'Negative' : 'Very Negative';
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(moodCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#10B981', '#22D3EE', '#F59E0B', '#F97316', '#EF4444'];

  // Prepare trend data (last 30 entries or all if less)
  const trendData = moods
    .slice(-30)
    .map((mood, index) => ({
      index: index + 1,
      date: new Date(mood.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      intensity: mood.intensity || 5,
      emotion: mood.emotion
    }));

  // Recent mood analysis
  const recentMoods = moods.slice(-7); // Last 7 entries
  const recentAverage = recentMoods.length > 0 ? 
    Math.round((recentMoods.reduce((sum, m) => sum + (m.intensity || 5), 0) / recentMoods.length) * 10) / 10 : 0;
  
  const trend = moods.length >= 2 ? 
    (moods[moods.length - 1].intensity || 5) - (moods[moods.length - 2].intensity || 5) : 0;

  const getTrendIndicator = () => {
    if (trend > 0) return { text: 'Improving', color: '#10B981', icon: '📈' };
    if (trend < 0) return { text: 'Declining', color: '#EF4444', icon: '📉' };
    return { text: 'Stable', color: '#F59E0B', icon: '➡️' };
  };

  const trendIndicator = getTrendIndicator();

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

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); max-height: 0; }
          to { opacity: 1; transform: translateY(0); max-height: 2000px; }
        }

        @keyframes slideUp {
          from { opacity: 1; transform: translateY(0); max-height: 2000px; }
          to { opacity: 0; transform: translateY(-20px); max-height: 0; }
        }

        .elegant-input, .elegant-textarea {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
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
        .elegant-input::placeholder, .elegant-textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
          opacity: 1;
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
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
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
          position: relative;
          overflow: hidden;
        }
        .mood-actions button {
          margin-right: 0.5rem;
        }
        .delete-button {
          background: linear-gradient(145deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1));
          border: 2px solid rgba(239, 68, 68, 0.4);
        }
        .delete-button:hover {
          background: linear-gradient(145deg, rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.2));
          border-color: rgba(239, 68, 68, 0.6);
        }
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(1px);
          opacity: 0.6;
          animation: float 6s ease-in-out infinite;
        }
        .orb-1 {
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, rgba(120, 200, 255, 0.4), rgba(120, 200, 255, 0.1));
          top: 15%;
          left: 10%;
          animation-delay: -2s;
        }
        .orb-2 {
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(255, 119, 198, 0.4), rgba(255, 119, 198, 0.1));
          top: 70%;
          right: 15%;
          animation-delay: -4s;
        }
        .orb-3 {
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(120, 119, 198, 0.3), rgba(120, 119, 198, 0.1));
          bottom: 25%;
          left: 5%;
          animation-delay: -1s;
        }
        .dropdown-toggle {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          color: #fff;
          padding: 15px 30px;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(20px);
          width: 100%;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dropdown-toggle:hover {
          transform: translateY(-2px);
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
        }
        .previous-moods-section {
          animation: ${showPreviousMoods ? 'slideDown' : 'slideUp'} 0.3s ease-out forwards;
          overflow: hidden;
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

      {/* Mood Analytics Dashboard */}
      {moods.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          animation: 'fadeInUp 1s ease-out 0.2s both'
        }}>
          <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '1.5rem' }}>
            📊 Mood Analytics
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'linear-gradient(145deg, rgba(34, 211, 238, 0.2), rgba(34, 211, 238, 0.1))',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid rgba(34, 211, 238, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#22D3EE' }}>
                {averageIntensity}
              </div>
              <div style={{ color: '#fff', fontSize: '1rem' }}>Average Intensity</div>
            </div>
            <div style={{
              background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#10B981' }}>
                {recentAverage}
              </div>
              <div style={{ color: '#fff', fontSize: '1rem' }}>Recent Average</div>
            </div>
            <div style={{
              background: `linear-gradient(145deg, ${trendIndicator.color}30, ${trendIndicator.color}10)`,
              padding: '1.5rem',
              borderRadius: '15px',
              border: `1px solid ${trendIndicator.color}50`
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: trendIndicator.color }}>
                {trendIndicator.icon}
              </div>
              <div style={{ color: '#fff', fontSize: '1rem' }}>{trendIndicator.text}</div>
            </div>
            <div style={{
              background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#8B5CF6' }}>
                {moods.length}
              </div>
              <div style={{ color: '#fff', fontSize: '1rem' }}>Total Entries</div>
            </div>
          </div>
        </div>
      )}

      {/* Mood Form */}
      <form onSubmit={handleSubmit} style={{ 
        marginBottom: '2rem', 
        display: 'grid', 
        gap: '1rem',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
        padding: '2rem',
        borderRadius: '20px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(25px)',
        animation: 'fadeInUp 1s ease-out 0.4s both'
      }}>
        <h3 style={{
          color: '#fff',
          textAlign: 'center',
          marginBottom: '1rem',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>
          {editingId ? '✏️ Edit Mood Entry' : '💭 Record Your Mood'}
        </h3>
        
        <input
          type="text"
          value={newMood}
          onChange={(e) => setNewMood(e.target.value)}
          placeholder="e.g., happy, sad, excited, anxious..."
          className="elegant-input"
          required
        />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What's on your mind? (optional)"
          className="elegant-textarea"
          rows="3"
        />
        
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <label style={{ 
            color: '#fff', 
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Intensity:</span>
            <span style={{ 
              fontSize: '1.2rem',
              color: getMoodColor(intensity),
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {getMoodEmoji(intensity)} {intensity}/10
            </span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            style={{ 
              width: '100%',
              height: '6px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '3px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>
        
        <button type="submit" className="elegant-button">
          {editingId ? '✏️ Update Mood' : '➕ Add Mood'}
        </button>
        
        {editingId && (
          <button 
            type="button" 
            className="elegant-button" 
            onClick={() => {
              setEditingId(null);
              setNewMood('');
              setNote('');
              setIntensity(5);
            }}
          >
            ❌ Cancel Edit
          </button>
        )}
      </form>

      {/* Previous Moods Dropdown Section */}
      {moods.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <button 
            className="dropdown-toggle"
            onClick={() => setShowPreviousMoods(!showPreviousMoods)}
          >
            <span>📝 Previous Mood Entries ({moods.length})</span>
            <span style={{ 
              transform: showPreviousMoods ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}>
              ⬇️
            </span>
          </button>

          {showPreviousMoods && (
            <div className="previous-moods-section">
              {moods.slice().reverse().map((mood, index) => (
                <div key={mood._id} className="mood-card" style={{
                  borderLeft: `5px solid ${getMoodColor(mood.intensity || 5)}`
                }}>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <span style={{ fontSize: '2rem' }}>
                        {getMoodEmoji(mood.intensity || 5)}
                      </span>
                      <div>
                        <h3 style={{ 
                          fontSize: '1.3rem', 
                          marginBottom: '0.3rem',
                          textTransform: 'capitalize',
                          fontWeight: '700'
                        }}>
                          {mood.emotion}
                        </h3>
                        <div style={{
                          background: `linear-gradient(145deg, ${getMoodColor(mood.intensity || 5)}30, ${getMoodColor(mood.intensity || 5)}10)`,
                          color: getMoodColor(mood.intensity || 5),
                          padding: '0.3rem 0.8rem',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          display: 'inline-block',
                          border: `1px solid ${getMoodColor(mood.intensity || 5)}40`
                        }}>
                          Intensity: {mood.intensity || 5}/10
                        </div>
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'right',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.9rem'
                    }}>
                      {new Date(mood.date).toLocaleDateString()}
                      <br />
                      {new Date(mood.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  
                  {mood.note && (
                    <p style={{ 
                      marginBottom: '1rem', 
                      opacity: 0.9,
                      fontStyle: 'italic',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '1rem',
                      borderRadius: '10px',
                      borderLeft: '3px solid rgba(255,255,255,0.3)'
                    }}>
                      "{mood.note}"
                    </p>
                  )}
                  
                  <div className="mood-actions">
                    <button className="elegant-button" onClick={() => handleEdit(mood)}>
                      ✏️ Edit
                    </button>
                    <button className="elegant-button" onClick={() => handleDelete(mood._id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {moods.length === 0 && (
        <p style={{ color: '#fff', textAlign: 'center', fontSize: '1.2rem' }}>
          🌟 No moods recorded yet. Share how you're feeling above!
        </p>
      )}

      {/* Charts and Analytics */}
      {moods.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          {/* Mood Trend Chart */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            animation: 'fadeInUp 1s ease-out 0.6s both'
          }}>
            <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '1rem' }}>
              📈 Mood Intensity Trend
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#fff" 
                  fontSize={11}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={[1, 10]} 
                  stroke="#fff" 
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    color: '#fff'
                  }}
                  formatter={(value, name, props) => [
                    `${value}/10 - ${props.payload.emotion}`, 
                    'Intensity'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="intensity"
                  stroke="#22D3EE"
                  strokeWidth={3}
                  fill="url(#moodGradient)"
                  dot={{ fill: '#22D3EE', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#22D3EE', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Mood Distribution Pie Chart */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            animation: 'fadeInUp 1s ease-out 0.8s both'
          }}>
            <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '1rem' }}>
              🎯 Mood Distribution
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value, percent}) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    color: '#fff'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mood;