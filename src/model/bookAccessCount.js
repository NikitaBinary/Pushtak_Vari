const mongoose = require('mongoose');

const bookAccessSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    accessUserCount: {
        type: Number
    },
    subscribeUserCount: {
        type: Number
    },
    currentReading: {
        type: Boolean,
    },
    readingUsers: {
        type: Array
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });


const bookAccess_userCount = mongoose.model("bookAccess_userCount", bookAccessSchema);
module.exports = bookAccess_userCount;