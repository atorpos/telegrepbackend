// test-jwt.js
// Simple test script to demonstrate createAccessToken function
require('dotenv').config();

const { createAccessToken, verifyToken } = require('./lib/jwt');

console.log('Testing JWT createAccessToken function');
console.log('=====================================');

// Test 1: Basic token creation
console.log('\n1. Creating a basic user token:');
const userPayload = {
    sub: 'user123',
    role: 'user',
    email: 'user@example.com'
};

try {
    const token = createAccessToken(userPayload);
    console.log('Generated Token:', token);

    // Verify the token
    const decoded = verifyToken(token);
    console.log('Decoded Payload:', decoded);
} catch (error) {
    console.error('Error:', error.message);
}

// Test 2: Admin token with custom expiration
console.log('\n2. Creating admin token with custom expiration:');
const adminPayload = {
    sub: 'admin456',
    role: 'admin',
    permissions: ['read', 'write', 'delete']
};

try {
    const adminToken = createAccessToken(adminPayload, { expiresIn: '2h' });
    console.log('Generated Admin Token:', adminToken);

    const decodedAdmin = verifyToken(adminToken);
    console.log('Decoded Admin Payload:', decodedAdmin);
} catch (error) {
    console.error('Error:', error.message);
}

// Test 3: Short-lived token for password reset
console.log('\n3. Creating short-lived token for password reset:');
const resetPayload = {
    sub: 'user123',
    type: 'password-reset',
    purpose: 'reset-password'
};

try {
    const resetToken = createAccessToken(resetPayload, { expiresIn: '15m' });
    console.log('Generated Reset Token:', resetToken);

    const decodedReset = verifyToken(resetToken);
    console.log('Decoded Reset Payload:', decodedReset);
} catch (error) {
    console.error('Error:', error.message);
}
