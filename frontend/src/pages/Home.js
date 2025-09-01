import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../unified-styles.css';
//import Navbar from './Navbar';

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
          top: 10%;
          left: 15%;
          animation-delay: -2s;
        }

        .orb-2 {
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(255, 119, 198, 0.4), rgba(255, 119, 198, 0.1));
          top: 60%;
          right: 20%;
          animation-delay: -4s;
        }

        .orb-3 {
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(120, 119, 198, 0.3), rgba(120, 119, 198, 0.1));
          bottom: 20%;
          left: 10%;
          animation-delay: -1s;
        }
      `}</style>

      {/* Floating decorative orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>

      <h1 style={{
        fontSize: '3.5rem',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 25%, #e1f5fe 50%, #b3e5fc 75%, #81d4fa 100%)',
        backgroundSize: '400% 400%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textAlign: 'center',
        marginBottom: '1rem',
        textShadow: '0 4px 30px rgba(255, 255, 255, 0.3)',
        animation: 'fadeIn 1s ease-out, gradientShift 4s ease-in-out infinite',
        letterSpacing: '2px'
      }}>
        THE WAY OF ALETHEA
      </h1>
      
      <p style={{
        fontSize: '1.2rem',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        marginBottom: '2rem',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        padding: '1.2rem 2rem',
        textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
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
          animation: 'shimmer 3s infinite'
        }}></span>
        {new Date().toLocaleDateString()}
      </p>

      <blockquote style={{
        fontSize: '1.4rem',
        fontStyle: 'italic',
        color: 'rgba(255, 255, 255, 0.98)',
        textAlign: 'center',
        margin: '2rem auto',
        padding: '2.5rem',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04))',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '2px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '25px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        position: 'relative',
        maxWidth: '850px',
        lineHeight: '1.7',
        textShadow: '0 2px 20px rgba(0, 0, 0, 0.6)',
        animation: 'fadeInUp 1s ease-out 0.6s both'
      }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '35px',
          fontSize: '5rem',
          color: 'rgba(255, 255, 255, 0.2)',
          fontFamily: 'Georgia, serif',
          lineHeight: '1'
        }}>"</div>
        <i style={{
          position: 'relative',
          zIndex: '1',
          background: 'linear-gradient(135deg, #ffffff, #f0f8ff, #e1f5fe)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '500'
        }}>
          "All hard work brings a profit, but mere talk leads only to poverty." - Proverbs 14:23
        </i>
        <div style={{
          position: 'absolute',
          bottom: '-15px',
          right: '35px',
          fontSize: '5rem',
          color: 'rgba(255, 255, 255, 0.2)',
          fontFamily: 'Georgia, serif',
          lineHeight: '1',
          transform: 'rotate(180deg)'
        }}>"</div>
      </blockquote>

      <div style={{
        marginTop: '3rem',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06))',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '2px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '30px',
        padding: '3rem',
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
          height: '5px',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #667eea)',
          backgroundSize: '300% 100%',
          borderRadius: '30px 30px 0 0',
          animation: 'gradientShift 3s ease-in-out infinite'
        }}></div>
        
        <h3 style={{
          fontSize: '2.2rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #ffffff, #f0f8ff, #e1f5fe, #b3e5fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          marginBottom: '2.5rem',
          textShadow: '0 4px 25px rgba(255, 255, 255, 0.4)',
          position: 'relative',
          animation: 'glow 2s ease-in-out infinite alternate'
        }}>
          📊 Your Progress Summary
        </h3>

        <div style={{
          display: 'grid',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.98)',
            padding: '2rem',
            background: 'linear-gradient(145deg, rgba(102, 126, 234, 0.25), rgba(118, 75, 162, 0.15))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid rgba(102, 126, 234, 0.4)',
            borderRadius: '20px',
            boxShadow: '0 15px 45px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            transform: 'translateZ(0)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-8px) scale(1.02)';
            e.target.style.boxShadow = '0 25px 60px rgba(102, 126, 234, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 15px 45px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = 'rgba(102, 126, 234, 0.4)';
          }}>
            <span style={{
              position: 'absolute',
              top: '0',
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
              transition: 'left 0.6s'
            }}></span>
            🎯 Goals: <span style={{
              color: '#87ceeb',
              fontSize: '1.8rem',
              fontWeight: '900',
              textShadow: '0 0 20px rgba(135, 206, 235, 0.8)',
              filter: 'drop-shadow(0 0 10px rgba(135, 206, 235, 0.6))'
            }}>{goals.length}</span>
          </p>

          <p style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.98)',
            padding: '2rem',
            background: 'linear-gradient(145deg, rgba(79, 172, 254, 0.25), rgba(0, 242, 254, 0.15))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid rgba(79, 172, 254, 0.4)',
            borderRadius: '20px',
            boxShadow: '0 15px 45px rgba(79, 172, 254, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            transform: 'translateZ(0)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-8px) scale(1.02)';
            e.target.style.boxShadow = '0 25px 60px rgba(79, 172, 254, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            e.target.style.borderColor = 'rgba(79, 172, 254, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 15px 45px rgba(79, 172, 254, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = 'rgba(79, 172, 254, 0.4)';
          }}>
            <span style={{
              position: 'absolute',
              top: '0',
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
              transition: 'left 0.6s'
            }}></span>
            ✅ Habits: <span style={{
              color: '#40e0d0',
              fontSize: '1.8rem',
              fontWeight: '900',
              textShadow: '0 0 20px rgba(64, 224, 208, 0.8)',
              filter: 'drop-shadow(0 0 10px rgba(64, 224, 208, 0.6))'
            }}>{habits.length}</span>
          </p>

          <p style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.98)',
            padding: '2rem',
            background: 'linear-gradient(145deg, rgba(250, 112, 154, 0.25), rgba(254, 225, 64, 0.15))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid rgba(250, 112, 154, 0.4)',
            borderRadius: '20px',
            boxShadow: '0 15px 45px rgba(250, 112, 154, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            transform: 'translateZ(0)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-8px) scale(1.02)';
            e.target.style.boxShadow = '0 25px 60px rgba(250, 112, 154, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            e.target.style.borderColor = 'rgba(250, 112, 154, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 15px 45px rgba(250, 112, 154, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = 'rgba(250, 112, 154, 0.4)';
          }}>
            <span style={{
              position: 'absolute',
              top: '0',
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
              transition: 'left 0.6s'
            }}></span>
            😊 Moods Logged: <span style={{
              color: '#ffd700',
              fontSize: '1.8rem',
              fontWeight: '900',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
              filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))'
            }}>{moods.length}</span>
          </p>

          {latestMood && (
            <p style={{
              fontSize: '1.4rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.98)',
              padding: '2rem',
              background: 'linear-gradient(145deg, rgba(255, 154, 158, 0.25), rgba(254, 207, 239, 0.15))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 154, 158, 0.4)',
              borderRadius: '20px',
              boxShadow: '0 15px 45px rgba(255, 154, 158, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              overflow: 'hidden',
              animation: 'pulse 3s infinite',
              lineHeight: '1.5'
            }}>
              <span style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                transform: 'translateX(-100%)',
                animation: 'shimmer 4s infinite'
              }}></span>
              📌 Last Mood: <span style={{
                color: '#ff69b4',
                fontWeight: '800',
                textShadow: '0 0 20px rgba(255, 105, 180, 0.8)',
                filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.6))'
              }}>{latestMood.emotion}</span> - <em style={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontStyle: 'italic'
              }}>{latestMood.note}</em>
            </p>
          )}
        </div>
      </div>

      <div style={{ 
        marginTop: "3rem", 
        display: 'flex', 
        gap: '1.5rem', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button className="elegant-button" onClick={() => navigate('/goals')}>
          🎯 Go to Goals
        </button>
        <button className="elegant-button" onClick={() => navigate('/habits')}>
          ✅ Go to Habits
        </button>
        <button className="elegant-button" onClick={() => navigate('/moods')}>
          😊 Go to Moods
        </button>
      </div>
    </div>
  );
}

export default Home;