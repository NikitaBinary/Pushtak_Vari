const mongoose = require("mongoose")
const purchase = require("../model/bookPurchaseModel");
const cart = require("../model/cartModel")
const ebook = require("../model/ebookModel");
const user = require("../model/userModel");
const bookStatus = require("../model/readingBookStatus")
const bookAccess_userCount = require("../model/bookAccessCount")

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
            let bookPurchased
            if (purchaseBooks.length > 0) {
                bookPurchased = await purchase.updateMany(
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
                if (bookPurchased) {
                    await ebook.updateMany(
                        { _id: { $in: purchaseBooks } },
                        {
                            $inc: {
                                userCount: 1,
                            }
                        },
                        { new: true }
                    )
                }

                if (bookPurchased) {
                    await cart.deleteMany(
                        {
                            BookId: { $in: purchaseBooks },
                            userId: new mongoose.Types.ObjectId(userId)
                        },
                        { new: true }
                    )
                }
                return bookPurchased
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
            const userInfo = await user.findOne({
                _id: userId
            })
            if (!userInfo) {
                return { message: "User not found." }
            }
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
            var userPurchaseInfo = await purchase.aggregate(aggregatePipe)

            const uniqueCategories = new Set();

            const uniqueArray = userPurchaseInfo.filter(item => {
                if (!uniqueCategories.has(item.catrgory)) {
                    uniqueCategories.add(item.catrgory);
                    return true;
                }
                return false;
            });

            const categories = uniqueArray.map(item => item.catrgory);

            const categoryName = [...new Set(categories)];

            let eBookList
            const bookaggregate = []

            if (categoryName) {
                bookaggregate.push(
                    {
                        $match: {
                            'category.categoryName': { $in: categoryName },
                            // 'category.categoryName': categoryName,
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
                        _id: 1, bookName: 1, category: 1, authorName: 1, price: 1, bookImage: 1, overallRating: 1, reviewData: 1
                    }
                },
                {
                    $sort: { created_at: -1 }
                }
            )

            eBookList = await ebook.aggregate(bookaggregate)

            const purchasedBooks = await purchase.find({ userId: userId, is_purchase: true });
            const purchasedBookIds = purchasedBooks.map(book => String(book.BookId));
            eBookList = eBookList.filter(book => !purchasedBookIds.includes(String(book._id)));


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
            const is_BookExists = await bookStatus.findOne(
                {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            )
            if (!is_BookExists && is_UserExist.userType == "REGULAR_USER") {
                return { message: "User not start to read any book" }
            }
            else if (!is_BookExists && is_UserExist.userType == "INSTITUTE_USER") {
                return { message: "User not start to read any book" }
            }
            else {
                const user_lastUpdateBook = await bookStatus.findOne(
                    { userId: new mongoose.Types.ObjectId(userId) }
                ).sort({ updated_at: -1 })
                    .limit(1);
                console.log("user_lastUpdateBook------------------>", user_lastUpdateBook)

                if (user_lastUpdateBook.books.bookId) {
                    var bookId = user_lastUpdateBook.books.bookId
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
                    book.readingPercent = user_lastUpdateBook.books.readingPercent
                    book.reviewData = ''
                });

                return { eBookList }

            }

        } catch (error) {
            console.log("error------------->", error)
            throw error
        }
    }

    async eBookGraphService(userId) {
        try {
            const userCountForEachBook = await bookStatus.aggregate([
                {
                    $group: {
                        _id: '$books.bookId',
                        bookName: { $first: '$books.bookName' },
                        userCount: { $addToSet: '$userId' },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        bookName: 1,
                        userCount: { $size: '$userCount' },
                    },
                },
                {
                    $sort: { userCount: -1 }
                },
                {
                    $limit: 10
                }
            ]);
            return userCountForEachBook
        } catch (error) {
            console.log("error------------->", error)
            throw error
        }
    }

    async updateBookStatusService(userId, bookId, totalPages, readPages, currentReading) {
        try {
            const bookInfo = await ebook.findOne({ _id: bookId })
            if (!bookInfo) {
                return { message: "This book not available" }
            }
            const userInfo = await user.findOne({ _id: userId }, { userType: 1, createdBy: 1 })
            if (!userInfo) {
                return { message: "User not found." }
            }
            // if (userInfo.userType === 'INSTITUTE_USER') {
            //     const bookAccessInfo = await bookAccess_userCount.findOne({ bookId: new mongoose.Types.ObjectId(bookId) });
            //     if (!bookAccessInfo) {
            //         // Create a new entry if book access info doesn't exist
            //         console.log("currentReading----------->", currentReading)
            //         await bookAccess_userCount.create({
            //             bookId: bookId,
            //             subscribeUserCount: 10,
            //             accessUserCount: 1,
            //             currentReading: currentReading,
            //             readingUsers: currentReading == 'true' ? [userId] : [] // Initialize readingUsers array with userId if currently reading
            //         });
            //     } else {
            //         if (currentReading == 'false') {
            //             // Remove userId from readingUsers array when user stops reading
            //             await bookAccess_userCount.findOneAndUpdate(
            //                 {
            //                     bookId: new mongoose.Types.ObjectId(bookId),
            //                     accessUserCount: { $gt: 0 }
            //                 },
            //                 { $addToSet: { readingUsers: userId }, $inc: { accessUserCount: 1 } },
            //                 // { $pull: { readingUsers: userId }, $inc: { accessUserCount: -1 } },
            //                 { new: true }
            //             );
            //         } else {
            //             if (bookAccessInfo.accessUserCount <= bookAccessInfo.subscribeUserCount && bookAccessInfo.readingUsers.includes(userId)) {
            //                 console.log("Currently reading users:", bookAccessInfo.readingUsers);
            //                 console.log("user already reading book")
            //             }
            //             else {
            //                 if (bookAccessInfo.accessUserCount < bookAccessInfo.subscribeUserCount) {
            //                     // Use $addToSet to add userId to readingUsers array if not already present
            //                     await bookAccess_userCount.findOneAndUpdate(
            //                         { bookId: new mongoose.Types.ObjectId(bookId) },
            //                         { $addToSet: { readingUsers: userId }, $inc: { accessUserCount: 1 } },
            //                         { new: true }
            //                     );
            //                 }
            //                 else {
            //                     return { message: "Access limit exceeded. Please purchase the book license." };
            //                 }
            //             }
            //         }
            //     }

            // }


            if (userInfo.userType === 'INSTITUTE_USER') {
                const bookAccessInfo = await bookAccess_userCount.findOne({ bookId: new mongoose.Types.ObjectId(bookId) });

                if (!bookAccessInfo) {
                    // Create a new entry if book access info doesn't exist
                    await bookAccess_userCount.create({
                        bookId: bookId,
                        subscribeUserCount: 10,
                        accessUserCount: 1,
                        currentReading: currentReading,
                        readingUsers: currentReading == 'true' ? [userId] : [] // Initialize readingUsers array with userId if currently reading
                    });
                } else {
                    if (currentReading == 'false') {
                        console.log("come in falseeee")
                        await bookAccess_userCount.findOneAndUpdate(
                            {
                                bookId: new mongoose.Types.ObjectId(bookId),
                                accessUserCount: { $gt: 0 }
                            },
                            { $pull: { readingUsers: userId }, $inc: { accessUserCount: -1 } },
                            { new: true }
                        );
                    } else {

                        if (bookAccessInfo.accessUserCount <= bookAccessInfo.subscribeUserCount && bookAccessInfo.readingUsers.includes(userId)) {
                            console.log("Currently reading users:", bookAccessInfo.readingUsers);
                            console.log("user already reading book")
                        }
                        else {
                            if (bookAccessInfo.accessUserCount < bookAccessInfo.subscribeUserCount) {
                                if (!bookAccessInfo.readingUsers || !bookAccessInfo.readingUsers.includes(userId)) {
                                    // If not reading, increment access count and add userId to readingUsers array
                                    await bookAccess_userCount.findOneAndUpdate(
                                        { bookId: new mongoose.Types.ObjectId(bookId) },
                                        { $addToSet: { readingUsers: userId }, $inc: { accessUserCount: 1 } },
                                        // { $push: { readingUsers: userId }, $inc: { accessUserCount: 1 } },
                                        { new: true }
                                    );
                                }
                            }
                            else {
                                return { message: "Access limit exceeded. Please purchase the book license." };
                            }
                        }
                    }
                }
            }


            let status = Math.min(Number((readPages / totalPages) * 100), 100);

            let readingInfo
            if (userInfo.userType == 'REGULAR_USER') {
                const is_BookExist = await purchase.findOne(
                    {
                        userId: new mongoose.Types.ObjectId(userId),
                        BookId: bookId,
                        is_purchase: true
                    })
                if (!is_BookExist) {
                    return { message: "User not purchase this book." }
                }
                const is_userBookExists = await bookStatus.findOne(
                    {
                        userId: new mongoose.Types.ObjectId(userId),
                        'books.bookId': new mongoose.Types.ObjectId(bookId)
                    }
                )
                if (!is_userBookExists) {
                    let bookObj = {
                        books:
                        {
                            bookId: bookId,
                            bookName: bookInfo.bookName,
                            readingPercent: status,
                            bookProgress: status == 100 ? 'Complete' : 'Incomplete',
                            lastReadPage: readPages || 1
                        },
                        userId: userId
                    }
                    readingInfo = await bookStatus.create(bookObj)
                }
                else {
                    let lastReadPage = is_userBookExists.books.lastReadPage || 0;
                    if (readPages > lastReadPage) {
                        if (status > is_userBookExists.books.readingPercent) {

                            readingInfo = await bookStatus.findOneAndUpdate(
                                {
                                    userId: new mongoose.Types.ObjectId(userId),
                                    'books.bookId': new mongoose.Types.ObjectId(bookId)
                                },
                                {
                                    $set: {
                                        'books.readingPercent': status,
                                        'books.bookProgress': status == 100 ? 'Complete' : 'Incomplete',
                                        'books.bookName': bookInfo.bookName,
                                        'books.lastReadPage': readPages
                                    }
                                },
                                { new: true }
                            )
                        }
                        else {
                            readingInfo = await bookStatus.findOne(
                                {
                                    userId: new mongoose.Types.ObjectId(userId),
                                    'books.bookId': new mongoose.Types.ObjectId(bookId),
                                },
                            )
                        }
                    }
                    else {
                        readingInfo = await bookStatus.findOne(
                            {
                                userId: new mongoose.Types.ObjectId(userId),
                                'books.bookId': new mongoose.Types.ObjectId(bookId),
                            },
                        )
                    }
                }
            }

            if (userInfo.userType == 'INSTITUTE_USER') {
                const is_userBookExists = await bookStatus.findOne(
                    {
                        userId: new mongoose.Types.ObjectId(userId),
                        'books.bookId': new mongoose.Types.ObjectId(bookId)
                    }
                )
                if (!is_userBookExists) {
                    let bookObj = {
                        books:
                        {
                            bookId: bookId,
                            bookName: bookInfo.bookName,
                            readingPercent: status,
                            bookProgress: status == 100 ? 'Complete' : 'Incomplete',
                            lastReadPage: readPages || 1
                        },
                        userId: userId
                    }
                    readingInfo = await bookStatus.create(bookObj)
                }
                else {
                    let lastReadPage = is_userBookExists.books.lastReadPage;
                    if (readPages > lastReadPage) {
                        if (status > is_userBookExists.books.readingPercent) {
                            readingInfo = await bookStatus.findOneAndUpdate(
                                {
                                    userId: new mongoose.Types.ObjectId(userId),
                                    'books.bookId': new mongoose.Types.ObjectId(bookId)
                                },
                                {
                                    $set: {
                                        'books.readingPercent': status,
                                        'books.bookProgress': status == 100 ? 'Complete' : 'Incomplete',
                                        'books.bookName': bookInfo.bookName,
                                        'books.lastReadPage': readPages
                                    }
                                },
                                { new: true }
                            )
                        }
                        else {
                            readingInfo = await bookStatus.findOne(
                                {
                                    userId: new mongoose.Types.ObjectId(userId),
                                    'books.bookId': new mongoose.Types.ObjectId(bookId),
                                },
                            )
                        }
                    }
                    else {
                        readingInfo = await bookStatus.findOne(
                            {
                                userId: new mongoose.Types.ObjectId(userId),
                                'books.bookId': new mongoose.Types.ObjectId(bookId),
                            },
                        )
                    }
                }
            }
            return { readingInfo }

        } catch (error) {
            console.log("error------------->", error)
            throw error
        }
    }

    async getMyBookService(userId) {
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
                return { message: "User not found." }
            }
            let myBookList
            const bookAggregate = []
            bookAggregate.push(
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                    }
                },
                {
                    $lookup: {
                        from: 'ebookdetails',
                        localField: 'books.bookId',
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
                {
                    $sort: { updated_at: -1 }
                }
            )
            myBookList = await bookStatus.aggregate(bookAggregate)

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

    async getlastBookProgressService(userId, bookId) {
        try {
            const bookDetail = await bookStatus.findOne(
                {
                    userId: new mongoose.Types.ObjectId(userId),
                    'books.bookId': new mongoose.Types.ObjectId(bookId),
                }
            )
            if (!bookDetail) {
                return { message: "User not start reading book" }
            }
            else {
                return bookDetail
            }
        } catch (error) {
            console.log("error------------->", error)
            throw error
        }
    }
}

module.exports = AuthService;
