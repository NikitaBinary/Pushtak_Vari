const mongoose = require("mongoose")
const ebookType = require("../model/ebookTypeModel");
const eBook = require("../model/ebookModel")
const category = require("../model/categoryModel")
const language = require("../model/ebookLanguageModel")
const review = require("../model/reviewModel");
const user = require("../model/userModel")


class AuthService {
    async addEbookTypeService(ebookBody) {
        try {
            const ebookTypeInfo = await ebookType.create(ebookBody);
            return ebookTypeInfo

        } catch (error) {
            throw error;
        }
    }
    async ebookTypeListService() {
        try {
            const ebookTypeList = await ebookType.find()
            return ebookTypeList
        } catch (error) {
            throw error;
        }
    }
    async ebooklanguageListService() {
        try {
            const ebooklanguageList = await language.find()
            return ebooklanguageList
        } catch (error) {
            throw error;
        }
    }

    async createEbookService(ebookData, imageUrl, pdfUrl) {
        try {
            const categoryData = await category.findById({ _id: ebookData.category }, { _id: 1, categoryName: 1 })
            const bookType = await ebookType.findById({ _id: ebookData.bookType }, { _id: 1, ebookType: 1 })
            const bookLanguage = await language.findById({ _id: ebookData.bookLanguage }, { _id: 1, language: 1 })

            ebookData.category = categoryData
            ebookData.bookType = bookType
            ebookData.bookLanguage = bookLanguage

            const eBookDetail = await eBook.create({
                ...ebookData,
                bookImage: imageUrl,
                bookPdf: pdfUrl
            });
            return eBookDetail
        } catch (error) {
            throw error;
        }
    }

    async updateEbookService(_id, dataBody, ImageUrl, pdfUrl) {
        try {
            if (ImageUrl || pdfUrl) {
                dataBody.bookImage = ImageUrl;
                dataBody.bookPdf = pdfUrl;
            }
            if (dataBody.category) {
                const categoryData = dataBody.category ? await category.findById(dataBody.category, { _id: 1, categoryName: 1 }) : null;
                dataBody.category = categoryData;

            }
            if (dataBody.bookType) {
                const bookType = dataBody.bookType ? await ebookType.findById(dataBody.bookType, { _id: 1, ebookType: 1 }) : null;
                dataBody.bookType = bookType;

            }
            if (dataBody.bookLanguage) {
                const bookLanguage = dataBody.bookLanguage ? await language.findById(dataBody.bookLanguage, { _id: 1, language: 1 }) : null;
                dataBody.bookLanguage = bookLanguage;
            }
            let eBookDetail = await eBook.findOne({ _id: _id });
            let eBookInfo = await eBook.findOneAndUpdate({ _id: _id }, dataBody, { new: true });
            return { eBookDetail, eBookInfo };
        } catch (error) {
            throw error;
        }

    }
    async deleteEbookService(_id) {
        try {
            let eBookInfo = await eBook.findOne({ _id: _id });
            if (eBookInfo) {
                var eBookdata = await eBook.findOneAndDelete({ _id });
                return eBookdata
            }
            return { message: "E-Book not found" }
        } catch (error) {
            throw error;
        }
    }
    async getEbookListService() {
        try {
            const eBookList = await eBook.find()
            return eBookList
        } catch (error) {
            throw error;
        }
    }
    async getEbookInfoService(_id) {
        try {
            let eBookDetail = await eBook.findOne({ _id: _id });
            if (eBookDetail) {
                var eBookInfo = await eBook.findOne({ _id: _id }, {});
            }
            return { eBookDetail, eBookInfo }
        } catch (error) {
            throw error;
        }
    }

