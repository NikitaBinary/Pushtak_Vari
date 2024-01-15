const HttpStatus = require("http-status-codes");
const authService = require("../service/signupService");
const { getPasswordHash } = require("../helper/passwordHelper");
const userService = new authService();


class authController {
    async userSignupController(req, res) {
        try {
            req.body.password = await getPasswordHash(req.body.password, 12);
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

    async userloginController(req, res) {
        try {
            const response = await userService.userloginService(req.body);
            if (!response) {
                return res.json({
                    status: 400,
                    message: "Email not registered",
                })
            }
            return res.json({
                status: 200,
                message: "User login successfully",
                body: response
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async forgotPassordAndOTPController(req, res) {
        try {
            const response = await userService.forgotPassordAndOTPService(req.body);
            if (response) {
                return res.json({
                    status: 200,
                    message: "OTP send successfully",
                })
            } else {
                return res.json({
                    status: 404,
                    message: "Email does not exists",
                })
            }
        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async verifyOTP(req, res) {
        try {
            const response = await userService.verifyOTP(req.body);
            if (response) {
                return res.json({
                    status: 200,
                    message: "OTP match successfully",
                })
            } else {
                return res.json({
                    status: 400,
                    message: "Invalid Otp",
                })
            }
        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async resetPassword(req, res) {
        try {
            const response = await userService.resetPassword(req.body);
            if (response) {
                return res.status(200).send({
                    status: 200,
                    message: "Password Reset Successfully",
                });
            } else {
                return res.status(400).send({
                    status: 400,
                    message: "Invalid email",
                });
            }
        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

}

module.exports = authController;