const mongoose = require('mongoose');

const readingBookSchema = new mongoose.Schema({
    books:
    {
        bookId: {
            type: mongoose.Schema.Types.ObjectId
        },
        bookName: {
            type: String
        },
        readingPercent: {
            type: Number
        },
        bookProgress: {
            type: String,
            enum: ['Incomplete', 'Complete'],
            default: 'Incomplete'
        }
    }
    ,
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },

},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    });


const readingStatus = mongoose.model("readingBookStatus", readingBookSchema);
module.exports = readingStatus;