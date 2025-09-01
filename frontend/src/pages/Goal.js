import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../unified-styles.css';
// Remove this line: import Navbar from './Navbar';
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

  const userId = '6847dd137ab96450bdb4f01c'; // Replace with dynamic userId if needed

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

  const markGoalCompleted = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/goals/${id}`, { completed: true });
      fetchGoals();
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  const data = [
    { name: 'Completed', value: goals.filter(g => g.completed).length },
    { name: 'Incomplete', value: goals.filter(g => !g.completed).length },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
        textShadow="0 2px 10px rgba(0,0,0,0.8)"
      >
        {`${name}: ${value}`}
      </text>
    );
  };

  return (
    // Remove <Navbar /> from here
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

        .complete-button {
          background: linear-gradient(145deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.1));
          border: 2px solid rgba(16, 185, 129, 0.4);
        }

        .complete-button:hover {
          background: linear-gradient(145deg, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.2));
          border-color: rgba(16, 185, 129, 0.6);
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
        🎯 Goal Tracker
      </h1>

      {/* Goal Form */}
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
          ✨ Create New Goal
        </h3>

        <form onSubmit={handleSubmit} style={{
          display: 'grid',
          gap: '1.5rem'
        }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="🎯 Goal Title"
            required
            className="elegant-input"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="📝 Description"
            className="elegant-input"
          />
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="elegant-input"
          />
          <button type="submit" className="elegant-button">
            ➕ Add Goal
          </button>
        </form>
      </div>

      {/* Goal List */}
      {goals.length === 0 ? (
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
            🌟 No goals found. Add your first goal above!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {goals.map((goal, index) => {
            const today = new Date();
            const target = new Date(goal.targetDate);
            const daysLeft = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
            const showReminder = !goal.completed && daysLeft >= 0 && daysLeft <= 3;

            return (
              <div
                key={goal._id}
                style={{
                  background: goal.completed 
                    ? 'linear-gradient(145deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))'
                    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                  border: goal.completed 
                    ? '2px solid rgba(16, 185, 129, 0.3)'
                    : '2px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: goal.completed 
                    ? '0 20px 60px rgba(16, 185, 129, 0.2)'
                    : '0 20px 60px rgba(0, 0, 0, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `fadeInUp 1s ease-out ${0.6 + index * 0.1}s both`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = goal.completed 
                    ? '0 30px 80px rgba(16, 185, 129, 0.3)'
                    : '0 30px 80px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = goal.completed 
                    ? '0 20px 60px rgba(16, 185, 129, 0.2)'
                    : '0 20px 60px rgba(0, 0, 0, 0.4)';
                }}
              >
                {showReminder && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(145deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.1))',
                    border: '2px solid rgba(255, 215, 0, 0.4)',
                    borderRadius: '15px',
                    padding: '8px 16px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#ffd700',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                    animation: 'pulse 2s infinite'
                  }}>
                    ⏰ {daysLeft === 0 ? 'Due Today!' : `Due in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`}
                  </div>
                )}

                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.95)',
                  marginBottom: '1rem',
                  textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)'
                }}>
                  {goal.title}
                </h2>

                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '0.5rem',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                }}>
                  <strong>Description:</strong> {goal.description || '—'}
                </p>

                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '0.5rem',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                }}>
                  <strong>Target Date:</strong> {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'N/A'}
                </p>

                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '1.5rem',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                }}>
                  <strong>Status:</strong>{' '}
                  {goal.completed ? (
                    <span style={{
                      color: '#10B981',
                      fontWeight: '700',
                      textShadow: '0 0 15px rgba(16, 185, 129, 0.6)'
                    }}>
                      ✅ Completed
                    </span>
                  ) : (
                    <span style={{
                      color: '#fbbf24',
                      fontWeight: '700',
                      textShadow: '0 0 15px rgba(251, 191, 36, 0.6)'
                    }}>
                      ⏳ Pending
                    </span>
                  )}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  {!goal.completed && (
                    <button 
                      onClick={() => markGoalCompleted(goal._id)} 
                      className="elegant-button complete-button"
                    >
                      ✅ Mark Completed
                    </button>
                  )}
                  <button 
                    onClick={() => deleteGoal(goal._id)} 
                    className="elegant-button delete-button"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Completion Progress Chart */}
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
        animation: 'fadeInScale 1s ease-out 0.9s both'
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

        <h2 style={{
          fontSize: '2rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ffffff, #f0f8ff, #e1f5fe, #b3e5fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          marginBottom: '2rem',
          textShadow: '0 4px 25px rgba(255, 255, 255, 0.4)',
          animation: 'glow 2s ease-in-out infinite alternate'
        }}>
          📊 Goal Completion Progress
        </h2>

        {goals.length === 0 ? (
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            fontWeight: '500',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}>
            📈 No data to show progress yet.
          </p>
        ) : (
          <div>
            <div style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03))',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={5}
                    label={renderCustomLabel}
                    labelLine={{ stroke: '#ffffff', strokeWidth: 2 }}
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      color: 'white'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              textAlign: 'center',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03))',
              borderRadius: '15px',
              padding: '1.5rem'
            }}>
              <p style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)'
              }}>
                <span style={{
                  color: '#10B981',
                  fontWeight: '800',
                  textShadow: '0 0 15px rgba(16, 185, 129, 0.6)'
                }}>
                  {data[0].value}
                </span> Completed /{' '}
                <span style={{
                  color: '#EF4444',
                  fontWeight: '800',
                  textShadow: '0 0 15px rgba(239, 68, 68, 0.6)'
                }}>
                  {data[1].value}
                </span> Incomplete
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Goal;