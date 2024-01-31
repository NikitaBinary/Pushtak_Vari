const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    language: {
        type: String,
    },
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const language = mongoose.model("ebooklanguage", languageSchema);
module.exports = language;