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
}

module.exports = authController;