const HttpStatus = require('http-status-codes');
const userService = require('../service/signupService');
const insitituteService = require('../service/instituteService');

const { verifyToken } = require('../helper/generateToken');
const useService = new userService()
const InsiService = new insitituteService()

async function superAdminAuth(req, res, next) {
    try {
        if (!req.headers.authorization) {
            res.status(404).send({
                status: 404,
                message: "Token Missing"
            })
        } else {
            const token = req.headers.authorization.split('Bearer')[1].trim();

            const payload = await verifyToken(token);

            if (payload.email && payload.name) {
                let user = await useService.verifyUser({ emailId: payload.email });
                if (!user) {
                    user = await InsiService.verifyUser({ emailId: payload.email });
                }
                req.email = user.emailId;
                // req.userId = user._id;
                
            }
            next();
        }

    } catch (error) {
        res.status(401).send({
            status: 401,
            message: 'Unauthorized Access'
        })
    }
}


module.exports = { superAdminAuth }