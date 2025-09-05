// backend/middleware/auth.js - FIXED VERSION
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header, access denied' });
    }

    // Check if it starts with "Bearer "
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid authorization format. Use Bearer <token>' });
    }

    const token = authHeader.split(' ')[1];

    // If no token after Bearer
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIXED: Provide both id and userId for compatibility
    req.user = {
      id: decoded.userId || decoded.id,        // For controllers expecting req.user.id
      userId: decoded.userId || decoded.id,    // For controllers expecting req.user.userId
      email: decoded.email,
      ...decoded // Include any other payload data
    };

    // Continue to next middleware / route handler
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Generic error
    res.status(401).json({ message: 'Token verification failed' });
  }
};