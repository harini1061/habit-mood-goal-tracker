import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../unified-styles.css';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

function Habit() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [editId, setEditId] = useState(null);
  const [showHabitList, setShowHabitList] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await axios.get("http://localhost:5000/api/habits", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHabits(res.data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.post(
        "http://localhost:5000/api/habits",
        { name, frequency },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setFrequency("daily");
      fetchHabits();
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  const handleEdit = (habit) => {
    setName(habit.name);
    setFrequency(habit.frequency);
    setEditId(habit._id);
  };
  
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/habits/${editId}`,
        { name, frequency },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setFrequency("daily");
      setEditId(null);
      fetchHabits();
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/habits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  // Mark habit as completed for today
  const markHabitCompleted = async (id) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/habits/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHabits();
    } catch (error) {
      if (error.response?.status === 400) {
        alert('Habit already completed today!');
      } else {
        console.error("Error marking habit completed:", error);
      }
    }
  };
  // Add this function after markHabitCompleted
const undoHabitCompletion = async (id) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/habits/${id}/complete`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchHabits();
  } catch (error) {
    if (error.response?.status === 400) {
      alert('Habit was not completed today!');
    } else {
      console.error("Error undoing habit completion:", error);
    }
  }
};
  // Check if habit was completed today
  const isCompletedToday = (habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return habit.completedDates.some(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });
  };

  // Calculate completion rate for a habit
  const getCompletionRate = (habit) => {
    const daysSinceCreated = Math.ceil((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24));
    const expectedCompletions = habit.frequency === 'daily' ? daysSinceCreated : 
                               habit.frequency === 'weekly' ? Math.ceil(daysSinceCreated / 7) : 
                               Math.ceil(daysSinceCreated / 30);
    return expectedCompletions > 0 ? Math.round((habit.completedDates.length / expectedCompletions) * 100) : 0;
  };

  // Get streak color based on streak length
  const getStreakColor = (streak) => {
    if (streak >= 30) return '#FFD700'; // Gold
    if (streak >= 14) return '#FF6B35'; // Orange
    if (streak >= 7) return '#4FACFE';  // Blue
    if (streak >= 3) return '#10B981';  // Green
    return '#9CA3AF'; // Gray
  };

  // Calculate overall statistics
  const totalHabits = habits.length;
  const activeStreaks = habits.filter(h => h.streak > 0).length;
  const completedToday = habits.filter(h => isCompletedToday(h)).length;
  const averageStreak = habits.length > 0 ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) : 0;

  // Prepare chart data
  const pieData = [
    { name: 'Completed Today', value: completedToday },
    { name: 'Pending Today', value: totalHabits - completedToday }
  ];

  const COLORS = ['#10B981', '#EF4444'];

  // Prepare streak trend data (last 30 days)
  const getStreakTrendData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completedCount = habits.filter(habit => 
        habit.completedDates.some(completedDate => 
          new Date(completedDate).toISOString().split('T')[0] === dateStr
        )
      ).length;

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: completedCount
      });
    }
    return data;
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
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes glow {
          from { text-shadow: 0 4px 20px rgba(255, 255, 255, 0.4); }
          to { text-shadow: 0 4px 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(120, 200, 255, 0.4); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
            max-height: 0;
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
            max-height: 2000px;
          }
        }

        @keyframes slideUp {
          from { 
            opacity: 1; 
            transform: translateY(0); 
            max-height: 2000px;
          }
          to { 
            opacity: 0; 
            transform: translateY(-20px); 
            max-height: 0;
          }
        }

        .elegant-input {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          color: #ffffff;
          padding: 12px 18px;
          font-size: 1rem;
          font-weight: 500;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          width: 100%;
        }

        .elegant-input:focus {
          outline: none;
          border-color: rgba(135, 206, 235, 0.6);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(135, 206, 235, 0.3);
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.06));
        }

        .elegant-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
        }

        .elegant-input select option {
          background: linear-gradient(145deg, #2a2a3e, #1a1a2e);
          color: #ffffff;
          padding: 10px;
          border: none;
        }

        .elegant-input option {
          background: #2a2a3e !important;
          color: #ffffff !important;
          padding: 8px 12px;
        }

        .elegant-input option:hover {
          background: #3a3a4e !important;
        }

        .elegant-input option:checked {
          background: linear-gradient(145deg, #4a4a6e, #3a3a5e) !important;
          color: #87ceeb !important;
        }

        .elegant-button {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          color: #ffffff;
          padding: 12px 24px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .elegant-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.6);
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
        }

        .elegant-button:active {
          transform: translateY(-1px);
        }

        .dropdown-button {
          background: linear-gradient(145deg, rgba(79, 172, 254, 0.3), rgba(79, 172, 254, 0.1));
          border: 2px solid rgba(79, 172, 254, 0.4);
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dropdown-button:hover {
          background: linear-gradient(145deg, rgba(79, 172, 254, 0.4), rgba(79, 172, 254, 0.2));
          border-color: rgba(79, 172, 254, 0.6);
        }

        .habit-list {
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .habit-list.show {
          animation: slideDown 0.5s ease-out forwards;
        }

        .habit-list.hide {
          animation: slideUp 0.5s ease-out forwards;
        }

        .edit-button {
          background: linear-gradient(145deg, rgba(251, 191, 36, 0.3), rgba(251, 191, 36, 0.1));
          border: 2px solid rgba(251, 191, 36, 0.4);
        }

        .edit-button:hover {
          background: linear-gradient(145deg, rgba(251, 191, 36, 0.4), rgba(251, 191, 36, 0.2));
          border-color: rgba(251, 191, 36, 0.6);
        }

        .delete-button {
          background: linear-gradient(145deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1));
          border: 2px solid rgba(239, 68, 68, 0.4);
        }

        .delete-button:hover {
          background: linear-gradient(145deg, rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.2));
          border-color: rgba(239, 68, 68, 0.6);
        }

        .complete-button {
          background: linear-gradient(145deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.1));
          border: 2px solid rgba(16, 185, 129, 0.4);
        }

        .complete-button:hover {
          background: linear-gradient(145deg, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.2));
          border-color: rgba(16, 185, 129, 0.6);
        }

        .undo-button {
  background: linear-gradient(145deg, rgba(251, 146, 60, 0.3), rgba(251, 146, 60, 0.1));
  border: 2px solid rgba(251, 146, 60, 0.4);
}

