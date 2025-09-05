import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../unified-styles.css';

function Home() {
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        const [habitsRes, goalsRes, moodsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/habits', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/goals', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/moods', {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);
        
        setHabits(habitsRes.data);
        setGoals(goalsRes.data);
        setMoods(moodsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const latestMood = moods.length > 0 ? moods[0] : null; // Assuming sorted by date desc

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

        @keyframes bounceIn {
          0% { transform: scale(0.3) translateY(-50px); opacity: 0; }
          50% { transform: scale(1.05) translateY(-10px); }
          70% { transform: scale(0.9) translateY(0); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes slideInLeft {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
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
          position: 'relative';
          overflow: 'hidden';
          white-space: nowrap;
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

        .nav-container {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
          animation: slideInLeft 0.8s ease-out;
        }

        .stat-card {
          font-size: 1.5rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.98);
          padding: 2rem;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          text-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          transform: translateZ(0);
        }

        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          transition: left 0.6s;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .loading-spinner {
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Floating decorative orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>

      {/* Navigation Buttons at Top */}
      <div className="nav-container">
        <button className="elegant-button" onClick={() => navigate('/goals')}>
          🎯 Goals
        </button>
        <button className="elegant-button" onClick={() => navigate('/habits')}>
          ✅ Habits
        </button>
        <button className="elegant-button" onClick={() => navigate('/moods')}>
          😊 Moods
        </button>
      </div>

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
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner"></div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginTop: '1rem', fontSize: '1.2rem' }}>
              Loading your progress...
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '2rem',
            marginBottom: '2.5rem'
          }}>
            <div className="stat-card" style={{
              background: 'linear-gradient(145deg, rgba(102, 126, 234, 0.25), rgba(118, 75, 162, 0.15))',
              border: '2px solid rgba(102, 126, 234, 0.4)',
              animation: 'slideInLeft 0.8s ease-out 0.2s both'
            }}>
              🎯 Goals: <span style={{
                color: '#87ceeb',
                fontSize: '1.8rem',
                fontWeight: '900',
                textShadow: '0 0 20px rgba(135, 206, 235, 0.8)',
                filter: 'drop-shadow(0 0 10px rgba(135, 206, 235, 0.6))'
              }}>{goals.length}</span>
            </div>

            <div className="stat-card" style={{
              background: 'linear-gradient(145deg, rgba(79, 172, 254, 0.25), rgba(0, 242, 254, 0.15))',
              border: '2px solid rgba(79, 172, 254, 0.4)',
              animation: 'slideInRight 0.8s ease-out 0.4s both'
            }}>
              ✅ Habits: <span style={{
                color: '#40e0d0',
                fontSize: '1.8rem',
                fontWeight: '900',
                textShadow: '0 0 20px rgba(64, 224, 208, 0.8)',
                filter: 'drop-shadow(0 0 10px rgba(64, 224, 208, 0.6))'
              }}>{habits.length}</span>
            </div>

            <div className="stat-card" style={{
              background: 'linear-gradient(145deg, rgba(250, 112, 154, 0.25), rgba(254, 225, 64, 0.15))',
              border: '2px solid rgba(250, 112, 154, 0.4)',
              animation: 'slideInLeft 0.8s ease-out 0.6s both'
            }}>
              😊 Moods Logged: <span style={{
                color: '#ffd700',
                fontSize: '1.8rem',
                fontWeight: '900',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
                filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))'
              }}>{moods.length}</span>
            </div>

            {latestMood && (
              <div style={{
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
                animation: 'bounceIn 1s ease-out 0.8s both',
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
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    📌 <strong>Latest Mood:</strong> <span style={{
                      color: '#ff69b4',
                      fontWeight: '800',
                      textShadow: '0 0 20px rgba(255, 105, 180, 0.8)',
                      filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.6))'
                    }}>{latestMood.emotion}</span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Intensity:</strong> <span style={{ color: '#ffd700' }}>{latestMood.intensity || 5}/10</span>
                  </div>
                  {latestMood.note && (
                    <div style={{ fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.9)' }}>
                      "{latestMood.note}"
                    </div>
                  )}
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.5rem' }}>
                    {new Date(latestMood.date).toLocaleDateString()} at {new Date(latestMood.date).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Motivational Section */}
      <div style={{
        marginTop: '3rem',
        textAlign: 'center',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02))',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '25px',
        padding: '2rem',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
        animation: 'fadeInUp 1s ease-out 1.2s both'
      }}>
        <h4 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #ffffff, #f0f8ff, #e1f5fe)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem',
          animation: 'glow 3s ease-in-out infinite alternate'
        }}>
          🌟 Keep Building Your Best Self! 🌟
        </h4>
        <p style={{
          fontSize: '1.1rem',
          color: 'rgba(255, 255, 255, 0.9)',
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Every step counts, every habit matters, and every mood tracked brings you closer to understanding yourself better. 
          Your journey to excellence is uniquely yours - embrace it! ✨
        </p>
      </div>
    </div>
  );
}

export default Home;