const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
    instituteName: {
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
    studentCount: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true
    },
    studentList: {
        type: Array,
        default: []
    },
    otp: {
        type: String,
        default: ''
    },
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const institute = mongoose.model("institute", instituteSchema);
module.exports = institute;