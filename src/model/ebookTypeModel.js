const mongoose = require('mongoose');

const ebookTypeSchema = new mongoose.Schema({
    ebookType: {
        type: String,
    },
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const ebooktype = mongoose.model("ebooktype", ebookTypeSchema);
module.exports = ebooktype;