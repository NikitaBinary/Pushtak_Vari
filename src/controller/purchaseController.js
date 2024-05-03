const authService = require("../service/purchaseService");
const purchaseService = new authService();

class authController {
    async addToPurchaseBookController(req, res) {
        try {
            const response = await purchaseService.addToPurchaseService(req.body)
            if (response.message) {
                return res.status(404).send({
                    status: 404,
                    message: response.message
                })
            }
            return res.status(200).send({
                status: 200,
                message: "Purchase book detail.",
                data: response
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }
    async updatePurchaseBookController(req, res) {
        try {
            // const purchaseId = req.params.id
            const bookId = req.query.bookId
            const userId = req.query.userId
            const purchaseDetail = await purchaseService.updatePurchaseBookService(bookId, userId)
            console.log("purchaseDetail--------------->", purchaseDetail)
            return res.status(200).send({
                status: 200,
                message: "Purchase book detail.",
                data: purchaseDetail
            })


        } catch (error) {
            console.log("error---------->", error.message)
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }

    }

    async multiplePurchaseBookController(req, res) {
        try {
            const purchaseBooks = req.body.purchaseBookIDs
            const userId = req.params.id
            const purchaseDetail = await purchaseService.multiplePurchaseBookService(purchaseBooks, userId)

            return res.status(200).send({
                status: 200,
                message: "Purchase book detail.",
                data: purchaseDetail
            })


        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }

    }
    async getPurchaseHistoryController(req, res) {
        try {
            const id = req.query.userId
            const purchaseBookList = await purchaseService.getPurchaseHistoryService(id)
            return res.status(200).send({
                status: 200,
                message: "Purchase book detail.",
                data: purchaseBookList
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async getMoreItemController(req, res) {
        try {
            const userId = req.params.id
            const response = await purchaseService.getMoreItemService(userId)
            if (response.message) {
                return res.status(404).send({
                    status: 404,
                    message: response.message
                })
            }
            return res.status(200).send({
                status: 200,
                message: "More item book list.",
                data: response
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async updateBookStatusController(req, res) {
        try {
            const userId = req.params.id
            const bookId = req.query.bookId
            const totalPages = req.query.totalPages
            const readPages = req.query.readPages
            const currentReading = req.query.currentReading
            const response = await purchaseService.updateBookStatusService(userId, bookId, totalPages, readPages, currentReading)

            if (response.message) {
                return res.status(404).send({
                    status: 404,
                    message: response.message
                })
            }
            return res.status(200).send({
                status: 200,
                message: "Update book reading status.",
                bookReadingPercent: response.readingInfo.books.readingPercent
            })
        } catch (error) {
            console.log("error--------->", error)
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async progressbookController(req, res) {
        try {
            const userId = req.query.userId
            const response = await purchaseService.progressbookService(userId)

            if (response.message) {
                return res.status(200).send({
                    status: 404,
                    message: response.message
                })
            }

            const [result] = response.eBookList
            return res.status(200).send({
                status: 200,
                message: "Get book progress",
                eBookProgress: result
            })

        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async eBookGraphController(req, res) {
        try {
            const userId = req.query.userId
            const response = await purchaseService.eBookGraphService(userId)

            // if (response.message) {
            //     return res.status(200).send({
            //         status: 404,
            //         message: response.message
            //     })
            // }

            return res.status(200).send({
                status: 200,
                message: "Get e-book graph.",
                eBookProgress: response
            })

        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async getMyBookController(req, res) {
        try {
            const userId = req.params.id
            const getMyBookList = await purchaseService.getMyBookService(userId)
            return res.status(200).send({
                status: 200,
                message: "Get my book list.",
                data: getMyBookList
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async getlastBookProgress(req, res) {
        try {
            const userId = req.query.userId
            const bookId = req.query.bookId
            const response = await purchaseService.getlastBookProgressService(userId, bookId)

            if (response.message) {
                return res.status(200).send({
                    status: 404,
                    message: response.message
                })
            }

            return res.status(200).send({
                status: 200,
                message: "Get book progress",
                eBookProgress: response
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