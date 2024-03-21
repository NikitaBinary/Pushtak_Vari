const mongoose = require('mongoose');

const singupSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    emailId: {
        type: String,
    },
    mobileNo: {
        type: Number,
    },
    password: {
        type: String,
    },
    userType: {
        type: String,
    },
    otp: {
        type: String,
        default: ''
    },
    is_instituteUser: {
        type: Boolean,
    },
    userImage: {
        type: String,
    },
    instituteName: {
        type: String
    },
    is_active: {
        type: Boolean
    },
    createdBy: {
        type: String
    },
    studentList: {
        type: Array,
        default: null
    },
    studentCount: {
        type: Number,
    },
    instituteImage: {
        type: String
    },
    loginStatus: {
        type: Boolean
    },
    lastLoginDate: {
        type: Date
    },
    genre_prefernce: {
        type: Array,
        default: []
    },
    author_prefernce: {
        type: Array,
        default: []
    },
    mediaId: {
        type: String
    },
    mediaType: {
        type: String
    },
    fcm_token: {
        type: String
    },
    select_Subscription: {
        type: JSON,
    },
    ebookSubscription: {
        type: JSON,
    },
    language: {
        type: String
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const user = mongoose.model("users", singupSchema);
module.exports = user;