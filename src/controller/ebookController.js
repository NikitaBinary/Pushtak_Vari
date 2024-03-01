const HttpStatus = require("http-status-codes");
const authService = require("../service/ebookService");
const ebookService = new authService();

class authController {
    async addEbookTypeController(req, res) {
        try {
            const ebookTypeInfo = await ebookService.addEbookTypeService(req.body);
            return res.json({
                status: 201,
                message: "E-Book type has been added successfully!",
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

    async ebooklanguageListController(req, res) {
        try {
            const ebooklanguageList = await ebookService.ebooklanguageListService();

            return res.json({
                status: 200,
                message: "E-Book language list get",
                data: ebooklanguageList
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
            const pdfFile = req.files.bookPdf
            const imageFile = req.files.bookImage
            const data = req.body

            const webUrl = `${req.protocol}://${req.get('host')}`;

            if (imageFile) {
                const [image_file] = imageFile
                var imageUrl = `${webUrl}/uploads/${image_file.filename}`
            }
            if (pdfFile) {
                const [pdf_file] = pdfFile
                var pdfUrl = `${webUrl}/uploads/${pdf_file.filename}`
            }
            const ebookDetail = await ebookService.createEbookService(data, imageUrl, pdfUrl);
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
            const dataBody = req.body
            const id = req.params.id

            const pdfFile = req.files.bookPdf
            const imageFile = req.files.bookImage

            const webUrl = `${req.protocol}://${req.get('host')}`;

            if (imageFile) {
                const [image_file] = imageFile
                var ImageUrl = `${webUrl}/uploads/${image_file.filename}`
            }
            if (pdfFile) {
                const [pdf_file] = pdfFile
                var pdfUrl = `${webUrl}/uploads/${pdf_file.filename}`
            }

            const eBookInfo = await ebookService.updateEbookService(id, dataBody, ImageUrl, pdfUrl);
            if (!eBookInfo.eBookDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "E-Book not exists",
                });
            }
            delete eBookInfo.eBookDetail
            return res.status(200).send({
                status: 200,
                message: "E-Book has been updated successfully!",
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
                message: "E-Book information deleted.",
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
                message: "E-Book list get.",
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
                    message: "E-Book id not exists",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "E-Book Detail get",
                body: response.eBookInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async getAppEbookListController(req, res) {
        try {
            const category = req.query.type
            const language = req.query.language
           
            const eBookList = await ebookService.getAppEbookListService(category, language);

            return res.json({
                status: 200,
                message: "E-Book list get.",
                data: eBookList
            })

        } catch (error) {
            console.log("errorr----------->", error)
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async addReviewController(req, res) {
        try {
            const reviewInfo = await ebookService.addReviewService(req.body);
            return res.json({
                status: 201,
                message: "E-Book review has been added successfully!",
                data: reviewInfo
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async eBookInfoController(req, res) {
        try {
            const id = req.params.id
            const response = await ebookService.eBookInfoService(id);
            if (!response.eBookDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "E-Book id not exists",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "E-Book Detail get",
                body: response.eBookInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async exploreBookListController(req, res) {
        try {
            const pageSize = Number(req.query.limit) || 10
            const page = Number(req.query.page) || 1
            const searchText = req.query.searchText || ""
            const eBookList = await ebookService.exploreBookListService(pageSize, page, searchText);

            return res.json({
                status: 200,
                message: "E-Book list get.",
                data: eBookList
            })

        } catch (error) {
            console.log("errorr----------->", error)
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

}

module.exports = authController;