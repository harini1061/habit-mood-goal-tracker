// src/pages/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import '../unified-styles.css';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [validations, setValidations] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
    setSuccess('');

    let isValid = false;
    switch (name) {
      case 'name': isValid = value.trim().length >= 2; break;
      case 'email': isValid = validateEmail(value); break;
      case 'password': isValid = validatePassword(value); break;
      case 'confirmPassword': isValid = value === form.password && value.length > 0; break;
      default: break;
    }
    setValidations({ ...validations, [name]: isValid });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!Object.values(validations).every(Boolean)) {
      setError('Please fill in all fields correctly');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password
      });

      localStorage.setItem('token', res.data.token);
      setSuccess('Account created successfully! Welcome aboard!');
      navigate('/home');

      setTimeout(() => {
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
        setValidations({ name: false, email: false, password: false, confirmPassword: false });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWelcome = () => {
    navigate('/');
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(form.password);

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

      {/* Back Button */}
      <button 
        onClick={handleBackToWelcome}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          animation: 'fadeInUp 1s ease-out'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-3px) scale(1.1)';
          e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
          e.target.style.background = 'linear-gradient(145deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.2))';
          e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
          e.target.style.background = 'linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }}
        title="Back to Welcome"
      >
        <ArrowLeft size={24} />
      </button>

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
            <User size={28} color="#ffffff" />
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
            Create Account
          </h2>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)'
          }}>
            Join us and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ animation: 'fadeInUp 1s ease-out 0.6s both' }}>
          {/* Name Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '0.5rem',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.7)',
                zIndex: 2
              }} size={18} />
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                style={{
                  width: '100%',
                  padding: '15px 50px 15px 50px',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `2px solid ${form.name ? (validations.name ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)') : 'rgba(255, 255, 255, 0.3)'}`,
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
                  e.target.style.borderColor = form.name ? (validations.name ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)') : 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              />
              {form.name && (
                <div style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2
                }}>
                  {validations.name ? 
                    <CheckCircle size={18} color="#4caf50" /> : 
                    <AlertCircle size={18} color="#f44336" />
                  }
                </div>
              )}
            </div>
          </div>

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
                  e.target.style.borderColor = 'rgba(79, 172, 254, 0.8)';
                  e.target.style.boxShadow = '0 12px 40px rgba(79, 172, 254, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
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
                placeholder="Create a strong password"
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

            {/* Password Strength */}
            {form.password && (
              <div style={{
                marginTop: '0.8rem',
                padding: '1rem',
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        height: '6px',
                        flex: 1,
                        borderRadius: '3px',
                        background: i < passwordStrength
                          ? passwordStrength <= 2 ? '#f44336'
                          : passwordStrength <= 4 ? '#ff9800'
                          : '#4caf50'
                          : 'rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        boxShadow: i < passwordStrength ? '0 2px 10px rgba(255, 255, 255, 0.3)' : 'none'
                      }}
                    />
                  ))}
                </div>
                <p style={{
                  fontSize: '0.9rem',
                  color: passwordStrength <= 2 ? '#f44336' : passwordStrength <= 4 ? '#ff9800' : '#4caf50',
                  fontWeight: '600',
                  margin: 0,
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
                }}>
                  Password strength: {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 4 ? 'Medium' : 'Strong'}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '0.5rem',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}>
              Confirm Password
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
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                style={{
                  width: '100%',
                  padding: '15px 80px 15px 50px',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `2px solid ${form.confirmPassword ? (validations.confirmPassword ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)') : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '15px',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 154, 158, 0.8)';
                  e.target.style.boxShadow = '0 12px 40px rgba(255, 154, 158, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = form.confirmPassword ? (validations.confirmPassword ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)') : 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {form.confirmPassword && (
                <div style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2
                }}>
                  {validations.confirmPassword ? 
                    <CheckCircle size={18} color="#4caf50" /> : 
                    <AlertCircle size={18} color="#f44336" />
                  }
                </div>
              )}
            </div>
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
              marginTop: '1rem'
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

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
            Already have an account?{' '}
            <a 
              href="/login"
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
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;