    async getAppEbookListService(category, language, userId) {
        const id = new mongoose.Types.ObjectId(userId)
        const userInfo = await user.findOne({ _id: id })


        function calculateRatingStats(reviews) {
            if (reviews.length === 0) return { ratingStats: [], overallRating: 0 };

            let totalRating = 0;
            const ratingCounts = Array(5).fill(0);

            reviews.forEach(review => {
                totalRating += review.rating;
                ratingCounts[review.rating - 1]++;
            });

            const totalReviews = reviews.length;
            const ratingStats = ratingCounts.map((count, index) => ({
                rating: index + 1,
                count,
                percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0
            }));

            const overallRating = totalReviews > 0 ? (totalRating / totalReviews) * 20 : 0;

            return { ratingStats, overallRating };
        }
        try {
            if (category || language) {

                var categoryPipe = []
                categoryPipe.push(
                    {
                        $match: {
                            'category.categoryName': category,
                            'bookLanguage.language': language,
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )
                categoryPipe.push(
                    {
                        $lookup: {
                            from: 'review_lists',
                            localField: '_id',
                            foreignField: 'bookId',
                            as: "reviewData"
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )

                var categoryWiseBookList = await eBook.aggregate(categoryPipe);

                categoryWiseBookList.forEach(book => {
                    const reviews = book.reviewData;
                    const { ratingStats, overallRating } = calculateRatingStats(reviews);
                    book.ratings = ratingStats;
                    book.overallssssRating = Math.round(overallRating);
                    book.reviewUserCount = book.reviewData.length
                    book.reviewData = reviews
                });
            }
            const condition = {}
            const newAggregatePipe = []

            if (userInfo.genre_prefernce.length > 0) {
                var genreCategory = userInfo.genre_prefernce
                condition['category.categoryName'] = { $in: genreCategory };
            }
            if (userInfo.genre_prefernce.length > 0) {
                var authorCategory = userInfo.author_prefernce
                condition.authorName = { $in: authorCategory };
            }

            if (language) {
                console.log('comee elseee')
                condition['bookLanguage.language'] = language;
            }
            if (typeof condition === 'object' && Object.keys(condition).length > 0 || limit) {
                newAggregatePipe.push(
                    {
                        $match: condition
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )
                newAggregatePipe.push(
                    {
                        $lookup: {
                            from: 'review_lists',
                            localField: '_id',
                            foreignField: 'bookId',
                            as: "reviewData"
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )
            }
            else {
                newAggregatePipe.push(
                    {
                        $match: {
                            'bookLanguage.language': language
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )
                newAggregatePipe.push(
                    {
                        $lookup: {
                            from: 'review_lists',
                            localField: '_id',
                            foreignField: 'bookId',
                            as: "reviewData"
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )
            }
            const newlyAddedBookList = await eBook.aggregate(newAggregatePipe);


            newlyAddedBookList.forEach(book => {
                const reviews = book.reviewData;
                const { ratingStats, overallRating } = calculateRatingStats(reviews);
                book.ratings = ratingStats;
                book.overallRating = Math.round(overallRating);
                book.reviewUserCount = book.reviewData.length
                book.reviewData = reviews
            });

            const otherAggregatePipe = []
            if (language) {
                otherAggregatePipe.push(
                    {
                        $match: {
                            'category.categoryName': "Other Book",
                            'bookLanguage.language': language,
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                )
            }

            otherAggregatePipe.push(
                {
                    $lookup: {
                        from: 'review_lists',
                        localField: '_id',
                        foreignField: 'bookId',
                        as: "reviewData"
                    }
                },
                {
                    $sort: { created_at: -1 }
                }
            )
            const otherBookList = await eBook.aggregate(otherAggregatePipe)

            otherBookList.forEach(book => {
                const reviews = book.reviewData;
                const { ratingStats, overallRating } = calculateRatingStats(reviews);
                book.ratings = ratingStats;
                book.overallRating = Math.round(overallRating);
                book.reviewUserCount = book.reviewData.length
                book.reviewData = reviews
            });

            return { categoryWiseBookList, newlyAddedBookList, otherBookList }

        } catch (error) {
            throw error;
        }
    }

    async addReviewService(reviewBody) {
        try {
            const reviewInfo = await review.create(reviewBody);
            const id = reviewInfo.userId
            if (reviewInfo) {
                const userData = await user.findOne({ _id: id })
                const reviewInfo = await review.create(reviewBody);
                const reviewId = reviewInfo._id
                if (userData) {
                    const image = userData.userImage
                    const userName = userData.fullName
                    const updateData = await review.updateMany(
                        { _id: reviewId },
                        {
                            $set: {
                                userImage: image,
                                userName: userName
                            }
                        },
                        {
                            new: true
                        }
                    )
                    console.log("updateData----------------->", updateData)

                }

            }
            return reviewInfo

        } catch (error) {
            throw error;
        }
    }

    async eBookInfoService(_id) {
        try {

            let eBookDetail = await eBook.findOne({ _id: new mongoose.Types.ObjectId(_id) });
            if (eBookDetail) {
                const pipeLine = []

                pipeLine.push({ $match: { _id: new mongoose.Types.ObjectId(_id) } },
                    {
                        $lookup: {
                            from: "review_lists",
                            localField: "_id",
                            foreignField: "bookId",
                            as: "reviews"
                        }
                    })
                var eBookInfo = await eBook.aggregate(pipeLine);
            }
            return { eBookDetail, eBookInfo }
        } catch (error) {
            throw error;
        }
    }

    async exploreBookListService(pageSize, page, searchText) {
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
            let eBookList
            const bookaggregate = []

            if (searchText) {
                bookaggregate.push(
                    {
                        $match: {
                            $text: { $search: searchText }
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
                        _id: 1, bookName: 1, authorName: 1, price: 1, bookImage: 1, reviewData: 1
                    }
                },
                {
                    $sort: { created_at: -1 }
                }
            )

            eBookList = await eBook.aggregate(bookaggregate)
            eBookList.forEach(async (book) => {
                const reviews = book.reviewData;
                const { overallRating } = await calculateRatingStats(reviews);
                book.overallRating = Math.round(overallRating);
            });

            return { eBookList }
        } catch (error) {
            throw error;
        }

    }

    async languageListService() {
        try {
            const languageList = await language.find({}, { _id: 1, language: 1 })
            return languageList
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService;