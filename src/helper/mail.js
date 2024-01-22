require('dotenv').config()
const nodemailer = require("nodemailer");
module.exports = class mail {
    async sendMail(email, message, subject) {
        const mail = nodemailer.createTransport({
            host: process.env.mail_host,
            port: process.env.mail_port,
            secure: false,
            auth: {
                user: process.env.user_name,
                pass: process.env.password
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        mail.sendMail({
            from: process.env.user_name,
            to: email,
            subject:subject,
            html: message,
        })
        return true;
    }
}