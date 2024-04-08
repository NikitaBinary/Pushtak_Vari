const notification = require("../model/notificationModel")
const userType = require("../model/userTypeModel")
const notificationType = require("../model/notificationTypeModel")
const { sendPushNotification } = require("../middleware/notification");
const mongoose = require("mongoose")
const user = require("../model/userModel")

class AuthService {
    async createNotificationService(data) {
        try {
            const userTypeData = await userType.findById({ _id: data.userType }, { _id: 1, userType: 1 })
            data.userType = userTypeData
            const notificationInfo = await notification.create(data);

            if (notificationInfo.userType.userType == 'Users') {
                const regularUserId = await user.find({ userType: 'REGULAR_USER' }, { _id: 1 })
                const notificationObj = {
                    body: {
                        title: notificationInfo.notificationTitle,
                        type: notificationInfo.notificationType,
                        message: notificationInfo.message,
                        usertype: "all",
                        // uservalues: [new mongoose.Types.ObjectId("65d328e5d9d9a09ad6444ee7"), new mongoose.Types.ObjectId("660518c550caed9eedb0b8bd")]
                        uservalues: regularUserId

                    },
                };
                sendPushNotification(notificationObj).then(() => { }).catch(() => { });
            }
            if (notificationInfo.userType.userType == 'Institutes') {
                const instituteUserId = await user.find({ userType: 'INSTITUTE_USER' }, { _id: 1 })
                const notificationObj = {
                    body: {
                        title: notificationInfo.notificationTitle,
                        type: notificationInfo.notificationType,
                        message: notificationInfo.message,
                        usertype: "all",
                        uservalues: instituteUserId

                    },
                };
                sendPushNotification(notificationObj).then(() => { }).catch(() => { });
            }
            if (notificationInfo.userType.userType == 'All') {
                const allUserId = await user.find({}, { _id: 1 })
                const notificationObj = {
                    body: {
                        title: notificationInfo.notificationTitle,
                        type: notificationInfo.notificationType,
                        message: notificationInfo.message,
                        usertype: "all",
                        uservalues: allUserId

                    },
                };
                sendPushNotification(notificationObj).then(() => { }).catch(() => { });
            }
            return notificationInfo
        } catch (error) {
            throw error;
        }
    }

    async getNotificationListService() {
        try {
            const instituteNotificationList = await notification.find({ "userType.userType": { $ne: 'Institutes' } }).sort({ created_at: -1 });
            const userNotificationList = await notification.find({ "userType.userType": { $ne: 'Users' } }).sort({ created_at: -1 });
            const notificationList = await notification.find().sort({ created_at: -1 });

            return { instituteNotificationList, userNotificationList, notificationList };
        } catch (error) {
            throw error;
        }

    }

    async getNotificationList(userType) {
        try {
            // const notificationList = await notification.find({ "userType.userType": userType })
            const notificationList = await notification.find({ "userType.userType": { $in: ['All', userType] } })

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