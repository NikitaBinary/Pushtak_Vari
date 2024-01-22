const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    subscriptionName: {
        type: String,
        required: true
    },
    duration: {
        type: JSON,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    features: {
        type: String,
        required: true
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