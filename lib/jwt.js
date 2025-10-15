const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

/**
 * Create a signed JWT token with the shared config
 * @param {Object} payload - The payload to include in the token (e.g., { sub: userId, role: 'user' })
 * @param {Object} overrides - Optional overrides for token options
 * @returns {string} - The signed JWT token
 */
function createAccessToken(payload, overrides = {}) {
    const signOpts = {
        expiresIn: overrides.expiresIn || jwtConfig.expiresIn,
        issuer: overrides.issuer || jwtConfig.issuer,
        audience: overrides.audience || jwtConfig.audience,
        algorithm: overrides.algorithm || jwtConfig.algorithm,
    };

    // Remove undefined values from signOpts
    Object.keys(signOpts).forEach(key => {
        if (signOpts[key] === undefined) {
            delete signOpts[key];
        }
    });

    return jwt.sign(payload, jwtConfig.secret, signOpts);
}

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @param {Object} options - Optional verification options
 * @returns {Object} - The decoded payload if valid
 */
function verifyToken(token, options = {}) {
    const verifyOpts = {
        issuer: options.issuer || jwtConfig.issuer,
        audience: options.audience || jwtConfig.audience,
        algorithms: [options.algorithm || jwtConfig.algorithm],
    };

    // Remove undefined values from verifyOpts
    Object.keys(verifyOpts).forEach(key => {
        if (verifyOpts[key] === undefined) {
            delete verifyOpts[key];
        }
    });

    return jwt.verify(token, jwtConfig.secret, verifyOpts);
}

module.exports = {
    createAccessToken,
    verifyToken
};
