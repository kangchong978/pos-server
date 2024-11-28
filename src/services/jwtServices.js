const jwt = require('jsonwebtoken');

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

function generateAccessToken(data) {
    return jwt.sign({ data }, JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

function generateRefreshToken(data) {
    return jwt.sign({ data }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

function verifyAccessToken(token) {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET, (err, result) => {
        if (err) throw err;
        return result.data;
    });
}

function verifyRefreshToken(token) {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET, (err, result) => {
        if (err) throw err;
        return result.data;
    });
}

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };