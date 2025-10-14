const jwt = require('jsonwebtoken');

// Middleware to verify JWT in Authorization header (Bearer token)
module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Misconfiguration safeguard
    return res.status(500).json({ success: false, error: 'Server JWT configuration missing' });
  }

  jwt.verify(token, secret, (err, payload) => {
    if (err) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    req.user = payload;
    return next();
  });
};

