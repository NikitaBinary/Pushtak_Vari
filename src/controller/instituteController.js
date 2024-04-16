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
                    message: "Institute not exists.",
                });
            }
            delete instituteInfo.instituteDetail
            return res.status(200).send({
                status: 200,
                message: "Institute information has been updated successfully!",
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
                    message: "Institute Id not exists.",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "Institute Detail get",
                body: instituteInfo.instituteInfo
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
            if (response.message) {
                return res.status(404).send({
                    status: 404,
                    message: response.message
                });
            }
            return res.status(200).send({
                status: 200,
                message: "Institute information deleted.",
                data: response
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
                    message: "Institute id not exists",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "Institute status has been updated successfully!",
                data: response.institutedata
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async assignBooktoInstituteController(req, res) {
        try {
            let instituteId = req.params.id
            let bookId = req.query.bookId
            const response = await instituteService.assignBooktoInstituteService(instituteId, bookId)
            return res.status(200).send({
                status: 200,
                message: "Institute assign eBook successfully!",
                data: response
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async deleteInstituteBookController(req, res) {
        try {
            let instituteId = req.params.id
            let bookId = req.query.bookId
            const response = await instituteService.deleteInstituteBookService(instituteId, bookId)

            if (response.message) {
                return res.status(404).send({
                    status: 404,
                    message: response.message
                })
            }
            return res.status(200).send({
                status: 200,
                message: "Institute assign eBook deleted!",
                data: response
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }
    async instituteBookListController(req, res) {
        try {
            let instituteId = req.params.id
            const response = await instituteService.instituteBookListService(instituteId)

            if (response.message) {
                return res.status(404).send({
                    status: 404,
                    message: response.message
                })
            }
            return res.status(200).send({
                status: 200,
                message: "Get institute ebook list.",
                data: response
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