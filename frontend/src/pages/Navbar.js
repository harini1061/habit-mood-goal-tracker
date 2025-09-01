// src/pages/Navbar.js
import React from 'react';
import '../unified-styles.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  // Check if we are on the Home page
  const isHomePage = location.pathname === '/home';

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes glow {
          from { text-shadow: 0 4px 20px rgba(255, 255, 255, 0.4); }
          to { text-shadow: 0 4px 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(120, 200, 255, 0.4); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .nav-link {
          position: relative;
          overflow: hidden;
          padding: 8px 16px;
          border-radius: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }

        .nav-link:hover::before {
          left: 100%;
        }

        .nav-link:hover {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      <nav
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.25) 0%, transparent 50%),
            linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
          `,
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 15px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          position: 'relative',
          overflow: 'hidden'
        }}
        className="text-white"
      >
        {/* Animated top border */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '3px',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #667eea)',
          backgroundSize: '300% 100%',
          animation: 'gradientShift 4s ease-in-out infinite'
        }}></div>

        {/* Subtle shimmer effect */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
          transform: 'translateX(-100%)',
          animation: 'shimmer 8s infinite'
        }}></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Only show title if not on Home page */}
            {!isHomePage && (
              <div style={{
                position: 'relative',
                padding: '8px 20px',
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.08))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '15px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)'
              }}>
                <h1
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 25%, #e1f5fe 50%, #b3e5fc 75%, #81d4fa 100%)',
                    backgroundSize: '400% 400%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 4px 25px rgba(255,255,255,0.5)',
                    letterSpacing: '1.5px',
                    animation: 'gradientShift 5s ease-in-out infinite'
                  }}
                >
                  The Way of Alethea
                </h1>
              </div>
            )}

            {/* Navigation Links and Logout */}
            <div className="flex items-center">
              {/* Only show links if not on Home page */}
              {!isHomePage && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '8px 16px',
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  marginRight: '2rem'
                }}>
                  <Link 
                    to="/home" 
                    className="nav-link font-semibold transition-all duration-300"
                    style={{
                      color: 'rgba(255,255,255,0.95)',
                      textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#87ceeb';
                      e.target.style.textShadow = '0 0 20px rgba(135,206,235,0.9), 0 0 30px rgba(135,206,235,0.6)';
                      e.target.style.filter = 'drop-shadow(0 0 8px rgba(135,206,235,0.5))';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'rgba(255,255,255,0.95)';
                      e.target.style.textShadow = '0 2px 10px rgba(0,0,0,0.6)';
                      e.target.style.filter = 'none';
                    }}
                  >
                    🏠 Home
                  </Link>

                  <Link 
                    to="/habits" 
                    className="nav-link font-semibold transition-all duration-300"
                    style={{
                      color: 'rgba(255,255,255,0.95)',
                      textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#40e0d0';
                      e.target.style.textShadow = '0 0 20px rgba(64,224,208,0.9), 0 0 30px rgba(64,224,208,0.6)';
                      e.target.style.filter = 'drop-shadow(0 0 8px rgba(64,224,208,0.5))';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'rgba(255,255,255,0.95)';
                      e.target.style.textShadow = '0 2px 10px rgba(0,0,0,0.6)';
                      e.target.style.filter = 'none';
                    }}
                  >
                    ✅ Habits
                  </Link>

                  <Link 
                    to="/moods" 
                    className="nav-link font-semibold transition-all duration-300"
                    style={{
                      color: 'rgba(255,255,255,0.95)',
                      textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ffd700';
                      e.target.style.textShadow = '0 0 20px rgba(255,215,0,0.9), 0 0 30px rgba(255,215,0,0.6)';
                      e.target.style.filter = 'drop-shadow(0 0 8px rgba(255,215,0,0.5))';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'rgba(255,255,255,0.95)';
                      e.target.style.textShadow = '0 2px 10px rgba(0,0,0,0.6)';
                      e.target.style.filter = 'none';
                    }}
                  >
                    😊 Moods
                  </Link>

                  <Link 
                    to="/goals" 
                    className="nav-link font-semibold transition-all duration-300"
                    style={{
                      color: 'rgba(255,255,255,0.95)',
                      textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ff69b4';
                      e.target.style.textShadow = '0 0 20px rgba(255,105,180,0.9), 0 0 30px rgba(255,105,180,0.6)';
                      e.target.style.filter = 'drop-shadow(0 0 8px rgba(255,105,180,0.5))';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'rgba(255,255,255,0.95)';
                      e.target.style.textShadow = '0 2px 10px rgba(0,0,0,0.6)';
                      e.target.style.filter = 'none';
                    }}
                  >
                    🎯 Goals
                  </Link>
                </div>
              )}

              {/* Enhanced Logout button */}
              <button
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06))',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '15px',
                  color: '#ffffff',
                  padding: '10px 20px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                  textShadow: '0 2px 15px rgba(0, 0, 0, 0.6)',
                  boxShadow: '0 10px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.02)';
                  e.target.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'linear-gradient(145deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))';
                  e.target.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 10px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.background = 'linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06))';
                  e.target.style.textShadow = '0 2px 15px rgba(0, 0, 0, 0.6)';
                }}
                onClick={handleLogout}
              >
                <span style={{
                  position: 'absolute',
                  top: '0',
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
                  transition: 'left 0.6s'
                }}></span>
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;