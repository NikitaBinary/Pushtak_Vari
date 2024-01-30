const HttpStatus = require("http-status-codes");
const authService = require("../service/instituteService");
const { getPasswordHash } = require("../helper/passwordHelper");
const instituteService = new authService();

class authController {
    async createInstituteController(req, res) {
        try {
            req.body.password = await getPasswordHash(req.body.password, 12);
            const response = await instituteService.createInstituteService(req.body);
            if (response.uniqueEmail) {
                return res.json({
                    status: 400,
                    message: "Email already exists",
                })
            }
            return res.json({
                status: 201,
                message: "Institute has been added successfully!",
                data: response.instituteDetail
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async loginInstituteController(req, res) {
        try {
            const response = await instituteService.loginInstituteService(req.body);
            if (!response) {
                return res.json({
                    status: 400,
                    message: "Email not registered",
                })
            }
            return res.json({
                status: 200,
                message: "Institute User login successfully",
                body: response
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async forgotPassword(req, res) {
        try {
            const response = await instituteService.forgotPassordAndOTPService(req.body);
            if (response) {
                return res.json({
                    status: 200,
                    message: "OTP send successfully",
                })
            } else {
                console.log("come in iff")
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
            const response = await instituteService.verifyOTP(req.body);
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
            const response = await instituteService.resetPassword(req.body);
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
    async updateInstituteController(req, res) {
        try {
            let dataBody = req.body
            const id = req.params.id
            const instituteInfo = await instituteService.updateInstituteService(id, dataBody);
            if (!instituteInfo.instituteDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "Institute not exists",
                });
            }
            delete instituteInfo.instituteDetail
            return res.status(200).send({
                status: 200,
                message: "Institute information has been edited successfully!",
                body: instituteInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async instituteListController(req, res) {
        try {
            const instituteList = await instituteService.instituteListService();

            return res.json({
                status: 200,
                message: "Institute list get",
                data: instituteList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async getInstituteInfoController(req, res) {
        try {
            const id = req.params.id
            const instituteInfo = await instituteService.getInstituteInfoService(id);
            if (!instituteInfo.instituteDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "instituteId not exists",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "institute Detail get",
                body: instituteInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async deleteInstituteInfoController(req, res) {
        try {
            let id = req.params.id
            const response = await instituteService.deleteInstituteInfoService(id);
            if (!response.instituteInfo) {
                return res.status(404).send({
                    status: 404,
                    message: "Institute not exists",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "Institute info deleted",
                data: response.institutedata
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }
    async instituteStatusController(req, res) {
        try {
            let id = req.params.id
            let status = req.query.activeStatus
            const response = await instituteService.instituteStatusService(id, status);
            if (!response.instituteInfo) {
                return res.status(404).send({
                    status: 404,
                    message: "instituteId not exists",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "institute status has been updated successfully!",
                data: response.institutedata
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