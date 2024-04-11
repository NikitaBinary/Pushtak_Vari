const authService = require("../service/notificationService");
const notifiService = new authService();

class authController {
    async createNotificationController(req, res) {
        try {
            const notificationInfo = await notifiService.createNotificationService(req.body);
            return res.json({
                status: 201,
                message: "Notification has been added successfully!",
                data: notificationInfo
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }
    async getUserTypeList(req, res) {
        try {
            const userTypeList = await notifiService.getUserTypeListService();

            return res.json({
                status: 200,
                message: "User Type list get",
                data: userTypeList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async getNotificationList(req, res) {
        try {
            const userId = req.query.userId
            const notificationList = await notifiService.getNotificationListService(userId);

            return res.json({
                status: 200,
                message: "Notification list get",
                data: notificationList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async getNotificationListController(req, res) {
        try {
            const userId = req.query.userId
            const userType = req.query.userType
            const notificationList = await notifiService.getNotificationList(userType,userId);

            return res.json({
                status: 200,
                message: "Notification list get",
                data: notificationList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

    async getNotificationTypeList(req, res) {
        try {
            const notyTypeList = await notifiService.getNotificationTypeService();

            return res.json({
                status: 200,
                message: "Notification type list get",
                data: notyTypeList
            })

        } catch (error) {
            return res.json({
                status: 500,
                message: error.message
            })
        }
    }

}

module.exports = authController;