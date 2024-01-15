require('dotenv').config()
const jwt = require('jsonwebtoken')

async function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY)
}


async function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY)
}

module.exports = { generateToken, verifyToken }
