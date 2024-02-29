const mongoose = require("mongoose")
const purchase = require("../model/bookPurchaseModel");

class AuthService {
    async addToPurchaseService(purchaseDetail) {
        try {
            // const bookId = cartBody.BookId
            // const userId = cartBody.userId
            // if (bookId && userId) {
            //     var cartDetail = await purchase.findOne(
            //         {
            //             BookId: new mongoose.Types.ObjectId(bookId),
            //             userId: new mongoose.Types.ObjectId(userId)
            //         }
            //     )
            //     return cartDetail
            // }
            // else {
            purchaseDetail = await purchase.create(purchaseDetail)
            return purchaseDetail
            // }

        } catch (error) {
            throw error
        }
    }
}

module.exports = AuthService;