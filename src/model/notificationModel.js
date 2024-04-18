const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    notificationTitle: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    notificationType: {
        type: String,
        required: true
    },
    userType: {
        type: JSON,
        required: true
    },
    imageUrl: {
        type: String
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const notification = mongoose.model("notification_list", notificationSchema);
module.exports = notification;