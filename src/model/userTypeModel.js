const mongoose = require('mongoose');

const userTypeSchema = new mongoose.Schema({
    userType: {
        type: String,
    },
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const userType = mongoose.model("usertype_list", userTypeSchema);
module.exports = userType;