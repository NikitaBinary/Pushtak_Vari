const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
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


const purchase = mongoose.model("bookPurchase_detail", purchaseSchema);
module.exports = purchase;