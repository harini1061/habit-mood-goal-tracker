import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../unified-styles.css';

function Home() {
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [moods, setMoods] = useState([]);
  const navigate = useNavigate();

  const userId = '6847dd137ab96450bdb4f01c'; // Replace with actual userId

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitsRes, goalsRes, moodsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/habits/${userId}`),
          axios.get(`http://localhost:5000/api/goals/${userId}`),
          axios.get('http://localhost:5000/api/moods'),
        ]);
        setHabits(habitsRes.data);
        setGoals(goalsRes.data);
        setMoods(moodsRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, [userId]);

  const latestMood = moods.length > 0 ? moods[moods.length - 1] : null;

  return (
    <div style={{ padding: "2rem" }}>
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
          from { text-shadow: 0 4px 20px rgba(255, 255, 255, 0.3); }
          to { text-shadow: 0 4px 30px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.3); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>

      <h1>THE WAY OF ALETHEA</h1>
      
      <p style={{
        fontSize: '1.2rem',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '15px',
        padding: '1rem 2rem',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
        animation: 'fadeIn 1s ease-out 0.3s both',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <span style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
          transform: 'translateX(-100%)',
          animation: 'shimmer 2s infinite'
        }}></span>
        {new Date().toLocaleDateString()}
      </p>

      <blockquote style={{
        fontSize: '1.3rem',
        fontStyle: 'italic',
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        margin: '2rem auto',
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        boxShadow: '0 15px 40px rgba(31, 38, 135, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        position: 'relative',
        maxWidth: '800px',
        lineHeight: '1.6',
        textShadow: '0 2px 15px rgba(0, 0, 0, 0.3)',
        animation: 'fadeInUp 1s ease-out 0.6s both',
        transform: 'perspective(1000px) rotateX(5deg)',
        transformStyle: 'preserve-3d'
      }}>
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '30px',
          fontSize: '4rem',
          color: 'rgba(255, 255, 255, 0.3)',
          fontFamily: 'serif',
          lineHeight: '1'
        }}>"</div>
        <i style={{
          position: 'relative',
          zIndex: '1',
          background: 'linear-gradient(135deg, #ffffff, #f0f8ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '500'
        }}>
          "All hard work brings a profit, but mere talk leads only to poverty." - Proverbs 14:23
        </i>
        <div style={{
          position: 'absolute',
          bottom: '-10px',
          right: '30px',
          fontSize: '4rem',
          color: 'rgba(255, 255, 255, 0.3)',
          fontFamily: 'serif',
          lineHeight: '1',
          transform: 'rotate(180deg)'
        }}>"</div>
      </blockquote>

      <div style={{
        marginTop: '3rem',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '25px',
        padding: '2.5rem',
        boxShadow: '0 20px 60px rgba(31, 38, 135, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
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
        
        <h3 style={{
          fontSize: '2rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ffffff, #f0f8ff, #e6f3ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          marginBottom: '2rem',
          textShadow: '0 4px 20px rgba(255, 255, 255, 0.3)',
          position: 'relative',
          animation: 'glow 2s ease-in-out infinite alternate'
        }}>
          📊 Your Progress Summary
        </h3>

        <div style={{
          display: 'grid',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <p style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.95)',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.2))',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '18px',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            transform: 'translateZ(0)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px) scale(1.02)';
            e.target.style.boxShadow = '0 20px 50px rgba(102, 126, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
          }}>
            <span style={{
              position: 'absolute',
              top: '0',
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              transition: 'left 0.5s'
            }}></span>
            🎯 Goals: <span style={{
              color: '#4facfe',
              fontSize: '1.6rem',
              fontWeight: '900',
              textShadow: '0 0 10px rgba(79, 172, 254, 0.8)'
            }}>{goals.length}</span>
          </p>

          <p style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.95)',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.3), rgba(0, 242, 254, 0.2))',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '18px',
            boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            transform: 'translateZ(0)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px) scale(1.02)';
            e.target.style.boxShadow = '0 20px 50px rgba(79, 172, 254, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 10px 30px rgba(79, 172, 254, 0.3)';
          }}>
            <span style={{
              position: 'absolute',
              top: '0',
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              transition: 'left 0.5s'
            }}></span>
            ✅ Habits: <span style={{
              color: '#00f2fe',
              fontSize: '1.6rem',
              fontWeight: '900',
              textShadow: '0 0 10px rgba(0, 242, 254, 0.8)'
            }}>{habits.length}</span>
          </p>

          <p style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.95)',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(250, 112, 154, 0.3), rgba(254, 225, 64, 0.2))',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '18px',
            boxShadow: '0 10px 30px rgba(250, 112, 154, 0.3)',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            transform: 'translateZ(0)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px) scale(1.02)';
            e.target.style.boxShadow = '0 20px 50px rgba(250, 112, 154, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 10px 30px rgba(250, 112, 154, 0.3)';
          }}>
            <span style={{
              position: 'absolute',
              top: '0',
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              transition: 'left 0.5s'
            }}></span>
            😊 Moods Logged: <span style={{
              color: '#fee140',
              fontSize: '1.6rem',
              fontWeight: '900',
              textShadow: '0 0 10px rgba(254, 225, 64, 0.8)'
            }}>{moods.length}</span>
          </p>

          {latestMood && (
            <p style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.95)',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(255, 154, 158, 0.3), rgba(254, 207, 239, 0.2))',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '18px',
              boxShadow: '0 10px 30px rgba(255, 154, 158, 0.3)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              animation: 'pulse 2s infinite',
              lineHeight: '1.4'
            }}>
              <span style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                transform: 'translateX(-100%)',
                animation: 'shimmer 3s infinite'
              }}></span>
              📌 Last Mood: <span style={{
                color: '#fecfef',
                fontWeight: '800',
                textShadow: '0 0 15px rgba(254, 207, 239, 0.8)'
              }}>{latestMood.emotion}</span> - <em style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontStyle: 'italic'
              }}>{latestMood.note}</em>
            </p>
          )}
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => navigate('/goals')}>Go to Goals</button>
        <button onClick={() => navigate('/habits')} style={{ margin: '0 1rem' }}>Go to Habits</button>
        <button onClick={() => navigate('/moods')}>Go to Moods</button>
      </div>
    </div>
  );
}

export default Home;