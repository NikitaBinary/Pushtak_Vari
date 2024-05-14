const userModel = require("../model/userModel");
const appUtils = require('./appUtils');
const fcm = require('./fcm');
require('dotenv').config()
const axios = require('axios');

const fcmServerKey = process.env.Server_Key; // put your server key here



exports.sendNotification = async (registrationToken, data) => {
    try {
        console.log("data---------------->", data)
        const dataInfo = data.body
        const response = await axios.post(
            'https://fcm.googleapis.com/fcm/send',
            {
                to: registrationToken,
                notification: {
                    "title": "notification.title",
                    "body": "notification.description",
                    // "sound": "default",
                    "color": "#53c4bc",
                    "image": "https://via.placeholder.com/500x500.png?text=Sample+Image",
                    "mutable_content": true,
                    "sound": "Tri-tone"
                    // "apns": {
                    //   payload: {
                    //     aps: {
                    //       'mutable-content': 1
                    //     }
                    //   },
                    // },
                },
                android: {},
                data: {
                },
            },

            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `key=${fcmServerKey}`,
                },
            }
        );
        console.log('Notification sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending notification:', error.response.data);
    }
}
exports.sendPushNotification = async (req) => {
    try {
        console.log("sendPushNotificationData body----------------> ",req.body);
        let appKey = [];
        let dataArr = [];
        const notificationObject = {
            type: req.body.type,
            title: req.body.title,
            message: req.body.message,
            image: req.body.image
        };

        if (req.body.usertype === 'csv') {
            await fs.createReadStream(`./public/uploads/csv/${req.file.filename}`)
                .pipe(parse({ delimiter: ",", from_line: 1 }))
                .on("data", function (row) {
                    dataArr.push(row);
                }).on("error", function (error) {
                    console.log(error.message);
                }).on("end", async function () {
                    console.log("finished");
                    for (const item of dataArr) {
                        let phoneNumber = item[0];
                        let emailId = item[1];
                        let userData = await userModel.findOne({ $or: [{ emailId: { $regex: new RegExp(emailId, "i") } }, { mobileNo: phoneNumber }] });
                        if (userData != null) {
                            appKey.push(userData.appKey);
                        };
                    };
                    notificationObject.deviceTokens = appKey;
                    console.log("-csv->");
                    await fs.unlink(`./public/uploads/csv/${req.file.filename}`, (error) => {
                        if (error) {
                            console.error('Error removing file:', error);
                            return;
                        }
                        console.log('File removed successfully.');
                    })
                });
        };

        if (req.body.usertype === 'specific') {
            let uservalues = req.body.uservalues;
            console.log("uservalues.length-->", uservalues.length);
            for (const item of uservalues) {
                let userData = await userModel.findOne({ _id: item });
                if (userData?.appKey) {
                    appKey.push(userData.appKey);
                };
            };
            notificationObject.deviceTokens = appKey;
            console.log("-specific-");
        };

        if (req.body.usertype === 'all') {
            // let user = await this.getUser({ appKey: { $ne: '' } });
            let user = await userModel.find({ _id: req.body.uservalues });
            for (let memb of user) {
                appKey.push(memb.fcm_token);
            };
            notificationObject.deviceTokens = appKey;
            console.log("-all->");
        };

        await this.PushAllNotifications(notificationObject);
        return {
            success: true,
            message: "Notification sent successfully",
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message
        };
    };
};

exports.PushAllNotifications = async (params) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("params--all------->",params)
            const pushLoad = {
                title: params.title || '',
                body: params.message,
                type: params.type,
                image: params.image,
                android: {},
                data: {},

                notification: {
                    title: params.message,
                    image: params.image,
                    type: params.type,
                    android: {},
                    data: {},
                },
                data: {
                    title: params.message,
                    image: params.image,
                    type: params.type,
                },
            };
            console.log("---deviceTokens-->", params.deviceTokens);


            const tokenChunks = appUtils.splitArrayInToChunks(params.deviceTokens);

            if (2 === 2) {
                const promiseResult = [];
                for (let i = 0; i < tokenChunks.length; i++) {
                    const message = appUtils.formatDataForPush(pushLoad, tokenChunks[i]);
                    promiseResult.push(fcm.sendPush(message));
                };
                resolve(Promise.all(promiseResult));
            } else {
                return;
            };
        } catch (error) {
            console.log('error', error);
            reject(error);
        };
    });
};

