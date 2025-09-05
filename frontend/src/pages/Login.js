// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../unified-styles.css';
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validations, setValidations] = useState({
    email: false,
    password: false
  });

  // Check for Google auth error in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const googleError = urlParams.get('error');

    if (googleError) {
      setError('Google authentication failed. Please try again.');
    }
  }, [location]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
    setSuccess('');

    let isValid = false;
    if (name === 'email') isValid = validateEmail(value);
    if (name === 'password') isValid = value.length >= 6;

    setValidations({ ...validations, [name]: isValid });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validations.email || !validations.password) {
      setError('Please enter valid email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);

      if (rememberMe) {
        localStorage.setItem('token', res.data.token);
      } else {
        sessionStorage.setItem('token', res.data.token);
      }

      setSuccess('Login successful! Welcome back!');
      navigate('/home');

      setTimeout(() => {
        setForm({ email: '', password: '' });
        setValidations({ email: false, password: false });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError('');
    
    // Open Google OAuth in popup
    const popup = window.open(
      'http://localhost:5000/api/auth/google',
      'google-login',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for messages from popup
    const messageListener = (event) => {
      // Ensure message is from our backend
      if (event.origin !== 'http://localhost:5000') return;

      const { success, token, user, error: authError } = event.data;

      if (success && token) {
        // Store token based on remember me preference
        if (rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }
        
        setSuccess('Google login successful! Welcome back!');
        setGoogleLoading(false);
        
        // Navigate to home after short delay
        setTimeout(() => navigate('/home'), 1500);
      } else {
        setError(authError || 'Google authentication failed. Please try again.');
        setGoogleLoading(false);
      }

      // Clean up
      window.removeEventListener('message', messageListener);
      popup.close();
    };

    window.addEventListener('message', messageListener);

    // Handle popup blocked or closed
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setGoogleLoading(false);
        window.removeEventListener('message', messageListener);
      }
    }, 1000);
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(1px);
          opacity: 0.6;
          animation: float 6s ease-in-out infinite;
          pointer-events: none;
        }

        .orb-1 {
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(120, 200, 255, 0.4), rgba(120, 200, 255, 0.1));
          top: 10%;
          left: 15%;
          animation-delay: -2s;
        }

        .orb-2 {
          width: 50px;
          height: 50px;
          background: radial-gradient(circle, rgba(255, 119, 198, 0.4), rgba(255, 119, 198, 0.1));
          top: 70%;
          right: 20%;
          animation-delay: -4s;
        }

        .orb-3 {
          width: 90px;
          height: 90px;
          background: radial-gradient(circle, rgba(120, 119, 198, 0.3), rgba(120, 119, 198, 0.1));
          bottom: 15%;
          left: 10%;
          animation-delay: -1s;
        }

        .sparkle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #ffffff;
          border-radius: 50%;
          animation: sparkle 3s infinite;
          pointer-events: none;
        }

        .sparkle-1 { top: 25%; left: 25%; animation-delay: 0s; }
        .sparkle-2 { top: 60%; right: 35%; animation-delay: 1s; }
        .sparkle-3 { bottom: 40%; left: 70%; animation-delay: 2s; }
      `}</style>

      {/* Floating decorative orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>

      {/* Sparkle effects */}
      <div className="sparkle sparkle-1"></div>
      <div className="sparkle sparkle-2"></div>
      <div className="sparkle sparkle-3"></div>

      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06))',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '2px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '30px',
        padding: '3rem 2.5rem',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInScale 1s ease-out'
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

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem',
          animation: 'fadeInUp 1s ease-out 0.3s both'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(145deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.3))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '2px solid rgba(102, 126, 234, 0.6)',
            boxShadow: '0 15px 45px rgba(102, 126, 234, 0.4)',
            animation: 'glow 2s ease-in-out infinite alternate'
          }}>
            <LogIn size={28} color="#ffffff" />
          </div>
          
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff, #f0f8ff, #e1f5fe, #b3e5fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            textShadow: '0 4px 25px rgba(255, 255, 255, 0.4)',
            letterSpacing: '1px'
          }}>
            Welcome Back
          </h2>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)'
          }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ animation: 'fadeInUp 1s ease-out 0.6s both' }}>
          {/* Email Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '0.5rem',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.7)',
                zIndex: 2
              }} size={18} />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: '15px 50px 15px 50px',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `2px solid ${form.email ? (validations.email ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)') : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '15px',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.8)';
                  e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = form.email ? (validations.email ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)') : 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              />
              {form.email && (
                <div style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2
                }}>
                  {validations.email ? 
                    <CheckCircle size={18} color="#4caf50" /> : 
                    <AlertCircle size={18} color="#f44336" />
                  }
                </div>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '0.5rem',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.7)',
                zIndex: 2
              }} size={18} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '15px 80px 15px 50px',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `2px solid ${form.password ? (validations.password ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)') : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '15px',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(250, 112, 154, 0.8)';
                  e.target.style.boxShadow = '0 12px 40px rgba(250, 112, 154, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = form.password ? (validations.password ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)') : 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '45px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '5px',
                  transition: 'all 0.3s ease',
                  zIndex: 2
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                  e.target.style.background = 'none';
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1rem',
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '1rem',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#667eea',
                  cursor: 'pointer'
                }}
              />
              Remember me
            </label>
            <button 
              type="button" 
              style={{
                background: 'none',
                border: 'none',
                color: '#87ceeb',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                textShadow: '0 0 20px rgba(135, 206, 235, 0.6)'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#40e0d0';
                e.target.style.textShadow = '0 0 25px rgba(64, 224, 208, 0.8)';
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#87ceeb';
                e.target.style.textShadow = '0 0 20px rgba(135, 206, 235, 0.6)';
                e.target.style.textDecoration = 'none';
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading || !Object.values(validations).every(Boolean)}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '1.3rem',
              fontWeight: '700',
              background: loading || !Object.values(validations).every(Boolean) 
                ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))'
                : 'linear-gradient(145deg, rgba(102, 126, 234, 0.6), rgba(118, 75, 162, 0.4))',
              border: `2px solid ${loading || !Object.values(validations).every(Boolean) 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(102, 126, 234, 0.8)'}`,
              borderRadius: '15px',
              color: loading || !Object.values(validations).every(Boolean) 
                ? 'rgba(255, 255, 255, 0.5)' 
                : '#ffffff',
              cursor: loading || !Object.values(validations).every(Boolean) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              boxShadow: loading || !Object.values(validations).every(Boolean) 
                ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
                : '0 15px 45px rgba(102, 126, 234, 0.4)',
              letterSpacing: '1px',
              marginBottom: '1.5rem'
            }}
            onMouseEnter={(e) => {
              if (!loading && Object.values(validations).every(Boolean)) {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                e.target.style.boxShadow = '0 25px 60px rgba(102, 126, 234, 0.6)';
                e.target.style.background = 'linear-gradient(145deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.6))';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && Object.values(validations).every(Boolean)) {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 15px 45px rgba(102, 126, 234, 0.4)';
                e.target.style.background = 'linear-gradient(145deg, rgba(102, 126, 234, 0.6), rgba(118, 75, 162, 0.4))';
              }
            }}
          >
            {loading ? '🔄 Signing in...' : '🚀 Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          position: 'relative',
          textAlign: 'center',
          margin: '2rem 0',
          animation: 'fadeInUp 1s ease-out 0.7s both'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
          }}></div>
          <span style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
            padding: '0.5rem 1.5rem',
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '600',
            borderRadius: '25px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
          }}>
            Or continue with
          </span>
        </div>

        {/* Google Button */}
        <button 
          type="button" 
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            background: googleLoading 
              ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))'
              : 'linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))',
            border: `2px solid ${googleLoading ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)'}`,
            borderRadius: '15px',
            color: googleLoading ? 'rgba(255, 255, 255, 0.6)' : '#ffffff',
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
            boxShadow: '0 10px 35px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '1.5rem',
            animation: 'fadeInUp 1s ease-out 0.8s both'
          }}
          onMouseEnter={(e) => {
            if (!googleLoading) {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 15px 50px rgba(255, 255, 255, 0.2)';
              e.target.style.background = 'linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08))';
            }
          }}
          onMouseLeave={(e) => {
            if (!googleLoading) {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 10px 35px rgba(0, 0, 0, 0.3)';
              e.target.style.background = 'linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))';
            }
          }}
        >
          {googleLoading ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid #ffffff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Signing in with Google...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Error/Success Messages */}
        {error && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem 1.5rem',
            background: 'linear-gradient(145deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1))',
            border: '2px solid rgba(244, 67, 54, 0.5)',
            borderRadius: '15px',
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 10px 30px rgba(244, 67, 54, 0.3)',
            animation: 'fadeInUp 0.5s ease-out',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
          }}>
            <AlertCircle size={18} color="#f44336" />
            {error}
          </div>
        )}

        {success && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem 1.5rem',
            background: 'linear-gradient(145deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))',
            border: '2px solid rgba(76, 175, 80, 0.5)',
            borderRadius: '15px',
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 10px 30px rgba(76, 175, 80, 0.3)',
            animation: 'fadeInUp 0.5s ease-out',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
          }}>
            <CheckCircle size={18} color="#4caf50" />
            {success}
          </div>
        )}

        {/* Footer Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          animation: 'fadeInUp 1s ease-out 0.9s both'
        }}>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            margin: 0
          }}>
            Don't have an account?{' '}
            <a 
              href="/signup"
              style={{
                color: '#87ceeb',
                textDecoration: 'none',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                textShadow: '0 0 20px rgba(135, 206, 235, 0.6)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#40e0d0';
                e.target.style.textShadow = '0 0 25px rgba(64, 224, 208, 0.8)';
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#87ceeb';
                e.target.style.textShadow = '0 0 20px rgba(135, 206, 235, 0.6)';
                e.target.style.textDecoration = 'none';
              }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;