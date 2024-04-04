const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    BookId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    bookName: {
        type: String,
    },
    price: {
        type: Number,
    },
    authorName: {
        type: String,
    },
    bookLanguage: {
        type: String
    },
    is_purchase: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });


const cart = mongoose.model("cart_detail", cartSchema);
module.exports = cart;