const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // ✅ Fixed: Use consistent payload structure
    const token = jwt.sign({ 
      userId: user._id, 
      email: user.email 
    }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        avatar: user.avatar,
        verified: user.verified,
        partner: user.partner
      } 
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Handle Google OAuth users (no password)
    if (user.googleId && !user.password) {
      return res.status(400).json({ 
        message: 'This account uses Google sign-in. Please use "Continue with Google".' 
      });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // ✅ Fixed: Use consistent payload structure
    const token = jwt.sign({ 
      userId: user._id, 
      email: user.email 
    }, JWT_SECRET, { expiresIn: '7d' });

    // Create refresh token for "remember me" (optional)
    const refreshToken = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_REFRESH_SECRET || JWT_SECRET, 
      { expiresIn: '30d' }
    );

    res.json({ 
      token,
      refreshToken, // Include for "remember me" functionality
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        avatar: user.avatar,
        verified: user.verified,
        partner: user.partner
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};