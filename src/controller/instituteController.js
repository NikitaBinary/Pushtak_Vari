const HttpStatus = require("http-status-codes");
const authService = require("../service/instituteService");
const { getPasswordHash } = require("../helper/passwordHelper");
const instituteService = new authService();

class authController {
    async createInstituteController(req, res) {
        try {
            const data = req.body
            const file = req.file

            if (file) {
                const webUrl = `${req.protocol}://${req.get('host')}`;
                var ImageUrl = `${webUrl}/uploads/${file.filename}`
            }

            const password = req.body.password
            req.body.password = await getPasswordHash(req.body.password, 12);
            const response = await instituteService.createInstituteService(data, ImageUrl, password);
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


    async updateInstituteController(req, res) {
        try {
            let dataBody = req.body
            const id = req.params.id
            const file = req.file

            if (file) {
                const webUrl = `${req.protocol}://${req.get('host')}`;
                var ImageUrl = `${webUrl}/uploads/${file.filename}`
            }

            const instituteInfo = await instituteService.updateInstituteService(id, dataBody, ImageUrl);
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