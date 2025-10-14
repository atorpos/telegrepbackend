var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

// POST /auth/token - issue a JWT
// Accept either:
//  - header: x-api-key matching AUTH_API_KEY, or
//  - body: { username, password } matching AUTH_USERNAME/AUTH_PASSWORD
router.post('/token', function(req, res) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ success: false, error: 'Server JWT configuration missing' });
  }

  const apiKey = req.header('x-api-key');
  const { username, password } = req.body || {};

  let subject = null;
  if (process.env.AUTH_API_KEY && apiKey && apiKey === process.env.AUTH_API_KEY) {
    subject = 'api-key';
  } else if (
    process.env.AUTH_USERNAME && process.env.AUTH_PASSWORD &&
    username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD
  ) {
    subject = username || 'user';
  }

  if (!subject) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  const token = jwt.sign({ sub: subject }, secret, {
    expiresIn,
    issuer: process.env.JWT_ISSUER || 'telegrepbackend'
  });

  return res.json({ success: true, token, expiresIn });
});

module.exports = router;

