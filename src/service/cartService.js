const mongoose = require("mongoose")
const cart = require("../model/cartModel");
const ebook = require("../model/ebookModel")
const purchase = require("../model/bookPurchaseModel")
const user = require("../model/userModel")

class AuthService {
    async addBookToCartService(cartBody) {
        try {
            const bookId = cartBody.BookId
            const userId = cartBody.userId

            const userInfo = await user.findOne({ _id: userId })
            if (userInfo.userType == 'REGULAR_USER') {
                var cartDetail = await cart.findOne(
                    {
                        BookId: new mongoose.Types.ObjectId(bookId),
                        userId: new mongoose.Types.ObjectId(userId)
                    }
                )
                if (!cartDetail) {
                    cartDetail = await cart.create(cartBody)
                    if (cartDetail) {
                        await purchase.create(cartDetail)
                    }
                }
            }
            var cartDetail = await cart.findOne(
                {
                    BookId: new mongoose.Types.ObjectId(bookId),
                    userId: new mongoose.Types.ObjectId(userId)
                }
            )
            if (!cartDetail) {
                cartDetail = await cart.create(cartBody)
                if (cartDetail) {
                    await purchase.create(cartBody)
                }
            }
            return cartDetail

        } catch (error) {
            console.log("errorr------->", error)
            throw error
        }
    }

    async cartBookListService(userId) {
        try {
            if (userId) {

                const aggregatePipe = [
                    {
                        $match: {
                            userId: new mongoose.Types.ObjectId(userId)
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
                            bookImage: "$bookDetail.bookImage",
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
                            category: 1
                        }
                    }
                ]
                const cartList = await cart.aggregate(aggregatePipe)


                return cartList
            }

        } catch (error) {
            throw error
        }
    }

    async deleteCartBookService(_id) {
        try {
            let cartbookInfo = await cart.findOne({ userId: _id });
            if (cartbookInfo) {
                var cartBookData = await cart.findOneAndDelete({ _id });
                return cartBookData
            }
            return { message: "Cart book not found" }
        } catch (error) {
            throw error;
        }
    }

}

module.exports = AuthService;