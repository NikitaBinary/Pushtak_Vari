const notification = require("../model/notificationModel")
const userType = require("../model/userTypeModel")
const notificationType = require("../model/notificationTypeModel")
const { sendPushNotification } = require("../middleware/notification");
const mongoose = require("mongoose")
const user = require("../model/userModel")

class AuthService {
    async createNotificationService(data, imageUrl) {
        try {
            const id = data.userType
            const userTypeData = await userType.findOne({ _id: new mongoose.Types.ObjectId(id) }, { _id: 1, userType: 1 })

            data.userType = userTypeData
            data.image = imageUrl
            const notificationInfo = await notification.create(data);

            if (notificationInfo.userType.userType == 'Users') {
                const regularUserId = await user.find({ userType: 'REGULAR_USER' }, { _id: 1 })
                const notificationObj = {
                    body: {
                        title: notificationInfo.notificationTitle,
                        type: notificationInfo.notificationType,
                        message: notificationInfo.message,
                        android: {
                            notification: {
                                imageUrl: "http://ebook.prometteur.in:5050/uploads/1713415943658-Bracket.png"
                            }
                        },
                        usertype: "all",
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
                        android: {
                            notification: {
                                imageUrl: "http://ebook.prometteur.in:5050/uploads/1713415943658-Bracket.png"
                            }
                        },
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
                        android: {
                            notification: {
                                imageUrl: "http://ebook.prometteur.in:5050/uploads/1713415943658-Bracket.png"
                            }
                        },
                        usertype: "all",
                        uservalues: allUserId
                    },
                };
                sendPushNotification(notificationObj).then(() => { }).catch(() => { });
            }
            return notificationInfo
        } catch (error) {
            console.log("error---------->", error)
            throw error;
        }
    }

    async getNotificationListService(userId) {
        try {
            const userInfo = await user.findOne({ _id: userId }, { created_at: 1 });
            const userCreatedAt = userInfo ? userInfo.created_at : null;

            // Fetch notifications created after user's creation date
            const instituteNotificationList = await notification.find({ "userType.userType": { $ne: 'Institutes' }, created_at: { $gt: userCreatedAt } }).sort({ created_at: -1 });
            const userNotificationList = await notification.find({ "userType.userType": { $ne: 'Users' }, created_at: { $gt: userCreatedAt } }).sort({ created_at: -1 });
            const notificationList = await notification.find({ created_at: { $gt: userCreatedAt } }).sort({ created_at: -1 });

            return { instituteNotificationList, userNotificationList, notificationList };
        } catch (error) {
            throw error;
        }
    }

    async getNotificationList(userType, userId) {
        try {
            const userInfo = await user.findOne({ _id: userId }, { created_at: 1 });
            const userCreatedAt = userInfo ? userInfo.created_at : null;

            const notificationList = await notification.find({ "userType.userType": { $in: ['All', userType] }, created_at: { $gt: userCreatedAt } }).sort({ created_at: -1 });

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