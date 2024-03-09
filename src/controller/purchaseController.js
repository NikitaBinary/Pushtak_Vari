const authService = require("../service/purchaseService");
const purchaseService = new authService();

class authController {
    async addToPurchaseBookController(req, res) {
        try {
            const response = await purchaseService.addToPurchaseService(req.body)
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
            const purchaseId = req.params.id
            const purchaseDetail = await purchaseService.updatePurchaseBookService(purchaseId)
            if (purchaseDetail.message) {
                return res.status(404).send({
                    status: 404,
                    message: purchaseDetail.message
                });
            }
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
            const response = await purchaseService.updateBookStatusService(userId, bookId,totalPages,readPages)

            return res.status(200).send({
                status: 200,
                message: "Update book reading status.",
                bookReadingPercent: response.bookReadingStatus
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async progressbookController(req, res) {
       try {
        const bookId = req.query.bookId
        const userId = req.query.userId

        const response = await purchaseService.progressbookService(bookId,userId)

        if(response.message){
            return res.status(200).send({
                status: 404,
                message: response.message
            })
        }

        return res.status(200).send({
            status: 200,
            message: "Get book progress",
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