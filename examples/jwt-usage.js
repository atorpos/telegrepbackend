// examples/jwt-usage.js
// This file demonstrates how to use the createAccessToken function

const { createAccessToken, verifyToken } = require('../lib/jwt');

// Example 1: Basic token creation for a user
function generateUserToken(userId, userRole = 'user') {
    const payload = {
        sub: userId,           // subject (user ID)
        role: userRole,        // user role
        iat: Math.floor(Date.now() / 1000), // issued at time
    };

    return createAccessToken(payload);
}

// Example 2: Token with custom expiration
function generateShortLivedToken(userId) {
    const payload = {
        sub: userId,
        role: 'user',
        type: 'password-reset'
    };

    // Override default expiration to 15 minutes
    const overrides = {
        expiresIn: '15m'
    };

    return createAccessToken(payload, overrides);
}

// Example 3: Admin token with additional claims
function generateAdminToken(adminId, permissions = []) {
    const payload = {
        sub: adminId,
        role: 'admin',
        permissions: permissions,
        scope: 'full-access',
        iat: Math.floor(Date.now() / 1000),
    };

    return createAccessToken(payload);
}

// Example 4: API service token
function generateServiceToken(serviceName, apiKey) {
    const payload = {
        sub: serviceName,
        role: 'service',
        api_key_hash: require('crypto').createHash('sha256').update(apiKey).digest('hex').substring(0, 8),
        type: 'service-token'
    };

    // Longer expiration for service tokens
    const overrides = {
        expiresIn: '24h'
    };

    return createAccessToken(payload, overrides);
}

// Example 5: How to use in Express route handlers
function loginHandler(req, res) {
    // Assume user authentication logic here
    const user = authenticateUser(req.body.username, req.body.password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token for authenticated user
    const token = generateUserToken(user.id, user.role);

    res.json({
        success: true,
        token: token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
}

// Example 6: Token verification
function verifyUserToken(token) {
    try {
        const decoded = verifyToken(token);
        return {
            valid: true,
            payload: decoded
        };
    } catch (error) {
        return {
            valid: false,
            error: error.message
        };
    }
}

// Mock authentication function for example
function authenticateUser(username, password) {
    // In real app, check against database
    if (username === 'admin' && password === 'password') {
        return { id: 1, username: 'admin', role: 'admin' };
    }
    return null;
}

module.exports = {
    generateUserToken,
    generateShortLivedToken,
    generateAdminToken,
    generateServiceToken,
    loginHandler,
    verifyUserToken
};

// Usage examples:
if (require.main === module) {
    console.log('JWT Token Generation Examples:');
    console.log('================================');

    // Make sure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
        console.error('Please set JWT_SECRET environment variable');
        process.exit(1);
    }

    // Example 1: Basic user token
    const userToken = generateUserToken('user123', 'user');
    console.log('\n1. Basic User Token:');
    console.log(userToken);

    // Example 2: Short-lived token
    const shortToken = generateShortLivedToken('user123');
    console.log('\n2. Short-lived Token (15min):');
    console.log(shortToken);

    // Example 3: Admin token
    const adminToken = generateAdminToken('admin456', ['read', 'write', 'delete']);
    console.log('\n3. Admin Token:');
    console.log(adminToken);

    // Example 4: Service token
    const serviceToken = generateServiceToken('payment-service', 'api-key-123');
    console.log('\n4. Service Token:');
    console.log(serviceToken);

    // Example 5: Verify a token
    const verification = verifyUserToken(userToken);
    console.log('\n5. Token Verification:');
    console.log(verification);
}
