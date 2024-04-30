const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    bookName: {
        type: String,
    },
    authorName: {
        type: String,
    },
    bookImage: {
        type: Array,
        default: []
    },
    co_authorName: {
        type: String,
    },
    publisher: {
        type: String,
    },
    bookLanguage: {
        type: JSON
    },
    
    bookPublishDate: {
        type: String
    },
    bookPdf: {
        type: String,
        required: false
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


const test = mongoose.model("test_list", testSchema);
module.exports = test;