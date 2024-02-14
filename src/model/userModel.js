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
    activeStatus: {
        type: Boolean,
        default: true
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
    studentList: {
        type: Array,
        default: null
    },
    instituteImage: {
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