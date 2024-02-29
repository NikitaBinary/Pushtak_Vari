const authService = require("../service/purchaseService");
const purchaseService = new authService();

class authController {
    async addToPurchaseBookController(req, res) {
        try {
            const response = await purchaseService.addToPurchaseService(req.body)
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }
}

module.exports = authController;