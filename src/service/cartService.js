const mongoose = require("mongoose")
const cart = require("../model/cartModel");
const ebook = require("../model/ebookModel")

class AuthService {
    async addBookToCartService(cartBody) {
        try {
            const bookId = cartBody.BookId
            const userId = cartBody.userId

            var cartDetail = await cart.findOne(
                {
                    BookId: new mongoose.Types.ObjectId(bookId),
                    userId: new mongoose.Types.ObjectId(userId)
                }
            )
            if (!cartDetail) {
                cartDetail = await cart.create(cartBody)
            }
            return cartDetail

        } catch (error) {
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
            let cartbookInfo = await cart.findOne({ _id: _id });
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