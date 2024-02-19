const HttpStatus = require("http-status-codes");
const authService = require("../service/signupService");
const { getPasswordHash } = require("../helper/passwordHelper");
const userRoles = require("../helper/userRoles")
const userService = new authService();


class authController {
    async userSignupController(req, res) {
        try {
            const data = req.body
            const userPassword = data.password

            const institutImage = req.file
            const webUrl = `${req.protocol}://${req.get('host')}`;

            if (institutImage) {
                var institute_Image = `${webUrl}/uploads/${institutImage.filename}`
            }

            req.body.password = await getPasswordHash(data.password, 12);

            if (req.body.userType) {
                if (!userRoles.USER_ROLES.includes(data.userType)) {
                    return res.json({
                        status: 400,
                        message: `Invalid User Type Should be [${userRoles.USER_ROLES}]`,
                    })
                }
            }
            const response = await userService.userSignupService(data, userPassword, institute_Image);
            if (response.uniqueEmail) {
                return res.json({
                    status: 400,
                    message: "Email already exists.",
                })

            }
            console.log("response--------------->", response)
            if (response.uniqueMobileNo) {
                return res.json({
                    status: 400,
                    message: "Mobile number already exists.",
                })
            }

            if (response.userDetail) {
                let data = response.userDetail.userType
                if (data == 'INSTITUTE') {
                    return res.json({
                        status: 201,
                        message: "Institute has been added successfully!",
                        data: response.userDetail
                    })
                }
                else if (data == 'REGULAR_USER' || data == 'INSTITUTE_USER' || data == 'SUPER_ADMIN') {
                    return res.json({
                        status: 201,
                        message: "User has been added successfully!",
                        data: response.userDetail
                    })
                }
            }

        } catch (error) {
            console.log("error------------->", error)
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }


    async userloginController(req, res) {
        try {
            const response = await userService.userloginService(req.body);
            if (response.message) {
                return res.json({
                    status: 400,
                    message: "Email not registered.",
                })
            }
            return res.json({
                status: 200,
                message: "User login successfully.",
                body: response
            })

        } catch (error) {
            console.log("error----------.", error)
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
                    message: "OTP send successfully.",
                })
            } else {
                return res.json({
                    status: 404,
                    message: "Email does not exists.",
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
                    message: "OTP match successfully.",
                })
            } else {
                return res.json({
                    status: 400,
                    message: "Invalid Otp.",
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
                    message: "Password Reset Successfully.",
                });
            } else {
                return res.status(400).send({
                    status: 400,
                    message: "Invalid email.",
                });
            }
        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async userListController(req, res) {
        try {

            const is_instituteUser = req.query.is_instituteUser
            const userList = await userService.userListService(is_instituteUser);

            return res.json({
                status: 200,
                message: "User list get.",
                data: userList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }


    async updateUserController(req, res) {
        try {
            let dataBody = req.body
            const id = req.params.id
            const file = req.file

            if (file) {
                const webUrl = `${req.protocol}://${req.get('host')}`;
                var ImageUrl = `${webUrl}/uploads/${file.filename}`
            }

            const userInfo = await userService.updateUserService(id, dataBody, ImageUrl);
            if (!userInfo.userDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "UserId not exists.",
                });
            }
            delete userInfo.userDetail
            return res.status(200).send({
                status: 200,
                message: "User information has been updated successfully!",
                body: userInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async getUserInfoController(req, res) {
        try {
            const id = req.params.id
            const userInfo = await userService.getUserInfoService(id);
            if (!userInfo.userDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "UserId not exists.",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "User detail get.",
                body: userInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async deleteUserInfoController(req, res) {
        try {
            let id = req.params.id
            const response = await userService.deleteUserService(id);
            if (!response.userInfo) {
                return res.status(404).send({
                    status: 404,
                    message: "UserId not exists.",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "User information deleted.",
                data: response.userdata
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async userStatusController(req, res) {
        try {
            let id = req.params.id
            let status = req.query.activeStatus
            const response = await userService.userStatusService(id, status);
            if (!response.userInfo) {
                return res.status(404).send({
                    status: 404,
                    message: "UserId not exists",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "User status has been updated successfully!",
                data: response.userdata
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async logoutController(req, res) {
        try {
            let id = req.params.id
            const response = await userService.logoutService(id);
            if (!response.userInfo) {
                return res.status(404).send({
                    status: 404,
                    message: "UserId not exists",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "User logout successfully!",
                data: response.userdata
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }
}

module.exports = authController;