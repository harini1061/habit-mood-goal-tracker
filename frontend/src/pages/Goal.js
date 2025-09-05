import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../unified-styles.css';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

function Goal() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showPreviousGoals, setShowPreviousGoals] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")); 
  const currentUserId = user ? user._id : null;

  useEffect(() => {
    fetchGoals();
  }, []);

  // Fetch goals with authentication
  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/goals", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(res.data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  };

  // Submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const goalData = {
        title,
        description,
        targetDate: targetDate || null
      };

      // Only include userId when creating a new goal, not when updating
      if (!editingId) {
        goalData.userId = currentUserId;
      }

      if (editingId) {
        await axios.put(`http://localhost:5000/api/goals/${editingId}`, goalData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/goals', goalData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setTitle('');
      setDescription('');
      setTargetDate('');
      fetchGoals();
    } catch (err) {
      console.error('Error saving goal:', err);
    }
  };

  // Mark goal as completed/incomplete
  const toggleGoalCompleted = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/goals/${id}`, { 
        completed: !currentStatus 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGoals();
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  // Delete goal
  const deleteGoal = async (id) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGoals();
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  // Edit goal
  const handleEdit = (goal) => {
    setTitle(goal.title);
    setDescription(goal.description || '');
    setTargetDate(goal.targetDate ? goal.targetDate.split('T')[0] : '');
    setEditingId(goal._id);
    // Auto-expand the previous goals section when editing
    setShowPreviousGoals(true);
  };

  // Chart data
  const completedCount = goals.filter(g => g.completed).length;
  const incompleteCount = goals.filter(g => !g.completed).length;
  
  const pieData = [
    { name: 'Completed', value: completedCount },
    { name: 'Incomplete', value: incompleteCount },
  ];

  const COLORS = ['#10B981', '#EF4444'];

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
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
          border: 2px solid rgba(255, 255, 255, 0.15);
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
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .elegant-button:hover {
          transform: translateY(-3px);
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
        }
        .goal-card {
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
        .goal-card.completed {
          border-color: rgba(16, 185, 129, 0.5);
          background: linear-gradient(145deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
        }
        .goal-card.overdue {
          border-color: rgba(239, 68, 68, 0.5);
          background: linear-gradient(145deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
        }
        .goal-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .status-completed {
          background: linear-gradient(145deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.1));
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }
        .status-pending {
          background: linear-gradient(145deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.1));
          color: #F59E0B;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .status-overdue {
          background: linear-gradient(145deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1));
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.4);
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
        .previous-goals-section {
          animation: ${showPreviousGoals ? 'slideDown' : 'slideUp'} 0.3s ease-out forwards;
          overflow: hidden;
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
        🎯 Goal Tracker
      </h1>

      {/* Goal Form */}
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
          {editingId ? '✏️ Edit Goal' : '🎯 Create New Goal'}
        </h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Goal title..."
          className="elegant-input"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="elegant-textarea"
          rows="3"
        />
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="elegant-input"
          placeholder="Target Date (optional)"
        />
        <button type="submit" className="elegant-button">
          {editingId ? '✏️ Update Goal' : '➕ Add Goal'}
        </button>
        {editingId && (
          <button 
            type="button" 
            className="elegant-button" 
            onClick={() => {
              setEditingId(null);
              setTitle('');
              setDescription('');
              setTargetDate('');
            }}
          >
            ❌ Cancel Edit
          </button>
        )}
      </form>

      {/* Previous Goals Dropdown Section */}
      {goals.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <button 
            className="dropdown-toggle"
            onClick={() => setShowPreviousGoals(!showPreviousGoals)}
          >
            <span>🎯 Previous Goals ({goals.length})</span>
            <span style={{ 
              transform: showPreviousGoals ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}>
              ⬇️
            </span>
          </button>

          {showPreviousGoals && (
            <div className="previous-goals-section">
              {goals.map((goal) => {
                const isOverdue = goal.targetDate && new Date(goal.targetDate) < new Date() && !goal.completed;
                const cardClass = goal.completed ? 'completed' : isOverdue ? 'overdue' : '';
                
                return (
                  <div key={goal._id} className={`goal-card ${cardClass}`}>
                    <div>
                      <div className={`status-badge ${goal.completed ? 'status-completed' : isOverdue ? 'status-overdue' : 'status-pending'}`}>
                        {goal.completed ? '✅ Completed' : isOverdue ? '⚠️ Overdue' : '🔄 In Progress'}
                      </div>
                      
                      <h3 style={{ 
                        fontSize: '1.4rem', 
                        marginBottom: '0.5rem',
                        textDecoration: goal.completed ? 'line-through' : 'none',
                        opacity: goal.completed ? 0.7 : 1
                      }}>
                        <b>{goal.title}</b>
                      </h3>
                      
                      {goal.description && (
                        <p style={{ marginBottom: '0.5rem', opacity: 0.9 }}>
                          <b>Description:</b> {goal.description}
                        </p>
                      )}
                      
                      {goal.targetDate && (
                        <p style={{ marginBottom: '0.5rem' }}>
                          <b>Target Date:</b> {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      )}
                      
                      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                        <b>Created:</b> {new Date(goal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="goal-actions">
                      <button 
                        className="elegant-button" 
                        onClick={() => toggleGoalCompleted(goal._id, goal.completed)}
                        style={{
                          background: goal.completed 
                            ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))'
                            : 'linear-gradient(145deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))',
                          borderColor: goal.completed ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'
                        }}
                      >
                        {goal.completed ? '🔄 Mark Incomplete' : '✅ Mark Complete'}
                      </button>
                      <button className="elegant-button" onClick={() => handleEdit(goal)}>
                        ✏️ Edit
                      </button>
                      <button className="elegant-button" onClick={() => deleteGoal(goal._id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {goals.length === 0 && (
        <p style={{ color: '#fff', textAlign: 'center', fontSize: '1.2rem' }}>
          🌟 No goals found. Add your first goal above!
        </p>
      )}

      {/* Charts */}
      {goals.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          {/* Progress Summary */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            animation: 'fadeInUp 1s ease-out 0.6s both'
          }}>
            <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '1rem' }}>
              📊 Goal Progress Summary
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
                  {completedCount}
                </div>
                <div style={{ color: '#fff', fontSize: '1.1rem' }}>Completed Goals</div>
              </div>
              <div style={{
                background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
                padding: '1.5rem',
                borderRadius: '15px',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#EF4444' }}>
                  {incompleteCount}
                </div>
                <div style={{ color: '#fff', fontSize: '1.1rem' }}>Pending Goals</div>
              </div>
              <div style={{
                background: 'linear-gradient(145deg, rgba(79, 172, 254, 0.2), rgba(79, 172, 254, 0.1))',
                padding: '1.5rem',
                borderRadius: '15px',
                border: '1px solid rgba(79, 172, 254, 0.3)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#4FACFE' }}>
                  {goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0}%
                </div>
                <div style={{ color: '#fff', fontSize: '1.1rem' }}>Completion Rate</div>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            animation: 'fadeInUp 1s ease-out 0.8s both'
          }}>
            <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '1rem' }}>
              📈 Goal Distribution
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
        </div>
      )}
    </div>
  );
}

export default Goal;