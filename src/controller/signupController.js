const HttpStatus = require("http-status-codes");
const authService = require("../service/signupService");
const userService = new authService();


class authController {
    
    async userSignupController(req, res) {
        try {
            // req.body.password = await getPasswordHash(req.body.password, 12);
            const response = await userService.userSignupService(req.body);
            if (response.uniqueEmail) {
                return res.json({
                    status: 400,
                    message: "Email already exists",
                })
            }
            return res.json({
                status: 201,
                message: "User created",
                data: response.userDetail
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
}

module.exports = authController;