const HttpStatus = require("http-status-codes");
const authService = require("../service/ebookService");
const ebookService = new authService();

class authController {
    async addEbookTypeController(req, res) {
        try {
            const ebookTypeInfo = await ebookService.addEbookTypeService(req.body);
            return res.json({
                status: 201,
                message: "ebookType has been added successfully!",
                data: ebookTypeInfo
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async ebookTypeListController(req, res) {
        try {
            const ebookTypeList = await ebookService.ebookTypeListService();

            return res.json({
                status: 200,
                message: "ebookType list get",
                data: ebookTypeList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async createEbookController(req, res) {
        try {
            const file = req.files
            const data = req.body
            const ebookDetail = await ebookService.createEbookService(data, file);
            return res.json({
                status: 201,
                message: "E-Book has been added successfully!",
                data: ebookDetail
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async updateEbookController(req, res) {
        try {
            let dataBody = req.body
            const id = req.params.id
            const eBookInfo = await ebookService.updateEbookService(id, dataBody);
            if (!eBookInfo.eBookDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "eBook not exists",
                });
            }
            delete eBookInfo.eBookDetail
            return res.status(200).send({
                status: 200,
                message: "E-Book has been edited successfully!",
                body: eBookInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }
    async deleteEbookController(req, res) {
        try {
            let id = req.params.id
            const response = await ebookService.deleteEbookService(id);

            if (response.message) {
                return res.status(404).send({
                    status: 404,
                    message: response.message
                });
            }
            return res.status(200).send({
                status: 200,
                message: "ebook info deleted",
                data: response
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async getEbookListController(req, res) {
        try {
            const eBookList = await ebookService.getEbookListService();

            return res.json({
                status: 200,
                message: "eBook list get",
                data: eBookList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async getEbookInfoController(req, res) {
        try {
            const id = req.params.id
            const response = await ebookService.getEbookInfoService(id);
            if (!response.eBookDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "eBookId not exists",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "eBook Detail get",
                body: response.eBookInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

}

module.exports = authController;