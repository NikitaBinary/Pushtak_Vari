const bcrypt = require('bcryptjs')
const HttpStatus = require('http-status-codes');

async function getPasswordHash(password, length) {
    return await bcrypt.hash(password, length);
}

async function verifyPassword(password, hash) {
    const valid = await bcrypt.compare(password, hash);
    console.log("vaid--------->",valid)
    if (!valid) {
        return Promise.reject({
            status: HttpStatus.UNAUTHORIZED,
            message: "Invalid password"
        })
    }
}

module.exports = { getPasswordHash, verifyPassword }