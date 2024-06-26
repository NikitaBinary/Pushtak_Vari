const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: false
    },
    bookLanguage: {
        type: JSON
    },

    authorName: {
        type: String,
        required: false
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
        type: Array,
        default: []
    },
    category: {
        type: Array,
        required: false,
        default: []
    },
    bookType: {
        type: JSON,
        required: false
    },
    videoLink: {
        type: Array,
        default: []
    },
    about: {
        type: String
    },
    price: {
        type: Number
    },
    is_selected: {
        type: Boolean,
        default: false
    },
    userCount: {
        type: Number
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });

ebookSchema.index({ bookName: "text", authorName: "text" });

const eBook = mongoose.model("eBookDetail", ebookSchema);
module.exports = eBook;