const mongoose = require("mongoose")
const purchase = require("../model/bookPurchaseModel");
const cart = require("../model/cartModel")
const ebook = require("../model/ebookModel");
const user = require("../model/userModel");

class AuthService {
    async addToPurchaseService(purchaseData) {
        try {
            const bookId = purchaseData.BookId
            const userId = purchaseData.userId
            const is_bookExists = await ebook.findOne({ _id: bookId })
            if (!is_bookExists) {
                return { message: "Book not exists." }
            }
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
    async updatePurchaseBookService(bookId, userId) {
        try {
            let bookPurchased
            const is_purchaseDetail = await purchase.findOne({
                BookId: new mongoose.Types.ObjectId(bookId),
                userId: new mongoose.Types.ObjectId(userId)
            })
            if (is_purchaseDetail) {
                bookPurchased = await purchase.findOneAndUpdate(
                    {
                        BookId: new mongoose.Types.ObjectId(bookId),
                        userId: new mongoose.Types.ObjectId(userId)
                    },
                    {
                        $set: {
                            is_purchase: true
                        }
                    },
                    { new: true }
                )
                if (bookPurchased) {
                    await ebook.findOneAndUpdate(
                        { _id: new mongoose.Types.ObjectId(is_purchaseDetail.BookId) },
                        {
                            $inc: {
                                userCount: 1,
                            }
                        },
                        { new: true }
                    )
                }
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
                return { bookPurchased }
            }
            if (!bookPurchased) {
                var cartPurchaseBook = await cart.findOneAndUpdate(
                    {
                        BookId: new mongoose.Types.ObjectId(bookId),
                        userId: new mongoose.Types.ObjectId(userId)
                    },
                    {
                        $set: {
                            is_purchase: true
                        }
                    },
                    { new: true }
                )
                if (cartPurchaseBook) {
                    await cart.findOneAndDelete(
                        {
                            BookId: new mongoose.Types.ObjectId(bookId),
                            userId: new mongoose.Types.ObjectId(userId)
                        },
                        { new: true }
                    )
                }
                return cartPurchaseBook
            }

        } catch (error) {
            throw error
        }
    }

    async multiplePurchaseBookService(purchaseBooks, userId) {
        try {
            if (purchaseBooks.length > 0) {
                const purchaseBookInfo = await cart.updateMany(
                    {
                        BookId: { $in: purchaseBooks },
                        userId: new mongoose.Types.ObjectId(userId)
                    },
                    {
                        $set: {
                            is_purchase: true
                        }
                    },
                    { new: true }
                )
                if (purchaseBookInfo) {
                    await cart.deleteMany(
                        {
                            BookId: { $in: purchaseBooks },
                            userId: new mongoose.Types.ObjectId(userId)
                        },
                        { new: true }
                    )
                }
                return purchaseBookInfo
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
                },
                {

                    $sort: { "updated_at": -1 }
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
            const userInfo = await user.findOne({
                _id: userId
            })
            if (!userInfo) {
                return { message: "User not found." }
            }
            const userLanguage = userInfo.language
          
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
                if (userLanguage) {
                    bookaggregate.push(
                        {
                            $match: {
                                'bookLanguage.language': userLanguage
                            }
                        }
                    )
                }
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
                        _id: 1, bookName: 1, authorName: 1, price: 1, bookImage: 1, overallRating: 1, reviewData: 1
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
                book.reviewData = ''
            });

            return { eBookList }


        } catch (error) {
            console.log("error------------->", error)
            throw error
        }

    }

    async progressbookService(userId) {
        try {

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
            const is_UserExist = await user.findOne({ _id: userId })
            if (!is_UserExist) {
                return { message: "User Not found" }
            }
            const is_BookExists = await purchase.findOne(
                {
                    userId: new mongoose.Types.ObjectId(userId)
                })
            if (!is_BookExists && is_UserExist.userType != "INSTITUTE_USER" ) {
                return { message: "User not purchase book" }
            } else {
                const user_lastUpdateBook = await purchase.findOne(
                    { userId: new mongoose.Types.ObjectId(userId), readingStatus: true }
                ).sort({ updated_at: -1 })
                    .limit(1);
                if (user_lastUpdateBook.BookId) {
                    var bookId = user_lastUpdateBook.BookId
                }
                let eBookList
                const bookaggregate = []

                if (bookId) {
                    bookaggregate.push(
                        {
                            $match: {
                                _id: new mongoose.Types.ObjectId(bookId),

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
                            _id: 1, bookName: 1, authorName: 1, price: 1, bookImage: 1, overallRating: 1, reviewData: 1, bookLanguage: 1
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
                    book.bookReadingStatus = is_BookExists.bookReadingStatus
                    book.reviewData = ''
                });

                return { eBookList }

            }

        } catch (error) {
            console.log("error------------->", error)
            throw error
        }
    }

    async updateBookStatusService(userId, bookId, totalPages, readPages, readingStatus) {
        try {
            const is_BookExist = await purchase.findOne(
                {
                    userId: new mongoose.Types.ObjectId(userId),
                    BookId: bookId,
                    is_purchase: true
                })
            if (!is_BookExist) {
                return { message: "Book not Purchase." }
            }
            let status = Number((readPages / totalPages) * 100)
            const readingStatusUpdate = await purchase.findOneAndUpdate(
                {
                    userId: new mongoose.Types.ObjectId(userId),
                    BookId: bookId,
                    is_purchase: true
                },
                {
                    $set: {
                        bookReadingStatus: status,
                        readingStatus: readingStatus
                    }
                },
                { new: true }
            )
            if (readingStatusUpdate) {
                await ebook.findOneAndUpdate(
                    { _id: bookId },
                    {
                        $set: {
                            readingPercent: status
                        }
                    },
                    { new: true }
                )
            }

            return readingStatusUpdate

        } catch (error) {
            console.log("error------------->", error)
            throw error
        }
    }

    async getMyBookService(userId) {
        try {
            const is_UserExist = await user.findOne({ _id: userId })
            if (!is_UserExist) {
                return { message: "User not found." }
            }

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
            const bookAggregate = []

            bookAggregate.push(
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
                        as: "eBookData"
                    }
                },
                {
                    $unwind: "$eBookData"
                },
                {
                    $lookup: {
                        from: 'review_lists',
                        localField: 'eBookData._id',
                        foreignField: 'bookId',
                        as: "reviewData"
                    }
                },
                // {
                //     $project: {
                //         _id: 1, bookName: 1, authorName: 1, bookImage: 1, overallRating: 1, reviewData: 1
                //     }
                // },
                {
                    $sort: { created_at: -1 }
                }
            )

            const myBookList = await purchase.aggregate(bookAggregate)

            myBookList.forEach(async (book) => {
                const reviews = book.reviewData;
                const { overallRating } = await calculateRatingStats(reviews);
                book.overallRating = Math.round(overallRating);
                book.bookReadingStatus = book.bookReadingStatus
                book.reviewData = ''
            });
            return myBookList

        } catch (error) {
            console.log("error------------->", error)
            throw error
        }
    }
}

module.exports = AuthService;
