const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    bookPdf: {
        type: String,
        required: true
    },
    bookImage: {
        type: String,
        required: true
    },
    category: {
        type: JSON,
        required: true
    },
    bookType: {
        type: JSON,
        required: true
    },
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const eBook = mongoose.model("eBookDetail", ebookSchema);
module.exports = eBook;