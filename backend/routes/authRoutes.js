// backend/routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Auth routes
router.post('/signup', signup);
router.post('/login', login);

// Token verification route
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ valid: false, message: 'User not found' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        verified: user.verified,
        partner: user.partner
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ valid: false, message: 'Server error' });
  }
});

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

    try {
      // Create JWT token for the authenticated user
      const payload = {
        userId: req.user.id,
        email: req.user.email
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      // Create refresh token
      const refreshToken = jwt.sign(
        { userId: req.user.id },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      // Save refresh token
      await req.user.addRefreshToken(
        refreshToken,
        req.headers['user-agent'] || 'Google OAuth'
      );

      // For popup flow - send message to parent window
      res.send(`
        <script>
          if (window.opener) {
            window.opener.postMessage({
              success: true,
              token: '${token}',
              refreshToken: '${refreshToken}',
              user: ${JSON.stringify({
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                avatar: req.user.avatar,
                verified: req.user.verified,
                partner: req.user.partner
              })}
            }, '${clientUrl}');
            window.close();
          } else {
            // Fallback - redirect to frontend with token
            window.location.href = '${clientUrl}/auth/success?token=' + '${token}';
          }
        </script>
      `);

    } catch (error) {
      console.error('Google callback error:', error);
      res.send(`
        <script>
          if (window.opener) {
            window.opener.postMessage({
              success: false,
              error: 'Authentication failed'
            }, '${clientUrl}');
            window.close();
          } else {
            window.location.href = '${clientUrl}/login?error=auth_failed';
          }
        </script>
      `);
    }
  }
);

// Refresh token route
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);
    if (!user || !user.hasValidRefreshToken(refreshToken)) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: newToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        verified: user.verified,
        partner: user.partner
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Logout route
router.post('/logout', auth, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const user = await User.findById(req.user.userId);
      if (user) {
        await user.removeRefreshToken(refreshToken);
      }
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.json({ message: 'Logged out successfully' }); // Still return success
  }
});

module.exports = router;
