const mongoose = require("mongoose")
const purchase = require("../model/bookPurchaseModel");
const cart = require("../model/cartModel")
const ebook = require("../model/ebookModel")

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

    async getMoreItemService(userId) {
        try {
            const aggregatePipe = []
            aggregatePipe.push(
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        is_purchase: true
                    }
                },
                {
                    $lookup: {
                        from: 'ebookdetails',
                        localField: 'BookId',
                        foreignField: '_id',
                        as: 'ebookDetail'
                    }
                },
                {
                    $addFields: {
                        ebookDetail: { $arrayElemAt: ["$ebookDetail", 0] }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        catrgory: '$ebookDetail.category.categoryName'
                    }
                }
            )
            const userPurchaseInfo = await purchase.aggregate(aggregatePipe)

            function removeDuplicates(array, property) {
                return array.filter((obj, index, self) =>
                    index === self.findIndex((t) => (
                        t[property] === obj[property]
                    ))
                );
            }

            const uniqueData = removeDuplicates(userPurchaseInfo, "category");

            let categoryName
            uniqueData.forEach((ele) => {
                categoryName = ele.catrgory
            })

            async function calculateRatingStats(reviews) {
                if (reviews.length === 0) return { ratingStats: [], overallRating: 0 };

                let totalRating = 0;
                const ratingCounts = Array(5).fill(0);

                reviews.forEach(review => {
                    totalRating += review.rating;
                    ratingCounts[review.rating - 1]++;
                });
                const totalReviews = reviews.length;
                const overallRating = totalReviews > 0 ? (totalRating / totalReviews) * 20 : 0;

                return { overallRating };
            }
            let eBookList
            const bookaggregate = []

            if (categoryName) {
                bookaggregate.push(
                    {
                        $match: {
                            'category.categoryName': categoryName,
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )
            }
            bookaggregate.push(
                {
                    $lookup: {
                        from: 'review_lists',
                        localField: '_id',
                        foreignField: 'bookId',
                        as: "reviewData"
                    }
                },
                {
                    $project: {
                        _id: 1, bookName: 1, authorName: 1, price: 1, bookImage: 1,overallRating: 1, reviewData: 1
                    }
                },
                {
                    $sort: { created_at: -1 }
                }
            )

            eBookList = await ebook.aggregate(bookaggregate)
            eBookList.forEach(async (book) => {
                const reviews = book.reviewData;
                const { overallRating } = await calculateRatingStats(reviews);
                book.overallRating = Math.round(overallRating);
            });

            return { eBookList }


        } catch (error) {
            console.log("error------------->", error)
            throw error
        }

    }
}

module.exports = AuthService;
