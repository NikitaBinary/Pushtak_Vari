const mongoose = require("mongoose")
const ebookType = require("../model/ebookTypeModel");
const eBook = require("../model/ebookModel")
const category = require("../model/categoryModel")
const language = require("../model/ebookLanguageModel")
const review = require("../model/reviewModel");


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
                dataBody.bookImage = ImageUrl
                dataBody.bookPdf = pdfUrl
            }
            let eBookDetail = await eBook.findOne({ _id: _id });
            let eBookInfo = await eBook.findOneAndUpdate({ _id: _id }, dataBody, { new: true });
            return { eBookDetail, eBookInfo }
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

    async getAppEbookListService(category, language) {
        try {


            if (category || language) {

                let categoryPipe = [
                    {
                        $match: {
                            'category.categoryName': category,
                            'bookLanguage.language': language,
                        }
                    },
                    {
                        $lookup: {
                            from: "review_lists",
                            let: { bookId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$bookId", "$$bookId"] }
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$rating",
                                        count: { $sum: 1 },
                                        reviews: { $push: "$$ROOT" }
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        totalReviews: { $sum: "$count" },
                                        ratings: {
                                            $push: {
                                                rating: "$_id",
                                                count: "$count",
                                                percentage: { $multiply: [{ $divide: ["$count", "$totalReviews"] }, 100] }
                                            }
                                        },
                                        reviews: { $push: "$reviews" }
                                    }
                                }
                            ],
                            as: "reviewData"
                        }
                    },
                    {
                        $unwind: '$reviewData'
                    },
                    {
                        $addFields: {
                            "overallRating": {
                                $reduce: {
                                    input: "$reviewData.ratings",
                                    initialValue: 0,
                                    in: { $add: ["$$value", { $multiply: ["$$this.rating", "$$this.count"] }] }
                                }
                            }
                        }
                    },
                    {
                        $addFields: {
                            "overallRating": {
                                $divide: ["$overallRating", "$reviewData.totalReviews"]
                            }
                        }
                    },
                    {
                        $addFields: {
                            "overallRating": { $round: ["$overallRating", 1] }
                        }
                    },
                    {
                        $project: {
                            "_id": 1,
                            "bookName": 1,
                            "bookLanguage": 1,
                            "authorName": 1,
                            "co_authorName": 1,
                            "publisher": 1,
                            "bookPublishDate": 1,
                            "bookPdf": 1,
                            "bookImage": 1,
                            "category": 1,
                            "bookType": 1,
                            "videoLink": 1,
                            "about": 1,
                            "price": 1,
                            "created_at": 1,
                            "updated_at": 1,
                            "reviewData.totalReviews": 1,
                            "overallRating": 1,
                            "reviewData.ratings": 1,
                            "reviewData.reviews": { $reduce: { input: "$reviewData.reviews", initialValue: [], in: { $concatArrays: ["$$value", "$$this"] } } }
                        }
                    },
                    {
                        $sort: { created_at: -1 }
                    }
                ]
                var categoryWiseBookList = await eBook.aggregate(categoryPipe);
            }

            const newlyAddedBookList = await eBook.aggregate([
                {
                    $match: {
                        'bookLanguage.language': language,
                    }
                },
                {
                    $lookup: {
                        from: "review_lists",
                        let: { bookId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$bookId", "$$bookId"] }
                                }
                            },
                            {
                                $group: {
                                    _id: "$rating",
                                    count: { $sum: 1 },
                                    reviews: { $push: "$$ROOT" }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalReviews: { $sum: "$count" },
                                    ratings: {
                                        $push: {
                                            rating: "$_id",
                                            count: "$count",
                                            percentage: { $multiply: [{ $divide: ["$count", "$totalReviews"] }, 100] }
                                        }
                                    },
                                    reviews: { $push: "$reviews" }
                                }
                            }
                        ],
                        as: "reviewData"
                    }
                },
                {
                    $unwind: '$reviewData'
                },
                {
                    $addFields: {
                        "overallRating": {
                            $reduce: {
                                input: "$reviewData.ratings",
                                initialValue: 0,
                                in: { $add: ["$$value", { $multiply: ["$$this.rating", "$$this.count"] }] }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        "overallRating": {
                            $divide: ["$overallRating", "$reviewData.totalReviews"]
                        }
                    }
                },
                {
                    $addFields: {
                        "overallRating": { $round: ["$overallRating", 1] }
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "bookName": 1,
                        "bookLanguage": 1,
                        "authorName": 1,
                        "co_authorName": 1,
                        "publisher": 1,
                        "bookPublishDate": 1,
                        "bookPdf": 1,
                        "bookImage": 1,
                        "category": 1,
                        "bookType": 1,
                        "videoLink": 1,
                        "about": 1,
                        "price": 1,
                        "created_at": 1,
                        "updated_at": 1,
                        "reviewData.totalReviews": 1,
                        "overallRating": 1,
                        "reviewData.ratings": 1,
                        "reviewData.reviews": { $reduce: { input: "$reviewData.reviews", initialValue: [], in: { $concatArrays: ["$$value", "$$this"] } } }
                    }
                },
                {
                    $sort: { created_at: -1 }
                }
            ]
            );

            const otherBookList = await eBook.aggregate([
                {
                    $match: {
                        'category.categoryName': "Other Book",
                        'bookLanguage.language': language,
                    }
                },
                {
                    $lookup: {
                        from: "review_lists",
                        let: { bookId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$bookId", "$$bookId"] }
                                }
                            },
                            {
                                $group: {
                                    _id: "$rating",
                                    count: { $sum: 1 },
                                    reviews: { $push: "$$ROOT" }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalReviews: { $sum: "$count" },
                                    ratings: {
                                        $push: {
                                            rating: "$_id",
                                            count: "$count",
                                            percentage: { $multiply: [{ $divide: ["$count", "$totalReviews"] }, 100] }
                                        }
                                    },
                                    reviews: { $push: "$reviews" }
                                }
                            }
                        ],
                        as: "reviewData"
                    }
                },
                {
                    $unwind: '$reviewData'
                },
                {
                    $addFields: {
                        "overallRating": {
                            $reduce: {
                                input: "$reviewData.ratings",
                                initialValue: 0,
                                in: { $add: ["$$value", { $multiply: ["$$this.rating", "$$this.count"] }] }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        "overallRating": {
                            $divide: ["$overallRating", "$reviewData.totalReviews"]
                        }
                    }
                },
                {
                    $addFields: {
                        "overallRating": { $round: ["$overallRating", 1] }
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "bookName": 1,
                        "bookLanguage": 1,
                        "authorName": 1,
                        "co_authorName": 1,
                        "publisher": 1,
                        "bookPublishDate": 1,
                        "bookPdf": 1,
                        "bookImage": 1,
                        "category": 1,
                        "bookType": 1,
                        "videoLink": 1,
                        "about": 1,
                        "price": 1,
                        "created_at": 1,
                        "updated_at": 1,
                        "reviewData.totalReviews": 1,
                        "overallRating": 1,
                        "reviewData.ratings": 1,
                        "reviewData.reviews": { $reduce: { input: "$reviewData.reviews", initialValue: [], in: { $concatArrays: ["$$value", "$$this"] } } }
                    }
                },
                {
                    $sort: { created_at: -1 }
                }

            ])

            return { categoryWiseBookList, newlyAddedBookList, otherBookList }

        } catch (error) {
            throw error;
        }
    }

    async addReviewService(reviewBody) {
        try {
            const reviewInfo = await review.create(reviewBody);
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
            const skip = (page - 1) * pageSize;

            const totalDocuments = await eBook.countDocuments();
            const totalPages = Math.ceil(totalDocuments / pageSize);

            const eBookList = await eBook.find(
                { $text: { $search: searchText } },
                { score: { $meta: "textScore" }, _id: 1, bookName: 1, authorName: 1, price: 1, bookImage: 1 }
            )
                .sort({ score: { $meta: "textScore" }, created_at: -1 })
                .skip(skip)
                .limit(pageSize);

            return { totalDocuments, totalPages, eBookList }
        } catch (error) {
            throw error;
        }

    }
}

module.exports = AuthService;