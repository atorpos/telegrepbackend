var express = require('express');
var router = express.Router();
const { createAccessToken } = require('../lib/jwt');

// POST /auth/token - issue a JWT
// Accept either:
//  - header: x-api-key matching AUTH_API_KEY, or
//  - body: { username, password } matching AUTH_USERNAME/AUTH_PASSWORD
router.post('/token', function(req, res) {
  try {
    const apiKey = req.header('x-api-key');
    const { username, password } = req.body || {};

    let subject = null;
    let role = 'user'; // default role

    if (process.env.AUTH_API_KEY && apiKey && apiKey === process.env.AUTH_API_KEY) {
      subject = 'api-key';
      role = 'admin'; // API key users get admin role
    } else if (
      process.env.AUTH_USERNAME && process.env.AUTH_PASSWORD &&
      username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD
    ) {
      subject = username || 'user';
      role = 'admin'; // Username/password users get admin role
    }

    if (!subject) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Create JWT token using the createAccessToken function
    const payload = {
      sub: subject,
      role: role,
      iat: Math.floor(Date.now() / 1000), // issued at time
    };

    const token = createAccessToken(payload);
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    return res.json({
      success: true,
      token,
      expiresIn,
      user: {
        subject,
        role
      }
    });
  } catch (error) {
    console.error('JWT generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate token'
    });
  }
});

module.exports = router;
