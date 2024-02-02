const mongoose = require('mongoose');

const notyTypeSchema = new mongoose.Schema({
    type: {
        type: String,
    },
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const notyType = mongoose.model("notification_type", notyTypeSchema);
module.exports = notyType;