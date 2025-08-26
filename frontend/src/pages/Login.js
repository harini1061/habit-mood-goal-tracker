// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validations, setValidations] = useState({
    email: false,
    password: false
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
    setSuccess('');

    // Real-time validation
    let isValid = false;
    switch (name) {
      case 'email':
        isValid = validateEmail(value);
        break;
      case 'password':
        isValid = value.length >= 6;
        break;
      default:
        break;
    }

    setValidations({ ...validations, [name]: isValid });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all fields
    if (!validations.email || !validations.password) {
      setError('Please enter valid email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      
      // Store token
      if (rememberMe) {
        localStorage.setItem('token', res.data.token);
      } else {
        sessionStorage.setItem('token', res.data.token);
      }
      
      setSuccess('Login successful! Welcome back!');
      navigate('/home');
      
      // Reset form after successful login
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

  const handleForgotPassword = () => {
    // This would typically open a modal or redirect to forgot password page
    alert('Forgot password functionality would be implemented here');
  };

  const handleGoogleLogin = () => {
    // This would typically handle Google OAuth
    alert('Google login functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                  form.email && (validations.email ? 'border-green-500' : 'border-red-500')
                }`}
                placeholder="Enter your email"
                required
              />
              {form.email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {validations.email ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                  form.password && (validations.password ? 'border-green-500' : 'border-red-500')
                }`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-purple-600 hover:text-purple-500"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !Object.values(validations).every(Boolean)}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              loading || !Object.values(validations).every(Boolean)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 transform hover:scale-105'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-purple-500 hover:text-purple-600 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;