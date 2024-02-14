const HttpStatus = require("http-status-codes");
const authService = require("../service/subscriptionService");
const subscriptionService = new authService();

class authController {

    async addSubscriptionDurationController(req, res) {
        try {
            const data = req.body
            const response = await subscriptionService.addSubscriptionDurationService(data)
            return res.json({
                status: 201,
                message: "Sunscription duration added.",
                data: response
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async subscriptionDurationListController(req, res) {
        try {
            const durationList = await subscriptionService.subscriptionDurationListService()
            return res.json({
                status: 200,
                message: "Get list of duration",
                data: durationList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async addSubscriptionController(req, res) {
        try {
            const data = req.body
            const subscriptionDetail = await subscriptionService.addSubscriptionDurationService(data)
            return res.json({
                status: 200,
                message: "Subscription has been added successfully!",
                data: subscriptionDetail
            })
        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async subscriptionListController(req, res) {
        try {
            const subscriptionList = await subscriptionService.subscriptionListService()
            return res.json({
                status: 200,
                message: "Get list of subscription.",
                data: subscriptionList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async updateSubscriptionController(req, res) {
        try {
            let dataBody = req.body
            const id = req.params.id
            const subscriptionInfo = await subscriptionService.updateSubscriptionService(id, dataBody);
            if (!subscriptionInfo.subscriptionDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "Subscription not exists.",
                });
            }
            delete subscriptionInfo.subscriptionDetail
            return res.status(200).send({
                status: 200,
                message: "Subscription has been edited successfully!",
                body: subscriptionInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async getSubscriptionInfoController(req, res) {
        try {
            const id = req.params.id
            const response = await subscriptionService.getSubscriptionInfoService(id);
            if (!response.subscriptionDetail) {
                return res.status(404).send({
                    status: 404,
                    message: "SubscriptionId not exists",
                });
            }
            return res.status(200).send({
                status: 200,
                message: "Subscription Detail get",
                body: response.subscriptionInfo
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: error.message,
            });
        }
    }

    async deleteSubscriptionController(req, res) {
        try {
            let id = req.params.id
            const response = await subscriptionService.deleteSubscriptionService(id);

            if (response.message) {
                return res.status(404).send({
                    status: 404,
                    message: response.message
                });
            }
            return res.status(200).send({
                status: 200,
                message: "Subscription info deleted",
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

module.exports = authController