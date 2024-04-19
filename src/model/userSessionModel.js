const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    email: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    userName:{
        type: String,
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const sessionModel = mongoose.model("Session", sessionSchema);
module.exports = sessionModel;