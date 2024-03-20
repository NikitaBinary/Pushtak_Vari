const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    subscriptionName: {
        type: String,
        required: false
    },
    duration: {
        type: JSON,
        required: false
    },
    rate: {
        type: Number,
        required: false
    },
    features: {
        type: String,
        required: false
    },
    no_of_Users: {
        type: Number,
        required: false
    },
    no_of_Books: {
        type: Number,
        required: false
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const subscription = mongoose.model("subscription", subscriptionSchema);
module.exports = subscription;