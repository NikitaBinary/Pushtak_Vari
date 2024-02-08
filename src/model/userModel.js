const mongoose = require('mongoose');

const singupSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
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
        default: ''
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