const notification = require("../model/notificationModel")
const userType = require("../model/userTypeModel")
const notificationType = require("../model/notificationTypeModel")


class AuthService {
    async createNotificationService(data) {
        try {
            const userTypeData = await userType.findById({ _id: data.userType }, { _id: 1, userType: 1 })
            data.userType = userTypeData
            const notificationInfo = await notification.create(data);
            return notificationInfo
        } catch (error) {
            throw error;
        }
    }

    async getNotificationListService(usertype) {
        try {
           
            if (usertype) {
                var notificationList = await notification.find({ "userType.userType": usertype })
            }
            if (!usertype) {
                notificationList = await notification.find()
            }
            return notificationList
        } catch (error) {
            throw error;
        }
    }

    async getUserTypeListService() {
        try {
            const userTypeList = await userType.find()
            return userTypeList
        } catch (error) {
            throw error;
        }
    }

    async getNotificationTypeService() {
        try {
            const notyTypeList = await notificationType.find()
            return notyTypeList
        } catch (error) {
            throw error;
        }
    }

}

module.exports = AuthService