import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../unified-styles.css';

function Habit() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await axios.get('http://localhost:5000/habits');
      setHabits(res.data);
    } catch (err) {
      console.error('Error fetching habits:', err);
      // For development, you can add some mock data to test the UI
      // setHabits([
      //   { _id: '1', name: 'Drink Water', frequency: 'daily' },
      //   { _id: '2', name: 'Exercise', frequency: 'weekly' }
      // ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/habits/${editId}`, { name, frequency });
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/habits', { name, frequency });
      }
      setName('');
      setFrequency('daily');
      fetchHabits();
    } catch (err) {
      console.error('Error saving habit:', err);
      alert('Error: Could not save habit. Make sure your backend server is running on localhost:5000');
    }
  };

  const handleEdit = (habit) => {
    setName(habit.name);
    setFrequency(habit.frequency);
    setEditId(habit._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/habits/${id}`);
      fetchHabits();
    } catch (err) {
      console.error('Error deleting habit:', err);
      alert('Error: Could not delete habit. Make sure your backend server is running on localhost:5000');
    }
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

        /* Enhanced select dropdown styling */
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
        animation: 'fadeInUp 1s ease-out 0.3s both',
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

        <form onSubmit={handleSubmit} style={{
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
            <option value="daily" style={{
              background: '#2a2a3e',
              color: '#ffffff',
              padding: '10px'
            }}>
              Daily
            </option>
            <option value="weekly" style={{
              background: '#2a2a3e',
              color: '#ffffff',
              padding: '10px'
            }}>
              Weekly
            </option>
            <option value="monthly" style={{
              background: '#2a2a3e',
              color: '#ffffff',
              padding: '10px'
            }}>
              Monthly
            </option>
          </select>
          <button type="submit" className="elegant-button">
            {editId ? '✏️ Update Habit' : '➕ Add Habit'}
          </button>
        </form>
      </div>

      {/* Habit List */}
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
        <div style={{
          display: 'grid',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {habits.map((habit, index) => (
            <div
              key={habit._id}
              style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
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
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'rgba(255, 255, 255, 0.95)',
                marginBottom: '1rem',
                textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)'
              }}>
                {habit.name}
              </h2>

              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '1.5rem',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}>
                <strong>Frequency:</strong> {habit.frequency}
              </p>

              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
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
          ))}
        </div>
      )}
    </div>
  );
}

export default Habit;