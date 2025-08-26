// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.split(' ')[1]; // Expecting "Bearer <token>"

  // If no token, block access
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = decoded;

    // Continue to next middleware / route handler
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
