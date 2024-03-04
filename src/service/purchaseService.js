const mongoose = require("mongoose")
const purchase = require("../model/bookPurchaseModel");
const cart = require("../model/cartModel")

class AuthService {
    async addToPurchaseService(purchaseData) {
        try {
            const bookId = purchaseData.BookId
            const userId = purchaseData.userId
            var purchaseDetail = await purchase.findOne(
                {
                    BookId: new mongoose.Types.ObjectId(bookId),
                    userId: new mongoose.Types.ObjectId(userId)
                }
            )
            if (!purchaseDetail) {
                purchaseDetail = await purchase.create(purchaseData)
            }
            return purchaseDetail

        } catch (error) {
            throw error
        }
    }
    async updatePurchaseBookService(id) {
        try {
            const is_purchaseDetail = await purchase.findOne({ _id: new mongoose.Types.ObjectId(id) })
            if (is_purchaseDetail) {
                const bookPurchased = await purchase.findOneAndUpdate(
                    { _id: new mongoose.Types.ObjectId(id) },
                    {
                        $set: {
                            is_purchase: true
                        }
                    },
                    { new: true }
                )

                if (bookPurchased) {
                    const bookId = bookPurchased.BookId
                    const userId = bookPurchased.userId
                    if (bookId && userId) {
                        await cart.findOneAndDelete(
                            {
                                BookId: new mongoose.Types.ObjectId(bookId),
                                userId: new mongoose.Types.ObjectId(userId)
                            }
                        )
                    }
                }
                return bookPurchased
            }
            else {
                return { message: "Purchase detail not found." }
            }
        } catch (error) {
            throw error
        }
    }

    async getPurchaseHistoryService(userId) {
        try {
            const id = new mongoose.Types.ObjectId(userId)
            const aggregatePipe = [
                {
                    $match: {
                        userId: id,
                        is_purchase: true
                    }
                },
                {
                    $lookup: {
                        from: 'ebookdetails',
                        localField: 'BookId',
                        foreignField: '_id',
                        as: "bookDetail"
                    }
                },
                {
                    $unwind: "$bookDetail"
                },
                {
                    $project: {
                        _id: 1,
                        BookId: 1,
                        bookName: 1,
                        price: 1,
                        authorName: 1,
                        bookLanguage: 1,
                        is_purchase: 1,
                        userId: 1,
                        created_at: 1,
                        updated_at: 1,
                        bookImage: "$bookDetail.bookImage"
                    }
                }
            ]
            const purchaseBookList = await purchase.aggregate(aggregatePipe)
            // console.log("purchaseBookList------------->", purchaseBookList)


            return purchaseBookList

        } catch (error) {
            console.log("error------------->", error)
            throw error
        }
    }
}

module.exports = AuthService;
