const FCM = require('fcm-node');
require('dotenv').config()

const fcmServerKey = process.env.Server_Key; // put your server key here
const fcm = new FCM(fcmServerKey);
// const message = {
//     to: 'fxhSGUOSOUrUtGwnWj7n7h:APA91bFab_a6BgpsaTMOnWxw431bdkzwdr3X1SWtK8q3m6fvVRUvEqlyEcTEk2ShZBDAS84sLPIGprRjWDPbht4BTjsVYGQpGK8GTQuSyBxmWAFmBRczLOtft0z9_jjo2ByCv8YuApgA',
//     notification: {
//         title: 'Notification Title',
//         body: 'Notification Body',
//     },
// };
// fcm.send(message, (a, b) => {
//     console.log("a-------->", a)
//     console.log("b-------->", b)

// })
let fcm_fun = {
    sendPush: async (message) => {
        return new Promise((resolve, reject) => {
            try {
                fcm.send(message, function (error, response) {
                    if (error) {
                        console.log(error);
                        resolve(error);
                    } else {
                        console.log("---push---notificatrion--sucess--", response)
                        resolve(response);
                    };
                });
            } catch (error) {
                reject(error);
            }
        });
    },
    subscribeToTopic: async (deviceIds, payload) => {
        return new Promise((resolve, reject) => {
            try {
                fcm.subscribeToTopic(deviceIds, 'some_topic_name', (err, res) => {
                    console.log(err, res);
                });
            } catch (error) {
                reject(error);
            }
        });
    },
    unsubscribeToTopic: async (deviceIds, payload) => {
        return new Promise((resolve, reject) => {
            try {
                fcm.unsubscribeToTopic(deviceIds, 'some_topic_name', (err, res) => {
                    console.log(err, res);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = fcm_fun;