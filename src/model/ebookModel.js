const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: false
    },
    authorName: {
        type: String,
        required: false
    },
    bookPdf: {
        type: String,
        required: false
    },
    bookImage: {
        type: String,
        required: false
    },
    category: {
        type: JSON,
        required: false
    },
    bookType: {
        type: JSON,
        required: false
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