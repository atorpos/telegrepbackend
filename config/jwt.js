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
    issuer: process.env.JWT_ISSUER || 'telegrepbackend',
    audience: process.env.JWT_AUDIENCE, // optional
    algorithm: process.env.JWT_ALGORITHM || 'HS256',
};

if (!jwtConfig.secret) {
    throw new Error('JWT_SECRET is not set in environment variables');
}

module.exports = jwtConfig;
