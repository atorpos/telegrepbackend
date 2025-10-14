// .env (example)
// JWT_SECRET=replace_with_a_long_random_string
// JWT_EXPIRES_IN=1h
// JWT_ISSUER=my-app
// JWT_AUDIENCE=my-app-client
// JWT_ALGORITHM=HS256

// config/jwt.js
const jwtConfig = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    issuer: process.env.JWT_ISSUER || 'my-app',
    audience: process.env.JWT_AUDIENCE, // optional
    algorithm: process.env.JWT_ALGORITHM || 'HS256',
};
if (!jwtConfig.secret) {
    throw new Error('JWT_SECRET is not set');
}
module.exports = jwtConfig;

// lib/jwt.js
const jwt = require('jsonwebtoken');
const cfg = require('../config/jwt');

// Create a signed JWT with the shared config
function createAccessToken(payload, overrides = {}) {
    const signOpts = {
        expiresIn: overrides.expiresIn || cfg.expiresIn,
        issuer: overrides.issuer || cfg.issuer,
        audience: overrides.audience || cfg.audience,
        algorithm: overrides.algorithm || cfg.algorithm,
    };
    return jwt.sign(payload, cfg.secret, signOpts);
}

// Example usage (e.g., in a login handler)
// const token = createAccessToken({ sub: user.id, role: user.role });
// res.json({ token });

module.exports = { createAccessToken };
