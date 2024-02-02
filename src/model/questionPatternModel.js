const mongoose = require('mongoose');

const patternSchema = new mongoose.Schema({
    pattern: {
        type: String,
    },
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const userType = mongoose.model("question_pattern", patternSchema);
module.exports = userType;