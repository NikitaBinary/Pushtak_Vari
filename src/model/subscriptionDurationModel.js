const mongoose = require('mongoose');

const subscriptionDurationSchema = new mongoose.Schema({
    duration: {
        type: String,
    },
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const subscriptionDuration = mongoose.model("subscriptionDuration", subscriptionDurationSchema);
module.exports = subscriptionDuration;