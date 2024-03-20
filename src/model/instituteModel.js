const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
    instituteName: {
        type: String,
        required: false
    },
    emailId: {
        type: String,
        required: false
    },
    mobileNo: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false
    },
    select_Subscription: {
        type: JSON,
    },
    studentCount: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: false
    },
    studentList: {
        type: Array,
        default: []
    },
    otp: {
        type: String,
        default: ''
    },
    instituteImage: {
        type: String,
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