.undo-button:hover {
  background: linear-gradient(145deg, rgba(251, 146, 60, 0.4), rgba(251, 146, 60, 0.2));
  border-color: rgba(251, 146, 60, 0.6);
}

        .completed-today {
          background: linear-gradient(145deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
          border-color: rgba(16, 185, 129, 0.5);
        }

        .streak-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
          backdrop-filter: blur(10px);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin: 1rem 0;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10B981, #34D399);
          border-radius: 4px;
          transition: width 0.3s ease;
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
      `}</style>

      {/* Floating decorative orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>

      <h1 style={{
        fontSize: '3rem',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 25%, #e1f5fe 50%, #b3e5fc 75%, #81d4fa 100%)',
        backgroundSize: '400% 400%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textAlign: 'center',
        marginBottom: '2rem',
        textShadow: '0 4px 30px rgba(255, 255, 255, 0.3)',
        animation: 'fadeIn 1s ease-out, gradientShift 4s ease-in-out infinite',
        letterSpacing: '2px'
      }}>
        ✅ Habit Tracker
      </h1>

      {/* Overall Statistics */}
      {habits.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          animation: 'fadeInUp 1s ease-out 0.2s both'
        }}>
          <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '1rem' }}>
            📊 Overall Progress
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#10B981' }}>
                {completedToday}
              </div>
              <div style={{ color: '#fff', fontSize: '1rem' }}>Completed Today</div>
            </div>
            <div style={{
              background: 'linear-gradient(145deg, rgba(79, 172, 254, 0.2), rgba(79, 172, 254, 0.1))',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid rgba(79, 172, 254, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#4FACFE' }}>
                {activeStreaks}
              </div>
              <div style={{ color: '#fff', fontSize: '1rem' }}>Active Streaks</div>
            </div>
            <div style={{
              background: 'linear-gradient(145deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.1))',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid rgba(251, 191, 36, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#FBB F24' }}>
                {averageStreak}
              </div>
              <div style={{ color: '#fff', fontSize: '1rem' }}>Average Streak</div>
            </div>
            <div style={{
              background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#8B5CF6' }}>
                {totalHabits}
              </div>
              <div style={{ color: '#fff', fontSize: '1rem' }}>Total Habits</div>
            </div>
          </div>
        </div>
      )}

      {/* Habit Form */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06))',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '2px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '25px',
        padding: '2.5rem',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 1s ease-out 0.4s both',
        marginBottom: '2rem'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '4px',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
          borderRadius: '25px 25px 0 0'
        }}></div>

        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'rgba(255, 255, 255, 0.95)',
          textAlign: 'center',
          marginBottom: '1.5rem',
          textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)'
        }}>
          ✨ {editId ? 'Update Habit' : 'Create New Habit'}
        </h3>

        <form onSubmit={editId ? handleUpdate : handleSubmit} style={{
          display: 'grid',
          gap: '1.5rem'
        }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="✅ Habit name"
            required
            className="elegant-input"
          />
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="elegant-input"
            style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04))',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '15px',
              color: '#ffffff',
              padding: '12px 18px',
              fontSize: '1rem',
              fontWeight: '500',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              width: '100%',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='rgba(255,255,255,0.8)' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 15px center',
              backgroundSize: '12px',
              paddingRight: '40px'
            }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <button type="submit" className="elegant-button">
            {editId ? '✏️ Update Habit' : '➕ Add Habit'}
          </button>
          {editId && (
            <button 
              type="button" 
              className="elegant-button" 
              onClick={() => {
                setEditId(null);
                setName('');
                setFrequency('daily');
              }}
            >
              ❌ Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Dropdown Button for Habit List */}
      {habits.length > 0 && (
        <div style={{
          marginBottom: '2rem',
          animation: 'fadeInUp 1s ease-out 0.6s both'
        }}>
          <button 
            onClick={() => setShowHabitList(!showHabitList)}
            className="elegant-button dropdown-button"
            style={{
              fontSize: '1.2rem',
              padding: '1rem 2rem'
            }}
          >
            <span>📋 View All Habits ({totalHabits})</span>
            <span style={{
              transform: showHabitList ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}>
              ⬇️
            </span>
          </button>
        </div>
      )}

      {/* Collapsible Habit List */}
      {habits.length === 0 ? (
        <div style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          animation: 'fadeInScale 1s ease-out 0.6s both',
          marginBottom: '2rem'
        }}>
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '500',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}>
            🌟 No habits found. Add your first habit above!
          </p>
        </div>
      ) : (
        showHabitList && (
          <div className={`habit-list ${showHabitList ? 'show' : 'hide'}`} style={{
            display: 'grid',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {habits.map((habit, index) => {
              const completedToday = isCompletedToday(habit);
              const completionRate = getCompletionRate(habit);
              const streakColor = getStreakColor(habit.streak);
              
              return (
                <div
                  key={habit._id}
                  className={completedToday ? 'completed-today' : ''}
                  style={{
                    background: completedToday 
                      ? 'linear-gradient(145deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))'
                      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                    backdropFilter: 'blur(25px)',
                    WebkitBackdropFilter: 'blur(25px)',
                    border: completedToday 
                      ? '2px solid rgba(16, 185, 129, 0.5)'
                      : '2px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: `fadeInUp 1s ease-out ${0.6 + index * 0.1}s both`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
                  }}
                >
                  {/* Completion Status Badge */}
                  {completedToday && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.1))',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '15px',
                      padding: '0.5rem 1rem',
                      color: '#10B981',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      ✅ Done Today
                    </div>
                  )}

                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.95)',
                    marginBottom: '1rem',
                    textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
                    textDecoration: completedToday ? 'line-through' : 'none',
                    opacity: completedToday ? 0.8 : 1
                  }}>
                    {habit.name}
                  </h2>

                  {/* Streak Counter */}
                  <div className="streak-badge" style={{
                    background: `linear-gradient(145deg, ${streakColor}30, ${streakColor}10)`,
                    border: `1px solid ${streakColor}60`,
                    color: streakColor
                  }}>
                    🔥 {habit.streak} day{habit.streak !== 1 ? 's' : ''} streak
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <p style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '0.3rem'
                      }}>
                        Frequency
                      </p>
                      <p style={{
                        fontSize: '1.1rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {habit.frequency}
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '0.3rem'
                      }}>
                        Completion Rate
                      </p>
                      <p style={{
                        fontSize: '1.1rem',
                        color: completionRate >= 80 ? '#10B981' : completionRate >= 60 ? '#F59E0B' : '#EF4444',
                        fontWeight: '600'
                      }}>
                        {completionRate}%
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '0.3rem'
                      }}>
                        Total Completions
                      </p>
                      <p style={{
                        fontSize: '1.1rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: '600'
                      }}>
                        {habit.completedDates.length}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                        Progress
                      </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                        {completionRate}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min(completionRate, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div style={{
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  marginTop: '1.5rem'
}}>
  {completedToday ? (
    <button 
      onClick={() => undoHabitCompletion(habit._id)} 
      className="elegant-button undo-button"
    >
      ↩️ Undo Complete
    </button>
  ) : (
    <button 
      onClick={() => markHabitCompleted(habit._id)} 
      className="elegant-button complete-button"
    >
      ✅ Mark Complete
    </button>
  )}
  <button 
    onClick={() => handleEdit(habit)} 
    className="elegant-button edit-button"
  >
    ✏️ Edit
  </button>
  <button 
    onClick={() => handleDelete(habit._id)} 
    className="elegant-button delete-button"
  >
    🗑️ Delete
  </button>
</div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Charts and Analytics */}
      {habits.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          {/* Today's Progress Pie Chart */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            animation: 'fadeInUp 1s ease-out 0.8s both'
          }}>
            <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '1rem' }}>
              📈 Today's Progress
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value, percent}) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 30-Day Trend Chart */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            animation: 'fadeInUp 1s ease-out 1s both'
          }}>
            <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '1rem' }}>
              📊 30-Day Completion Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getStreakTrendData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#fff" 
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#fff" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Streak Leaderboard */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            animation: 'fadeInUp 1s ease-out 1.2s both'
          }}>
            <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '1.5rem' }}>
              🏆 Streak Leaderboard
            </h3>
            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {habits
                .sort((a, b) => b.streak - a.streak)
                .slice(0, 5)
                .map((habit, index) => (
                  <div
                    key={habit._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '1rem 1.5rem',
                      borderRadius: '15px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: '900',
                        color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#fff'
                      }}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </div>
                      <div>
                        <div style={{
                          color: '#fff',
                          fontWeight: '600',
                          fontSize: '1rem'
                        }}>
                          {habit.name}
                        </div>
                        <div style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '0.8rem'
                        }}>
                          {habit.frequency}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      color: getStreakColor(habit.streak),
                      fontWeight: '900',
                      fontSize: '1.1rem'
                    }}>
                      {habit.streak} days
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Habit;