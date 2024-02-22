const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    bookLanguage: {
        type: JSON
    },
    authorName: {
        type: String,
        required: true
    },
    co_authorName: {
        type: String,
    },
    publisher: {
        type: String,
    },
    bookPublishDate: {
        type: String
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
        required: true
    },
    bookType: {
        type: JSON,
        required: true
    },
    videoLink: {
        type: String,
        required: false
    },
    about: {
        type: String
    },
    price: {
        type: Number
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const eBook = mongoose.model("eBookDetail", ebookSchema);
module.exports = eBook;